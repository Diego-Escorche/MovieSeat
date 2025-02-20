import { connectDB, disconnectDB } from './mongodb/DBBroker.js';

async function testDBBroker() {
  console.log('Testing connectDB function...');
  try {
    await connectDB();
    console.log('connectDB function passed.');
  } catch (error) {
    console.error('connectDB function failed:', error);
  }

  console.log('Testing disconnectDB function...');
  try {
    await disconnectDB();
    console.log('disconnectDB function passed.');
  } catch (error) {
    console.error('disconnectDB function failed:', error);
  }
}

testDBBroker();
