/**
 * Vrátí všech nebo filtrovaných úlovků podle druhu ryby
 * není uvedeno ID druhu vrátí všechny úlovky
 */
const fs = require("fs");
const path = require("path");

const catchFolderPath = path.join("server", "data", "catchData"); //adresář pro ukládání záznamů druhů ryb
const speciesFolderPath = path.join("server", "data", "speciesData"); //adresář pro ukládání záznamů úlovků

const Ajv = require("ajv");// modul pro kontrolu formátu Json
const addFormats = require("ajv-formats").default; // přidává kontrolu formátů
const ajv = new Ajv();
addFormats(ajv);

const schema = {
    type: "object",
    properties: {
        speciesId: { type: "string", minLength: 32, maxLength: 32 },
    },
    required: [],
    additionalProperties: false,
};

async function ListCatch(req, res) {
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
        let listFish;

        if (fish.speciesId !== undefined) {
            //ověř jestli existuje ID
            const sfPath = path.join(speciesFolderPath, fish.speciesId)

            if (!FileExists(sfPath)) {
                res.status(400).json({
                    code: "catchIdDoesNotExist",
                    message: `catch with id ${fish.speciesId} does not exist`,
                    validationError: ajv.errors,
                });
                return;
            }
            listFish = GetFilteredList(fish.speciesId); //filtrovaný seznam
        }
        else {
            listFish = List(); //nefiltrovaný seznam
        }
        res.json({ listFish });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

/**
 * Vrátí seznam všech ryb - DAO
 * @returns {object} JSON
 */
function List() {
    try {
        const files = fs.readdirSync(catchFolderPath);
        const allData = [];
        for (const file of files) {
            const fullPath = path.join(catchFolderPath, file);
            const fileContent = fs.readFileSync(fullPath, 'utf-8');
            try {
                const jsonData = JSON.parse(fileContent);
                jsonData.name = getSpecies(jsonData.speciesId); // přidá podle ID název druhu ryby
                allData.push(jsonData);
            } catch (error) {
                console.error("Error reading file ${file}:", error);
                res.status(500).json({ message: error.message });
                throw error;
            }
        }

        return JSON.parse(JSON.stringify(allData));

    } catch (error) {
        console.error("Error reading directory:", error);
        throw error;
    }
}

/**
 * Vrátí seznam ryb filtrovaný podle druhů - DAO
 * @returns {object} JSON
 */
function GetFilteredList(idSpecies) {
    try {
        const files = fs.readdirSync(catchFolderPath);
        const allData = [];
        for (const file of files) {
            const fullPath = path.join(catchFolderPath, file);
            const fileContent = fs.readFileSync(fullPath, 'utf-8');
            try {
                const jsonData = JSON.parse(fileContent);
                jsonData.name = getSpecies(jsonData.speciesId); // přidá podle ID název druhu ryby

                if (String(jsonData.speciesId) === idSpecies) {
                    allData.push(jsonData);
                }
            } catch (error) {
                console.error("Error reading file ${file}:", error);
                res.status(500).json({ message: error.message });
                throw error;
            }
        }

        return JSON.parse(JSON.stringify(allData));

    } catch (error) {
        console.error("Error reading directory:", error);
        throw error;
    }
}

/**
 * Funkce přečte data ze souboru podle ID a vrátí název
 * @param {string} speciesID 
 * @returns {string} name
 */
function getSpecies(speciesID) {
    try {
        const filePath = path.join(speciesFolderPath, speciesID);
        const fileData = fs.readFileSync(filePath, "utf8");
        const data = JSON.parse(fileData);
        return data.name;

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
module.exports = ListCatch;