const {replyEphemeral, sendMessage} = require('../../utils/discord_wrapper.js');
const {CustomID} = require('../../utils/custom_id.js');
const {dropRequestInfo} = require('../../utils/io.js');

async function handle(interaction, buttonCustomID)
{
    const levelID = buttonCustomID.getOption('levelID');
    const mention = buttonCustomID.getOption('mention');
    const modMention = interaction.user.toString();
    
    sendMessage('discarded', `${mention}, your pre-approved level (ID: ${levelID}) was discarded. Responsible moderator: ${modMention}`);

    dropRequestInfo(levelID);

    await interaction.message.delete();
    
    replyEphemeral(interaction, 'Success');
}

module.exports.handle = handle;