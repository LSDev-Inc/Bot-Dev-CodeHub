module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Bot online come ${client.user.tag}`);
  },
};
