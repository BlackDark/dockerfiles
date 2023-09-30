const express = require("express");

const emojis = require("./emojis");
const trakt = require("./trakt");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/emojis", emojis);
router.use("/trakt", trakt);

module.exports = router;
