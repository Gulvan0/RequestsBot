const {replyEphemeral, sendMessage} = require('../../utils/discord_wrapper.js');
const {CustomID} = require('../../utils/custom_id.js');

async function handle(interaction, buttonCustomID)
{
    const levelID = buttonCustomID.getOption('levelID');
    const mention = buttonCustomID.getOption('mention');
    const modMention = interaction.user.toString();
    
    sendMessage('discarded', `${mention}, your pre-approved level (ID: ${levelID}) was discarded. Responsible moderator: ${modMention}`);
    
    replyEphemeral(interaction, 'Success');

    await interaction.message.delete();
}

module.exports.handle = handle;