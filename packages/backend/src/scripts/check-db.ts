import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

async function checkDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found in .env');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('Connected to MongoDB successfully!');

  const db = mongoose.connection.db;
  if (!db) {
    console.error('Database handle unavailable');
    process.exit(1);
  }

  const collections = await db.listCollections().toArray();
  console.log(`Found ${collections.length} collections:`);

  for (const col of collections) {
    const count = await db.collection(col.name).countDocuments();
    console.log(`- ${col.name}: ${count} documents`);
  }

  await mongoose.disconnect();
  console.log('Disconnected.');
}

checkDatabase().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
