require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const corsOptions = {
    origin: 'http://localhost:3000' // this is the acceptable origin for incoming requests
};

app.use(cors(corsOptions));

app.get('/api/test', (req, res) => {
  res.json({'msg': process.env.MAL_CLIENT_ID});
});

app.get('/api/data', async (req, res) => {
  // for now, let's look at summer anime
  // apparently for summer 2022, there are 336 anime! :O
  // this is a lot more anime than what I was expecting
  // I really only want regular 1 or 2-cour seasonal Japanese anime 
  // but not sure if that's filterable via the API.
  const startYear = 2008;
  const endYear = 2012;
  
  const requestParams = {
    headers: {
      'X-MAL-CLIENT-ID': process.env.MAL_CLIENT_ID // your MyAnimeList client ID should be in a .env file
    },
  };
  
  const data = {};
  
  try {
    for(let year = startYear; year <= endYear; year++){
      data[year] = {}; // map genre to list of anime
      
      const url = `https://api.myanimelist.net/v2/anime/season/${year}/summer?limit=100`; // change limit to a higher number to get all anime for season
      const resp = await fetch(url, requestParams);
      if(!resp.ok){
        console.error(resp.status);
      }
      
      const json = await resp.json();
      
      console.log(`found ${json.data.length} anime for summer ${year}`);
      
      // for each anime in this year and season
      await Promise.all(json.data.map(async (d) => {
        const anime = d.node;
        const animeName = anime.title;
        const animeId = anime.id;
        
        //console.log(`getting genres for: ${animeName}, ${animeId} - summer ${year}`);
        
        // find the genres of this anime (note: I think I really want the theme, which appears separate from genre
        // if you check out a profile for an anime on MyAnimeList - but that's not filterable it seems? :/
        // see https://myanimelist.net/forum/?topicid=2067624&msgid=68303382)
        const detailsUrl = `https://api.myanimelist.net/v2/anime/${animeId}?fields=genres`;
        const genresResp = await fetch(detailsUrl, requestParams);
        if(!genresResp.ok){
          console.error(genresResp.status);
          console.log(`failed to find data for anime: ${animeName}, id: ${animeId}`);
        }else{
          const genresJson = await genresResp.json();
          if(genresJson.genres){
            genresJson.genres.forEach(genreObj => {
              const genre = genreObj.name;
              if(data[year][genre] === undefined){
                data[year][genre] = [animeName];
              }else{
                data[year][genre].push(animeName);
              }
            });
          }else{
            console.log(`failed to find genres for anime: ${animeName}, id: ${animeId}`);
          }
        }
      }));
    }
  }catch(err){
    console.error(err.message);
  }
  
  res.json({data});
});

app.use('/', express.static((path.join(__dirname, ''))));

app.listen(port, () => console.log('listening on port: ' + port));