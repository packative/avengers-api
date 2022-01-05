import express from 'express';
import mvFetch from '../utils/mvFetch';
const router = express.Router();

const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/**
 * MARVEL API LIMIT MAX VALUE IS 100.
 * Thus, I use max value for now.
 */
const MARVEL_API_MAX_LIMIT = 100;

/* GET /avengers listing. */
router.get('/', async function (req, res, next) {
  // 1. fetch series ids with "title=avengers".
  const resultArr = await mvFetch({
    pubKey: PUBLIC_KEY,
    priKey: PRIVATE_KEY,
    route: '/series',
    limit: MARVEL_API_MAX_LIMIT,
    pObject: {
      title: 'avengers',
    },
  });

  const ids = resultArr.map((result) => result.id);
  const idStr = ids.join();

  //console.log(idStr);

  // 2. fetch all characters with series values from step 1.
  const charArr = await mvFetch({
    pubKey: PUBLIC_KEY,
    priKey: PRIVATE_KEY,
    route: '/characters',
    limit: MARVEL_API_MAX_LIMIT,
    pObject: {
      series: idStr,
    },
  });

  const charArrForm = charArr.map((x) => {
    return {
      id: x.id,
      name: x.name,
      description: x.description,
      modified: x.modified,
    };
  });

  res.send(charArrForm);
  //console.log(charArrForm.length);
});

export default router;
