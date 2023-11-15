var express = require('express');
var router = express.Router();

router.get('/', async function (req, res, next) {
    species = [
        {
            Id: 1,
            Name: "Tedy bear hamster"
        },
        {
            Id: 2,
            Name: "Jack-Russel"
        }
    ]
    res.render("species", {user: null})
})

router.post('/update', async function (req,res,next){
    res.render("index",{user: null})
})

module.exports = router;