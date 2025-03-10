// Import the UserModel and database connection functions
import { UserModel } from '../models/users.js';
import { connectDB, disconnectDB } from '../models/mongodb/DBBroker.js';

// Connect to the database before running any tests
beforeAll(async () => {
  await connectDB();
});

// Disconnect from the database after all tests have run
afterAll(async () => {
  await disconnectDB();
});

// Group related tests using describe
describe('UserModel', () => {
  // Test case for creating a new user
  it('should create a new user', async () => {
    const newUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
      role: ['user'],
    };
    const createdUser = await UserModel.register({ user: newUser });
    expect(createdUser).toHaveProperty('username', 'testuser'); // Check if the created user has the correct username
  });

  // Test case for finding a user by email
  it('should find a user by email', async () => {
    const email = 'testuser@example.com';
    const user = await UserModel.login({ email: email });
    expect(user).toHaveProperty('email', email); // Check if the user has the correct email
  });

  // Test case for finding a user by username
  it('should find a user by username', async () => {
    const username = 'testuser';
    const user = await UserModel.login({ username: username });
    expect(user).toHaveProperty('username', username); // Check if the user has the correct username
  });

  // Test case for updating a user
  it('should update a user', async () => {
    const userId = 'b9de29c8-80dd-4fd2-8611-3aea550cf4d0';
    const updatedData = { username: 'updateduser' };
    const updatedUser = await UserModel.update({
      id: userId,
      user: updatedData,
    });
    expect(updatedUser).toHaveProperty('username', 'updateduser'); // Check if the user has been updated correctly
  });

  // Test case for deleting a user
  it('should delete a user', async () => {
    const userId = 'b9de29c8-80dd-4fd2-8611-3aea550cf4d0';
    const result = await UserModel.delete({ id: userId });
    expect(result).toBe(true); // Check if the user was deleted successfully
  });
});
