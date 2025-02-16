// basic server to act as a proxy for getting data from https://api.adsb.lol/
// https://pkg.go.dev/net/http#pkg-overview
// https://www.jetbrains.com/guide/go/tutorials/rest_api_series/stdlib/
// https://stackoverflow.com/questions/26559557/how-do-you-serve-a-static-html-file-using-a-go-web-server

package main

import (
  "fmt"
  "io"
  "log"
  "net/http"
)

func main() {
  // serve the web app on localhost:3000
  http.Handle("/", http.FileServer(http.Dir(".")))

  // handle GET req for local airplanes withn 10nm of given lng and lat
  http.HandleFunc("/localplanes", func(w http.ResponseWriter, r *http.Request) {
    fmt.Println("got a request!")
    
    queryParams := r.URL.Query()
    longitude := queryParams["lng"][0]
    latitude := queryParams["lat"][0]
    radius := 10
    
    apiQuery := fmt.Sprintf("https://api.adsb.lol/v2/point/%s/%s/%d", latitude, longitude, radius)
    fmt.Printf("making req: %s\n", apiQuery)
    
    resp, err := http.Get(apiQuery)
    
    if err != nil {
      log.Fatal(err)
    }
    
    body, err := io.ReadAll(resp.Body)
    resp.Body.Close()
    
    if err != nil {
      log.Fatal(err)
    }
    
    // send the response body back as is to the client
    fmt.Println("sending data to client!")
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write(body)
  })

  fmt.Println("running on 3000...")
  log.Fatal(http.ListenAndServe(":3000", nil))
}