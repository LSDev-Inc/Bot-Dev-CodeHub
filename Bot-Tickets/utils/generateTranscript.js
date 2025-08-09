const { AttachmentBuilder } = require('discord.js');

async function generateTranscript(channel) {
  let messages = [];
  let lastId;

  while (true) {
    const options = { limit: 100 };
    if (lastId) options.before = lastId;

    const fetched = await channel.messages.fetch(options);
    messages = [...messages, ...fetched.values()];
    if (fetched.size < 100) break;

    lastId = fetched.last().id;
  }

  messages = messages.reverse(); // Ordine cronologico

  let content = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Transcript - ${channel.name}</title>
    <style>
      body { font-family: Arial; background: #2c2f33; color: #fff; padding: 20px; }
      .msg { margin-bottom: 10px; }
      .author { font-weight: bold; color: #7289da; }
      .time { color: #bbb; font-size: 12px; }
    </style>
  </head>
  <body>
    <h2>Transcript: ${channel.name}</h2>
  `;

  for (const msg of messages) {
    const timestamp = msg.createdAt.toLocaleString();
    content += `
      <div class="msg">
        <span class="author">${msg.author.tag}</span>
        <span class="time">(${timestamp})</span>
        <div>${msg.cleanContent || '[embed/media/allegato]'}</div>
      </div>
    `;
  }

  content += `
  </body>
  </html>
  `;

  return Buffer.from(content, 'utf-8');
}

module.exports = generateTranscript;
