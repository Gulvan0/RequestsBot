const {getCooldownExpirationTS} = require('../../utils/io.js');
const {formatTS, replyEphemeral} = require('../../utils/discord_wrapper.js');
const {sendRequestModal} = require('../../components.js');
const {CustomID} = require('../../utils/custom_id.js');
const {config} = require('../../utils/io.js');

async function handle(interaction, options)
{
    const cdExpirationTS = getCooldownExpirationTS(interaction.user.id);

    if (cdExpirationTS)
    {
        const replyMsg = 'Please wait, you will be able to create new request ' + formatTS(cdExpirationTS);
        replyEphemeral(interaction, replyMsg);
        return;
    }

    if (!config.requests_enabled)
    {
        const replyMsg = 'Sorry, the requests are temporarily closed';
        replyEphemeral(interaction, replyMsg);
        return;
    }

    const reviewOpt = options.getString('review');
    const customID = CustomID.explicit('reqModal', {reviewOpt: reviewOpt});

    const modal = sendRequestModal(customID);
    await interaction.showModal(modal);
}

module.exports.handle = handle;