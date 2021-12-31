import express from 'express';

const router = express.Router();

/* GET /avengers listing. */
router.get('/', function (req, res, next) {
  // API Docs: https://developer.marvel.com/docs
  // create some method / class or whatever to get the data

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
