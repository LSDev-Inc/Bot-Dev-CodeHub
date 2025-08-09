const path = require('path');
// Carica il .env unico che sta una cartella sopra
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const fs = require('fs');
const pathModule = require('path'); // Per evitare conflitti col path sopra
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

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
}

// Usa la variabile con prefisso ARRIVEDERCI_ dal .env unico
client.login(process.env.ARRIVEDERCI_TOKEN).then(() => {
  console.log('🔑 Login effettuato con successo');
}).catch(err => {
  console.error('❌ Errore nel login:', err);
});
