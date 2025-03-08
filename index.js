const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const drafts = new Map(); // Store draft data

client.once('ready', () => {
  console.log('Bot is online!');
});

// Function to parse arguments with quotes
function parseArgs(content) {
  const args = [];
  const regex = /"([^"]+)"|(\S+)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    args.push(match[1] || match[2]);
  }
  return args.slice(1); // Remove the command itself (!draft)
}

client.on('messageCreate', async (message) => {
  if (message.content.startsWith('!draft')) {
    const args = parseArgs(message.content);
    if (args.length < 4) {
      return message.reply('Usage: !draft "<game>" <mode> "<map>" <slots>');
    }
    const [game, mode, map, slots] = args;
    const maxSlots = parseInt(slots);

    if (isNaN(maxSlots) || maxSlots <= 0) {
      return message.reply('Slots must be a positive number!');
    }

    const draftMessage = await message.channel.send({
      content: `A draft has been started\nGame: ${game}\nMode: ${mode}\nMap: ${map}\nSlots: 0 / ${maxSlots}\n\nEnlisted players:\n(None)`,
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('join')
            .setLabel('Join')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('leave')
            .setLabel('Leave')
            .setStyle(ButtonStyle.Danger)
        ),
      ],
    });

    drafts.set(draftMessage.id, {
      game,
      mode,
      map,
      maxSlots,
      players: [],
    });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const draft = drafts.get(interaction.message.id);
  if (!draft) return;

  const user = interaction.user;
  let updatedContent = interaction.message.content.split('\n\nEnlisted players:\n')[0];

  if (interaction.customId === 'join') {
    if (!draft.players.includes(user.id)) {
      draft.players.push(user.id);
      await interaction.reply({ content: 'You joined the draft!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'You’re already in the draft!', ephemeral: true });
      return;
    }
  } else if (interaction.customId === 'leave') {
    const index = draft.players.indexOf(user.id);
    if (index > -1) {
      draft.players.splice(index, 1);
      await interaction.reply({ content: 'You left the draft!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'You’re not in the draft!', ephemeral: true });
      return;
    }
  }

  updatedContent += `\n\nEnlisted players:\n${draft.players.length > 0 ? draft.players.map(id => `<@${id}>`).join('\n') : '(None)'}`;
  await interaction.message.edit({
    content: updatedContent,
    components: interaction.message.components,
  });

  if (draft.players.length >= draft.maxSlots) {
    await interaction.channel.send('Draft has been filled. Please join channel #gaming to start playing.');
  }
});

client.login(process.env.DISCORD_TOKEN);