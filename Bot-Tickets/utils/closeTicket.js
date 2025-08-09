const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
} = require('discord.js');
const generateTranscript = require('./generateTranscript');
const config = require('../config');

module.exports = {
  async closeTicket(interaction, client, reason = null) {
    const channel = interaction.channel;

    try {
      // Genera trascrizione
      const transcriptBuffer = await generateTranscript(channel);

      // Recupera ID utente ticket dalla topic (es. (1234567890))
      const ticketOwnerId = channel.topic?.match(/\((\d+)\)/)?.[1] ?? 'Sconosciuto';

      // Invia trascrizione nel canale dedicato con info complete
      const transcriptChannel = await client.channels.fetch(config.transcriptChannelId);
      await transcriptChannel.send({
        content: `📄 Trascrizione ticket chiuso: **${channel.name}**\n` +
                 `Ticket aperto da: <@${ticketOwnerId}>\n` +
                 `Ticket chiuso da: <@${interaction.user.id}>\n` +
                 `Motivazione: ${reason ?? 'Nessuna motivazione fornita'}`,
        files: [{ attachment: transcriptBuffer, name: `${channel.name}.html` }],
      });

      // Cancella messaggio di apertura log se presente
      if (client.ticketLogs && client.ticketLogs.has(channel.id)) {
        const { openMessage } = client.ticketLogs.get(channel.id);
        if (openMessage && !openMessage.deleted) {
          await openMessage.delete().catch(() => {});
        }
      }

      // Manda messaggio di chiusura nel canale log e salva messaggio per cancellazione dopo
      const logChannel = await client.channels.fetch(config.logChannelId);
      const embed = new EmbedBuilder()
        .setTitle('❌ Ticket chiuso')
        .setDescription(`Il ticket \`${channel.name}\` è stato chiuso da <@${interaction.user.id}>.`)
        .setColor('Red')
        .addFields({ name: 'Motivazione', value: reason ?? 'Nessuna motivazione fornita' })
        .setTimestamp();

      const closeLogMessage = await logChannel.send({ embeds: [embed] });

      // Salva il messaggio di chiusura in memoria per cancellazione
      if (!client.ticketLogs) client.ticketLogs = new Map();
      if (client.ticketLogs.has(channel.id)) {
        const existing = client.ticketLogs.get(channel.id);
        client.ticketLogs.set(channel.id, { ...existing, closeMessage: closeLogMessage });
      } else {
        client.ticketLogs.set(channel.id, { closeMessage: closeLogMessage });
      }

      // Messaggio in canale ticket prima di eliminare
      await channel.send({ content: 'Il ticket verrà chiuso e il canale eliminato a breve.' });

      // Dopo 10 secondi elimina messaggio di chiusura log
      setTimeout(() => {
        if (closeLogMessage && !closeLogMessage.deleted) {
          closeLogMessage.delete().catch(() => {});
        }
      }, 10000);

      // Elimina canale dopo 3 secondi
      setTimeout(() => {
        channel.delete().catch(console.error);
        // Pulisce la memoria dei log ticket
        if (client.ticketLogs) client.ticketLogs.delete(channel.id);
      }, 3000);

    } catch (error) {
      console.error('Errore durante la chiusura del ticket:', error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: '❌ Errore durante la chiusura del ticket.', ephemeral: true });
      }
    }
  },

  async promptCloseConfirmation(interaction, withReason = false) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('confirm_close_yes')
        .setLabel('Conferma')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('confirm_close_no')
        .setLabel('Annulla')
        .setStyle(ButtonStyle.Secondary),
    );

    if (withReason) {
      const modal = new ModalBuilder()
        .setCustomId('close_reason_modal')
        .setTitle('Motivazione chiusura ticket');

      const reasonInput = new TextInputBuilder()
        .setCustomId('close_reason_input')
        .setLabel('Inserisci la motivazione')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(1000);

      modal.addComponents(new ActionRowBuilder().addComponents(reasonInput));

      await interaction.showModal(modal);
      return;
    }

    await interaction.reply({ content: 'Sei sicuro di voler chiudere il ticket?', components: [row], flags: 64 });
  }
};
