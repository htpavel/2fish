/**
 * Aktualizuje záznam druh ryby
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
        name: { type: "string" },
    },
    required: ["id"],
    additionalProperties: false,
};

async function UpdateSp(req, res) {

    let species = req.body;

    // validate input
    const valid = ajv.validate(schema, species);
    if (!valid) {
        res.status(400).json({
            code: "dtoInIsNotValid",
            category: "dtoIn is not valid",
            validationError: ajv.errors,
        });
        return;
    }

    //ověří, jestli existuje ID
    //zkontroluj, jestli existuje druh ryby
    const sfPath = path.join(speciesFolderPath, species.id)

    if (!FileExists(sfPath)) {
        res.status(400).json({
            code: "SpeciesIdDoesNotExist",
            message: `Species with id ${species.id} does not exist`,
            validationError: ajv.errors,
        });
        return;
    }

    try {
        const spec = Update(species);
        res.json({ spec });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

/**
 * Funkce aktualizuje název druhu ryby podle ID - DAO
 * @param {object} species druh ryby
 * @param {object} JSON
 */
function Update(species) {
    filePath = path.join(speciesFolderPath, species.id);
    if (FileExists(filePath)) {
        try {
            species["id"] = species.id;
            species["name"] = species.name;
            const data = JSON.stringify(species);
            fs.writeFileSync(filePath, data, "utf8");
        }
        catch {
            console.error(error);
            throw error;
        }

        return species;
    }
    else{}

}

/**
 * Funkce ověří, jestli se nenachází stejné ID záznamu.
 * Ověřují se názvy souborů, kde je uloženo ID
 * @param {string} filePath 
 * @returns bool
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
        throw { code: "failedToReadFile", specie: error.species };
    }
}

module.exports = UpdateSp;