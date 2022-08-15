const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const request = require('supertest');
const app = require('../app');

const ArrayColumns = require('../models/arrayColumns');

describe('Array of Columns router test', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri(), { dbName: 'verifyMASTER' });
  });

  afterAll(async () => mongoose.disconnect());

  test('GET /api/arrayColumns', async () => {
    const array = await ArrayColumns.create({
      idColumns: ['dasdq23'],
    });

    await request(app)
      .get('/api/arrayColumns')
      .expect(200)
      .then((response) => {
        // Check the response type and length
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toEqual(1);

        // Check the response data
        expect(response.body[0]._id).toBe(array.id);
        expect(response.body[0].idColumns[0]).toBe(array.idColumns[0]);
      });
  });

  test('POST /api/arrayColumns', async () => {
    const data = {
      idColumns: ['dasdq23'],
    };

    await request(app)
      .post('/api/arrayColumns')
      .send(data)
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body.data._id).toBeTruthy();
        expect(response.body.data.idColumns[0]).toBe(data.idColumns[0]);
        expect(response.body.message).toBe('ArrayColumns was created');

        // Check the data in the database
        const array = await ArrayColumns.findOne({ _id: response.body.data._id });
        expect(array).toBeTruthy();
        expect(array.idColumns[0]).toBe(data.idColumns[0]);
      });
  });

  test('POST BAD_REQUEST /api/arrayColumns', async () => {
    const data = {
      idColumns: null,
    };

    await request(app)
      .post('/api/arrayColumns')
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message.errors.idColumns.message).toBe('Path `idColumns` is required.');
      });
  });

  test('PATCH /api/arrayColumns/:id', async () => {
    const array = await ArrayColumns.create({
      idColumns: ['dasdq23'],
    });

    const data = {
      idColumns: ['SiemanoKolano'],
    };
    await request(app)
      .patch('/api/arrayColumns/' + array.id)
      .send(data)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.data._id).toBe(array.id);
        expect(response.body.data.idColumns[0]).toBe(data.idColumns[0]);
        expect(response.body.message).toBe('Updated');

        // Check the data in the database
        const newArray = await ArrayColumns.findOne({ _id: response.body.data._id });
        expect(newArray).toBeTruthy();
        expect(newArray.idColumns[0]).toBe(data.idColumns[0]);
      });
  });

  test('PATCH BAD_REQUEST /api/arrayColumns/:id', async () => {
    const array = await ArrayColumns.create({
      idColumns: ['dasdq23'],
    });

    const data = {
      idColumns: ['SiemanoKolano'],
    };

    await request(app)
      .patch('/api/arrayColumns/' + mongoose.Types.ObjectId('4edd40c86762e0fb12000003'))
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('ArrayColumns not found');
      });
  });

  test('PATCH /api/arrayColumns/:id/addColumn', async () => {
    const array = await ArrayColumns.create({
      idColumns: ['dasdq23'],
    });

    const data = {
      idColumns: 'SiemanoKolano',
    };
    await request(app)
      .patch('/api/arrayColumns/' + array.id + '/addColumn')
      .send(data)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.data.idColumns.length).toBe(2);
        expect(response.body.data._id).toBe(array.id);
        expect(response.body.data.idColumns[0]).toBe(array.idColumns[0]);
        expect(response.body.data.idColumns[1]).toBe(data.idColumns);
        expect(response.body.message).toBe('Updated');

        // Check the data in the database
        const newArray = await ArrayColumns.findOne({ _id: response.body.data._id });
        expect(newArray).toBeTruthy();
        expect(newArray.idColumns.length).toBe(2);
        expect(newArray.idColumns[0]).toBe(array.idColumns[0]);
        expect(response.body.data.idColumns[1]).toBe(data.idColumns);
      });
  });

  test('PATCH BAD_REQUEST /api/arrayColumns/:id/addColumn', async () => {
    const array = await ArrayColumns.create({
      idColumns: ['dasdq23', 'SiemanoKolano'],
    });

    const data = {
      idColumns: 'SiemanoKolano',
    };
    await request(app)
      .patch('/api/arrayColumns/' + array.id + '/addColumn')
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('Column already added');
      });
  });

  test('PATCH /api/arrayColumns/:id/removeColumn', async () => {
    const array = await ArrayColumns.create({
      idColumns: ['dasdq23', 'SiemanoKolano'],
    });

    const data = {
      idColumns: 'SiemanoKolano',
    };
    await request(app)
      .patch('/api/arrayColumns/' + array.id + '/removeColumn')
      .send(data)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.data.idColumns.length).toBe(1);
        expect(response.body.data._id).toBe(array.id);
        expect(response.body.data.idColumns[0]).toBe(array.idColumns[0]);
        expect(response.body.message).toBe('Deleted');

        // Check the data in the database
        const newArray = await ArrayColumns.findOne({ _id: response.body.data._id });
        expect(newArray).toBeTruthy();
        expect(newArray.idColumns.length).toBe(1);
        expect(newArray.idColumns[0]).toBe(array.idColumns[0]);
      });
  });

  test('PATCH BAD_REQUEST /api/arrayColumns/:id/removeColumn', async () => {
    const array = await ArrayColumns.create({
      idColumns: ['dasdq23'],
    });

    const data = {
      idColumns: 'SiemanoKolano',
    };
    await request(app)
      .patch('/api/arrayColumns/' + array.id + '/removeColumn')
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('Column not found');
      });
  });
});
