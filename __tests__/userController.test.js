// Import necessary modules and functions
import request from 'supertest';
import { createApp } from '../app.js';
import { UserModel } from '../models/users.js';
import { connectDB, disconnectDB } from '../models/mongodb/DBBroker.js';

let app;

// Connect to the database and create the app before running any tests
beforeAll(async () => {
  await connectDB();
  app = await createApp({ userModel: UserModel });
});

// Disconnect from the database after all tests have run
afterAll(async () => {
  await disconnectDB();
});

// Group related tests using describe
describe('UserController', () => {
  // Test case for registering a new user
  it('should register a new user', async () => {
    const newUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    };
    const response = await request(app).post('/auth/register').send(newUser);
    expect(response.status).toBe(201); // Check if the response status is 201 (Created)
    expect(response.body).toHaveProperty('username', 'testuser'); // Check if the created user has the correct username
  });

  // Test case for logging in a user
  it('should login a user', async () => {
    const user = {
      email: 'testuser@example.com',
      password: 'password123',
    };
    const response = await request(app).post('/auth/login').send(user);
    expect(response.status).toBe(200); // Check if the response status is 200 (OK)
    expect(response.body).toHaveProperty('message', 'Login successful'); // Check if the login was successful
  });

  // Test case for deleting a user
  it('should delete a user', async () => {
    const userId = 'test-user-id';
    const response = await request(app).delete(`/auth/${userId}`);
    expect(response.status).toBe(200); // Check if the response status is 200 (OK)
    expect(response.body).toHaveProperty(
      'message',
      'User deleted successfully',
    ); // Check if the user was deleted successfully
  });

  // Test case for promoting a user to admin
  it('should promote a user to admin', async () => {
    const userId = 'test-user-id';
    const response = await request(app).patch(`/auth/promote/${userId}`);
    expect(response.status).toBe(200); // Check if the response status is 200 (OK)
    expect(response.body).toHaveProperty('role', ['admin']); // Check if the user was promoted to admin
  });
});
