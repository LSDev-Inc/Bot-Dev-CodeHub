const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'guildMemberAdd',
  once: false,
  async execute(member, client) {
    const WELCOME_CHANNEL_ID = '1400601106970837002'; // Canale di benvenuto
    const NON_VERIFICATO_ROLE_ID = '1400586916021407837'; // ID del ruolo "non verificato"
    const REGOLAMENTO_LINK = 'https://docs.google.com/document/d/1HhqIEVSV2doWgkHFK6-Ry4jn-P2Zc8DqcLTI5I8CWxw/edit?usp=drivesdk';

    // ✅ Assegna ruolo "non verificato"
    try {
      await member.roles.add(NON_VERIFICATO_ROLE_ID);
      console.log(`🛡️ Ruolo "non verificato" assegnato a ${member.user.tag}`);
    } catch (error) {
      console.error(`❌ Errore assegnando ruolo a ${member.user.tag}:`, error);
    }

    // 🔊 Messaggio di benvenuto
    const channel = await member.guild.channels.fetch(WELCOME_CHANNEL_ID).catch(() => null);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor('#1E90FF')
      .setAuthor({
        name: `🌟 Benvenuto, ${member.user.username}!`,
        iconURL: member.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `Gentile ${member},\n\n` +
        `Siamo lieti di accoglierti nella nostra community\n\n` +
        `\u2005\u2005\u2005\u2005\u2005**• \u00A0 Dev | CodeHub**\n\n` +
        `Per iniziare:\n\n` +
        ` • \u00A0 📜 Consulta il  ⁠<#1400620518381588663> per integrarti al meglio\n\n` +
        ` • \u00A0  💬 Presentati in ⁠<#1400607161981337723>\n\n` +
        `Per qualsiasi dubbio siamo qui per aiutarti.\n\n` +
        `Felici di averti con noi, ti auguriamo un’esperienza fantastica!`
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
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
        .setURL(REGOLAMENTO_LINK)
    );

    await channel.send({
      content: `🎉 Benvenuto ${member}!`,
      embeds: [embed],
      components: [row],
    });
  },
};
