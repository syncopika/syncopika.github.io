package com.example.localplanes

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.pm.PackageManager
import android.location.LocationManager
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.ClickableText
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableDoubleStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.example.localplanes.ui.theme.LocalplanesTheme
import com.github.kittinunf.fuel.httpGet
import kotlinx.coroutines.launch
import org.json.JSONArray
import org.json.JSONObject
import java.time.Instant
import java.time.format.DateTimeFormatter

// notes
// https://stackoverflow.com/questions/21085497/how-to-use-android-locationmanager-and-listener
// https://stuff.mit.edu/afs/sipb/project/android/docs/training/basics/location/locationmanager.html
// https://medium.com/@dugguRK/difference-between-access-coarse-location-and-access-fine-location-android-kotlin-4573f00bc41b
// https://www.geeksforgeeks.org/how-to-get-current-location-in-android/
// https://www.reddit.com/r/androiddev/comments/1cr3iwj/is_there_any_noncomplicated_way_of_fetching/
// https://stackoverflow.com/questions/69691483/how-to-request-for-gps-location-updates-in-kotlin
// https://stackoverflow.com/questions/17119968/android-locationmanager-requestlocationupdates-doesnt-work
// https://developer.android.com/training/permissions/requesting
// https://api.adsb.lol/docs#/v2/v2_point_v2_lat__lat__lon__lon__dist__radius__get
// https://stackoverflow.com/questions/48876070/kotlin-android-parsing-json-from-http-request
// https://stackoverflow.com/questions/65567412/jetpack-compose-text-hyperlink-some-section-of-the-text
// https://stackoverflow.com/questions/69651880/how-to-get-system-service-in-composable-function

data class LocalPlane(
    val lat: Double,
    val lng: Double,
    val flight: String
)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // set up location manager
        val locationManager: LocationManager = getSystemService(Context.LOCATION_SERVICE) as LocationManager
        val locationListener = android.location.LocationListener { location -> println(location) }

        // Register the permissions callback, which handles the user's response to the
        // system permissions dialog. Save the return value, an instance of
        // ActivityResultLauncher. You can use either a val, as shown in this snippet,
        // or a lateinit var in your onAttach() or onCreate() method.
        val requestPermissionLauncher =
            registerForActivityResult(
                ActivityResultContracts.RequestPermission()
            ) { isGranted: Boolean ->
                if (isGranted) {
                    // Permission is granted. Continue the action or workflow in your
                    // app.
                    locationManager.requestLocationUpdates(
                        LocationManager.GPS_PROVIDER,
                        0L,
                        0f,
                        locationListener
                    )
                } else {
                    // Explain to the user that the feature is unavailable because the
                    // feature requires a permission that the user has denied. At the
                    // same time, respect the user's decision. Don't link to system
                    // settings in an effort to convince the user to change their
                    // decision.
                }
            }

        // check if permission for accessing location allowed
        when {
            ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED -> {
                // You can use the API that requires the permission.
                locationManager.requestLocationUpdates(
                    LocationManager.GPS_PROVIDER,
                    0L,
                    0f,
                    locationListener
                )
            }

            ActivityCompat.shouldShowRequestPermissionRationale(
                this, Manifest.permission.ACCESS_COARSE_LOCATION
            ) -> {
                // In an educational UI, explain to the user why your app requires this
                // permission for a specific feature to behave as expected, and what
                // features are disabled if it's declined. In this UI, include a
                // "cancel" or "no thanks" button that lets the user continue
                // using your app without granting the permission.
                //showInContextUI(...)
            }

            else -> {
                // You can directly ask for the permission.
                // The registered ActivityResultCallback gets the result of this request.
                requestPermissionLauncher.launch(
                    Manifest.permission.ACCESS_COARSE_LOCATION
                )
            }
        }

        setContent {
            LocalplanesTheme {
                // A surface container using the 'background' color from the theme
                Surface(
                    color = MaterialTheme.colorScheme.background
                ) {
                    Content(locationManager)
                }
            }
        }
    }
}

@SuppressLint("MissingPermission", "NewApi")
@Composable
fun Content(locationManager: LocationManager, modifier: Modifier = Modifier) {
    var latitude by remember { mutableDoubleStateOf(0.0) }
    var longitude by remember { mutableDoubleStateOf(0.0) }
    var lastUpdatedTimestamp by remember { mutableStateOf("") }
    var flights = remember { mutableStateListOf<LocalPlane>() }

    val context = LocalContext.current

    // https://stackoverflow.com/questions/51141970/check-internet-connectivity-android-in-kotlin
    fun isConnectedToInternet(): Boolean {
        val connManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        if (connManager != null) {
            val netCapabilities = connManager.getNetworkCapabilities(connManager.activeNetwork)
            if (netCapabilities != null) {
                if (netCapabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)) {
                    return true;
                } else if (netCapabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)) {
                    return true;
                } else if (netCapabilities.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET)) {
                    return true;
                }
            }
        }
        return false
    }

    fun makeAnnotatedString(flightName: String, latitude: Double, longitude: Double): AnnotatedString {
        val annotatedString = buildAnnotatedString {
            val str = "${flightName.trim()} - lat: $latitude, lng: $longitude"
            val startIdx = 0
            val endIdx = flightName.trim().length

            append(str)

            addStyle(
                style = SpanStyle(
                    color = Color.White,
                    fontSize = 18.sp,
                    textDecoration = TextDecoration.Underline
                ),
                start = startIdx,
                end = endIdx
            )

            addStringAnnotation(
                tag = "URL",
                annotation = "https://www.flightaware.com/live/flight/${flightName.trim()}",
                start = startIdx,
                end = endIdx
            )
        }

        return annotatedString
    }

    // this function needs to be async to be able to use httpGet() from the fuel library
    suspend fun getLocalPlanes(latitude: Double, longitude: Double) {
        // TODO: verify internet is accessible
        val isConnectedToInternet = isConnectedToInternet()
        if (!isConnectedToInternet) {
            val toast = Toast.makeText(context, "no internet connection :(", Toast.LENGTH_SHORT)
            toast.show()
        } else {
            val toast = Toast.makeText(context, "fetching flight data!", Toast.LENGTH_SHORT)
            toast.show()

            val radius = 15

            "https://api.adsb.lol/v2/point/$latitude/$longitude/$radius"
                .httpGet()
                .responseString { _, _, result ->
                    val res = JSONObject(result.get())
                    val planes = res.get("ac") as JSONArray

                    flights.clear()

                    for (idx in 0 until planes.length()) {
                        val currPlane = planes.getJSONObject(idx)

                        // TODO: order by distance based on user current location?
                        // and maybe show distance in miles or km from user as well for each plane?
                        flights.add(LocalPlane(
                            currPlane.optDouble("lat", 0.0) as Double,
                            currPlane.optDouble("lon", 0.0) as Double,
                            currPlane.optString("flight", "unknown") as String
                        ))
                    }
                }
        }
    }

    val scope = rememberCoroutineScope()
    val uriHandler = LocalUriHandler.current

    Column(
        Modifier
            .background(Color.Black)
            .fillMaxHeight()
    ) {
        Row() {
            Button(onClick = {
                // TODO: don't suppress missing permission
                scope.launch {
                    val lastLocation = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER)
                    if (lastLocation != null) {
                        latitude = lastLocation.latitude
                        longitude = lastLocation.longitude
                        lastUpdatedTimestamp = DateTimeFormatter.ISO_INSTANT.format(Instant.now())
                        getLocalPlanes(latitude, longitude)
                    }
                }
            }) {
                Text("update location")
            }
        }

        Row(Modifier.fillMaxWidth()) {
            Text(
                text = "lat: $latitude",
            )
        }

        Row(Modifier.fillMaxWidth()) {
            Text(
                text = "lng: $longitude",
            )
        }

        Row(Modifier.fillMaxWidth()) {
            Text(
                text = "last updated: $lastUpdatedTimestamp",
            )
        }

        Spacer(Modifier.height(12.dp))

        //Text("results go here")
        flights.forEach { flight ->
            //Text("${flight.flight} - lat: ${flight.lat}, lng: ${flight.lng}")
            val annotatedStr = makeAnnotatedString(flight.flight, flight.lat, flight.lng)

            ClickableText(
                text = annotatedStr,
                onClick = {
                    annotatedStr
                        .getStringAnnotations("URL", it, it)
                        .firstOrNull()?.let {
                            stringAnnotation -> uriHandler.openUri(stringAnnotation.item)
                        }
                },
                style = TextStyle(
                    color = Color.White
                )
            )

            Spacer(Modifier.height(14.dp))
        }
    }

}
