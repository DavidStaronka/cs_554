const projects = require('./arr');

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

async function getById(id){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            type_checker(id, 'number', 'id must be a number');
            for(project of projects.projects) {
                if(project.id == id) {
                    resolve(project);
                    return;
                }
            }
            reject(new Error("No person found with that id."));
        }, 5000);
    });
}

module.exports = {getById};