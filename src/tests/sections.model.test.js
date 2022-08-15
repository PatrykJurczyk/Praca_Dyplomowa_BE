const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const Section = require('../models/section');

describe('Section model test', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri(), { dbName: 'verifyMASTER' });
  });

  afterAll(async () => mongoose.disconnect());

  it('Has a model', () => {
    expect(Section).toBeDefined();
  });

  describe('Check a model section', () => {
    it('Create a section', async () => {
      const section = new Section({ name: 'FrontEnd', taskLimit: 15 });
      await section.save();

      const foundSection = await Section.findOne({ id: section._id });

      const expectedName = 'FrontEnd';
      const actualName = foundSection.name;
      expect(expectedName).toEqual(actualName);

      const expectedTaskLimit = 15;
      const actualTaskLimit = foundSection.taskLimit;
      expect(expectedTaskLimit).toEqual(actualTaskLimit);
    });
  });
});
