const {resetCooldowns, resetCooldown} = require('../../utils/io.js');
const {replyEphemeral} = require('../../utils/discord_wrapper.js');

async function handle(interaction, options)
{
    const user = options.getUser('user');
    
    if (user)
        resetCooldown(user.id);
    else
        resetCooldowns();
    
    replyEphemeral(interaction, 'Success');
}

module.exports.handle = handle;