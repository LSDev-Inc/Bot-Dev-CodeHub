module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`🚀 Bot di benvenuto online come ${client.user.tag}`);
  },
};
