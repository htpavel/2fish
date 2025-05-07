/**
 * Vrátí údaje pro vyplnění ročního výkazu úlovku
 */

const fs = require("fs");
const path = require("path");

const catchFolderPath = path.join("server", "data", "catchData"); //adresář pro ukládání záznamů druhů ryb
const speciesFolderPath = path.join("server", "data", "speciesData"); //adresář pro ukládání záznamů úlovků

const Ajv = require("ajv");// modul pro kontrolu formátu Json
const addFormats = require("ajv-formats").default; // přidává kontrolu formátů
const ajv = new Ajv();
addFormats(ajv);

//Schema není potřeba, není žádný vstup

async function GetSummary(req, res) {

    if (!FileExists(catchFolderPath)) {
        res.status(400).json({
            code: "catchIdDoesNotExist",
            message: `catch with id ${fish.id} does not exist`,
            validationError: ajv.errors,
        });
        return;
    }
    const summary = GetSum();
    res.json({ summary });
}


/**
 * Vrátí podklady pro vyplnění sumáře - DAO
 * @returns {object} JSON
 */
function GetSum() {
    try {
        const files = fs.readdirSync(catchFolderPath);
        const allData = [];
        var totalWeight = 0; //celková váha ryb
        var totalLength = 0; //celková délka ryb
        const fishWeights = {}; // objekt pro ukládání celkové váhy pro každý druh ryby
        const fishLengths = {}; // objekt pro ukládání celkové délky pro každý druh ryby
        for (const file of files) {
            const fullPath = path.join(catchFolderPath, file);
            const fileContent = fs.readFileSync(fullPath, 'utf-8');
            try {
                const jsonData = JSON.parse(fileContent);
                totalWeight += jsonData.weight;
                totalLength += jsonData.length;

                const speciesName = getSpecies(jsonData.speciesId);
                // Sčítáme váhu pro daný druh ryby
                if (fishWeights[speciesName]) {
                    fishWeights[speciesName] += jsonData.weight;
                } else {
                    fishWeights[speciesName] = jsonData.weight;
                }

                // Sčítáme délku pro daný druh ryby
                if (fishLengths[speciesName]) {
                    fishLengths[speciesName] += jsonData.length;
                } else {
                    fishLengths[speciesName] = jsonData.length;
                }

            } catch (error) {
                console.error("Error reading file ${file}:", error);
                res.status(500).json({ message: error.message });
                throw error;
            }
        }
        allData.push({ totalWeight: totalWeight });
        allData.push({ totalLength: totalLength });
        allData.push({ totalWeightBySpecies: fishWeights });
        allData.push({ totalLengthBySpecies: fishLengths });

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

module.exports = GetSummary;