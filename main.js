const Home = {
	template: `
		<div id='home'>
			<h4> hello! </h4>
		</div>
	`
}


const About = {
	template:
		`<div id='aboutContent'>
			<br>
			<p>Thank you for visiting! I'm Nicholas. 熊志文 is my Chinese name. </p>
			<br>
			<p>I really enjoy music composition/arrangement and programming! I'm particularly interested in developing applications for artistic endeavors. <br><br>I'm also an avid trumpet player and enjoy playing various genres of music (but especially orchestral stuff and brass literature). Currently I play on a stock Bach 5C and a silver Yamaha 4335. </p>
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
			<p id='footerTag2'>c. 2016 </p>
		</div>`
}

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
			
			<div class='footer'>
				<p id='footerTag2'>(c) n.c.h works 2016-2020 </p>
			</div>
		</div>`
}

const Projects = {
	template:
		`<div id='projectsContent'>
			<h2>some programs I've made</h2>
			<hr>
			<p style='font-size: 13px'>please note: some of my web applications are not optimized for mobile viewing! </p>
			<br>
			
			<h4><b> audio </b></h4>
			<p><a href='https://syncopika.github.io/piano_roll_browser/'> piano roll </a></p>
			<p><a href='misc/karaokeget.html'> karaoke-get </a></p>
			<br>
			
			<h4><b> visual </b></h4>
			<p><a href='https://github.com/syncopika/gifCatch_desktop-Windows-'>gifCatch</a></p>
			<p><a href='https://syncopika.github.io/funSketch/'> funSketch </a></p>
			<p><a href='https://github.com/syncopika/boringChat'> boringChat </a></p>
			<p><a href='https://syncopika.github.io/threejs-projects/'> 3d projects </a></p>
			<br>
			
			<h4><b> misc </b></h4>
			<p><a href='https://syncopika.github.io/chinese_quiz/'> chinese quiz (普通話) </a></p>
			<p><a href='misc/asciiArt.html'> ASCII art generator </a></p>			
			
			<br>
			
			<p id='footerTag2'>c.2016 nch</p>
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
			<br>
			<p>you can contact me at my email below! thanks!</p>
			<h2 id='email'>abcdef1 lm opqr,stuxzy</h2>
			<button ref="emailButton" id='getEmail' class='btn-primary'>decode</button>
		</div>`
}

const Blog = {
	data: function(){
		return {'posts': [],
				'currIndex': 0,
				'sliceSize': 3 // show 3 blog posts at a time.
				};
	},
	
	methods: {
		prevPage(){
			this.currIndex -= this.sliceSize;
			if(this.currIndex <= 0){
				this.currIndex = 0;
			}
		},
		nextPage(){
			this.currIndex += this.sliceSize;
			if(this.currIndex >= this.posts.length){
				this.currIndex -= this.sliceSize;
			}
		}
	},
	
	beforeMount: function(){
		// retrieve the list of blog entries and return them as a list
		let list = [];
		let listOfEntries = fetch('blog_entries/entry_list.txt', {'method': 'GET'});
		listOfEntries.then((res) => res.text()).then((text) => {
			let entryList = text.split('\n');
			// get the json files 
			let promiseList = [];
			for(let i = 0; i < entryList.length; i++){
				promiseList.push(new Promise((resolve, err) => {
					resolve(fetch('blog_entries/json_entries/'+entryList[i], {'method': 'GET'}).then((res)=>res.json()));
				}));
			}
			Promise.all(promiseList).then((res) => {
				//console.log(res);
				res.reverse(); // assuming in ascending order currently
				this.posts = res;
			});
		});
		
	},
	template:
		`<div>
			<br>
			<div v-for="(entry, index) in posts.slice(currIndex, currIndex + sliceSize)">
				
				<h3 v-if="posts[index+currIndex].title"> 
					Entry #{{posts.length - (index + currIndex) }} - {{posts[index+currIndex].title}}, {{posts[index + currIndex].date}} 
				</h3>
				<h3 v-else> 
					Entry #{{posts.length - (index + currIndex)}}, {{posts[index + currIndex].date}} 
				</h3>
				
				
				<hr>
				<span v-html="posts[index + currIndex].content"></span>
				<hr>
				<p> Tags: {{posts[index + currIndex].tags.join(",")}} </p>
				<br>
			</div>
			<div>
				<button @click="prevPage">newer</button>
				<button @click="nextPage">older</button>
			</div>
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
		{path: '/blog', component: Blog},
		{path: '/contact', component: Contact},
		{path: '/not_found', component: NotFound}
	]
});

const app = new Vue({router}).$mount('#app');
