/**
 * Uloží záznam do souboru ve formátu Json.
 */


/*pro insomnii
{
	"date": "2025-01-20",
	"districtNr": 10,
    "weight": 10,
	"length": 10,
	"speciesId": "ijjf23132"
}
*/
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const catchFolderPath = path.join("server","data", "catchData"); //adresář pro ukládání záznamů

const Ajv = require("ajv");// modul pro kontrolu formátu Json
const addFormats = require("ajv-formats").default; // přidává kontrolu formátů
const ajv = new Ajv();
addFormats(ajv);

const schema = {
    type: "object",
    properties: {
        date: { type: "string", format: "date" }, //formát je kontrolován pomocí modulu ajv-formats
        districtNr: { type: "number" },
        weight: { type: "number" },
        length: { type: "number" },
        speciesId: { type: "string" },
    },
    additionalProperties: false,
};


async function CreateCatch(req, res) {

    try {
        let fish = req.body;

        //validuj vstup
        const valid = ajv.validate(schema, fish);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        //zkontroluj datum
        if (new Date(fish.date) >= new Date()) {
            res.status(400).json({
                code: "invalidDate",
                message: "date must be current day or a day in the past",
                validationError: ajv.errors,
            });
            return;
        }

        /*    //zkontroluj jestli existuje druh ryby
            const category = categoryDao.get(fish.categoryId);
    
            if (!category) {
                res.status(400).json({
                  code: "categoryDoesNotExist",
                  message: `category with id ${fish.categoryId} does not exist`,
                  validationError: ajv.errors,
                });
                return; 
            }*/

        //uloží soubor
          create(fish);
          res.send(fish);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}


/**
 * Funkce vytvoří soubor do adresáře "data" a uloží do něj záznam ve formátu JSON
 * @param {object} fish 
 * @returns fish 
 */
function create(fish) {
    try {
        const ID = crypto.randomBytes(16).toString("hex"); //vygeneruje ID záznamu
        fish["id"] = ID; // přidá ID hodnotu do záznamu - není nutné, protože je hodnota uložena i v názvu
        const data = JSON.stringify(fish); 
        const filePath = path.join(catchFolderPath ,ID);
        fs.writeFileSync(filePath, data, "utf8");
        return fish;
    }
    catch (error) {
        
        throw  error.message;
    }
}


/**
 * Funkce ověří, jestli se nenachází stejné ID záznamu.
 * Ověřují se názvy souborů, kde je uloženo ID
 * @param {string} filePath 
 * @returns bool
 */
function checkID(filePath) {
    try {
    const filePath = path.join(categoryFolderPath, `${categoryId}.json`);
        const fileData = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileData);
    } catch (error) {
        if (error.code === "ENOENT") return null;
        throw { code: "failedToReadCategory", category: error.category };
    }
}

module.exports = CreateCatch;