const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Cancella un numero di messaggi nel canale')
    .addIntegerOption(option =>
      option.setName('count')
        .setDescription('Numero di messaggi da cancellare (max 100)')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const count = interaction.options.getInteger('count');

    // Limit count between 1 and 100 (discord limita a max 100 messaggi)
    if (count < 1 || count > 100) {
      return interaction.reply({ content: 'Inserisci un numero tra 1 e 100.', ephemeral: true });
    }

    // Prova a cancellare i messaggi
    try {
      // bulkDelete cancella i messaggi più recenti nel canale
      const deletedMessages = await interaction.channel.bulkDelete(count, true);

      return interaction.reply({ content: `Ho cancellato ${deletedMessages.size} messaggi.`, ephemeral: true });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'Non ho potuto cancellare i messaggi. Forse sono troppo vecchi o non ho permessi.', ephemeral: true });
    }
  }
};
