const {replyEphemeral, sendMessage} = require('../../utils/discord_wrapper.js');
const {markCompletedRequest} = require('../../utils/io.js');

async function handle(interaction, buttonCustomID) 
{
    const levelID = buttonCustomID.getOption('levelID');
    const mention = buttonCustomID.getOption('mention');
    const modMention = interaction.user.toString();

    sendMessage('sent_to_robtop', `Congratulations ${mention}, your level (ID: ${levelID}) was successfully sent to RobTop for feature. Responsible moderator: ${modMention}`);

    markCompletedRequest(levelID);

    await interaction.message.delete();

    replyEphemeral(interaction, 'Success');
}

module.exports.handle = handle;