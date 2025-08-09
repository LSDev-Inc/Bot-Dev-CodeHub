module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`❌ Errore eseguendo comando ${interaction.commandName}:`, error);
      await interaction.reply({ content: 'Si è verificato un errore.', ephemeral: true });
    }
  }
};
