const express = require("express");
const controller = require("../controllers/hitos");

const router = express.Router();

router.get("/", controller.getAll);
router.get("/getAll", controller.getAll);
router.get("/:id", controller.get);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
