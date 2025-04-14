const express = require("express");
const app = express();
const port = 3333;

const catchController = require("./controller/catch"); //controller pro úlovky
const speciesController = require("./controller/species"); //controler pro druhy ryb

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})