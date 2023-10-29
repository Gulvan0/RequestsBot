const {getRequestInfos} = require('../../utils/io.js');
const {replyEphemeral, formatTS, followUpEphemeral} = require('../../utils/discord_wrapper.js');

async function handle(interaction, options)
{
    await interaction.deferReply({ ephemeral: true });
    
    const requestInfos = getRequestInfos();
    var msg = "";
    var msgLength = 0;

    for (const [levelID, info] of requestInfos) 
    {
        if (!Object.hasOwn(info, "levelName"))
            continue;
        
        var requestRow = `${levelID}: ${info.levelName} by ${info.levelAuthor}`;
        if (Object.hasOwn(info, "requestAuthor") && Object.hasOwn(info, "created"))
            requestRow += ` (requested by ${info.requestAuthor} ${formatTS(info.created)})`;
        const appendedLength = requestRow.length;
        
        if (msgLength + appendedLength > 2000)
        {
            followUpEphemeral(interaction, msg);
            
            msg = "";
            msgLength = 0;
        }
        
        if (msgLength > 0)
        {
            msg += "\n";
            msgLength++;
        }

        msg += requestRow;
        msgLength += appendedLength;
    }
    
    followUpEphemeral(interaction, msg);
}

module.exports.handle = handle;