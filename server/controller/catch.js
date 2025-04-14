/**
 * Pomocné routování k entitě "Úlovky" odkazující na jednotlivé UC.
 * Jeden UC je jeden soubor.
 * UC jsou uloženy v adresáři ../eps/catch/
 */
const express = require("express");
const router = express.Router();

const GetCatch = require("../eps/catch/getCatch");
const CreateCatch = require("../eps/catch/createCatch");
/*const ListCatch = require("../eps/catch/listCatch");

const UpdateCatch = require("../eps/catch/updateCatch");
const DeleteCatch = require("../eps/catch/deleteCatch");*/

router.get("/get", GetCatch); //jeden záznam
router.post("/create", CreateCatch); //vytvoř záznam
/*router.get("/list", ListCatch); //seznam všech záznamů
router.post("/update", UpdateCatch); //aktualizuj záznam
router.post("/delete", DeleteCatch); //vymaž záznam
*/
module.exports = router;