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
        id: { type: "string", minLength: 32, maxLength: 32 },
    },
    required: ["id"],
    additionalProperties: false,
};

async function GetCatch(req, res) {
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

        //zkontroluj, jestli existuje ID
        const sfPath = path.join(catchFolderPath, fish.id)

        if (!FileExists(sfPath)) {
            res.status(400).json({
                code: "CatchIdDoesNotExist",
                message: `Catch with id ${fish.id} does not exist`,
                validationError: ajv.errors,
            });
            return;
        }


        const fi = getFish(fish.id, res);
        res.json({ fi });

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

/**
 * Funkce přečte data ze souboru podle ID
 * @param {string} ID 
 * @returns {string} druh ryby
 */
function getFish(ID) {
    try {
        const filePath = path.join(catchFolderPath, ID);
        const fileData = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileData);
    } catch (error) {
        if (error.code === "ENOENT") return null;
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

module.exports = GetCatch;