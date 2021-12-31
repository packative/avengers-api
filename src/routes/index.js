import express from 'express';
const router = express.Router();

/* GET index */
router.get('/', function (req, res, next) {
  res.send('Welcome to the Champions API 🏆');
});

export default router;
