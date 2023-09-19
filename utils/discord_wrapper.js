const {Client, Intents} = require('discord.js');
const {ActivityType} = require('discord-api-types/v10');

const {config} = require('./io.js');
const {CustomID} = require('./custom_id.js');

const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const channels = new Map();

const handlers = {
    command: new Map(),
    modalSubmission: new Map(),
    button: new Map()
}

function formatTS(timestamp)
{
    const unixsecs = Math.round(timestamp / 1000);
    return `<t:${unixsecs}:R>`;
}

function setActivity(type, msg)
{
    const paramsObj = {type: type};
    client.user.setActivity(msg, type);
}

function bindCommandHandler(commandName, handler)
{
    handlers.command.set(commandName, handler);
}

function bindModalSubmissionHandler(modalSlug, handler)
{
    handlers.modalSubmission.set(modalSlug, handler);
}

function bindButtonHandler(btnSlug, handler)
{
    handlers.button.set(btnSlug, handler);
}

function getTextInputValue(interaction, customID, trim = true)
{
    const val = interaction.fields.getTextInputValue(customID);
    
    if (trim)
        return val.trim();
    else
        return val;
}

async function replyEphemeral(interaction, msg)
{
    await interaction.reply({content: msg, ephemeral: true});
}

async function sendMessage(channelSlug, msg, components)
{
    const channel = channels.get(channelSlug);
    
    if (components === undefined)
        await channel.send({content: msg});
    else
        await channel.send({content: msg, components: components});
}

async function deleteMessage(channelSlug, messageID)
{
    const channel = channels.get(channelSlug);
    
    const fetchedMsg = await channel.messages.fetch({
        around: messageID,
        limit: 1
    });

    await fetchedMsg.first().delete();
}

function getChannelID(slug)
{
    return channels.get(slug).id;
}

async function onInteraction(interaction)
{
    if (interaction.isCommand())
    {
        const handlerMap = handlers.command;
        const commandName = interaction.commandName;

        if (handlerMap.has(commandName))
        {
            const handler = handlerMap.get(commandName);
            handler(interaction, interaction.options);
        }
        else
            console.log(`${interaction.user.id} has executed the unknown command: ${commandName}`);
    }
    else if (interaction.isModalSubmit())
    {
        const handlerMap = handlers.modalSubmission;
        const customID = CustomID.fromStr(interaction.customId);
        const modalSlug = customID.slug;

        if (handlerMap.has(modalSlug))
        {
            const handler = handlerMap.get(modalSlug);
            handler(interaction, customID);
        }
        else
            console.log(`${interaction.user.id} has submitted the unknown modal: ${modalSlug}`);
    }
    else if (interaction.isButton())
    {
        const handlerMap = handlers.button;
        const customID = CustomID.fromStr(interaction.customId);
        const buttonSlug = customID.slug;

        if (handlerMap.has(buttonSlug))
        {
            const handler = handlerMap.get(buttonSlug);
            handler(interaction, customID);
        }
        else
            console.log(`${interaction.user.id} has pressed the unknown button: ${buttonSlug}`);
    }
}

function assignChannel(slug, id)
{
    const channel = client.channels.cache.get(id.toString());
    
    channels.set(slug, channel);
}

async function onReady()
{
    const guild = await client.guilds.fetch(guildId);
    
    const channelIDs = config.channel_ids;
    const notificationGroup = channelIDs.author_notifications;
    
    assignChannel('pending', channelIDs.pending);
    assignChannel('review_text', channelIDs.review_text);
    assignChannel('levels_to_send', channelIDs.levels_to_send);
    assignChannel('discarded', notificationGroup.discarded);
    assignChannel('pre_approved', notificationGroup.pre_approved);
    assignChannel('sent_to_robtop', notificationGroup.sent_to_robtop);

    setActivity(ActivityType.Watching, "out for your level requests!");

    console.log('Ready!');
}

function startClient()
{
    client.once('ready', onReady);
    client.on('interactionCreate', onInteraction);

    client.login(token);
}

module.exports.formatTS = formatTS;

module.exports.bindCommandHandler = bindCommandHandler;
module.exports.bindModalSubmissionHandler = bindModalSubmissionHandler;
module.exports.bindButtonHandler = bindButtonHandler;

module.exports.getTextInputValue = getTextInputValue;

module.exports.replyEphemeral = replyEphemeral;
module.exports.sendMessage = sendMessage;
module.exports.deleteMessage = deleteMessage;

module.exports.getChannelID = getChannelID;

module.exports.startClient = startClient;
