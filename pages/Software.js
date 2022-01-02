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
                    <h4 class="projectTitle"><a href='https://syncopika.github.io/piano_roll_browser/'> piano roll browser </a></h4>
                    <div class="imgContainer">
                        <img src="projectScreenshots/piano_roll_browser.png" class="screenshot">
                    </div>
                    <br>
                    <p> mostly vanilla JavaScript, jQuery, SCSS, Web Audio API </p>
                    <p> This project lets you compose music in the browser! I also created an incomplete companion application called <span class='projectTitle'><a href='https://syncopika.github.io/soundmaker/'> soundmaker </a></span> to create custom instruments that you could import into the piano roll.</p>
                    <br>
                </div>
                
                <div>
                    <h4 class="projectTitle"><a href='https://syncopika.github.io/funSketch/'> funSketch </a></h4>
                    <div class="imgContainer">
                        <img src="projectScreenshots/fun_sketch.png" class="screenshot">
                    </div>
                    <br>
                    <p> React, Canvas API </p>
                    <p> This is a web application for basic drawing and animating. There are different kinds of image filters and brushes to use, as well as onion-skin and layering.</p>
                    <br>
                </div>
                
                <div>
                    <h4 class="projectTitle"><a href='https://syncopika.github.io/trip-planner/'> trip-planner </a></h4>
                    <div class="imgContainer">
                        <img src="projectScreenshots/trip_planner.png" class="screenshot">
                    </div>
                    <br>
                    <p> Vue, TypeScript, PostgreSQL, MapBox API </p>
                    <p> This is an experimental idea I had for a trip planner. It has an interactive map in which the user can plot markers for trip destinations and provide extra information about each destination (notes, pictures, dates). </p>
                    <br>
                </div>
                
                <div>
                    <h4 class="projectTitle"><a href='https://syncopika.github.io/music-score-viewer/'> music score viewer </a></h4>
                    <div class="imgContainer">
                        <img src="projectScreenshots/music_score_viewer.png" class="screenshot">
                    </div>
                    <br>
                    <p> React, pdf.js </p>
                    <p>Nothing super special but this is a tool that allows you to sync music score page turning (a pdf score) with audio with some manual intervention in the form of JSON. </p>
                    <br>
                </div>
                
                <div>
                    <h4 class="projectTitle"><a href='https://syncopika.github.io/threejs-projects/'> threejs projects </a></h4>
                    <div class="imgContainer">
                        <img src="projectScreenshots/airshow.png" class="screenshot">
                    </div>
                    <br>
                    <p> JavaScript (three.js), Blender </p>
                    <p> This is a collection of small 3d projects with models I made in Blender. For each project I try to implement an idea that could be useful on its own as well as explore 3d graphics/threejs/algorithm-related ideas/concepts.</p>
                    <p> Shown above is my 'airshow' demo. </p>
                    <br>
                </div>
                
                
                <div>
                    <h4 class="projectTitle"><a href='https://github.com/syncopika/gifCatch_desktop-Windows-'> gifCatch </a></h4>
                    <div class="imgContainer">
                        <img src="projectScreenshots/gif_catch.png" class="screenshot">
                    </div>
                    <br>
                    <p> C++, Win32 API </p>
                    <p> gifCatch is a Windows application that allows you to capture part (or all) of your screen for a period of time or feed it a series of .bmp images to create a .gif. It also has image filter options!</p>
                    <p> It's been pretty useful as I've used it quite a bit to generate screen capture gifs of my projects :) </p>
                    <br>
                </div>
                
                
            </div>
            
            <br>
            <br>
            <h4><a href='#/novelties'> some more neat but smaller projects that I would rather not clutter this page with → </a></h4>
            <br>
        </div>`
}

export {
    Software
}