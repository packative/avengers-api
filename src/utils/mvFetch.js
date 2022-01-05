/**
 * Super Awsome Fetch for Marvel API
 */
import md5 from 'md5';
import axios from 'axios';

async function mvFetch({ pubKey, priKey, route, limit, pObject } = options) {
  /**
   * List of parameter which needed.
   * PUBLIC_KEY, PRIVATE_KEY -> pubKey,priKey
   * Route Name -> route
   * pObject that includes query name and values ->pObject
   * MARVEL_API_MAX_LIMIT -> limit
   *
   */

  //Get timestamp
  const ts = Date.now();
  const strForDigest = ts + priKey + pubKey;
  const hash = md5(strForDigest);

  //axios test;
  try {
    /**
     *  Phase 1. First Fetch Begins.
     *    It fetchs only specified number of data (MARVEL_API_MAX_LIMIT).
     *
     * */

    const res = await axios.get(route, {
      baseURL: 'https://gateway.marvel.com:443/v1/public/',
      params: {
        ...pObject,
        ts: ts,
        apikey: pubKey,
        hash: hash,
        limit: limit,
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
      limit: limit,
      //fetchStatus: FETCH_SUCCESS,
    });

    const resArr = data.results;

    const total = data.total;
    if (limit > total) {
      // 1. if total is small enough, don't need to fetch more.
      return resArr;
    } else {
      /**
       *  2. if total is big, due to the limitation on response data of MARVEL SERVER's
       *  policy (limit max value is 100) we need multiple fetchs. Instead of countinuous fetch sequences,
       *  we can fetch them all at once by using Promise.all().
       */

      /**
       * Phase 2. Main Fetch Begins.
       */

      let fetchCnt = total / limit;
      if (total % limit != 0) fetchCnt++;

      const paramArr2 = []; // for map iteration only for phase2 stage.

      for (let x = 1; x < fetchCnt; x++) {
        //it starts with 1.
        const param = {
          fetchIdx: x,
          offset: x * limit,
          limit: limit,
          // fetchStatus: FETCH_INIT, // Not sure if it is needed on this stage...
        };
        paramArr.push(param); // purpose of audit of param.
        paramArr2.push(param); // purpose of map method.
      }

      //Prep Promise Arry.
      const promises = paramArr2.map(async (ele) => {
        const ts = Date.now();
        const strForDigest = ts + priKey + pubKey;
        const hash = md5(strForDigest);

        const res = await axios.get(route, {
          baseURL: 'https://gateway.marvel.com:443/v1/public/',
          params: {
            ...pObject,
            ts: ts,
            apikey: pubKey,
            hash: hash,
            offset: ele.offset,
            limit: limit,
          },
          responseType: 'json',
        });
        return res;
      });

      //process promise array and return res of axios. notice only phase2 response.
      const resArr2 = await Promise.all(promises);
      //notice resultArr is multi dimentional matirix
      const resultArr = resArr2.map(function (ele) {
        return ele.data.data.results;
      });

      //Combinate phase1 and phase2 results.
      resultArr.forEach((x) => {
        Array.prototype.push.apply(resArr, x);
      });

      return resArr;
    }
  } catch (err) {
    console.log(err.response.data);
  }
}

export default mvFetch;
