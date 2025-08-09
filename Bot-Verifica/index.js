const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const {
  Client, GatewayIntentBits, Events,
  ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder
} = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

const RUOLO_VERIFICATO = '1400588224425890004';
const RUOLO_NON_VERIFICATO = '1400586916021407837';

client.once(Events.ClientReady, () => {
  console.log(`✅ Bot online come ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'setupverifica') {
      await interaction.reply({ content: '✅ Messaggio di verifica inviato.', ephemeral: true });

      const embed = new EmbedBuilder()
        .setTitle('🎟️ Verifica per entrare in Dev | CodeHub')
        .setDescription(
          `Benvenuto in **Dev | CodeHub**!\nPer accedere al server devi prima verificarti.\nClicca il pulsante qui sotto per iniziare il processo di verifica.`
        )
        .setColor(0x5865F2)
        .setFooter({ text: 'Dev | CodeHub • Sistema di Verifica' });

      const button = new ButtonBuilder()
        .setCustomId('start_verifica')
        .setLabel('Verificati Ora')
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder().addComponents(button);

      const channel = await interaction.client.channels.fetch('1400607510557360198');
      await channel.send({ embeds: [embed], components: [row] });
    }
  }
  else if (interaction.isButton()) {
    const member = interaction.member;

    if (interaction.customId === 'start_verifica') {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('verificati')
          .setLabel('✅ Verificati')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('non_verificarti')
          .setLabel('❌ Non verificarti')
          .setStyle(ButtonStyle.Secondary)
      );

      await interaction.reply({
        content: 'Seleziona un’opzione per completare la verifica:',
        components: [row],
        ephemeral: true,
      });
    }
    else if (interaction.customId === 'verificati') {
      await member.roles.add(RUOLO_VERIFICATO);
      await member.roles.remove(RUOLO_NON_VERIFICATO);
      await interaction.update({
        content: '✅ Verifica completata! Ora hai accesso a tutto il server.',
        components: [],
      });
    }
    else if (interaction.customId === 'non_verificarti') {
      await interaction.update({
        content: '⏳ Ok, nessun problema! Torna quando sei pronto.',
        components: [],
      });
    }
  }
});

// Usa la variabile con prefisso VERIFICA_ dal .env unico
client.login(process.env.VERIFICA_TOKEN);
