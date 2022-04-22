const express = require('express');
const router = express.Router();
const axios = require('axios');
const LIMIT = 20;

router.get('/page/:pagenum', async (req, res) => {
    try {
        let offset = req.params.pagenum * LIMIT
        let url = 'https://pokeapi.co/api/v2/pokemon/?limit=' + LIMIT + '&offset=' + offset + '/';
        let response = await axios.get(url);
        // console.log(response.data);
        if(response.data.results.length === 0){
            res.status(404).json({ message: "No pokemon found on this page." })
        } else {
            res.json(response.data);
        }
    } catch(e) {
        res.status(404).json({ message: e })
    }
    return;
});

router.get('/:id', async (req, res) => {
    try {
        let url = 'https://pokeapi.co/api/v2/pokemon/' + req.params.id + '/';
        let response = await axios.get(url);
        console.log(response.data);
        res.json(response.data);
    } catch(e) {
        // console.log(e);
        res.status(404).json({ message: "No pokemon found with this id." })
    }
    return;
});

module.exports = router;