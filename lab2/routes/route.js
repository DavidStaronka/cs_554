const express = require('express');
const router = express.Router();
const data = require('../data');
const get = data.get;
const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();
let recentVisits = [];

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

function type_checker(item, type, errString, objType){
    if(item == undefined || typeof(item) != type || item.length == 0) throw errString;
    if(type == "string"){
        //got this if statement from stack overflow here: https://stackoverflow.com/questions/2031085/how-can-i-check-if-string-contains-characters-whitespace-not-just-whitespace
        if (!/\S/.test(item)) throw errString;
    }
    if(objType == "array"){
        if(!Array.isArray(item) || item.length == 0) throw errString;
    }
}

function stringCheck(str) {
    return typeof str === 'string' && str.length > 0 && str.replace(/\s/g, "").length > 0;
}

function validateId(id) {
    if(!id || typeof id !== 'string' || !stringCheck(id) || !ObjectId.isValid(id))
        throw new Error('id must be a valid ObjectId string');
}

router.use('/history', async (req, res) => {
    try{
        res.send(recentVisits.slice(0, 21));
        return;
    } catch(e){
        res.status(400).json({error: e.toString()});
        return;
    }
});

router.use('/:id', async (req, res, next) => {
    try{
        if(!req.params.id) throw new Error('id must not be empty');
        let cachedUser = await client.getAsync(req.params.id);
        if (cachedUser) {
            recentVisits.unshift(cachedUser);
            res.send(JSON.parse(cachedUser));
            return;
        } else {
            next();
        }
    } catch(e){
        res.status(400).json({error: e.toString()});
        return;
    }
});

router.use('/:id', async (req, res) => {
    try{
        let person = await get.getById(parseInt(req.params.id));
        if(!person) throw new Error('No person found with that id');
        recentVisits.unshift(person);
        await client.setAsync(req.params.id, JSON.stringify(person));
        res.send(person);
        return;
    } catch(e){
        res.status(400).json({error: e.toString()});
        return;
    }
});

module.exports = router;