const Home = {
	template: `
		<div id='home'>
			<h4> hi! feel free to look around. :) </h4>
		</div>
	`
}


const About = {
	template:
		`<div id='aboutContent'>
			<br>
			<p>I'm <span class="bold">Nicholas</span>. 熊志文 is my Chinese name. </p>
			<br>
			<p>I really enjoy music composition/arrangement and programming! I'm particularly interested in developing applications for artistic endeavors. <br>I also play the trumpet. </p>
			<br>
			<p> I've been using 'syncopika' as my username in various places. It's a combination of <span class='bold'>synco</span>pation (I like syncopated rhythms) and '<span class='bold'>pika</span>pika' (Japanese onomatopoeia for something sparkly). Not the best name, but easy to find and kinda unique, I think. :D</p>
			<br>
			<p> other places I'm at: </p>
			<ul id='links'>
				<li><a href='https://github.com/syncopika'>GitHub <i class="fa fa-github" aria-hidden="true"></i></a></li>
				<li><a href='http://soundcloud.com/syncopika'>SoundCloud <i class="fa fa-soundcloud" aria-hidden="true"></i></a></li>
				<li><a href='https://www.youtube.com/user/OrchestralPikachu'>YouTube <i class="fa fa-youtube" aria-hidden="true"></i></a></li>
				<li><a href='http://opengameart.org/users/syncopika'>OpenGameArt</a></li>
			</ul>
			<br>
			<p><span class="bold"> thanks for visiting! </span></p>
			<p id='footerTag2'>c. 2016 </p>
		</div>`
}

const Music = {
	data: function(){
		var soundcloud = [
			"https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/276332169&amp;color=0066cc&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false",
			"https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/481490157&color=0066cc&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false",
			"https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/209110662&amp;color=0066cc&amp;auto_play=false&amp;hide_related=false&amp;show_comments=false&amp;show_user=true&amp;show_reposts=false",
			"https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/264147169&amp;color=0066cc&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false",
			"https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/209159656&amp;color=0066cc&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false",
			"https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/335892402&amp;color=0066cc&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false"
		];

		var bandcamp = [
			{
				"style": "border: 0; width: 700px; height: 282px;",
				"src": "https://bandcamp.com/EmbeddedPlayer/album=2349212220/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=true/artwork=small/transparent=true/", 
				"href": "http://greenbearmusic.bandcamp.com/album/bgm-fun-vol-6",
				"text": "BGM Fun Vol.6 by n.c.h"
			},
			{
				"style": "border: 0; width: 700px; height: 282px;",
				"src": "https://bandcamp.com/EmbeddedPlayer/album=932190421/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=true/artwork=small/transparent=true/", 
				"href": "http://greenbearmusic.bandcamp.com/album/bgm-fun-vol-7",
				"text": "BGM Fun Vol.7 by n.c.h"
			},
			{
				"style": "border: 0; width: 700px; height: 282px;",
				"src": "https://bandcamp.com/EmbeddedPlayer/album=1715420384/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=true/artwork=small/transparent=true/", 
				"href": "http://greenbearmusic.bandcamp.com/album/bgm-fun-vol-2",
				"text": "BGM Fun Vol.2 by n.c.h"
			},
			{
				"style": "border: 0; width: 700px; height: 282px;",
				"src": "https://bandcamp.com/EmbeddedPlayer/album=3271172078/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=true/artwork=small/transparent=true/", 
				"href": "http://greenbearmusic.bandcamp.com/album/bgm-fun-vol-9",
				"text": "BGM Fun Vol.9 by n.c.h"
			},
			{
				"style": "border: 0; width: 700px; height: 282px;",
				"src": "https://bandcamp.com/EmbeddedPlayer/album=764407444/size=large/bgcol=ffffff/linkcol=0687f5/artwork=small/transparent=true/", 
				"href": "http://greenbearmusic.bandcamp.com/album/bgm-fun-vol-10",
				"text": "BGM Fun Vol.10 by n.c.h"
			}
		];
		
		var gameMusicSample = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/89302627&amp;auto_play=false&amp;hide_related=false&amp;show_comments=false&amp;show_user=true&amp;show_reposts=false&amp;visual=false";
		
		return ({
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
					<iframe id="gameSample" width="80%" height="102" scrolling="no" frameborder="no" v-bind:src="soundcloudSamples[soundcloudIndex]">
					</iframe>
				</div>
				<button id='sc' type='button' class='btn btn-primary btn-sm' v-on:click="soundcloudIndex = (soundcloudIndex+1)%soundcloudSamples.length">next</button>
				<p>archive of some arrangments (.wav): <b><a href='https://www.dropbox.com/sh/ac5s3aa1i9pueev/AACArNHLVBZr_xQp3ZcRfVRKa?dl=0'>here</a></b> and sheet music (score format, needs MuseScore): <b><a href='https://www.dropbox.com/sh/l39zcxbw3pns8q9/AABKSN3_DtIOiaku8CPNrd85a?dl=0'>here</a></b></p>
			<br>
			
			<hr>
			<h3>game</h3>
				<iframe id='gameSample' frameborder="no" width="80%" height="320" scrolling="no" v-bind:src="gameMusicSample">
				</iframe>
			<br>
			
			<hr>
			<h3>random, original stuff</h3>
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
			
			<div class='footer'>
				<p id='footerTag2'>(c) n.c.h works 2016-2019 </p>
			</div>
		</div>`
}

const Projects = {
	template:
		`<div id='projectsContent'>
			<h2>some of my programming stuff</h2>
			<hr>
			<p style='font-size: 13px'>some of the web applications are not optimized for mobile viewing, sorry! </p>
			<br>
			<!-- nothing really cool... maybe will improve on these someday 
			<h3>data visualization</h3>
				<p><a href='http://syncopika.tumblr.com/audiovisual'>audio visualizations</a></p>
				<p><a href='http://syncopika.tumblr.com/datavisualdemo'>sample YouTube data visualizations</a></p>
			<br>
			-->
			
			<h4 id='browserTools'><b> for browser: </b></h4>
			<p><a href='https://syncopika.github.io/piano_roll_browser/'> piano roll </a> (Chrome recommended)</p>
			<p><a href='https://syncopika.github.io/funSketch/'> funSketch</a></p>
			<p><a href='misc/karaokeget.html'> karaoke-get </a></p>
			<p><a href='https://github.com/syncopika/gifCatch_extension'> gifCatch (Chrome extension) </a></p>
			<p><a href='https://github.com/syncopika/boringChat'> boringChat </a> (<a href=' https://boring-chat.herokuapp.com/'>demo</a>)</p>
			<br>
			
			<h4 id='desktopTools'><b>for desktop: </b></h4>
			<p><a href='https://github.com/syncopika/gifCatch_desktop-Windows-'>gifCatch for Windows</a></p>
			<p><a href='https://github.com/syncopika/cute_animator'> cute animator </a></p>
			<p><a href='https://github.com/syncopika/winsock-server-client'>basic chat server/client</a></p>
			<br>	

			<h4><b> random, misc stuff </b></h4>
			<p><a href='https://syncopika.github.io/chinese_quiz/'> Chinese Quiz (普通話) </a></p>
			<p><a href='https://github.com/syncopika/visual_novel_maker'> visual novel maker </a> (<a href='https://syncopika.github.io/visual_novel_maker/'>demo</a>)</p>
			<p><a href='misc/soundtrackLib/index.html'>anime soundtracks lib</a></p>
			<p><a href='misc/asciiArt.html'> ASCII art </a></p>
			<br>
			
			<!--
			<h3>misc.</h3>
				<p><a href='http://syncopika.tumblr.com/greenbearmusic'> other website idea</a></p>
				<p><a href='http://syncopika.tumblr.com/aquarium'>aquarium (click on the shark!)</a></p>
			-->
			<p id='footerTag2'>(c) n.c.h works 2016-2019 </p>
		</div>`
}

const Contact = {
	mounted: function(){
		//console.log(this.$refs["emailButton"]);
		let contact = this.$refs["emailButton"];
		contact.addEventListener('click', function(){
			// this function comes from roulette.js
			roulette("nhung93 at outlook.com".split(""), $("#email").html().split(""), $("#email").html(), "email" );
		});
	},
	template:
		`<div id='contactContent'>
			<h3><a href='https://github.com/syncopika'> <i class="fa fa-github" aria-hidden="true"></i></a></h3>
			<br>
			<p>you can also contact me at my email below! thanks!</p>
			<h2 id='email'>abcdef1 lm opqr,stuxzy</h2>
			<button ref="emailButton" id='getEmail' class='btn-primary'>decode</button>
		</div>`
}

const NotFound = {
	template: 
	`<div>
		<h3> page not found </h3>
	</div>
	`
}


const router = new VueRouter({
	history: true,
	routes: [
		{path: '/', component: Home},
		{path: '/about', component: About},
		{path: '/music', component: Music},
		{path: '/projects', component: Projects},
		{path: '/contact', component: Contact},
		{path: '/not_found', component: NotFound}
	]
});

const app = new Vue({router}).$mount('#app');