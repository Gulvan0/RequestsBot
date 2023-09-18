const { Modal, TextInputComponent, MessageActionRow, MessageButton } = require('discord.js');

const { CustomID } = require('./utils/custom_id.js');

function levelIDInput() 
{
    return new TextInputComponent()
        .setCustomId('levelIDInput')
        .setLabel("Level ID")
        .setMinLength(3)
        .setMaxLength(8)
        .setRequired(true)
        .setStyle('SHORT');
}

function ytLinkInput() 
{
    return new TextInputComponent()
        .setCustomId('ytLinkInput')
        .setLabel("Link to YouTube video")
        .setMinLength(8)
        .setMaxLength(100)
        .setPlaceholder('https://www.youtube.com/watch?v=...')
        .setRequired(true)
        .setStyle('SHORT');
}

function additionalInfoInput() 
{
    return new TextInputComponent()
        .setCustomId('additionalInfoInput')
        .setLabel("Additional info")
        .setMinLength(5)
        .setMaxLength(400)
        .setPlaceholder('Anything you want to add regarding this submission')
        .setRequired(false)
        .setStyle('PARAGRAPH');
}

function sendRequestModal(customID) 
{
    const firstActionRow = new MessageActionRow()
        .addComponents(levelIDInput());
    const secondActionRow = new MessageActionRow()
        .addComponents(ytLinkInput());
    const thirdActionRow = new MessageActionRow()
        .addComponents(additionalInfoInput());

    return new Modal()
        .setCustomId(customID.toStr())
        .setTitle('Submit a new request')
        .addComponents(firstActionRow, secondActionRow, thirdActionRow);
}

function sendToKazvixxBtn(customID) 
{
    return new MessageButton()
        .setCustomId(customID.toStr())
        .setLabel('Send')
        .setStyle('SUCCESS');
}

function reviewAndSendToKazvixxBtn(customID) 
{
    return new MessageButton()
        .setCustomId(customID.toStr())
        .setLabel('Review and Send')
        .setStyle('SUCCESS');
}

function reviewAndDiscardBtn(customID) 
{
    return new MessageButton()
        .setCustomId(customID.toStr())
        .setLabel('Review and Discard')
        .setStyle('DANGER');
}

function discardBtn(customID) 
{
    return new MessageButton()
        .setCustomId(customID.toStr())
        .setLabel('Discard')
        .setStyle('DANGER');
}

function buttonRow(buttons) 
{
    return new MessageActionRow()
        .addComponents(buttons);
}

function reviewTextPlaceholder(english) 
{
    if (english)
        return 'Write a review for this level here (in English)';
    else
        return 'Напишите ревью уровня (на русском языке)';
}

function reviewTextInput(english) 
{
    return new TextInputComponent()
        .setCustomId('reviewInput')
        .setLabel("Review")
        .setMinLength(5)
        .setMaxLength(1920)
        .setPlaceholder(reviewTextPlaceholder(english))
        .setRequired(true)
        .setStyle('PARAGRAPH');
}

function discardReasonInput(required) 
{
    return new TextInputComponent()
        .setCustomId('reasonInput')
        .setLabel("Reason")
        .setMinLength(5)
        .setMaxLength(400)
        .setPlaceholder('Why did you decide to discard this request?')
        .setRequired(required)
        .setStyle('PARAGRAPH');
}

function reviewAndSendModal(english, customID) 
{
    const reviewRow = new MessageActionRow()
        .addComponents(reviewTextInput(english));

    return new Modal()
        .setCustomId(customID.toStr())
        .setTitle('Review a level and send to KazVixX')
        .addComponents(reviewRow);
}

function reviewAndDiscardModal(english, customID) 
{
    const reviewTextRow = new MessageActionRow()
        .addComponents(reviewTextInput(english));
    const reasonRow = new MessageActionRow()
        .addComponents(discardReasonInput(false));

    return new Modal()
        .setCustomId(customID.toStr())
        .setTitle('Review a level and discard a request')
        .addComponents(reviewTextRow, reasonRow);
}

function discardModal(customID) 
{
    const reasonRow = new MessageActionRow()
        .addComponents(discardReasonInput(true));

    return new Modal()
        .setCustomId(customID.toStr())
        .setTitle('Discard a request')
        .addComponents(reasonRow);
}

function markAsSentToRobTopRBtn(customID) 
{
    return new MessageButton()
        .setCustomId(customID.toStr())
        .setLabel('Mark as Sent (Starrate)')
        .setStyle('SUCCESS');
}

function markAsSentToRobTopFBtn(customID) 
{
    return new MessageButton()
        .setCustomId(customID.toStr())
        .setLabel('Mark as Sent (Featured)')
        .setStyle('SUCCESS');
}

function discardPreApprovedBtn(customID) 
{
    return new MessageButton()
        .setCustomId(customID.toStr())
        .setLabel('Discard')
        .setStyle('DANGER');
}

module.exports.sendRequestModal = sendRequestModal;

module.exports.sendToKazvixxBtn = sendToKazvixxBtn;
module.exports.reviewAndSendToKazvixxBtn = reviewAndSendToKazvixxBtn;
module.exports.reviewAndDiscardBtn = reviewAndDiscardBtn;
module.exports.discardBtn = discardBtn;
module.exports.buttonRow = buttonRow;

module.exports.reviewAndSendModal = reviewAndSendModal;
module.exports.reviewAndDiscardModal = reviewAndDiscardModal;
module.exports.discardModal = discardModal;

module.exports.markAsSentToRobTopRBtn = markAsSentToRobTopRBtn;
module.exports.markAsSentToRobTopFBtn = markAsSentToRobTopFBtn;
module.exports.discardPreApprovedBtn = discardPreApprovedBtn;