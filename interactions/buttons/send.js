const {replyEphemeral} = require('../../utils/discord_wrapper.js');
const {approve} = require('../../common/approve_level.js');

async function handle(interaction, buttonCustomID) 
{
    const levelID = buttonCustomID.getOption('levelID');
    const mention = buttonCustomID.getOption('mention');
    const msgID = interaction.message.id;

    approve(levelID, mention, msgID);

    replyEphemeral(interaction, 'Success');
}

module.exports.handle = handle;