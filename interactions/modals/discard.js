const {replyEphemeral, getTextInputValue, sendMessage, deleteMessage} = require('../../utils/discord_wrapper.js');

async function handle(interaction, customID)
{
    const levelID = customID.getOption('levelID');
    const mention = customID.getOption('mention');
    const msgID = customID.getOption('msgID');
    const reason = getTextInputValue(interaction, 'reasonInput');

    const discardMsgText = `${mention}, your level request (ID: ${levelID}) was discarded. Reason:\n${reason}`;

    deleteMessage('pending', msgID);

    sendMessage('discarded', discardMsgText);

    replyEphemeral(interaction, 'Success');
}

module.exports.handle = handle;