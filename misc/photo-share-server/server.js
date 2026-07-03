const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// parent directory with all the child directories of pictures
const imageDirectoriesParent = 'C:/Users/nhung/stuff/travel';

// when user clicks on a directory of images to look at,
// keep track of that list so we can enable easy traversal of images via arrow keys
let currListOfImages = [];

function getPrevImage(currImage){
  let currIdx = 0;
  for(let i = 0; i < currListOfImages.length; i++){
    if(currListOfImages[i] === currImage){
      break;
    }
    currIdx = i;
  }
  return currListOfImages[currIdx];
}

function getNextImage(currImage){
  let currIdx = 0;
  for(let i = 0; i < currListOfImages.length; i++){
    currIdx++;
    if(currListOfImages[i] === currImage){
      break;
    }
  }
  if(currIdx > currListOfImages.length){
    currIdx = 0;
  }
  return currListOfImages[currIdx];
}

// get all the directories under a certain path
function getDirectories(path){
  return fs.readdirSync(path, {withFileTypes: true}).filter(e => e.isDirectory());
}

// get all images in a directory async
async function getImagesInDir(dirPath){
  const imgFormatsToFind = ['.jpg', '.png'];
  try{
    const imageFiles = await fs.promises.readdir(dirPath); // using the fs.promises readdir version
    const imgs = imageFiles.filter(file => {
      const fileFmt = path.extname(file).toLowerCase();
      return imgFormatsToFind.includes(fileFmt);
    });
    return imgs;
  }catch(err){
    console.error(`error getting images in ${dirPath}: ${err}`);
    return [];
  }
}

async function getImage(imgPath){
  try{
    const imgFileBuffer = await fs.promises.readFile(imgPath);
    const base64Img = imgFileBuffer.toString('base64');
    return base64Img;
  }catch(err){
    console.error(`error getting image: ${imgPath}: ${err}`);
    return;
  }
}

app.listen(port, () => {
  console.log(`serving app on port ${port}`);
});

// root route
app.get('/', (req, res) => {
  const dirList = getDirectories(imageDirectoriesParent).map(dir => dir.name);
  const htmlListOfDirs = `<ul>${
    dirList.map(dirName => {
      return `<li style='margin-top: 8px; margin-bottom: 8px'><a href='/images/?dir=${dirName}'>${dirName}</a></li>`
    }).join('')
  }</ul>`;
  const htmlBody = `<div><h1> trip pictures </h1>${htmlListOfDirs}</div>`;
  res.send(htmlBody);
});

// GET /images route with a query param for specifying a certain child directory to get the images from
// TODO: show a thumbnail of each photo? this might be helpful: https://www.npmjs.com/package/sharp
// also consider pagination!
app.get('/images', (req, res) => {
  const { dir } = req.query;
  const imageDir = `${imageDirectoriesParent}/${dir}`;
  getImagesInDir(imageDir).then(images => {
    currListOfImages = images; // keep track of the list of images in this directory
    const htmlImages = `<div style='display: flex'><ul>${
      images.map(i => `<li><a href='/image?imgPath=${imageDir}/${i}'>${i}</a></li>`).join('')
    }</ul></div>`;
    res.send(htmlImages);
  });
});

// GET a specific image
app.get('/image', (req, res) => {
  const { imgPath } = req.query;
  
  getImage(imgPath).then(imgBase64 => {
    // TODO: pass in the photo file format (e.g. jpg, png, etc.) here for image/<format> when constructing img src string
    const htmlImage = `<img width='50%' height='auto' src='data:image/jpg;base64,${imgBase64}' />`;
    
    const imageDirPath = path.dirname(imgPath);
    const imgFilename = path.basename(imgPath);
    
    const prevImg = getPrevImage(imgFilename);
    const nextImg = getNextImage(imgFilename);
    
    const prevImgPath = `${imageDirPath}/${prevImg}`;
    const nextImgPath = `${imageDirPath}/${nextImg}`;
    
    // use IIFE because regular arrow functions can't be used as inline functions!
    res.send(`<div tabindex="-1" autofocus onkeydown="((evt) => {
        if(evt.code === 'ArrowLeft'){
          //console.log('${prevImg}');
          window.location.href = '/image?imgPath=${prevImgPath}';
        }else if(evt.code === 'ArrowRight'){
          //console.log('${nextImg}');
          window.location.href = '/image?imgPath=${nextImgPath}';
        }
      })(event)">${htmlImage}</div>`);
  });
});