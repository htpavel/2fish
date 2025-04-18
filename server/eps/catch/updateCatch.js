const fs = require("fs");
const path = require("path");

const catchFolderPath = path.join("server", "data", "catchData"); //adresář pro ukládání záznamů

const Ajv = require("ajv");// modul pro kontrolu formátu Json
const addFormats = require("ajv-formats").default; // přidává kontrolu formátů
const ajv = new Ajv();
addFormats(ajv);

async function UpdateCatchCatch(req, res) {
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
        
        //odpověď serveru
        res.json(fish);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = UpdateCatchCatch;