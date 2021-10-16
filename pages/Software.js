const Software = {
	template:
		`<div id='softwareContent'>
			<h2>programming</h2>
			<p>some selected projects</p>
			<hr>
			<p style='font-size: 13px'>please note: most of my web apps are not designed/optimized for mobile at the moment </p>
			<br>
			
			<div id='projectsGrid'>
			
				<div>
					<h4><b><a href='https://syncopika.github.io/piano_roll_browser/'> piano roll browser </a></b></h4>
					<div class="imgContainer">
						<img src="projectScreenshots/piano_roll_browser.png" class="screenshot">
					</div>
					<br>
					<p> This project lets you compose music in the browser! It's made of mostly vanilla JS, HTML and CSS and leverages the Web Audio API and a bit of jQuery. </p>
					<p> I also created an incomplete companion application called <a href='https://syncopika.github.io/soundmaker/'><b> soundmaker </b></a> to create custom instruments that you could import into the piano roll.</p>
					<br>
				</div>
				
				<div>
					<h4><b><a href='https://syncopika.github.io/funSketch/'> funSketch </a></b></h4>
					<div class="imgContainer">
						<img src="projectScreenshots/fun_sketch.png" class="screenshot">
					</div>
					<br>
					<p> This is a web application for basic drawing and animating. There are different kinds of image filters and brushes to use, as well as onion-skin and layering. I relied on React for this project.</p>
					<br>
				</div>
				
				<div>
					<h4><b><a href='https://syncopika.github.io/trip-planner/'> trip-planner </a></b></h4>
					<div class="imgContainer">
						<img src="projectScreenshots/trip_planner.png" class="screenshot">
					</div>
					<br>
					<p> This is an experimental idea I had for a trip planner. It has an interactive map in which the user can plot markers for trip destinations and provide extra information about each destination (notes, pictures, dates). For this project I used Vue, Typescript and the MapBox API. </p>
					<br>
				</div>
				
				<div>
					<h4><b><a href='https://syncopika.github.io/music-score-viewer/'> music score viewer </a></b></h4>
					<div class="imgContainer">
						<img src="projectScreenshots/music_score_viewer.png" class="screenshot">
					</div>
					<br>
					<p>Nothing super special but this is a tool that allows you to sync music score page turning (a pdf score) with audio with some manual intervention in the form of JSON. </p>
					<p> It utilizes pdf.js and a bit of React (for routing). I use it to showcase some of my music composition/arrangement work.</p>
					<br>
				</div>
				
				<div>
					<h4><b><a href='https://github.com/syncopika/gifCatch_desktop-Windows-'> gifCatch </a></b></h4>
					<div class="imgContainer">
						<img src="projectScreenshots/gif_catch.png" class="screenshot">
					</div>
					<br>
					<p> gifCatch is a Windows application that allows you to capture part (or all) of your screen for a period of time or feed it a series of .bmp images to create a .gif. It also has image filter options!</p>
					<p>This project is built with C++ and the Win32 API It's been pretty useful as I've used it quite a bit to generate screen capture gifs of my projects :) </p>
					<br>
				</div>
				
				<div>
					<h4><b><a href='https://syncopika.github.io/threejs-projects/'> threejs projects </a></b></h4>
					<div class="imgContainer">
						<img src="projectScreenshots/airshow.png" class="screenshot">
					</div>
					<br>
					<p> This is a collection of small 3d projects I've created using three.js and models I made in Blender. For each project I try to implement an idea that could be useful on its own as well as explore 3d graphics/threejs/algorithm-related ideas/concepts.</p>
					<p> Shown above is my 'airshow' demo. </p>
					<br>
				</div>
				
			</div>
			
			<br>
			<br>
			<h4><a href='#/novelties'><b>here's some more neat but smaller projects that I would rather not clutter this page with → </b></a></h4>
			<br>
		</div>`
}

export {
	Software
}