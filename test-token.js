const http = require('http');
const jwt = require('jsonwebtoken');
const config = require('./dist/config').default;
const { AppDataSource } = require('./dist/database/data-source');
const { User } = require('./dist/database/entities/User');

async function main() {
  try {
    await AppDataSource.initialize();
    const user = await AppDataSource.getRepository(User).findOne({ where: { email: 'candidate@test.com' } });
    if (!user) {
      console.log('User not found, trying to find any user...');
      const anyUser = await AppDataSource.getRepository(User).findOne({});
      if (!anyUser) { console.log('No users found'); return; }
      const token = jwt.sign({ userId: anyUser.id, role: anyUser.role, tokenVersion: anyUser.tokenVersion }, config.jwt.secret, { expiresIn: '1h' });
      console.log('TOKEN:' + token);
      return;
    }
    const token = jwt.sign({ userId: user.id, role: user.role, tokenVersion: user.tokenVersion }, config.jwt.secret, { expiresIn: '1h' });
    console.log('TOKEN:' + token);
  } catch(e) { console.error('Error:', e.message); }
}
main();
