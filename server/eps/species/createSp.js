/**
 * Vytvoří nový záznam druhu ryby a uloží ho do souboru ve formátu JSON.
 */

const fs = require("fs").promises; // Použijeme Promise-based verzi fs pro asynchronní operace
const path = require("path");
const crypto = require("crypto");

const speciesFolderPath = path.join("server", "data", "speciesData"); //adresář pro ukládání záznamů

const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const schema = {
    type: "object",
    properties: {
        name: { type: "string" },
    },
    required: ["name"],
    additionalProperties: false,
};

// --- Hlavní handler pro vytvoření druhu ---
async function CreateSp(req, res) { // Přidáno 'res' jako argument
    try {
        const species = req.body;

        // Validace vstupu
        const valid = ajv.validate(schema, species);
        if (!valid) {
            return res.status(400).json({ // Používáme 'return' pro ukončení
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
        }

        // Ověří, jestli neexistuje stejný druh
        try {
            const nameExists = await NameExists(species.name);
            if (nameExists) {
                return res.status(409).json({ // 409 Conflict - Název již existuje
                    code: "uniqueNameAlreadyExists",
                    message: "Druh s tímto názvem již existuje.",
                });
            }
        } catch (nameError) {
            // Chyba při čtení souborů (např. adresář neexistuje)
            console.error("Chyba při ověřování existence názvu:", nameError);
            return res.status(500).json({ message: "Interní chyba serveru při ověřování názvu." });
        }

        // Vytvoří a uloží soubor
        const createdSpecies = await Create(species); // Čekáme na dokončení vytvoření

        // Odpověď serveru
        res.json(createdSpecies); // Vracíme vytvořený objekt s ID
    } catch (error) {
        console.error("Chyba v CreateSp:", error);
        // Pokud chyba není specifická (např. z validace nebo existence jména), pošleme generickou 500
        res.status(500).json({ message: error.message || "Interní chyba serveru" });
    }
}

/**
 * Funkce vytvoří soubor do adresáře "speciesData" a uloží do něj záznam ve formátu JSON - DAO
 * @param {object} species
 * @returns {Promise<object>} JSON s přidaným ID
 */
async function Create(species) {
    let ID;
    let filePath;

    do {
        ID = crypto.randomBytes(16).toString("hex"); // Vygeneruje ID záznamu
        filePath = path.join(speciesFolderPath, ID);
        // Musíme čekat na FileExists
    } while (await FileExists(filePath)); // Čekáme na asynchronní funkci

    species["id"] = ID; // Přidá ID hodnotu do záznamu
    const data = JSON.stringify(species, null, 2); // Pěkně formátovaný JSON
    await fs.writeFile(filePath, data, "utf8"); // Používáme fs.promises.writeFile

    return species;
}

/**
 * Funkce ověří, jestli se nenachází stejné ID záznamu.
 * Ověřují se názvy souborů, kde je uloženo ID
 * @param {string} filePath
 * @returns {Promise<boolean>}
 */
async function FileExists(filePath) { // Asynchronní funkce
    try {
        await fs.access(filePath); // Zkusí získat přístup k souboru
        return true;
    } catch (error) {
        if (error.code === 'ENOENT') { // Soubor neexistuje
            return false;
        }
        // Jiná chyba při přístupu k souboru
        console.error(`Chyba při ověřování souboru ${filePath}:`, error);
        throw error; // Vyhodit chybu, aby byla zachycena výše
    }
}

/**
 * Funkce ověří, jestli existuje druh ryby s daným názvem.
 * @param {string} name
 * @returns {Promise<boolean>} true, pokud název existuje, jinak false
 */
async function NameExists(name) { // Asynchronní funkce
    try {
        const files = await fs.readdir(speciesFolderPath); // Načteme seznam souborů asynchronně
        for (const file of files) {
            const fullPath = path.join(speciesFolderPath, file);
            const fileContent = await fs.readFile(fullPath, 'utf-8'); // Čteme soubor asynchronně
            const jsonData = JSON.parse(fileContent);
            if (jsonData.name === name) {
                return true; // Název nalezen
            }
        }
        return false; // Název nenalezen
    } catch (error) {
        // Zde může dojít k chybě, pokud adresář neexistuje nebo soubor není JSON
        if (error.code === 'ENOENT') {
            console.warn(`Adresář pro druhy (${speciesFolderPath}) neexistuje.`);
            return false; // Pokud adresář neexistuje, název logicky taky ne
        }
        console.error("Chyba při čtení souborů druhů v NameExists:", error);
        throw error; // Propagujeme chybu dál
    }
}

module.exports = CreateSp;