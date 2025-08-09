const path = require('path');
// Carica il .env unico che sta una cartella sopra
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const fs = require('fs');
const pathModule = require('path');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.User, Partials.GuildMember, Partials.Message],
});

// Comandi (slash)
client.commands = new Collection();
const commandsPath = pathModule.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
  console.log(`✅ Comando caricato: ${file}`);
}

// Eventi
const eventsPath = pathModule.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  try {
    const event = require(`./events/${file}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
    console.log(`✅ Evento caricato: ${file}`);
  } catch (error) {
    console.error(`❌ Errore caricando evento ${file}:`, error);
  }
};

// Usa la variabile con prefisso REGOLAMENTO_ dal .env unico
client.login(process.env.REGOLAMENTO_TOKEN).then(() => {
  console.log('🔐 Login effettuato con successo');
}).catch(err => {
  console.error('❌ Errore nel login:', err);
});
