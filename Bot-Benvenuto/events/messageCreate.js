const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  once: false,
  async execute(message, client) {
    if (message.author.bot) return;

    if (message.content === '!TBSF') {
      const embed = new EmbedBuilder()
        .setColor('#1E90FF')
        .setAuthor({
          name: `🌟 Benvenuto, ${message.author.username}!`,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(
          `Gentile ${message.author},\n\n` +
          `Siamo lieti di accoglierti nella nostra community\n\n` +
          `\u2005\u2005\u2005\u2005\u2005**• \u00A0 Dev | CodeHub**\n\n` +
          `Per iniziare:\n\n` +
          ` • \u00A0 📜 Consulta il  ⁠<#1400620518381588663> per integrarti al meglio\n\n` +
          ` • \u00A0  💬 Presentati in ⁠<#1400601106970837002>\n\n` +
          `Per qualsiasi dubbio siamo qui per aiutarti.\n\n` +
          `Felici di averti con noi, ti auguriamo un’esperienza fantastica!`
        )
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setImage('https://media.tenor.com/Ug6pdEZz_j8AAAAC/welcome-anime.gif')
        .setFooter({
          text: 'Dev | CodeHub — LSDev',
          iconURL: client.user.displayAvatarURL(),
        })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel('📜 Regolamento')
          .setStyle(ButtonStyle.Link)
          .setURL('https://docs.google.com/document/d/1vHsrukybs8y_oKjW1oUnfyErI7CnHOPDMjrWOrZyMQY/edit?usp=drivesdk')
      );

      await message.channel.send({
        content: `🎉 Benvenuto ${message.author}!`,
        embeds: [embed],
        components: [row],
      });
    }
  },
};
