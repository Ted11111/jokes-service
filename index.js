const express = require('express');
const app = express();
const { Joke } = require('./db');
const { Op } = require('sequelize')
app.set("json spaces", "\t")
app.use(express.json());


app.get('/jokes', async (req, res, next) => {
  if (req.query) {
    try{
      const jokes = await Joke.findAll({
        where: {
          tags: {
            [Op.substring]: req.query.tags ?? "",
          },
          joke: {
            [Op.substring]: req.query.content ??  "",
          },
        },
      });
    } catch (error) {
      console.error(error);
      next(error)
    }
  }
  try {
    const jokes = await Joke.findAll()
    res.send(jokes)
  } catch (error) {
    console.error(error);
    next(error)
  }
});

app.post("/jokes", async (req, res, next) => {
  try {
      const joke = await Joke.create(req.body);
      res.status(201).send(joke);
  } catch (error) {
    console.error(error);
    next(error);
  }
})

// we export the app, not listening in here, so that we can run tests
module.exports = app;
