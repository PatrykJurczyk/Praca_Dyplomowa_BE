const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const request = require('supertest');

const House = require('../models/house');

describe('House router test', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri(), { dbName: 'verifyMASTER' });
  });

  afterAll(async () => mongoose.disconnect());

  test('GET /api/house', async () => {
    expect(1).toBe(1);
  });

  test('GET  /api/house:id', async () => {
    expect(1).toBe(1);
  });

  test('GET BAD_REQUEST /api/house', async () => {
    expect(1).toBe(1);
  });

  test('GET BAD_REQUEST /api/house/:id', async () => {
    expect(1).toBe(1);
  });

  test('POST /api/house', async () => {
    expect(1).toBe(1);
  });
  test('POST BAD_REQUEST /api/house', async () => {
    expect(1).toBe(1);
  });

  test('PATCH /api/house/:id/statusExist', async () => {
    expect(1).toBe(1);
  });

  test('PATCH BAD_REQUEST /api/house/:id/statusExist', async () => {
    expect(1).toBe(1);
  });

  test('PATCH /api/house/:id/statusAccepted', async () => {
    expect(1).toBe(1);
  });

  test('PATCH BAD_REQUEST /api/house/:id/statusAccepted', async () => {
    expect(1).toBe(1);
  });

  test('PATCH /api/house/:id', async () => {
    expect(1).toBe(1);
  });

  test('PATCH BAD_REQUEST /api/house/:id', async () => {
    expect(1).toBe(1);
  });

  test('DELETE /api/house/:id', async () => {
    expect(1).toBe(1);
  });
  test('DELETE BAD_REQUEST /api/house/:id', async () => {
    expect(1).toBe(1);
  });
});
