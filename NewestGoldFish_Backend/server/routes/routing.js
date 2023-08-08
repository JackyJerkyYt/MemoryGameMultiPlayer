const router = require("express").Router();
let Score = require("../models/score.model");

router.route("/createScore").post((req, res) => {
  const username = req.body.username;
  const score = req.body.score;
  const temp = new Score({
    username,
    score,
  });
  temp
    .save()
    .then(() => {
      res.json("Yay you just created a new one!");
    })
    .catch((err) => {
      res.status(400).json("Error" + err);
    });
});

router.route("/getTop10").get((req, res) => {
  Score.find({}, "username score")
    .sort({ score: -1 })
    .limit(10)
    .then((topScores) => {
      res.json(topScores);
    })
    .catch((err) => {
      res.status(400).json("Error: " + err);
    });
});

module.exports = router;
