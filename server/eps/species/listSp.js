/**
 * Získá seznam všech druhů ryb
  */
const fs = require("fs");
const path = require("path");
const speciesFolderPath = path.join("server", "data", "speciesData"); //adresář pro ukládání záznamů

const Ajv = require("ajv");// modul pro kontrolu formátu Json
const addFormats = require("ajv-formats").default; // přidává kontrolu formátů
const ajv = new Ajv();
addFormats(ajv);

const schema = {
    type: "object",
    properties: {
        date: { type: "string" },
    },
    required: [],
    additionalProperties: false,
};

async function ListSp(req, res) {

    try {
        const species = req.body;

        //validuj vstup
        const valid = ajv.validate(schema, species);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }
        const listSP = GetList();
        res.json({listSP});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}


/**
 * Vrátí seznam všech druhů ryb
 * @returns {string} Json
 */
function GetList() {
  try {
    const files = fs.readdirSync(speciesFolderPath);
    const allData = [];
       for (const file of files) {
      const fullPath = path.join(speciesFolderPath, file);
      const fileContent = fs.readFileSync(fullPath, 'utf-8');
      try {
        const jsonData = JSON.parse(fileContent);
        allData.push(jsonData);
      } catch (error) {
        console.error("Error reading file ${file}:", error);
      }
    }
  
    return JSON.parse(JSON.stringify(allData));

  } catch (error) {
    console.error("Error reading directory:", error);
    throw error;
  }
}

module.exports = ListSp;