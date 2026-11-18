const express = require("express");
const controller = require("../controllers/contactos");

const router = express.Router();

router.post("/", controller.create);
router.get("/", controller.list);
router.get("/:id", controller.get);

module.exports = router;
