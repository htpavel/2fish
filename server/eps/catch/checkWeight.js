/**
 * Zkontroluje, jestli není překročen denní limit váhy 7 kg
 */

const fs = require("fs");
const path = require("path");

const catchFolderPath = path.join("server", "data", "catchData"); //adresář pro ukládání záznamů druhů ryb

const Ajv = require("ajv");// modul pro kontrolu formátu Json
const addFormats = require("ajv-formats").default; // přidává kontrolu formátů
const ajv = new Ajv();
addFormats(ajv);

const schema = {
    type: "object",
    properties: {
        date: { type: "string", format: "date" },
    },
    required: ["date"],
    additionalProperties: false,
};


async function CheckWeight(req, res) {
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
           const result = CheckW(fish.date);
           res.json({overWeight: result});
   
       }
       catch (error) {
           console.error(error);
           res.status(500).json({ message: error.message });
           throw error;
       }
}


/**
 * Vrátí true, jestli byl překročen limit 7 kg - DAO
 * @returns {boolean} 
 */
function CheckW(date) {
    try {
        const files = fs.readdirSync(catchFolderPath);
        var weight = 0;
        const allData = [];
        for (const file of files) {
            const fullPath = path.join(catchFolderPath, file);
            const fileContent = fs.readFileSync(fullPath, 'utf-8');
            try {
                const jsonData = JSON.parse(fileContent);

                if (String(jsonData.date) === date) {
                    weight += jsonData.weight;
                }
            } catch (error) {
                console.error("Error reading file ${file}:", error);
                res.status(500).json({ message: error.message });
                throw error;
            }
        }
        return weight >= 7;

    } catch (error) {
        console.error("Error reading directory:", error);
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

module.exports = CheckWeight;