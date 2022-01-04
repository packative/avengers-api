import express from 'express';
import md5 from 'md5';
import axios from 'axios';
const router = express.Router();

const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/**
 * MARVEL API LIMIT MAX VALUE IS 100.
 * Thus, I use max value for now.
 */
const MARVEL_API_MAX_LIMIT = 100;

//status indicator of fetching process
//It might need to consider more steps.
const FETCH_INIT = 0;
const FETCH_SUCCESS = 1;
const FETCH_FAILED = 2;

/* GET /avengers listing. */
router.get('/', async function (req, res, next) {
  // API Docs: https://developer.marvel.com/docs
  // create some method / class or whatever to get the data

  //Get timestamp
  const ts = Date.now();
  const strForDigest = ts + PRIVATE_KEY + PUBLIC_KEY;
  const hash = md5(strForDigest);

  //axios test;
  try {
    /**
     *  Phase 1. First Fetch Begins.
     *  It fetchs only specified number of data (MARVEL_API_MAX_LIMIT).
     *
     * */

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

    //check fetch returns OK.
    const data = res.data.data;
    const paramArr = [];

    /**
     * Params Data Stored for future usage. ex) re-fetch data
     * for missing specific request chunck made by errors.
     */

    //first fetch stored.
    paramArr.push({
      fetchIdx: 0,
      offset: 0,
      limit: MARVEL_API_MAX_LIMIT,
      //fetchStatus: FETCH_SUCCESS,
    });

    //get ids from array of results of first fetch
    const idArr = data.results.map((result) => result.id);

    const total = data.total;
    if (MARVEL_API_MAX_LIMIT > total) {
      // 1. if total is small enough, don't need to fetch more.
      console.log(idArr);
    } else {
      /**
       *  2. if total is big, due to the limitation on response data of MARVEL SERVER's
       *  policy (limit max value is 100) we need multiple fetchs. Instead of countinuous fetch sequences,
       *  we can fetch them all at once by using Promise.all().
       */

      /**
       * Phase 2. Main Fetch Begins.
       */

      let fetchCnt = total / MARVEL_API_MAX_LIMIT;
      if (total % MARVEL_API_MAX_LIMIT != 0) fetchCnt++;
      for (let x = 1; x < fetchCnt; x++) {
        //it starts with 1.
        const param = {
          fetchIdx: x,
          offset: x * MARVEL_API_MAX_LIMIT,
          limit: MARVEL_API_MAX_LIMIT,
          // fetchStatus: FETCH_INIT, // Not sure if it is needed on this stage...
        };
        paramArr.push(param);
      }

      //Prep Promise Arry.
      const promises = paramArr.map(async (ele) => {
        const ts = Date.now();
        const strForDigest = ts + PRIVATE_KEY + PUBLIC_KEY;
        const hash = md5(strForDigest);

        const res = await axios.get('/series', {
          baseURL: 'https://gateway.marvel.com:443/v1/public/',
          params: {
            title: 'avengers',
            ts: ts,
            apikey: PUBLIC_KEY,
            hash: hash,
            offset: ele.offset,
            limit: MARVEL_API_MAX_LIMIT,
          },
          responseType: 'json',
        });
        return res;
      });

      //process promise array and return res of axios.
      const ph2ResArr = await Promise.all(promises);
      //resIdArr is multi dimention matirix
      const resIdArr = ph2ResArr.map(function (ele) {
        return ele.data.data.results.map((x) => x.id);
      });

      // Push ids into final idArr.
      //
      resIdArr.forEach((x) => {
        Array.prototype.push.apply(idArr, x);
      });

      console.log(idArr);
    }
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
