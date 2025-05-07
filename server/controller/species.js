/**
 * Pomocné routování k entitě "Druhy" odkazující na jednotlivé UC.
 * Jeden UC je jeden soubor.
 * UC jsou uloženy v adresáři ../eps/species/
 */
const express = require("express");
const router = express.Router();

const GetSp = require("../eps/species/getSp");
const ListSp = require("../eps/species/listSp");
const CreateSp = require("../eps/species/createSp");
const UpdateSp = require("../eps/species/updateSp");
const DeleteSp = require("../eps/species/deleteSp");

router.get("/get", GetSp); //jeden záznam
router.get("/list", ListSp); //seznam všech záznamů
router.post("/create", CreateSp); //vytvoř záznam
router.post("/update", UpdateSp); //aktualizuj záznam
router.post("/delete", DeleteSp); //vymaž záznam

module.exports = router;