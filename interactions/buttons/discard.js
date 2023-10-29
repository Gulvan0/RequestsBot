const {discardModal} = require('../../components.js');
const {CustomID} = require('../../utils/custom_id.js');
const {dropRequestInfo} = require('../../utils/io.js');

async function handle(interaction, buttonCustomID)
{
    const levelID = buttonCustomID.getOption('levelID');
    const mention = buttonCustomID.getOption('mention');
    const msgID = interaction.message.id;

    dropRequestInfo(levelID);
    
    const modalCustomID = CustomID.explicit('dModal', {
        levelID: levelID,
        mention: mention,
        msgID: msgID
    });
    
    const modal = discardModal(modalCustomID);
    await interaction.showModal(modal);
}

module.exports.handle = handle;