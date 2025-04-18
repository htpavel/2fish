/**
 * Smaže druh ryby podle podle ID
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
        id: { type: "string", minLength: 32, maxLength: 32 },
    },
    required: ["id"],
    additionalProperties: false,
};

async function DeleteSp(req, res) {

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

        //smaže soubor
        DelSpecies(species.id);
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
function DelSpecies(ID)
{
     try {
            filePath = path.join(speciesFolderPath, ID);
            fs.unlinkSync(filePath);
            return {};
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
}

module.exports = DeleteSp;