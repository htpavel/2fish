/**
 * Vytvoří záznam do souboru ve formátu Json.
 */

const Ajv = require("ajv");// modul pro kontrolu formátu Json
const addFormats = require("ajv-formats").default; // přidává kontrolu formátů
const ajv = new Ajv();
addFormats(ajv);

const schema = {
    type: "object",
    properties: {
      date: { type: "string", format: "date" }, //
      districtNr: { type: "number"},
      weight:{ type: "number"},
      length: { type: "number" },
      speciesId: { type: "string" },
    },
    additionalProperties: false,
  };

  const validate = ajv.compile(schema);

async function CreateCatch(req, res) {

    let transaction = req.body;
    const valid = validate(transaction);

    if (!valid) console.log(validate.errors);
    else (console.log("Validováno"));
  }
  
  module.exports = CreateCatch;