const {CustomID} = require('../../utils/custom_id.js');
const {isValidLink} = require('../../utils/youtube.js');
const {replyEphemeral, getTextInputValue, sendMessage} = require('../../utils/discord_wrapper.js');
const {getLevel} = require('../../utils/gd.js');
const {putOnCooldown, setUrl, pendingRequestExists} = require('../../utils/io.js');
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

    setUrl(levelID, ytLink);
    
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

    if (pendingRequestExists(levelID))
    {
        const replyMsg = 'Please wait until the previous request for this level gets resolved';
        replyEphemeral(interaction, replyMsg);
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