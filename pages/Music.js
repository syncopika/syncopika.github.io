const Music = {
	data: function(){
		
		let getSoundCloudLink = function(trackId){
			return "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/" + trackId + "&amp;color=0066cc&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false";
		};
		
		// track ids 
		let soundcloud = [
			276332169,
			481490157,
			209110662,
			255402027,
			264147169,
			209159656,
			335892402,
			337453719
		];

		let bandcamp = [
			{
				"style": "border: 0; width: 80%; height: 282px;",
				"src": "https://bandcamp.com/EmbeddedPlayer/album=2349212220/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=true/artwork=small/transparent=true/", 
				"href": "http://greenbearmusic.bandcamp.com/album/bgm-fun-vol-6",
				"text": "BGM Fun Vol.6 by n.c.h"
			},
			{
				"style": "border: 0; width: 80%; height: 282px;",
				"src": "https://bandcamp.com/EmbeddedPlayer/album=932190421/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=true/artwork=small/transparent=true/", 
				"href": "http://greenbearmusic.bandcamp.com/album/bgm-fun-vol-7",
				"text": "BGM Fun Vol.7 by n.c.h"
			},
			{
				"style": "border: 0; width: 80%; height: 282px;",
				"src": "https://bandcamp.com/EmbeddedPlayer/album=1715420384/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=true/artwork=small/transparent=true/", 
				"href": "http://greenbearmusic.bandcamp.com/album/bgm-fun-vol-2",
				"text": "BGM Fun Vol.2 by n.c.h"
			},
			{
				"style": "border: 0; width: 80%; height: 282px;",
				"src": "https://bandcamp.com/EmbeddedPlayer/album=3271172078/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=true/artwork=small/transparent=true/", 
				"href": "http://greenbearmusic.bandcamp.com/album/bgm-fun-vol-9",
				"text": "BGM Fun Vol.9 by n.c.h"
			},
			{
				"style": "border: 0; width: 80%; height: 282px;",
				"src": "https://bandcamp.com/EmbeddedPlayer/album=764407444/size=large/bgcol=ffffff/linkcol=0687f5/artwork=small/transparent=true/", 
				"href": "http://greenbearmusic.bandcamp.com/album/bgm-fun-vol-10",
				"text": "BGM Fun Vol.10 by n.c.h"
			}
		];
		
		let gameMusicSample = [
		"https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/89302627&amp;auto_play=false&amp;hide_related=false&amp;show_comments=false&amp;show_user=true&amp;show_reposts=false&amp;visual=false",
		"https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/961667977&color=%23ff5500&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=true&visual=false"]
		
		return ({
			'getSoundCloudLink': getSoundCloudLink,
			'soundcloudSamples': soundcloud,
			'bandcampSamples': bandcamp,
			"gameMusicSample": gameMusicSample,
			'soundcloudIndex': 0,
			'bandcampIndex': 0
		});
	},
	template:
		`<div id='musicContent'>
			<h2>music works</h2>
			<p>more original work @ my <a href='http://greenbearmusic.bandcamp.com' style='color: #000FFF'>bandcamp</a></p>
			
			<hr>
			<h3>arrangements</h3>
				<p> I love creating arrangements! You can find my most recent work at my YouTube channel. </p>
				<div id='soundcloud'>
					<iframe id="gameSample" width="80%" height="102" scrolling="no" frameborder="no" v-bind:src="getSoundCloudLink(soundcloudSamples[soundcloudIndex])">
					</iframe>
				</div>
				<button id='sc' type='button' class='btn btn-primary btn-sm' v-on:click="soundcloudIndex = (soundcloudIndex+1)%soundcloudSamples.length">next</button>
				<p>archive of some arrangments (.wav): <b><a href='https://www.dropbox.com/sh/ac5s3aa1i9pueev/AACArNHLVBZr_xQp3ZcRfVRKa?dl=0'>here</a></b> and sheet music (score format, needs MuseScore): <b><a href='https://www.dropbox.com/sh/l39zcxbw3pns8q9/AABKSN3_DtIOiaku8CPNrd85a?dl=0'>here</a></b></p>
			<br>
			
			<hr>
			<h3>game</h3>
				<iframe v-for="(playlist, index) in gameMusicSample" class='gameSample' frameborder="no" width="80%" height="320" scrolling="no" v-bind:src="playlist">
				</iframe>
			<br>
			
			<hr>
			<h3>original stuff</h3>
				<div id='bandcamp'>
				<iframe v-bind:style="bandcampSamples[bandcampIndex].style" v-bind:src="bandcampSamples[bandcampIndex].src" seamless><a v-bind:href="bandcampSamples[bandcampIndex].href"></a>{{bandcampSamples[bandcampIndex].text}}</iframe>
				</div>
				<button id='bc' type='button' class='btn btn-primary btn-sm' v-on:click="bandcampIndex = (bandcampIndex+1)%bandcampSamples.length">next</button>
			<br>
			
			<hr>
			<div id="clients">
				<h3>clients</h3>
				<h2><a href='http://armouredboar.com/'>ArmouredBoar</a></h2>
				<h2><a href='http://www.fantasytalesonline.com/'>Fantasy Tales Online</a></h2>
				<h2><a href='http://sparmmo.com/'>Spar MMO</a></h2>
				<h2><a href='https://wolff95.weebly.com/wolffware.html'>WolffWare</a></h2>
			</div>
		</div>`
}

export {
	Music
}