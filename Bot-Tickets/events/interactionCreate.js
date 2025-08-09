const {
  InteractionType,
} = require('discord.js');

const createTicket = require('../utils/createTicket');
const { promptCloseConfirmation, closeTicket } = require('../utils/closeTicket');
const config = require('../config');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (command) {
        try {
          await command.execute(interaction, client);
        } catch (err) {
          console.error('Errore eseguendo il comando:', err);
          await interaction.reply({ content: '❌ Errore durante l\'esecuzione del comando.', ephemeral: true });
        }
      }
    } else if (interaction.isButton()) {
      const { customId, member } = interaction;

      switch (customId) {
        case 'create_ticket':
          await createTicket(interaction, client);
          break;

        case 'close_ticket':
          // Chiudi senza motivo, mostra conferma con pulsanti
          await promptCloseConfirmation(interaction, false);
          break;

        case 'close_ticket_reason':
          // Solo staff può usare "chiudi con motivazione"
          const hasStaffRole = member.roles.cache.some(role => config.staffRoles.includes(role.id));
          if (!hasStaffRole) {
            return interaction.reply({ content: '❌ Non hai i permessi per chiudere con motivazione.', ephemeral: true });
          }
          // Apri modal per motivazione
          await promptCloseConfirmation(interaction, true);
          break;

        case 'confirm_close_yes':
          // Conferma chiusura senza motivo
          await closeTicket(interaction, client);
          break;

        case 'confirm_close_no':
          // Annulla chiusura
          await interaction.update({
            content: '❌ Chiusura ticket annullata.',
            components: [],
            embeds: [],
          });
          break;
      }
    } else if (interaction.type === InteractionType.ModalSubmit) {
      if (interaction.customId === 'close_reason_modal') {
        await interaction.deferReply({ ephemeral: true });

        const reason = interaction.fields.getTextInputValue('close_reason_input');

        await closeTicket(interaction, client, reason);

        await interaction.editReply({ content: '✅ Ticket chiuso con motivazione.' });
      }
    }
  },
};
