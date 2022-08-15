const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const request = require('supertest');
const app = require('../app');

const Column = require('../models/column');

describe('Columns router test', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri(), { dbName: 'verifyMASTER' });
  });

  afterAll(async () => mongoose.disconnect());

  test('GET /api/columns', async () => {
    const column = await Column.create({
      name: 'Test',
      numberOfTasks: 20,
      arrayOfTasks: ['62604e7108af9e84d7366221'],
    });

    await request(app)
      .get('/api/columns')
      .expect(200)
      .then((response) => {
        // Check the response type and length
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toEqual(1);

        // Check the response data
        expect(response.body[0]._id).toBe(column.id);
        expect(response.body[0].name).toBe(column.name);
        expect(response.body[0].numberOfTasks).toBe(column.numberOfTasks);
        expect(response.body[0].arrayOfTasks[0]).toBe(column.arrayOfTasks[0].toString());
      });
  });

  test('POST /api/columns', async () => {
    const data = {
      name: 'Test',
      numberOfTasks: 20,
      arrayOfTasks: ['62604e7108af9e84d7366221'],
    };

    await request(app)
      .post('/api/columns')
      .send(data)
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body.data._id).toBeTruthy();
        expect(response.body.data.name).toBe(data.name);
        expect(response.body.data.numberOfTasks).toBe(data.numberOfTasks);
        expect(response.body.data.arrayOfTasks[0]).toBe(data.arrayOfTasks[0].toString());
        expect(response.body.message).toBe('Column was created');

        // Check the data in the database
        const column = await Column.findOne({ _id: response.body.data._id });
        expect(column).toBeTruthy();
        expect(column.name).toBe(data.name);
        expect(column.numberOfTasks).toBe(data.numberOfTasks);
        expect(column.arrayOfTasks[0].toString()).toBe(data.arrayOfTasks[0].toString());
      });
  });

  test('POST BAD_REQUEST /api/columns', async () => {
    const data = {
      name: 'Test',
      arrayOfTasks: ['62604e7108af9e84d7366221'],
    };

    await request(app)
      .post('/api/columns')
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message.errors.numberOfTasks.message).toBe('Path `numberOfTasks` is required.');
      });
  });

  test('PUT /api/columns/:id', async () => {
    const column = await Column.create({
      name: 'Test',
      numberOfTasks: 20,
      arrayOfTasks: ['62604e7108af9e84d7366221'],
    });

    const data = {
      name: 'Test123',
      numberOfTasks: 0,
      arrayOfTasks: ['62604e7108af9e84d7366221'],
    };
    await request(app)
      .put('/api/columns/' + column.id)
      .send(data)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.data._id).toBe(column.id);
        expect(response.body.data.name).toBe(data.name);
        expect(response.body.data.numberOfTasks).toBe(data.numberOfTasks);
        expect(response.body.data.arrayOfTasks[0]).toBe(data.arrayOfTasks[0].toString());
        expect(response.body.message).toBe('Updated');

        // Check the data in the database
        const newColumn = await Column.findOne({ _id: response.body.data._id });
        expect(newColumn).toBeTruthy();
        expect(newColumn.name).toBe(data.name);
        expect(newColumn.numberOfTasks).toBe(data.numberOfTasks);
        expect(newColumn.arrayOfTasks[0].toString()).toBe(data.arrayOfTasks[0].toString());
      });
  });

  test('PUT BAD_REQUEST /api/columns/:id', async () => {
    const column = await Column.create({
      name: 'Test',
      numberOfTasks: 20,
      arrayOfTasks: ['62604e7108af9e84d7366221'],
    });

    const data = {
      name: 'Test123',
      numberOfTasks: 0,
      arrayOfTasks: ['62604e7108af9e84d7366221'],
    };
    await request(app)
      .put('/api/columns/' + mongoose.Types.ObjectId('4edd40c86762e0fb12000003'))
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('Column not found');
      });
  });

  test('DELETE /api/columns/:id', async () => {
    const column = await Column.create({
      name: 'Test1',
      numberOfTasks: 20,
      arrayOfTasks: ['62604e7108af9e84d7366221'],
    });

    await request(app)
      .delete('/api/columns/' + column.id)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('Column was deleted.');
      });
  });

  test('DELETE BAD_REQUEST /api/columns/:id', async () => {
    const column = await Column.create({
      name: 'Test1',
      numberOfTasks: 20,
      arrayOfTasks: ['62604e7108af9e84d7366221'],
    });

    await request(app)
      .delete('/api/columns/' + mongoose.Types.ObjectId('4edd40c86762e0fb12000003'))
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('Column was not found.');
      });
  });
});
