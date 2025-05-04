/**
 * Získá záznam druhu ryby podle ID
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

async function GetSp(req, res) {

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

        const sp = getSpecies(species.id);
        if (!sp) {
            res.status(404).json({
                code: "speciesNotFound",
                category: `Species with id ${reqParams.id} not found`,
            });
            return;
        }
        res.json({ sp });

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

/**
 * Funkce přečte data ze souboru podle ID - DAO
 * @param {string} speciesID 
 * @returns {Object} JSON
 */
function getSpecies(speciesID) {
    try {
        const filePath = path.join(speciesFolderPath, speciesID);
        const fileData = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileData);
    } catch (error) {
        if (error.code === "ENOENT") return null;
        throw error;
    }
}
module.exports = GetSp;