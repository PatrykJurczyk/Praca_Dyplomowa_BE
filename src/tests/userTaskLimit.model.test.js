const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const UserTaskLimit = require('../models/userTaskLimit');

describe('User task limit model test', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri(), { dbName: 'verifyMASTER' });
  });

  afterAll(async () => mongoose.disconnect());

  it('Has a model', () => {
    expect(UserTaskLimit).toBeDefined();
  });

  describe('Check a model task limit for user', () => {
    it('Create a limit task', async () => {
      const userTaskLimit = new UserTaskLimit({ userTaskLimit: 15 });
      await userTaskLimit.save();

      const foundUserTaskLimit = await UserTaskLimit.findOne({ id: userTaskLimit._id });

      const expectedUserTaskLimit = 15;
      const actualUserTaskLimit = foundUserTaskLimit.userTaskLimit;
      expect(expectedUserTaskLimit).toEqual(actualUserTaskLimit);
    });
  });
});
