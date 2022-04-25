const express = require('express');
const router = express.Router();
const axios = require('axios');
const redis = require('redis');
const bluebird = require('bluebird');
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const LIMIT = 20;

router.get('/page/:pagenum', async (req, res) => {
    let pageData = await client.getAsync(`page:${req.params.pagenum}`);
    if (pageData) {
        res.json(JSON.parse(pageData));
    } else {
        try {
            let offset = req.params.pagenum * LIMIT
            let url = 'https://pokeapi.co/api/v2/pokemon/?limit=' + LIMIT + '&offset=' + offset + '/';
            let response = await axios.get(url);
            // console.log(response.data);
            if(response.data.results.length === 0){
                res.status(404).json({ message: "No pokemon found on this page." })
            } else {
                let cached = await client.setAsync(`page:${req.params.pagenum}`, JSON.stringify(response.data));
                res.json(response.data);
            }
        } catch(e) {
            res.status(404).json({ message: e })
        }
    }
    return;
});

router.get('/:id', async (req, res) => {
    let pokeData = await client.getAsync(`id:${req.params.id}`);
    if (pokeData) {
        res.json(JSON.parse(pokeData));
    } else {
        try {
            let url = 'https://pokeapi.co/api/v2/pokemon/' + req.params.id + '/';
            let response = await axios.get(url);
            console.log(response.data);
            let cached = await client.setAsync(`id:${req.params.id}`, JSON.stringify(response.data));
            res.json(response.data);
        } catch(e) {
            // console.log(e);
            res.status(404).json({ message: "No pokemon found with this id." })
        }
    }
    return;
});

module.exports = router;