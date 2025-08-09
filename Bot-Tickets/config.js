const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

module.exports = {
  token: process.env.TICKETS_TOKEN,
  guildId: process.env.TICKETS_GUILD_ID,
  staffRoles: process.env.TICKETS_STAFF_ROLE_IDS ? process.env.TICKETS_STAFF_ROLE_IDS.split(',') : [],
  logChannelId: process.env.TICKETS_LOG_CHANNEL_ID,
  transcriptChannelId: process.env.TICKETS_TRANSCRIPT_CHANNEL_ID,
  categoryId: process.env.TICKETS_CATEGORY_ID,
};