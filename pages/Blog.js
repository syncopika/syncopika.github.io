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

export {
	Blog
}