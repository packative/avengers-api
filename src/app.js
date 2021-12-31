import createError from 'http-errors';
import express from 'express';

import indexRouter from './routes/index';
import avengersRouter from './routes/avengers';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/avengers', avengersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.error('err = ', err);
  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
