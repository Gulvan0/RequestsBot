const { reviewAndDiscardModal } = require('../../components.js');
const { CustomID } = require('../../utils/custom_id.js');

async function handle(interaction, buttonCustomID) 
{
    const reviewOpt = buttonCustomID.getOption('reviewOpt');
    const english = reviewOpt == 'EN';

    const levelID = buttonCustomID.getOption('levelID');
    const mention = buttonCustomID.getOption('mention');
    const msgID = interaction.message.id;

    const modalCustomID = CustomID.explicit('rndModal', {
        levelID: levelID,
        mention: mention,
        msgID: msgID
    });

    const modal = reviewAndDiscardModal(english, modalCustomID);
    await interaction.showModal(modal);
}

module.exports.handle = handle;