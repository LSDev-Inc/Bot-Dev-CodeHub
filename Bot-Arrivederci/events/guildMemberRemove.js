const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guildMemberRemove',
  once: false,
  async execute(member) {
    try {
      const channelId = '1400606773647507507';  // ID canale messaggi uscita
      const channel = await member.guild.channels.fetch(channelId);
      if (!channel) return;

      const embed = new EmbedBuilder()
        .setColor('#ff0055')
        .setAuthor({ name: `${member.user.tag} è uscito da Dev | CodeHub`, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`👋 Arrivederci ${member.user},\n\n📊 Ora siamo **${member.guild.memberCount}** membri attivi.\n\nGrazie per aver fatto parte della nostra community. Ti auguriamo il meglio.`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: ' Dev | CodeHub - Creato da LSDev', iconURL: member.client.user.displayAvatarURL() })
        .setTimestamp();

      await channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Errore evento guildMemberRemove:', error);
    }
  },
};
