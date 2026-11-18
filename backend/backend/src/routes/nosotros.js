const express = require("express");
const controller = require("../controllers/nosotros");

const router = express.Router();

router.get("/", controller.get);
router.post("/", controller.create);
router.put("/", controller.update);
router.delete("/", controller.remove);

module.exports = router;
