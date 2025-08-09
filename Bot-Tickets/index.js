const path = require('path');
// Carica il .env unico che sta una cartella sopra
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const fs = require('fs');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel, Partials.Message],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.existsSync(commandsPath)
  ? fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
  : [];

for (const file of commandFiles) {
  try {
    const command = require(path.join(commandsPath, file));
    client.commands.set(command.data.name, command);
    console.log(`✅ Comando caricato: ${file}`);
  } catch (error) {
    console.error(`❌ Errore caricando comando ${file}:`, error);
  }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.existsSync(eventsPath)
  ? fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'))
  : [];

for (const file of eventFiles) {
  try {
    const event = require(path.join(eventsPath, file));
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
    console.log(`✅ Evento caricato: ${file}`);
  } catch (error) {
    console.error(`❌ Errore caricando evento ${file}:`, error);
  }
}

client.once('ready', () => {
  console.log(`🚀 Bot ticket pronto! Loggato come ${client.user.tag}`);
});

// Usa la variabile TOKEN con prefisso TICKETS_ dal .env unico
client.login(process.env.TICKETS_TOKEN).then(() => {
  console.log('🔑 Login effettuato con successo');
}).catch(err => {
  console.error('❌ Errore nel login:', err);
});
