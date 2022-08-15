const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const Column = require('../models/column');

describe('Column model test', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri(), { dbName: 'verifyMASTER' });
  });

  afterAll(async () => mongoose.disconnect());

  it('Has a model', () => {
    expect(Column).toBeDefined();
  });

  describe('Check a model column', () => {
    it('Create a column', async () => {
      const column = new Column({ name: 'To do', numberOfTasks: 20 });
      await column.save();

      const foundColumn = await Column.findOne({ id: column._id });

      const expectedName = 'To do';
      const actualName = foundColumn.name;
      expect(expectedName).toEqual(actualName);

      const expectedNumberOfTasks = 20;
      const actualNumberOfTasks = foundColumn.numberOfTasks;
      expect(expectedNumberOfTasks).toEqual(actualNumberOfTasks);
    });
  });

  describe('Save column', () => {
    it('Save a column', async () => {
      const column = new Column({ name: 'To do', numberOfTasks: 20 });
      const savedColumn = await column.save();

      const expectedName = 'To do';
      const actualName = savedColumn.name;
      expect(expectedName).toEqual(actualName);

      const expectedNumberOfTasks = 20;
      const actualNumberOfTasks = savedColumn.numberOfTasks;
      expect(expectedNumberOfTasks).toEqual(actualNumberOfTasks);
    });
  });

  describe('Update column', () => {
    it('Update a column', async () => {
      const column = new Column({ name: 'To do', numberOfTasks: 20 });
      await column.save();

      column.name = 'Backlog';
      column.numberOfTasks = 0;

      const updateColumn = await column.save();

      const expectedName = 'Backlog';
      const actualName = updateColumn.name;
      expect(expectedName).toEqual(actualName);

      const expectedNumberOfTasks = 0;
      const actualNumberOfTasks = updateColumn.numberOfTasks;
      expect(expectedNumberOfTasks).toEqual(actualNumberOfTasks);
    });
  });
});
