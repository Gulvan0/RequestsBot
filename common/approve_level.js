const {deleteMessage, sendMessage} = require('../utils/discord_wrapper.js');
const {CustomID} = require('../utils/custom_id.js');
const {markAsSentToRobTopRBtn, markAsSentToRobTopFBtn, discardPreApprovedBtn, buttonRow} = require('../components.js');
const {getUrl} = require('../utils/io.js');

async function approve(levelID, mention, pendingRequestMsgID) 
{
    const successMsgText = `${mention}, your level (ID: ${levelID}) has been pre-approved. KazVixX will send it to RobTop in the next few days. Please wait patiently until then`;

    sendMessage('pre_approved', successMsgText);

    const ytLink = getUrl(levelID) ?? "YouTube link not found";

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
    sendMessage('levels_to_send', `${levelID}\n${ytLink}`, components);

    deleteMessage('pending', pendingRequestMsgID);
}

module.exports.approve = approve;