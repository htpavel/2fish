/**
 * Zkontroluje, jestli není překročen denní limit váhy 7 kg
 */

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
        date: { type: "string", format: "date" },
    },
    required: ["date"],
    additionalProperties: false,
};


async function CheckWeight(req, res) {
    try {
        const dateString = req.query.date; // Získává datum z URL: /catch/checkWeight?date=2025-03-19

        // Vytvoříme objekt pro validaci, aby odpovídal schématu
        const dtoIn = { date: dateString };
    
        // Validuj vstup
        const valid = ajv.validate(schema, dtoIn); // Validujeme objekt s datem
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "Query parameter 'date' is not valid or missing.",
                validationError: ajv.errors,
            });
            return;
        }
    
        // --- KLÍČOVÁ ÚPRAVA ZDE: Spolehlivé porovnání dat bez ohledu na časovou zónu/čas ---
        const inputDate = new Date(dateString); 
        const today = new Date();

        // Nastavíme obě data na začátek dne v UTC, abychom odstranili vliv časových zón a času
        const inputDateUtc = Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
        const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

        // Porovnáme, zda je vstupní datum striktně větší než dnešní datum
        if (inputDateUtc > todayUtc) { 
            res.status(400).json({
                code: "invalidDate",
                message: `Date must be current day or a day in the past. Received: ${dateString}.`,
            });
            return;
        }
        // --- KONEC UPRAVENÉ VALIDACE ---

        const totalWeight = CheckW(dateString); // Získáme celkovou váhu pro daný den
        const dailyLimit = 7.0; // Váš denní limit
        const overWeight = totalWeight >= dailyLimit; // Zjistíme, zda je limit překročen

        res.json({
            totalWeight: totalWeight,
            overWeight: overWeight
        });
    
    } catch (error) {
        console.error("Chyba na serveru při kontrole váhy:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
}


/**
 * Vrátí celkovou váhu ryb pro daný den - DAO (Data Access Object)
 * @param {string} date - Datum ve formátu YYYY-MM-DD
 * @returns {number} Celková váha ryb pro daný den v kg
 */
function CheckW(date) {
    let totalWeight = 0;
    try {
        const files = fs.readdirSync(catchFolderPath);
        for (const file of files) {
            const fullPath = path.join(catchFolderPath, file);
            const fileContent = fs.readFileSync(fullPath, 'utf-8');
            try {
                const jsonData = JSON.parse(fileContent);
                // Kontrolujeme, zda datum v souboru odpovídá požadovanému datu
                // a zda je váha platné číslo
                if (String(jsonData.date) === date && typeof jsonData.weight === 'number') {
                    totalWeight += jsonData.weight;
                }
            } catch (error) {
                console.error(`Chyba při čtení/parsování souboru ${file}:`, error);
                // Nechceme zastavovat celý proces kvůli jednomu špatnému souboru, jen logujeme
            }
        }
        return totalWeight;

    } catch (error) {
        console.error("Chyba při čtení adresáře s úlovky:", error);
        throw error; // Přepošleme chybu dál, aby byla zachycena v CheckWeight
    }
}

module.exports = CheckWeight;