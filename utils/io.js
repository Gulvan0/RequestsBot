const yaml = require('js-yaml');
const fs = require('fs');
const {Collection} = require('discord.js');

const configData = fs.readFileSync('./config.yaml', 'utf8');
const config = yaml.load(configData, 'utf8');

const cdData = fs.readFileSync('./cd.json', 'utf8');
const cdMap = new Map(JSON.parse(cdData));
var cdExpirationTimes = new Collection(cdMap);

const requestInfoData = fs.readFileSync('./requests.json', 'utf8');
const requestInfo = new Map(JSON.parse(requestInfoData));

function isFuture(timestamp)
{
    return timestamp > Date.now();
}

function cleanExpiredCooldowns()
{
    cdExpirationTimes = cdExpirationTimes.filter(isFuture);
}

function dumpCooldowns()
{
    const itemArray = Array.from(cdExpirationTimes.entries());
    const serializedItemArray = JSON.stringify(itemArray);
    
    fs.writeFile("./cd.json", serializedItemArray, (err) => {});
}

function dumpRequests()
{
    const itemArray = Array.from(requestInfo.entries());
    const serializedItemArray = JSON.stringify(itemArray);
    
    fs.writeFile("./requests.json", serializedItemArray, (err) => {});
}

function getRequestInfos()
{
    return requestInfo;
}

function getRequestStatus(levelID)
{
    if (!requestInfo.has(levelID))
        return "CAN_BE_REQUESTED";
    else
    {
        const obj = requestInfo.get(levelID);

        if (!Object.hasOwn(obj, "url"))
            return "COMPLETE";
        else
            return "PENDING";
    }
}

function getRequestInfo(levelID)
{
    if (!requestInfo.has(levelID))
        return null;
    else
        return requestInfo.get(levelID);
}

function addRequestInfo(levelID, url, levelName, levelAuthor, requestAuthor)
{
    requestInfo.set(levelID, {
        url: url, 
        levelName: levelName, 
        levelAuthor: levelAuthor,
        requestAuthor: requestAuthor,
        created: Date.now()
    });
    dumpRequests();
}

function markCompletedRequest(levelID)
{
    requestInfo.set(levelID, {});
    dumpRequests();
}

function dropRequestInfo(levelID)
{
    requestInfo.delete(levelID);
    dumpRequests();
}

function resetCooldown(userID)
{
    cdExpirationTimes.delete(userID);
    
    dumpCooldowns();
}

function resetCooldowns()
{
    cdExpirationTimes = new Collection();
    
    dumpCooldowns();
}

function getCooldownExpirationTS(userID)
{
    if (!cdExpirationTimes.has(userID))
        return null;

    const expiresAt = cdExpirationTimes.get(userID);
      
    if (!isFuture(expiresAt))
    {
        cdExpirationTimes.delete(userID);
        return null;
    }

    return expiresAt;
}

function putOnCooldown(userID)
{
    cleanExpiredCooldowns();
    
    const cooldownMinutes = config.request_cooldown_mins;
    const cooldownMS = cooldownMinutes * 60 * 1000;
    
    const expiresAt = Date.now() + cooldownMS;
    cdExpirationTimes.set(userID, expiresAt);

    dumpCooldowns();
}

cleanExpiredCooldowns();
dumpCooldowns();

module.exports.config = config;

module.exports.getCooldownExpirationTS = getCooldownExpirationTS;
module.exports.putOnCooldown = putOnCooldown;
module.exports.resetCooldown = resetCooldown;
module.exports.resetCooldowns = resetCooldowns;

module.exports.getRequestInfos = getRequestInfos;
module.exports.getRequestStatus = getRequestStatus;
module.exports.getRequestInfo = getRequestInfo;
module.exports.addRequestInfo = addRequestInfo;
module.exports.markCompletedRequest = markCompletedRequest;
module.exports.dropRequestInfo = dropRequestInfo;