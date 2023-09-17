const {discardModal} = require('../../components.js');
const {CustomID} = require('../../utils/custom_id.js');

async function handle(interaction, buttonCustomID)
{
    const levelID = buttonCustomID.getOption('levelID');
    const mention = buttonCustomID.getOption('mention');
    const msgID = interaction.message.id;
    
    const modalCustomID = CustomID.explicit('dModal', {
        levelID: levelID,
        mention: mention,
        msgID: msgID
    });
    
    const modal = discardModal(modalCustomID);
    await interaction.showModal(modal);
}

module.exports.handle = handle;