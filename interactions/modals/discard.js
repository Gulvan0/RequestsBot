const {replyEphemeral, getTextInputValue, sendMessage, deleteMessage} = require('../../utils/discord_wrapper.js');
const {dropRequestInfo} = require('../../utils/io.js');

async function handle(interaction, customID)
{
    const levelID = customID.getOption('levelID');
    const mention = customID.getOption('mention');
    const modMention = interaction.user.toString();
    const msgID = customID.getOption('msgID');
    const reason = getTextInputValue(interaction, 'reasonInput');

    dropRequestInfo(levelID);

    deleteMessage('pending', msgID);

    const discardMsgText = `${mention}, your level request (ID: ${levelID}) was discarded by ${modMention}. Reason:\n${reason}`;
    sendMessage('discarded', discardMsgText);

    replyEphemeral(interaction, 'Success');
}

module.exports.handle = handle;