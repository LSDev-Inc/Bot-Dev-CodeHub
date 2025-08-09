const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.VERIFICA_TOKEN);

const GUILD_ID = '1384827008609161296'; // Se vuoi puoi spostarlo in .env come VERIFICA_GUILD_ID

(async () => {
  try {
    console.log('⏳ Registrazione comandi in corso...');

    await rest.put(
      Routes.applicationGuildCommands(process.env.VERIFICA_CLIENT_ID, GUILD_ID),
      { body: commands },
    );

    console.log('✅ Comandi registrati nel server!');
  } catch (error) {
    console.error(error);
  }
})();
