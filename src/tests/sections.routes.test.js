const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const request = require('supertest');
const app = require('../app');

const Section = require('../models/section');

describe('Section router test', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri(), { dbName: 'verifyMASTER' });
  });

  afterAll(async () => mongoose.disconnect());

  test('GET /api/sections', async () => {
    const section = await Section.create({
      name: 'FrontEnd',
      taskLimit: 5,
    });

    await request(app)
      .get('/api/sections')
      .expect(200)
      .then((response) => {
        // Check the response type and length
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toEqual(1);

        // Check the response data
        expect(response.body[0].taskLimit).toBe(5);
        expect(response.body[0]._id).toBe(section.id);
        expect(response.body[0].name).toBe(section.name);
        expect(response.body[0].taskLimit).toBe(section.taskLimit);
      });
  });

  test('POST /api/sections', async () => {
    const data = {
      name: 'FrontEnd',
      taskLimit: 5,
    };

    await request(app)
      .post('/api/sections')
      .send(data)
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBeTruthy();
        expect(response.body.name).toBe(data.name);
        expect(response.body.taskLimit).toBe(data.taskLimit);

        // Check the data in the database
        const section = await Section.findOne({ _id: response.body._id });
        expect(section).toBeTruthy();
        expect(section.name).toBe(data.name);
        expect(section.taskLimit).toBe(data.taskLimit);
      });
  });

  test('POST BAD_REQUEST /api/sections', async () => {
    const data = {
      name: 'FrontEnd',
      taskLimit: null,
    };

    await request(app)
      .post('/api/sections')
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message.errors.taskLimit.message).toBe('Path `taskLimit` is required.');
      });
  });

  test('POST BAD_REQUEST /api/sections', async () => {
    const data = {
      name: null,
      taskLimit: 5,
    };

    await request(app)
      .post('/api/sections')
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message.errors.name.message).toBe('Path `name` is required.');
      });
  });

  test('PUT /api/sections/:id', async () => {
    const section = await Section.create({
      name: 'FrontEnd',
      taskLimit: 5,
    });

    const data = {
      name: 'Backend',
      taskLimit: 2,
    };
    await request(app)
      .put('/api/sections/' + section.id)
      .send(data)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.data._id).toBe(section.id);
        expect(response.body.data.name).toBe(data.name);
        expect(response.body.data.taskLimit).toBe(data.taskLimit);
        expect(response.body.message).toBe('Updated');

        // Check the data in the database
        const newSection = await Section.findOne({ _id: response.body.data._id });
        expect(newSection).toBeTruthy();
        expect(newSection.name).toBe(data.name);
        expect(newSection.taskLimit).toBe(data.taskLimit);
      });
  });

  test('PUT BAD_REQUEST /api/sections/:id', async () => {
    const section = await Section.create({
      name: 'FrontEnd',
      taskLimit: 5,
    });

    const data = {
      name: 'Backend',
      taskLimit: 2,
    };

    await request(app)
      .put('/api/sections/' + mongoose.Types.ObjectId('4edd40c86762e0fb12000003'))
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('Section not found');
      });
  });

  test('DELETE /api/arrayColumns/:id/removeColumn', async () => {
    const section = await Section.create({
      name: 'FrontEnd',
      taskLimit: 5,
    });

    await request(app)
      .delete('/api/sections/' + section.id)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('Section was deleted.');
      });
  });
});
