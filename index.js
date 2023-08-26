const keep_alive = require('./keep_alive.js')

require('isomorphic-fetch');
const GD = require('gd.js');
const fs = require('fs');
const https = require('https');
const { Client, Intents, Modal, TextInputComponent, MessageActionRow, MessageButton, Collection } = require('discord.js');
const { ActivityType } = require('discord-api-types/v10');

const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

const modsChannelID = '1065623745307357204';
const reviewsChannelID = '1065681370422186045';
const successesChannelID = '1061617543565025320';
const discardsChannelID = '1061617605451972740';

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const gd = new GD();

const ytPattern = /^(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed)(?:(?:(?=\/[-a-zA-Z0-9_]{11,}(?!\S))\/)|(?:\S*v=|v\/)))([-a-zA-Z0-9_]{11,})$/;

var modsChannel;
var reviewsChannel;
var successesChannel;
var discardsChannel;

const requestCooldownMS = 1000 * 60 * 60 * 6;
var cdExpirationTimes;

try {
  const data = fs.readFileSync('./cd.json', 'utf8');
  let map = new Map(JSON.parse(data));
  cdExpirationTimes = new Collection(map);
  
  const now = Date.now();
  cdExpirationTimes = cdExpirationTimes.filter(expirationTime => expirationTime > now);
  cdExpStr = JSON.stringify(Array.from(cdExpirationTimes.entries()));
  fs.writeFile("./cd.json", cdExpStr, (err)=>{}); 
} catch (err) {
  cdExpirationTimes = new Collection();
}

client.once('ready', async () => {
  const guild = await client.guilds.fetch(guildId);
  modsChannel = client.channels.cache.get(modsChannelID);
  reviewsChannel = client.channels.cache.get(reviewsChannelID);
  successesChannel = client.channels.cache.get(successesChannelID);
  discardsChannel = client.channels.cache.get(discardsChannelID);

  client.user.setActivity("out for your level requests!", {
    type: ActivityType.Watching,
  });

  console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;
  const now = Date.now();

  if (commandName === 'req') {
    if (cdExpirationTimes.has(interaction.user.id)) {
    	const expirationTime = cdExpirationTimes.get(interaction.user.id);
    
    	if (now < expirationTime) {
    		const expiredTimestamp = Math.round(expirationTime / 1000);
    		await interaction.reply({ content: `Please wait, you will be able to create new request <t:${expiredTimestamp}:R>.`, ephemeral: true });
        return;
    	}
    }
    
    const reviewOpt = options.getString('review');

    const levelIDInput = new TextInputComponent()
      .setCustomId('levelIDInput')
      .setLabel("Level ID")
      .setMinLength(3)
      .setMaxLength(8)
      .setRequired(true)
      .setStyle('SHORT');
    const ytLinkInput = new TextInputComponent()
      .setCustomId('ytLinkInput')
      .setLabel("Link to YouTube video")
      .setMinLength(8)
      .setMaxLength(100)
      .setPlaceholder('https://www.youtube.com/watch?v=...')
      .setRequired(true)
      .setStyle('SHORT');
    const additionalInfoInput = new TextInputComponent()
      .setCustomId('additionalInfoInput')
      .setLabel("Additional info")
      .setMinLength(5)
      .setMaxLength(400)
      .setPlaceholder('Anything you want to add regarding this submission')
      .setRequired(false)
      .setStyle('PARAGRAPH');

    const firstActionRow = new MessageActionRow().addComponents(levelIDInput);
    const secondActionRow = new MessageActionRow().addComponents(ytLinkInput);
    const thirdActionRow = new MessageActionRow().addComponents(additionalInfoInput);

    const modal = new Modal()
      .setCustomId('reqModal-' + reviewOpt)
      .setTitle('Submit a new request')
      .addComponents(firstActionRow, secondActionRow, thirdActionRow);

    await interaction.showModal(modal);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isModalSubmit()) return;
  if (!interaction.customId.startsWith('reqModal')) return;

  const parts = interaction.customId.split('-')

  if (parts.length != 2) return;

  const levelID = interaction.fields.getTextInputValue('levelIDInput').trim();
  const ytLink = interaction.fields.getTextInputValue('ytLinkInput').trim();
  const additionalInfo = interaction.fields.getTextInputValue('additionalInfoInput');
  const reviewOpt = parts[1]

  if (ytLink.match(ytPattern) == null) {
    await interaction.reply({ content: 'Failed to send a level request: invalid YouTube link!', ephemeral: true });
    return;
  }

  const requestOptions = {
    hostname: 'gdbrowser.com',
    port: 443,
    path: '/api/level/' + levelID,
    method: 'GET'
  };

  req = https.request(requestOptions, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data = data + chunk.toString();
    });

    res.on('end', () => {
      const body = JSON.parse(data);

      if (body == -1)
        interaction.reply({ content: 'Failed to send a level request: level not found!', ephemeral: true });
      else {
        const now = Date.now();
        cdExpirationTimes = cdExpirationTimes.filter(expirationTime => expirationTime > now);
        cdExpirationTimes.set(interaction.user.id, now + requestCooldownMS);
        cdExpStr = JSON.stringify(Array.from(cdExpirationTimes.entries()));
        fs.writeFile("./cd.json", cdExpStr, (err)=>{}); 
        
        const creatorStr = body.author == null ? 'Anonymous Creator' : body.author
        const levelNameStr = '"' + body.name + '"'
        const diffStr = body.difficulty
        const reviewStr = reviewOpt == 'EN' ? 'Yes (in English)' : reviewOpt == 'RU' ? 'Yes (in Russian)' : 'No'
        const mention = interaction.user.toString()

        var msgText = ''
        msgText += levelNameStr + ' by ' + creatorStr + '\n'
        msgText += 'ID: ' + levelID + '\n'
        msgText += 'Difficulty: ' + diffStr + '\n'
        msgText += 'YT Link: ' + ytLink + '\n'
        msgText += 'Review: ' + reviewStr + '\n'
        msgText += 'Requested by: ' + mention + '\n'
        msgText += '\n'
        if (additionalInfo)
          msgText += additionalInfo + '\n'

        const sBtn = new MessageButton()
          .setCustomId('sBtn-' + levelID + '-' + mention)
          .setLabel('Send')
          .setStyle('SUCCESS');

        const rnsBtn = new MessageButton()
          .setCustomId('rnsBtn-' + levelID + '-' + mention + '-' + reviewOpt)
          .setLabel('Review and Send')
          .setStyle('SUCCESS');

        const rndBtn = new MessageButton()
          .setCustomId('rndBtn-' + levelID + '-' + mention + '-' + reviewOpt)
          .setLabel('Review and Discard')
          .setStyle('DANGER');

        const dBtn = new MessageButton()
          .setCustomId('dBtn-' + levelID + '-' + mention)
          .setLabel('Discard')
          .setStyle('DANGER');

        const btns = reviewOpt == 'NONE' ? [sBtn, dBtn] : [rnsBtn, rndBtn, dBtn];

        const row = new MessageActionRow()
          .addComponents(btns);

        modsChannel.send({
          content: msgText,
          components: [row]
        });

        interaction.reply({
          content: 'Success',
          ephemeral: true
        });
      }
    });
  });
                      
  req.end();
});
    //=============================================================================================================================

    client.on('interactionCreate', async interaction => {
      if (!interaction.isButton()) return;
      if (!interaction.customId.startsWith('rnsBtn')) return;

      const parts = interaction.customId.split('-');
      const levelID = parts[1];
      const mention = parts[2];
      const reviewOpt = parts[3];

      var revPlaceholder;
      if (reviewOpt == 'EN')
        revPlaceholder = 'Write a review for this level here (in English)';
      else
        revPlaceholder = 'Напишите ревью уровня (на русском языке)';


      const reviewInput = new TextInputComponent()
        .setCustomId('reviewInput')
        .setLabel("Review")
        .setMinLength(5)
        .setMaxLength(1920)
        .setPlaceholder(revPlaceholder)
        .setRequired(true)
        .setStyle('PARAGRAPH');

      const reviewRow = new MessageActionRow().addComponents(reviewInput);

      const modal = new Modal()
        .setCustomId('rnsModal-' + levelID + '-' + mention + '-' + interaction.message.id)
        .setTitle('Review a level and send to mods')
        .addComponents(reviewRow);

      await interaction.showModal(modal);
    });

    client.on('interactionCreate', async interaction => {
      if (!interaction.isButton()) return;
      if (!interaction.customId.startsWith('rndBtn')) return;

      const parts = interaction.customId.split('-');
      const levelID = parts[1];
      const mention = parts[2];
      const reviewOpt = parts[3];

      var revPlaceholder;
      if (reviewOpt == 'EN')
        revPlaceholder = 'Write a review for this level here (in English)';
      else
        revPlaceholder = 'Напишите ревью уровня (на русском языке)';

      const reviewInput = new TextInputComponent()
        .setCustomId('reviewInput')
        .setLabel("Review")
        .setMinLength(5)
        .setMaxLength(1920)
        .setPlaceholder(revPlaceholder)
        .setRequired(true)
        .setStyle('PARAGRAPH');

      const reviewRow = new MessageActionRow().addComponents(reviewInput);

      const reasonInput = new TextInputComponent()
        .setCustomId('reasonInput')
        .setLabel("Reason")
        .setMinLength(5)
        .setMaxLength(100)
        .setPlaceholder('Why did you decide to decline this request?')
        .setRequired(false)
        .setStyle('PARAGRAPH');

      const reasonRow = new MessageActionRow().addComponents(reasonInput);

      const modal = new Modal()
        .setCustomId('rndModal-' + levelID + '-' + mention + '-' + interaction.message.id)
        .setTitle('Review a level and discard a request')
        .addComponents(reviewRow, reasonRow);

      await interaction.showModal(modal);
    });

    client.on('interactionCreate', async interaction => {
      if (!interaction.isButton()) return;
      if (!interaction.customId.startsWith('dBtn')) return;

      const parts = interaction.customId.split('-');
      const levelID = parts[1];
      const mention = parts[2];

      const reasonInput = new TextInputComponent()
        .setCustomId('reasonInput')
        .setLabel("Reason")
        .setMinLength(5)
        .setMaxLength(400)
        .setPlaceholder('Why did you decide to decline this request?')
        .setRequired(true)
        .setStyle('PARAGRAPH');

      const reasonRow = new MessageActionRow().addComponents(reasonInput);

      const modal = new Modal()
        .setCustomId('discardModal-' + levelID + '-' + mention + '-' + interaction.message.id)
        .setTitle('Discard a request')
        .addComponents(reasonRow);

      await interaction.showModal(modal);
    });

    //=============================================================================================================================

    client.on('interactionCreate', async interaction => {
      if (!interaction.isButton()) return;
      if (!interaction.customId.startsWith('sBtn')) return;

      const parts = interaction.customId.split('-');
      const levelID = parts[1];
      const mention = parts[2];

      var successMsgText = '';
      successMsgText += 'Congratulations ' + mention + ', your level (ID: ' + levelID + ') was successfully sent to mods!';

      await successesChannel.send({
        content: successMsgText
      });

      await interaction.reply({
        content: 'Success',
        ephemeral: true
      });

      await interaction.message.delete();
    });

    client.on('interactionCreate', async interaction => {
      if (!interaction.isModalSubmit()) return;
      if (!interaction.customId.startsWith('rnsModal')) return;

      const parts = interaction.customId.split('-');
      const levelID = parts[1];
      const mention = parts[2];
      const msgID = parts[3];
      const review = interaction.fields.getTextInputValue('reviewInput');

      var reviewMsgText = '';
      reviewMsgText += mention + ', a review for your level (ID: ' + levelID + ') is available:' + '\n';
      reviewMsgText += '\n';
      reviewMsgText += review;

      var successMsgText = '';
      successMsgText += 'Congratulations ' + mention + ', your level (ID: ' + levelID + ') was successfully sent to mods!';

      const fetchedMsg = await modsChannel.messages.fetch({
        around: msgID,
        limit: 1
      });

      await fetchedMsg.first().delete();

      await reviewsChannel.send({
        content: reviewMsgText
      });

      await successesChannel.send({
        content: successMsgText
      });

      await interaction.reply({
        content: 'Success',
        ephemeral: true
      });
    });

    client.on('interactionCreate', async interaction => {
      if (!interaction.isModalSubmit()) return;
      if (!interaction.customId.startsWith('rndModal')) return;

      const parts = interaction.customId.split('-');
      const levelID = parts[1];
      const mention = parts[2];
      const msgID = parts[3];
      const review = interaction.fields.getTextInputValue('reviewInput');
      const reason = interaction.fields.getTextInputValue('reasonInput');

      var reviewMsgText = '';
      reviewMsgText += mention + ', a review for your level (ID: ' + levelID + ') is available:' + '\n';
      reviewMsgText += '\n';
      reviewMsgText += review;

      var discardMsgText = '';
      if (reason) {
        discardMsgText += mention + ', your level request (ID: ' + levelID + ') was discarded with the following reason:' + '\n';
        discardMsgText += reason;
      }
      else
        discardMsgText += mention + ', your level request (ID: ' + levelID + ') was discarded. Check the review in the corresponding channel for the possible reasons' + '\n';


      const fetchedMsg = await modsChannel.messages.fetch({
        around: msgID,
        limit: 1
      });

      await fetchedMsg.first().delete();

      await reviewsChannel.send({
        content: reviewMsgText
      });

      await discardsChannel.send({
        content: discardMsgText
      });

      await interaction.reply({
        content: 'Success',
        ephemeral: true
      });
    });

    client.on('interactionCreate', async interaction => {
      if (!interaction.isModalSubmit()) return;
      if (!interaction.customId.startsWith('discardModal')) return;

      const parts = interaction.customId.split('-');
      const levelID = parts[1];
      const mention = parts[2];
      const msgID = parts[3];
      const reason = interaction.fields.getTextInputValue('reasonInput');

      var msgText = '';
      msgText += mention + ', your level request (ID: ' + levelID + ') was discarded with the following reason:' + '\n';
      msgText += reason;

      const fetchedMsg = await modsChannel.messages.fetch({
        around: msgID,
        limit: 1
      });

      await fetchedMsg.first().delete();

      await discardsChannel.send({
        content: msgText
      });

      await interaction.reply({
        content: 'Success',
        ephemeral: true
      });
    });

    client.login(token);
