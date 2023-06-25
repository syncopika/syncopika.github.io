const BlogEntry = {
    props: ["entryTitle"],
    
    data: function(){
        return {
            'entryData': {}
        }
    },
    
    beforeMount: function(){
        // fetch the json entry, which should be in a file with the name given by the entryTitle prop
        const entry = fetch(`../blog_entries/json_entries/${this.entryTitle}.json`, {'method': 'GET'});
        entry
        .then((res) => res.json())
        .then(data => this.entryData = data);
    },
    
    updated: function(){
        // set image size and let all images be clickable to be enlarged
        const images = document.getElementsByTagName("img");
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
                const enlargedImage = new Image();

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

                const imageDiv = document.createElement('div');
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

                const cancel = document.createElement('h3');
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
            <h3 v-if="entryData.title"> {{entryData.date}}, {{entryData.title}} </h3>
            <h3 v-else> {{entryData.date}} </h3>
            <hr />
            <span v-html="entryData.content" v-bind:style="entryData.fontFamily ? 'font-family: ' + entryData.fontFamily : ''"></span>
            <hr />
            <br>
        </div>
        `
}

export {
    BlogEntry
}