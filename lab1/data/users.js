const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 12;

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

function ObjectIdToString(obj) {
    if (typeof obj !== 'object' || !ObjectId.isValid(obj._id))
        throw new Error('Object passed in needs to have a valid _id field');

    obj._id = obj._id.toString();

    return obj;
}

function validateId(id) {
    if (!id || typeof id !== 'string' || !stringCheck(id) || !ObjectId.isValid(id))
        throw new Error('id must be a valid ObjectId string');
}

function stringCheck(str) {
    return typeof str === 'string' && str.length > 0 && str.replace(/\s/g, "").length > 0;
}

async function create(name, username, password) {
    console.log(name, username, password);
    type_checker(name, "string", "Name must be a non-empty string");
    type_checker(username, "string", "Username must be a non-empty string");
    type_checker(password, "string", "Password must be a non-empty string");

    const userCollection = await users();

    const oldUser = await userCollection.findOne({ username: username.toLowerCase() });
    if (oldUser) throw new Error('Username already exists.');

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = {
        name: name,
        username: username.toLowerCase(),
        password: hashedPassword
    };

    const info = await userCollection.insertOne(user);

    return {_id: user._id.toString(), name: user.name, username: user.username};
}

async function login_validation(username, password) {
    type_checker(username, "string", "Username must be a non-empty string");
    type_checker(password, "string", "Password must be a non-empty string");

    const userCollection = await users();
    const user = await userCollection.findOne({ username: username.toLowerCase() });
    if (!user) throw new Error('Either username or password is incorrect.');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Either username or password is incorrect.');

    return {_id: user._id.toString(), username: user.username};
}

module.exports = {
    create,
    login_validation
}