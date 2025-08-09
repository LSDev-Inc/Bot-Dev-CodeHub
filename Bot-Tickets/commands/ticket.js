const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Mostra il pannello per aprire un ticket'),

  async execute(interaction) {
    // Rispondi in modo nascosto solo all'utente che ha usato il comando
    await interaction.reply({ content: 'Pannello ticket inviato.', ephemeral: true });

    // Invia nel canale pubblico il messaggio con embed e bottone
    const embed = new EmbedBuilder()
      .setTitle('🎟️ Supporto e Assistenza')
      .setDescription('Clicca sul pulsante qui sotto per aprire un ticket e parlare con il nostro staff.')
      .setColor('Blue')
      .setFooter({ text: 'Il nostro team è sempre pronto ad aiutarti!' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('create_ticket')
        .setLabel('🎫 Crea Ticket')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.channel.send({ embeds: [embed], components: [row] });
  },
};
