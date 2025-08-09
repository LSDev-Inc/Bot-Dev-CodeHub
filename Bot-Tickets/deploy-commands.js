const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const token = process.env.TICKETS_TOKEN;
const clientId = '1401516947069210776'; 
const guildId = process.env.TICKETS_GUILD_ID;

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log(`Inizio registrazione ${commands.length} comandi...`);

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log('✅ Comandi registrati con successo!');
  } catch (error) {
    console.error(error);
  }
})();
