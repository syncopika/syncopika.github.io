const Blog = {
	data: function(){
		return {
			'posts': [],
			'currIndex': 0,
			'currTag': '',
			'currPosts': [], // the currently shown posts (so that we can filter on all the posts)
			'sliceSize': 3   // show 3 blog posts at a time.
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
		},
		sortByTag(evt){
			// show only posts that have this tag
			const tag = evt.target.textContent;
			this.currPosts = this.posts.filter((post) => post.tags.includes(tag));
			this.currTag = tag;
		},
		clearTagSearch(){
			this.currTag = '';
			this.currPosts = this.posts;
		}
	},
	
	beforeMount: function(){
		// retrieve the list of blog entries and return them as a list
		let list = [];
		let listOfEntries = fetch('../blog_entries/entry_list.txt', {'method': 'GET'});
		listOfEntries.then((res) => res.text()).then((text) => {
			let entryList = text.split('\n');
			// get the json files 
			let promiseList = [];
			for(let i = 0; i < entryList.length; i++){
				promiseList.push(new Promise((resolve, err) => {
					resolve(fetch('../blog_entries/json_entries/'+entryList[i], {'method': 'GET'}).then((res)=>res.json()));
				}));
			}
			Promise.all(promiseList).then((res) => {
				res.reverse(); // assuming in ascending order currently
				this.posts = res;
				this.currPosts = res; // show all posts by default
			});
		});
	},
	
	updated: function(){
		// set image size and let all images be clickable to be enlarged
		let images = document.getElementsByTagName("img");
		Array.from(images).forEach((img) => {
			
			img.setAttribute('width', "20%");
			img.setAttribute('height', "20%");
			img.style.marginRight = "3px";
			img.style.marginTop = "3px";
			img.style.border = "1px solid #000";
			
			img.addEventListener('mouseover', (evt) => {
				evt.target.style.border = "1px solid #e0ffff";
			});
			
			img.addEventListener('mouseout', (evt) => {
				evt.target.style.border = "1px solid #000";
			});
			
			img.addEventListener('click', (evt) => {
				// taken from: https://github.com/syncopika/trip-planner/blob/master/src/components/Destination.vue#L258
				let enlargedImage = new Image();

				enlargedImage.onload = function(){
					const originalHeight = enlargedImage.height;
					const originalWidth = enlargedImage.width;
					
					const viewportHeight = window.innerHeight;
					const viewportWidth = window.innerWidth;
					const scaleFactor = 0.8;
					
					if(originalHeight > originalWidth){
						// set image to take the viewport height and adjust width to about the original dimension ratio
						enlargedImage.height = viewportHeight*scaleFactor;
						enlargedImage.width = Math.min(viewportHeight*scaleFactor*originalWidth / originalHeight, viewportWidth*0.98);
					}else{
						// take the viewport width, adjust height accordingly
						enlargedImage.width = viewportWidth*scaleFactor;
						enlargedImage.height = viewportWidth*scaleFactor*originalHeight / originalWidth;
					}
					
					document.body.style.overflowY = "hidden"; // hide the body Y scrollbar so the user won't see 2 scrollbars
				};
				
				enlargedImage.src = evt.target.src;

				let imageDiv = document.createElement('div');
				imageDiv.style.opacity = "0.99";
				imageDiv.style.backgroundColor = "#383838";
				imageDiv.style.position = "fixed";
				imageDiv.style.zIndex = "10";
				imageDiv.style.width = "100%";
				imageDiv.style.height = "100%";
				imageDiv.style.top = "0";
				imageDiv.style.left = "0";
				imageDiv.style.textAlign = "center";
				imageDiv.style.paddingTop = "2%";
				imageDiv.style.paddingBottom = "1%";

				enlargedImage.addEventListener("dblclick", (evt) => {
					if(imageDiv && imageDiv.parentNode){
						imageDiv.parentNode.removeChild(imageDiv);
					}
					document.body.style.overflowY = "scroll"; // revert back to normal
				});
				
				const enlargedImgContainer = document.createElement('div');
				enlargedImgContainer.appendChild(enlargedImage);
				enlargedImgContainer.style.height = "100%";
				enlargedImgContainer.style.overflowY = "scroll";
				imageDiv.appendChild(enlargedImgContainer);

				let cancel = document.createElement('h3');
				cancel.textContent = "close";
				cancel.style.color = "#fff";
				cancel.style.marginTop = "1%";
				cancel.style.fontFamily = "monospace";
				cancel.style.cursor = "pointer";
				cancel.addEventListener("click", () => {
					if(imageDiv && imageDiv.parentNode){
						imageDiv.parentNode.removeChild(imageDiv);
					}
					document.body.style.overflowY = "scroll"; // back to normal
				});
				enlargedImgContainer.appendChild(cancel);

				document.body.appendChild(imageDiv);				
			});
		});
	},
	
	template:
		`<div>
			<p v-if="currTag"> <br /> showing posts with the <b>{{currTag}}</b> tag <span id='clearTagSearch' @click='clearTagSearch'>clear?</span> </p>
			<br>
			<div v-for="(entry, index) in currPosts.slice(currIndex, currIndex + sliceSize)">
				<h3 v-if="currPosts[index+currIndex].title"> 
					Entry #{{currPosts.length - (index + currIndex) }} - {{currPosts[index+currIndex].title}}, {{currPosts[index + currIndex].date}} 
				</h3>
				<h3 v-else> 
					Entry #{{currPosts.length - (index + currIndex)}}, {{currPosts[index + currIndex].date}} 
				</h3>
				
				<hr>
				<span v-html="currPosts[index + currIndex].content"></span>
				<hr>
				<p> 
					Tags:
					<template v-for="tag in currPosts[index + currIndex].tags">
						<span class='tag' @click="sortByTag">{{tag}}</span>
					</template>
				</p>
				<br>
			</div>
			<div>
				<button @click="prevPage">newer</button>
				<button @click="nextPage">older</button>
			</div>
			<br>
		</div>`
}

export {
	Blog
}