const express = require("express");
const app = express();
const port = 3333;

const catchController = require("./controller/catch"); //controller pro úlovky
//const speciesController = require("./controller/species"); //controler pro druhy ryb

app.use(express.json()); // podpora pro application/json
app.use(express.urlencoded({ extended: true })); // podpora pro application/x-www-form-urlencoded


app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.use("/catch", catchController);
//app.use("/species", speciesController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})