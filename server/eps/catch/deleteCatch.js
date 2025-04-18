
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

        //smaže soubor
        DelCatch(fish.id);
        //odpověď serveru
        res.json({});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

/**
 * Funkce smaže soubor podle ID
 * @param {*} ID  ID záznamu
 * @returns {}
 */
function DelCatch(ID)
{
     try {
            filePath = path.join(catchFolderPath, ID);
            fs.unlinkSync(filePath);
            return {};
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
}

module.exports = DeleteCatch;