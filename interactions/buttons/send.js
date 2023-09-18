const { replyEphemeral, sendMessage } = require('../../utils/discord_wrapper.js');
const { CustomID } = require('../../utils/custom_id.js');
const { markAsSentToRobTopRBtn, markAsSentToRobTopFBtn, discardPreApprovedBtn, buttonRow } = require('../../components.js');

async function handle(interaction, buttonCustomID) 
{
    const levelID = buttonCustomID.getOption('levelID');
    const mention = buttonCustomID.getOption('mention');

    const successMsgText = `${mention}, your level (ID: ${levelID}) has been pre-approved. KazVixX will send it to RobTop in the next few days. Please patiently wait until then`;

    sendMessage('pre_approved', successMsgText);

    const btnOptions = {
        levelID: levelID,
        mention: mention
    };

    const robSentRBtnCustomID = CustomID.explicit('robSentRBtn', btnOptions);
    const robSentFBtnCustomID = CustomID.explicit('robSentFBtn', btnOptions);
    
    const robSentRBtn = markAsSentToRobTopRBtn(robSentRBtnCustomID);
    const robSentFBtn = markAsSentToRobTopFBtn(robSentBFtnCustomID);

    const robDiscardedBtnCustomID = CustomID.explicit('robDiscardedBtn', btnOptions);
    const robDiscardedBtn = discardPreApprovedBtn(robDiscardedBtnCustomID);

    const btns = [robSentRBtn, robSentFBtn, robDiscardedBtn];
    const components = [buttonRow(btns)];
    sendMessage('levels_to_send', `${levelID} ${ytLink}`, components);

    replyEphemeral(interaction, 'Success');

    await interaction.message.delete();
}

module.exports.handle = handle;