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
				enlargedImage.src = evt.target.src;

				let imageDiv = document.createElement('div');
				imageDiv.style.opacity = "0.98";
				imageDiv.style.backgroundColor = "#383838";
				imageDiv.style.position = "fixed";
				imageDiv.style.zIndex = "10";
				imageDiv.style.width = "100%";
				imageDiv.style.height = "100%";
				imageDiv.style.top = "0";
				imageDiv.style.left = "0";
				imageDiv.style.textAlign = "center";

				if (document.body.clientHeight < enlargedImage.height ||
					document.body.clientWidth < enlargedImage.width) {
					// reduce size of enlarged image if larger than the page
					enlargedImage.style.height = "70%";
					enlargedImage.style.width = "70%";
				}

				if (document.body.clientHeight > enlargedImage.height) {
					// if image height is smaller than the page height,
					// make sure the background is as tall as the page
					imageDiv.style.height = document.body.clientHeight + "px";
				}

				enlargedImage.style.marginTop = "3%";
				enlargedImage.addEventListener("dblclick", () => {
					if(imageDiv && imageDiv.parentNode){
						imageDiv.parentNode.removeChild(imageDiv);
					}
				});
				imageDiv.appendChild(enlargedImage);

				let cancel = document.createElement('h3');
				cancel.textContent = "close";
				cancel.style.color = "#fff";
				cancel.style.marginTop = "1%";
				cancel.style.fontFamily = "monospace";
				cancel.addEventListener("click", () => {
					if(imageDiv && imageDiv.parentNode){
						imageDiv.parentNode.removeChild(imageDiv);
					}
				});
				imageDiv.appendChild(cancel);

				document.body.appendChild(imageDiv);				
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

export {
	Blog
}