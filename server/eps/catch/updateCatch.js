const fs = require("fs");
const path = require("path");

const catchFolderPath = path.join("server", "data", "catchData"); //adresář pro ukládání záznamů úlovků
const speciesFolderPath = path.join("server", "data", "speciesData"); //adresář pro ukládání druhů ryb

const Ajv = require("ajv");// modul pro kontrolu formátu Json
const addFormats = require("ajv-formats").default; // přidává kontrolu formátů
const ajv = new Ajv();
addFormats(ajv);

const schema = {
    type: "object",
    properties: {
        id: { type: "string", minLength: 32, maxLength: 32 },
        date: { type: "string", format: "date" }, //formát je kontrolován pomocí modulu ajv-formats
        districtNr: { type: "number" },
        weight: { type: "number" },
        length: { type: "number" },
        speciesId: { type: "string", minLength: 32, maxLength: 32 },
    },
    additionalProperties: false,
};

async function UpdateCatch(req, res) {
    try {
        let fish = req.body;

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

        //zkontroluj, jestli existuje ID úlovku
        const sfPath = path.join(catchFolderPath, fish.id)

        if (!FileExists(sfPath)) {
            res.status(400).json({
                code: "CatchIdDoesNotExist",
                message: `Catch with id ${fish.id} does not exist`,
                validationError: ajv.errors,
            });
            return;
        }

        //zkontroluj, jestli existuje ID druhu ryby
        const caPath = path.join(speciesFolderPath, fish.speciesId)

        if (!FileExists(caPath)) {
            res.status(400).json({
                code: "SpeciesIdDoesNotExist",
                message: `species with id ${fish.speciesId} does not exist`,
                validationError: ajv.errors,
            });
            return;
        }
        
        try {
            fish = Update(fish);
            res.json({ fish });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
        
        
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
function Update(fish) {
    filePath = path.join(catchFolderPath, fish.id);
    if (FileExists(filePath)) {
        try {
            fish["id"] = fish.id;
            fish["date"] = fish.date;
            fish["districtNr"] = fish.districtNr;
            fish["weight"] = fish.weight;
            fish["lenght"] = fish.lenght;
            fish["speciesId"] = fish.speciesId;
            const data = JSON.stringify(fish);
            fs.writeFileSync(filePath, data, "utf8");
        }
        catch(error) {
            console.error(error);
            throw error;
        }

        return  fish;
    }
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
        throw { code: "failedToReadFile", fish: error.fish };
    }
}

module.exports = UpdateCatch;