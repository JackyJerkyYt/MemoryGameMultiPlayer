const router = require('express').Router();
let Score = require('../models/score.model')

router.route('/user').get((req, res) => {
  Score.find()
    .then((user) => {
      res.json(user)
    })
    .catch((err) => {
      res.status(400).json('Erro' + err)
    })
})

router.route('/createScore').post((req, res) => {
    const username = req.body.username
    const score = req.body.score
    const temp = new Score({
        username,
        score,
    })

    console.log("Landed")
    temp.save()
        .then(() => {
          res.json("Yay you just created a new one!")
        })
        .catch((err) => {
          res.status(400).json("Error" + err)
        })
})

router.route('/delete/:id').delete((req, res) => {
  Score.findByIdAndDelete(req.params.id)
    .then((exercise)=>{
      res.json(exercise)
    })
    .catch((err) => {
      res.status(400).json(err)
    })
})

module.exports = router