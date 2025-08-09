const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const commands = [
  new SlashCommandBuilder()
    .setName('regolamento')
    .setDescription('Invia il regolamento ufficiale del server.'),

  new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Cancella un numero di messaggi nel canale')
    .addIntegerOption(option =>
      option.setName('count')
        .setDescription('Numero di messaggi da cancellare (max 100)')
        .setRequired(true))
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.REGOLAMENTO_TOKEN);

(async () => {
  try {
    console.log('⏳ Registrazione comandi...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.REGOLAMENTO_CLIENT_ID, process.env.REGOLAMENTO_GUILD_ID),
      { body: commands }
    );
    console.log('✅ Comandi registrati con successo!');
  } catch (error) {
    console.error(error);
  }
})();
