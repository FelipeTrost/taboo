const express = require("express");

const cards = require("./cards");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/cards", cards);

module.exports = router;
