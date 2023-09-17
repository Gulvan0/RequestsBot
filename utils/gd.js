const https = require('https');

function requestHandler(callback, res)
{
    let data = '';

    res.on('data', (chunk) => {
        data = data + chunk.toString();
    });

    res.on('end', () => {
        callback(data);
    });
}

//====================================================

function getLevelOptions(levelID) 
{
    return {
        hostname: 'gdbrowser.com',
        port: 443,
        path: '/api/level/' + levelID,
        method: 'GET'
    };
}

function onGetLevelResponse(callback, data)
{
    const body = JSON.parse(data);

    if (body == -1)
        callback(null);
    else
        callback(body);
}

function getLevel(levelID, callback)
{
    const options = getLevelOptions(levelID);

    const responseHandler = onGetLevelResponse.bind(null, callback);
    const eventHandler = requestHandler.bind(null, responseHandler);
    const req = https.request(options, eventHandler);

    req.end();
}

module.exports.getLevel = getLevel;