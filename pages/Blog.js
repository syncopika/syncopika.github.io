// https://stackoverflow.com/questions/68123636/vue-js-on-render-populate-content-dynamically-via-vue-router-params
// https://forum.vuejs.org/t/passing-props-through-router-link-solved/16868
// https://stackoverflow.com/questions/51244708/vue-cli-passing-props-data-through-router-link/55707080

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
            this.currIndex = 0;
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
                // may need to sort by date eventually but for now everything is in order per entry_list.txt
                res.reverse(); // assuming in ascending order currently
                this.posts = res;
                this.currPosts = res; // show all posts by default
            });
        });
    },
    
    updated: function(){
    },
    
    template:
        `<div>
            <p v-if="currTag"> <br /> showing posts with the <b>{{currTag}}</b> tag <span id='clearTagSearch' @click='clearTagSearch'>clear?</span> </p>
            <br>
            <div v-for="(entry, index) in currPosts">
                <h3 v-if="entry.title"> 
                    <router-link :to="{
                        name: 'blog',
                        params: {entryTitle: entry.filename}
                    }">
                        Entry #{{currPosts.length - index}} - {{entry.title}}, {{entry.date}} 
                    </router-link>
                </h3>
                <h3 v-else> 
                    <router-link :to="{
                        name: 'blog',
                        params: {entryTitle: entry.filename}
                    }">
                        Entry #{{currPosts.length - index}}, {{entry.date}} 
                    </router-link>
                </h3>
                
                <p> 
                    Tags:
                    <template v-for="tag in currPosts[index].tags">
                        <span class='tag' @click="sortByTag">{{tag}}</span>
                    </template>
                </p>
                <br>
            </div>
            
            <!--
            <div>
                <button @click="prevPage">newer</button>
                <button @click="nextPage">older</button>
            </div>
            -->
            
            <br>
            
        </div>`
}

export {
    Blog
}