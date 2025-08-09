const { PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = async function createTicket(interaction, client) {
  const guild = client.guilds.cache.get(config.guildId);
  if (!guild) return interaction.reply({ content: 'Errore: guild non trovata.', ephemeral: true });

  // Controlla se utente ha già un ticket aperto
  const existingChannel = guild.channels.cache.find(ch =>
    ch.name === `ticket-${interaction.user.username.toLowerCase()}` &&
    ch.topic?.includes(interaction.user.id)
  );

  if (existingChannel) {
    return interaction.reply({ content: `Hai già un ticket aperto: ${existingChannel}`, ephemeral: true });
  }

  // Crea il canale nella categoria specificata
  const channel = await guild.channels.create({
    name: `ticket-${interaction.user.username}`,
    type: ChannelType.GuildText,
    topic: `Ticket per ${interaction.user.tag} (${interaction.user.id})`,
    parent: config.categoryId,
    permissionOverwrites: [
      {
        id: guild.roles.everyone.id,
        deny: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: interaction.user.id,
        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
      },
      // Permessi per ruoli staff configurati
      ...config.staffRoles.map(roleId => ({
        id: roleId,
        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
      })),
    ],
  });

  // Messaggio di benvenuto nel canale ticket
  const embed = new EmbedBuilder()
    .setTitle('🎟️ Ticket aperto')
    .setDescription(`Ciao ${interaction.user}, un membro dello staff ti risponderà presto.\nUsa i pulsanti qui sotto per chiudere il ticket.`)
    .setColor('Blue');

  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('close_ticket')
      .setLabel('🔒 Chiudi ticket')
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId('close_ticket_reason')
      .setLabel('📝 Chiudi con motivazione')
      .setStyle(ButtonStyle.Secondary)
  );

  await channel.send({ content: `${interaction.user}`, embeds: [embed], components: [buttons] });

  // Manda messaggio di log nel canale log configurato e salva il messaggio in memoria
  const logChannel = guild.channels.cache.get(config.logChannelId);
  if (logChannel) {
    const staffCount = 0; // All'inizio nessuno ha scritto nel ticket
    const logEmbed = new EmbedBuilder()
      .setTitle('🎟️ Nuovo ticket aperto')
      .addFields(
        { name: 'Utente', value: `<@${interaction.user.id}>`, inline: true },
        { name: 'Staff nel ticket', value: `${staffCount}`, inline: true }
      )
      .setColor('Green')
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('➡️ Vai al ticket')
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/channels/${guild.id}/${channel.id}`)
    );

    const logMessage = await logChannel.send({ embeds: [logEmbed], components: [row] });

    // Inizializza la mappa se non esiste e salva il messaggio di log di apertura
    if (!client.ticketLogs) client.ticketLogs = new Map();
    client.ticketLogs.set(channel.id, { openMessage: logMessage });
  }

  // Risposta all'utente
  return interaction.reply({ content: `Ticket creato: ${channel}`, ephemeral: true });
};
