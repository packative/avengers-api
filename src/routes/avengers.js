import express from 'express';
import md5 from 'md5';
import axios from 'axios';
import MarvelAPI from '../utils/uri';
import dotenv from 'dotenv/config';

const router = express.Router();
//const marvelAPI = new MarvelAPI();
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/* GET /avengers listing. */
router.get('/', async function (req, res, next) {
  // API Docs: https://developer.marvel.com/docs
  // create some method / class or whatever to get the data

  //Get timestamp
  const ts = Date.now();
  const strForDigest = ts + PRIVATE_KEY + PUBLIC_KEY;
  const hash = md5(strForDigest);
  // const targetURI = marvelAPI.makeURI(
  //   'series',
  //   'title',
  //   'avengers',
  //   ts,
  //   PUBLIC_KEY,
  //   hash
  // );

  //axios test;
  try {
    const res = await axios.get('/series', {
      baseURL: 'https://gateway.marvel.com:443/v1/public/',
      params: {
        title: 'avengers',
        ts: ts,
        apikey: PUBLIC_KEY,
        hash: hash,
      },
      responseType: 'json',
    });

    //all good.
    const json = res.data;
    console.log(json);
  } catch (err) {
    console.log(err);
  }
  // First get all the series from https://gateway.marvel.com:443/v1/public/series?title=avengers&apikey=ABC

  // Pass a comma seperated list of series ids to the character api:
  // https://gateway.marvel.com:443/v1/public/characters?series=100,200,300&apikey=ABC

  // Return all characters in this style:
  res.send([
    {
      id: 1009368,
      name: 'Iron Man',
      description:
        'Wounded, captured and forced to build a weapon by his enemies, billionaire industrialist Tony Stark instead created an advanced suit of armor to save his life and escape captivity. Now with a new outlook on life, Tony uses his money and intelligence to make the world a safer, better place as Iron Man.',
      modified: '2016-09-28T12:08:19-0400',
    },
  ]);
});

export default router;
