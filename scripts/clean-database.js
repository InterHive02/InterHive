const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const envPath = path.resolve(__dirname, '../packages/backend/.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [k, ...v] = trimmed.split('=');
      if (k) process.env[k.trim()] = v.join('=').trim();
    }
  });
}

const DEMO_EMAILS = [
  'admin@interhive.in',
  'hr@interhive.in',
  'manager@interhive.in',
  'intern@interhive.in',
  'company@interhive.in',
];

(async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI not found in packages/backend/.env');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('Connected successfully!\n');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    console.log('================ DATABASE CLEANUP REPORT ================');
    
    // 1. Process `users` collection
    const userCollection = db.collection('users');
    const usersBefore = await userCollection.countDocuments();
    const deleteUsersResult = await userCollection.deleteMany({
      email: { $nin: DEMO_EMAILS },
    });
    const usersAfter = await userCollection.countDocuments();
    console.log(`[users] Initial: ${usersBefore} | Deleted: ${deleteUsersResult.deletedCount} non-demo users | Remaining: ${usersAfter}`);

    // Verify remaining users
    const remainingUsers = await userCollection.find({}, { projection: { email: 1, role: 1, firstName: 1, lastName: 1 } }).toArray();
    remainingUsers.forEach(u => console.log(`   -> Preserved: ${u.email} (${u.role}) - ${u.firstName} ${u.lastName}`));

    // 2. Clear all other data collections
    console.log('\n--- Purging All Other Demo / Dummy Collections ---');
    for (const c of collections) {
      if (c.name === 'users') continue;
      const col = db.collection(c.name);
      const countBefore = await col.countDocuments();
      if (countBefore > 0) {
        const delRes = await col.deleteMany({});
        console.log(`[${c.name}] Deleted ${delRes.deletedCount} items (Now 0)`);
      } else {
        console.log(`[${c.name}] Already empty (0 items)`);
      }
    }

    console.log('\n================ FINAL VERIFICATION ================');
    const finalCollections = await db.listCollections().toArray();
    for (const c of finalCollections) {
      const cnt = await db.collection(c.name).countDocuments();
      console.log(` • ${c.name.padEnd(25)} : ${cnt} documents`);
    }
    console.log('====================================================\n');
    console.log('Database successfully cleaned! Only the 5 official demo accounts remain.');

    await mongoose.disconnect();
  } catch (err) {
    console.error('Cleanup failed:', err);
    process.exit(1);
  }
})();
