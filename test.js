const https = require('https');
const levelID = '42840134';

const requestOptions = {
  hostname: 'gdbrowser.com',
  port: 443,
  path: '/api/level/' + levelID,
  method: 'GET'
};
  
req = https.request(requestOptions, (res) => {
  let data = '';
    res.on('data', (chunk) => {
        data = data + chunk.toString();
    });
  
    res.on('end', () => {
            console.log(data);
        const body = JSON.parse(data);
        
        /*const creatorStr = body.author == null? 'Anonymous Creator' : body.author
            const levelNameStr = '"' + body.name + '"'
            const diffStr = body.difficulty
            const reviewStr = 'Yes (in Russian)'

            var msgText = ''
            msgText += levelNameStr + ' by ' + creatorStr + '\n'
            msgText += 'ID: ' + levelID + '\n'
            msgText += 'Difficulty: ' + diffStr + '\n'
            msgText += 'YT Link: link' + '\n'
            msgText += 'Review: ' + reviewStr + '\n'
            msgText += '\n'*/

            console.log(body == -1);
    });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

req.end() 