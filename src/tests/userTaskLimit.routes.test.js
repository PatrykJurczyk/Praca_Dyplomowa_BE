const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const request = require('supertest');
const app = require('../app');

const UserTaskLimit = require('../models/userTaskLimit');

describe('Task user limit router test', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri(), { dbName: 'verifyMASTER' });
  });

  afterAll(async () => mongoose.disconnect());

  test('GET /api/userTasksLimit', async () => {
    const taskLimit = await UserTaskLimit.create({
      userTaskLimit: 5,
    });

    await request(app)
      .get('/api/userTasksLimit')
      .expect(200)
      .then((response) => {
        // Check the response type and length
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toEqual(1);

        // Check the response data
        expect(response.body[0].userTaskLimit).toBe(5);
        expect(response.body[0]._id).toBe(taskLimit.id);
        expect(response.body[0].userTaskLimit).toBe(taskLimit.userTaskLimit);
      });
  });

  test('POST /api/userTasksLimit', async () => {
    const data = {
      userTaskLimit: 5,
    };

    await request(app)
      .post('/api/userTasksLimit')
      .send(data)
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBeTruthy();
        expect(response.body.userTaskLimit).toBe(data.userTaskLimit);

        // Check the data in the database
        const taskLimit = await UserTaskLimit.findOne({ _id: response.body._id });
        expect(taskLimit).toBeTruthy();
        expect(taskLimit.userTaskLimit).toBe(data.userTaskLimit);
      });
  });

  test('POST BAD_REQUEST /api/userTasksLimit', async () => {
    const data = {
      userTaskLimit: null,
    };

    await request(app)
      .post('/api/userTasksLimit')
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message.errors.userTaskLimit.message).toBe('Path `userTaskLimit` is required.');
      });
  });

  test('PUT /api/userTasksLimit/:id', async () => {
    const taskLimit = await UserTaskLimit.create({
      userTaskLimit: 5,
    });

    const data = {
      userTaskLimit: 0,
    };

    await request(app)
      .put('/api/userTasksLimit/' + taskLimit.id)
      .send(data)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.data._id).toBe(taskLimit.id);
        expect(response.body.data.userTaskLimit).toBe(data.userTaskLimit);
        expect(response.body.message).toBe('Updated');

        // Check the data in the database
        const newTaskLimit = await UserTaskLimit.findOne({ _id: response.body.data._id });
        expect(newTaskLimit).toBeTruthy();
        expect(newTaskLimit.userTaskLimit).toBe(0);
        expect(newTaskLimit.userTaskLimit).toBe(data.userTaskLimit);
      });
  });

  test('PUT BAD_REQUEST /api/userTasksLimit/:id', async () => {
    const taskLimit = await UserTaskLimit.create({
      userTaskLimit: 5,
    });

    const data = {
      userTaskLimit: 0,
    };

    await request(app)
      .put('/api/userTasksLimit/' + mongoose.Types.ObjectId('4edd40c86762e0fb12000003'))
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('User limit not found');
      });
  });
});
