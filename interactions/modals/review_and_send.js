const { replyEphemeral, getTextInputValue, sendMessage, deleteMessage } = require('../../utils/discord_wrapper.js');
const { CustomID } = require('../../utils/custom_id.js');
const { markAsSentToRobTopRBtn, markAsSentToRobTopFBtn, discardPreApprovedBtn, buttonRow } = require('../../components.js');

async function handle(interaction, customID) 
{
    const levelID = customID.getOption('levelID');
    const mention = customID.getOption('mention');
    const msgID = customID.getOption('msgID');
    const review = getTextInputValue(interaction, 'reviewInput');

    const reviewMsgText = `${mention}, ${interaction.user.toString()} wrote a review of your level (ID: ${levelID}):` + '\n\n' + review;

    const successMsgText = `${mention}, your level (ID: ${levelID}) has been pre-approved. KazVixX will send it to RobTop in the next few days. Please patiently wait until then`;

    deleteMessage('pending', msgID);

    sendMessage('review_text', reviewMsgText);
    sendMessage('pre_approved', successMsgText);

    const btnOptions = {
        levelID: levelID,
        mention: mention
    };

    const robSentRBtnCustomID = CustomID.explicit('robSentRBtn', btnOptions);
    const robSentFBtnCustomID = CustomID.explicit('robSentFBtn', btnOptions);
    
    const robSentRBtn = markAsSentToRobTopRBtn(robSentRBtnCustomID);
    const robSentFBtn = markAsSentToRobTopFBtn(robSentFBtnCustomID);

    const robDiscardedBtnCustomID = CustomID.explicit('robDiscardedBtn', btnOptions);
    const robDiscardedBtn = discardPreApprovedBtn(robDiscardedBtnCustomID);

    const btns = [robSentRBtn, robSentFBtn, robDiscardedBtn];
    const components = [buttonRow(btns)];
    sendMessage('levels_to_send', `${levelID}`, components);

    replyEphemeral(interaction, 'Success');
}

module.exports.handle = handle;