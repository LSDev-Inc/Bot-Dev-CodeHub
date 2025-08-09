const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setupverifica')
    .setDescription('Invia il messaggio di verifica nel canale'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🎟️ Verifica per entrare in Dev | CodeHub')
      .setDescription(
        `Benvenuto in **Dev | CodeHub**!\n\n` +
        `Per accedere al server e goderti la community devi verificarti.\n` +
        `Clicca il pulsante qui sotto per iniziare il processo di verifica.`
      )
      .setColor(0x5865F2)
      .setFooter({ text: 'Dev | CodeHub • Sistema di Verifica' });

    const button = new ButtonBuilder()
      .setCustomId('start_verifica')
      .setLabel('Verificati Ora')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    // Risponde privatamente all'admin/mod che ha usato il comando
    await interaction.reply({ content: '✅ Messaggio di verifica inviato.', ephemeral: true });

    // Invia il messaggio pubblico nel canale di verifica
    const channel = await interaction.client.channels.fetch('1400607510557360198');
    await channel.send({ embeds: [embed], components: [row] });
  },
};
