const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('regolamento')
    .setDescription('Invia il regolamento ufficiale del server.'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const embed = new EmbedBuilder()
      .setColor(0x1abc9c)
      .setAuthor({
        name: 'Dev | CodeHub',
        iconURL: 'https://i.imgur.com/85nAiGp.png' 
      })
      .setTitle('📜 Regolamento Ufficiale')
      .setDescription('🔗 Di seguito trovi il regolamento completo del server \n **Dev | CodeHub**. Ti invitiamo a leggerlo attentamente per contribuire a una community seria e professionale.')
      .addFields({
        name: '👉 Clicca qui:',
        value: '[Visualizza il Regolamento](https://regolamento-dev-codehub.notion.site/242cd78736058057a7adc7d57bba746b?v=242cd7873605802d97f5000c0d85d52f)'
      })
      .setThumbnail('https://i.imgur.com/85nAiGp.png')
      .setFooter({ text: 'Dev | CodeHub — Qualità, Professionalità, Competenza' });

    await interaction.channel.send({ embeds: [embed] });

    await interaction.editReply({ content: '✅ Regolamento inviato nel canale.', ephemeral: true });
  }
};
