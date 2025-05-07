
const Ajv = require("ajv");// modul pro kontrolu formátu Json
const addFormats = require("ajv-formats").default; // přidává kontrolu formátů
const ajv = new Ajv();
addFormats(ajv);

const fs = require("fs");
const path = require("path");
const catchFolderPath = path.join("server", "data", "catchData"); //adresář pro ukládání záznamů


const schema = {
    type: "object",
    properties: {
        id: { type: "string", minLength: 32, maxLength: 32 },
    },
    required: ["id"],
    additionalProperties: false,
};

async function DeleteCatch(req, res) {

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

        //smaže soubor
        Delete(fish.id);
        //odpověď serveru
        res.json({});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
        throw error;
    }
}

/**
 * Funkce smaže soubor podle ID - DAO
 * @param {*} ID  ID záznamu
 * @returns {}
 */
function Delete(ID) {
    try {
        filePath = path.join(catchFolderPath, ID);
        fs.unlinkSync(filePath);
        return {};
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

module.exports = DeleteCatch;