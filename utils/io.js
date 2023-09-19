const yaml = require('js-yaml');
const fs = require('fs');
const {Collection} = require('discord.js');

const configData = fs.readFileSync('./config.yaml', 'utf8');
const config = yaml.load(configData, 'utf8');

const cdData = fs.readFileSync('./cd.json', 'utf8');
const cdMap = new Map(JSON.parse(cdData));
var cdExpirationTimes = new Collection(cdMap);

const youtubeUrlsData = fs.readFileSync('./urls.json', 'utf8');
const youtubeUrls = new Map(JSON.parse(youtubeUrlsData));

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

function pendingRequestExists(levelID)
{
    return youtubeUrls.has(levelID);
}

function dumpUrls()
{
    const itemArray = Array.from(youtubeUrls.entries());
    const serializedItemArray = JSON.stringify(itemArray);
    
    fs.writeFile("./urls.json", serializedItemArray, (err) => {});
}

function getUrl(levelID)
{
    if (!youtubeUrls.has(levelID))
        return null;
    else
        return youtubeUrls.get(levelID);
}

function setUrl(levelID, url)
{
    youtubeUrls.set(levelID, url);
    dumpUrls();
}

function dropUrl(levelID)
{
    youtubeUrls.delete(levelID);
    dumpUrls();
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
module.exports.resetCooldowns = resetCooldowns;

module.exports.pendingRequestExists = pendingRequestExists;

module.exports.getUrl = getUrl;
module.exports.setUrl = setUrl;
module.exports.dropUrl = dropUrl;