const {resetCooldowns} = require('../../utils/io.js');
const {replyEphemeral} = require('../../utils/discord_wrapper.js');

async function handle(interaction, options)
{
    resetCooldowns();
    
    replyEphemeral(interaction, 'Success');
}

module.exports.handle = handle;