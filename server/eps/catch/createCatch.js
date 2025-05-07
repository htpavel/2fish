/**
 * Uloží záznam úlovku do souboru ve formátu Json.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const catchFolderPath = path.join("server", "data", "catchData"); //adresář pro ukládání záznamů druhů ryb
const speciesFolderPath = path.join("server", "data", "speciesData"); //adresář pro ukládání záznamů úlovků

const Ajv = require("ajv");// modul pro kontrolu formátu Json
const addFormats = require("ajv-formats").default; // přidává kontrolu formátů
const ajv = new Ajv();
addFormats(ajv);

const schema = {
    type: "object",
    properties: {
        date: { type: "string", format: "date" }, //formát je kontrolován pomocí modulu ajv-formats
        districtNr: { type: "number", minimum: 100000, maximum: 999999 },
        weight: { type: "number", minimum: 1 },
        length: { type: "number", minimum: 1 },
        speciesId: { type: "string", minLength: 32, maxLength: 32 },
    },
    additionalProperties: false,
};

async function CreateCatch(req, res) {

    try {
        const fish = req.body;

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

        // validuj datum
        if (new Date(fish.date) >= new Date()) {
            res.status(400).json({
                code: "invalidDate",
                message: `date must be current day or a day in the past`,
                validationError: ajv.errors,
            });
            return;
        }
        //zkontroluj, jestli existuje ID 
        const sfPath = path.join(speciesFolderPath, fish.speciesId)

        if (!FileExists(sfPath)) {
            res.status(400).json({
                code: "catchIdDoesNotExist",
                message: `catch with id ${fish.speciesId} does not exist`,
                validationError: ajv.errors,
            });
            return;
        }

        //Vytvoří a uloží soubor
        Create(fish);
        res.json(fish);

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
        throw error;
    }
}

/**
 * Funkce vytvoří soubor do adresáře "catchData" a uloží do něj záznam ve formátu JSON - DAO
 * @param {object} fish 
 * @returns {object} Json data
 */
function Create(fish) {
    try {
        let ID;
        let filePath;

        do {
            ID = crypto.randomBytes(16).toString("hex"); //vygeneruje ID záznamu
            filePath = path.join(catchFolderPath, ID);
        }
        while (FileExists(filePath)); //ověří, jestli neexistuje stejný ID záznamu úlovku
        fish["id"] = ID; // přidá ID hodnotu do záznamu - není nutné, protože je hodnota uložena i v názvu
        const data = JSON.stringify(fish);
        fs.writeFileSync(filePath, data, "utf8");

        return fish;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Funkce ověří, jestli se nenachází stejné ID záznamu.
 * Ověřují se názvy souborů, kde je uloženo ID
 * @param {string} filePath 
 * @returns {bool}
 */
function FileExists(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = CreateCatch;