const {CustomID} = require('../../utils/custom_id.js');
const {isValidLink} = require('../../utils/youtube.js');
const {replyEphemeral, getTextInputValue, sendMessage, formatTS} = require('../../utils/discord_wrapper.js');
const {getLevel} = require('../../utils/gd.js');
const {putOnCooldown, addRequestInfo, getRequestStatus, getRequestInfo} = require('../../utils/io.js');
const {sendToKazvixxBtn, reviewAndSendToKazvixxBtn, reviewAndDiscardBtn, discardBtn, buttonRow} = require('../../components.js');

async function onLevelData(interaction, levelID, ytLink, additionalInfo, reviewOpt, data)
{
    if (!data)
    {
        const replyMsg = 'Failed to send a level request: level not found!';
        replyEphemeral(interaction, replyMsg);
        return;
    }
    else if (data.featured || data.epic)
    {
        const levelQuality = data.epic? 'epic' : 'featured';
        const replyMsg = `Failed to send a level request: level is already ${levelQuality}!`;
        replyEphemeral(interaction, replyMsg);
        return;
    }

    putOnCooldown(interaction.user.id);
      
    const creatorStr = data.author ?? 'Anonymous Creator';
    const levelNameStr = `"${data.name}"`;
    const diffStr = data.difficulty;
    const reviewStr = reviewOpt == 'EN' ? 'Yes (in English)' : reviewOpt == 'RU' ? 'Yes (in Russian)' : 'No';
    const mention = interaction.user.toString();

    const msgLines = [];
    
    msgLines.push(`${levelNameStr} by ${creatorStr}`);
    msgLines.push(`ID: ${levelID}`);
    msgLines.push(`YT Link: ${ytLink}`);
    msgLines.push(`Review: ${reviewStr}`);
    msgLines.push(`Requested by: ${mention}`);

    addRequestInfo(levelID, ytLink, levelNameStr, creatorStr, mention);
    
    if (additionalInfo)
    {
        msgLines.push("");
        msgLines.push(additionalInfo);
    }

    const btns = [];

    const nonReviewButtonOptions = {
        levelID: levelID,
        mention: mention
    };
    const reviewButtonOptions = {
        levelID: levelID,
        mention: mention,
        reviewOpt: reviewOpt
    };

    if (reviewOpt == 'NONE')
    {
        const sBtnCustomID = CustomID.explicit('sBtn', nonReviewButtonOptions);
        const sBtn = sendToKazvixxBtn(sBtnCustomID);
        btns.push(sBtn);

        const dBtnCustomID = CustomID.explicit('dBtn', nonReviewButtonOptions);
        const dBtn = discardBtn(dBtnCustomID);
        btns.push(dBtn);
    }
    else
    {
        const rnsBtnCustomID = CustomID.explicit('rnsBtn', reviewButtonOptions);
        const rnsBtn = reviewAndSendToKazvixxBtn(rnsBtnCustomID);
        btns.push(rnsBtn);

        const rndBtnCustomID = CustomID.explicit('rndBtn', reviewButtonOptions);
        const rndBtn = reviewAndDiscardBtn(rndBtnCustomID);
        btns.push(rndBtn);
        
        const dBtnCustomID = CustomID.explicit('dBtn', nonReviewButtonOptions);
        const dBtn = discardBtn(dBtnCustomID);
        btns.push(dBtn);
    }

    const msgText = msgLines.join('\n');
    const components = [buttonRow(btns)];
    
    sendMessage('pending', msgText, components);

    replyEphemeral(interaction, 'Success');
}

async function handle(interaction, customID)
{
    const levelID = getTextInputValue(interaction, 'levelIDInput');
    const ytLink = getTextInputValue(interaction, 'ytLinkInput');
    const additionalInfo = getTextInputValue(interaction, 'additionalInfoInput');
    
    const reviewOpt = customID.getOption('reviewOpt');
    const reqStatus = getRequestStatus(levelID);

    if (reqStatus != "CAN_BE_REQUESTED")
    {
        const reqInfo = getRequestInfo(levelID);

        var postfix = "";
        if (Object.hasOwn(reqInfo, "requestAuthor") && Object.hasOwn(reqInfo, "created"))
        {
            const prevReqAuthor = reqInfo.requestAuthor;
            const prevReqTS = formatTS(reqInfo.created);
            postfix = ` (requested by ${prevReqAuthor} ${prevReqTS})`;
        }

        var replyMsg;
        if (reqStatus == "PENDING")
            replyMsg = "Please wait until the previous request for this level gets resolved";
        else
            replyMsg = "This level has already been sent to RobTop";
        
        replyEphemeral(interaction, replyMsg + postfix);
    }
    else if (!isValidLink(ytLink))
    {
        const replyMsg = 'Failed to send a level request: invalid YouTube link!';
        replyEphemeral(interaction, replyMsg);
    }
    else
    {
        const onData = onLevelData.bind(null, interaction, levelID, ytLink, additionalInfo, reviewOpt);
        getLevel(levelID, onData);
    }
}

module.exports.handle = handle;