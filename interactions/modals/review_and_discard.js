const {replyEphemeral, getTextInputValue, sendMessage, getChannelID, deleteMessage} = require('../../utils/discord_wrapper.js');
const {dropRequestInfo} = require('../../utils/io.js');

async function handle(interaction, customID)
{
    const levelID = customID.getOption('levelID');
    const mention = customID.getOption('mention');
    const modMention = interaction.user.toString();
    const msgID = customID.getOption('msgID');
    const review = getTextInputValue(interaction, 'reviewInput');
    const reason = getTextInputValue(interaction, 'reasonInput');

    const reviewChannelID = getChannelID('review_text');

    const reviewMsgText = `${mention}, ${modMention} wrote a review of your level (ID: ${levelID}):` + '\n\n' + review;

    var discardMsgText = `${mention}, your level request (ID: ${levelID}) was discarded by ${modMention}. `;
    if (reason)
        discardMsgText += 'Reason:\n' + reason;
    else
        discardMsgText += `See review in <#${reviewChannelID}> for the possible reasons`;

    dropRequestInfo(levelID);

    deleteMessage('pending', msgID);

    sendMessage('review_text', reviewMsgText);
    sendMessage('discarded', discardMsgText);
    
    replyEphemeral(interaction, 'Success');
}

module.exports.handle = handle;