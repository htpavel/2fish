const Ajv = require("ajv");// modul pro kontrolu formátu Json
const addFormats = require("ajv-formats").default; // přidává kontrolu formátů
const ajv = new Ajv();
addFormats(ajv);

//zde musí být použit filtr: buď vše nebo jednotlivé druhy ryb.

async function ListCatch(req, res) {

    try {
      
        res.json({});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = ListCatch;