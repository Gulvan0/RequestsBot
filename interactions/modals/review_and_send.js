const {replyEphemeral, getTextInputValue, sendMessage, deleteMessage} = require('../../utils/discord_wrapper.js');
const {CustomID} = require('../../utils/custom_id.js');
const {markAsSentToRobTopRBtn, markAsSentToRobTopFBtn, discardPreApprovedBtn, buttonRow} = require('../../components.js');
const {approve} = require('../../common/approve_level.js');

async function handle(interaction, customID) 
{
    const levelID = customID.getOption('levelID');
    const mention = customID.getOption('mention');
    const msgID = customID.getOption('msgID');
    const review = getTextInputValue(interaction, 'reviewInput');

    const reviewMsgText = `${mention}, ${interaction.user.toString()} wrote a review of your level (ID: ${levelID}):` + '\n\n' + review;
    sendMessage('review_text', reviewMsgText);

    approve(levelID, mention, msgID);

    replyEphemeral(interaction, 'Success');
}

module.exports.handle = handle;