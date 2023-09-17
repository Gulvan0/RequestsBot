const { SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandStringOption } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const clientId = process.env.CLIENT_ID;
const guildId  = process.env.GUILD_ID;
const token = process.env.TOKEN;

reqReviewOption = new SlashCommandStringOption()
    .setName('review')
    .setDescription('Whether to request a level review')
    .setDescriptionLocalization('ru', 'Запросить ли дополнительно обзор уровня?')
    .setRequired(true)
    .addChoices(
        {name: 'Also request a review in English', value: 'EN'},
        {name: 'Also request a review in Russian', value: 'RU'},
        {name: 'Just submit a level (no review will be provided)', value: 'NONE'}
    )

const commands = [
    new SlashCommandBuilder()
        .setName('req')
        .setDescription('Submit a level request')
        .setDescriptionLocalization('ru', 'Отправить уровень на ревью')
        .addStringOption(reqReviewOption)
        .toJSON(),
    new SlashCommandBuilder()
        .setName('refresh')
        .setDescription('Reset request cooldowns')
        .setDescriptionLocalization('ru', 'Обнулить КД реквестов')
        .toJSON()
]

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);