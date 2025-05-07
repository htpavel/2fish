/**
 * Vytvoří nový záznam druhu ryby a uloží ho do souboru ve formátu JSON.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const speciesFolderPath = path.join("server", "data", "speciesData"); //adresář pro ukládání záznamů

const Ajv = require("ajv");// modul pro kontrolu formátu Json
const addFormats = require("ajv-formats").default; // přidává kontrolu formátů
const ajv = new Ajv();
addFormats(ajv);

const schema = {
    type: "object",
    properties: {
        name: { type: "string" },
    },
    required: ["name"],
    additionalProperties: false,
};

async function CreateSp(req) {

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

        //ověří jestli neexistuje stejný druh
        NameExists(species.name);

        //Vytvoří a uloží soubor
        Create(species, res);

        //odpověď serveru
        res.json(species);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
        throw error;
    }
}

/**
 * Funkce vytvoří soubor do adresáře "speciesData" a uloží do něj záznam ve formátu JSON - DAO
 * @param {object} species 
 * @returns {object} JSON 
 */
function Create(species) {
    try {
        let ID;
        let filePath;

        do {
            ID = crypto.randomBytes(16).toString("hex"); //vygeneruje ID záznamu
            filePath = path.join(speciesFolderPath, ID);
        }
        while (FileExists(filePath));
        species["id"] = ID; // přidá ID hodnotu do záznamu - není nutné, protože je hodnota uložena i v názvu
        const data = JSON.stringify(species);
        fs.writeFileSync(filePath, data, "utf8");

        return species;
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
        res.status(500).json({ message: error.message });
    }
}

/**
  * Funkce ověří, jestli existuje druh ryby
  * @param {string} name 
  * @returns bool
  */
function NameExists(name) {
    try {
        fs.readdir(speciesFolderPath, (err, files) => {
            files.forEach(file => {
                const fullPath = path.join(speciesFolderPath, file);
                const fileContent = fs.readFileSync(fullPath, 'utf-8');
                const jsonData = JSON.parse(fileContent);
                if (jsonData["name"] === name) {
                    throw {
                        code: "uniqueNameAlreadyExists",
                        message: "exists category with given name",
                    };
                }

            });
        });
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
module.exports = CreateSp;