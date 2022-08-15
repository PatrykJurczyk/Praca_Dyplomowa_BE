const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const User = require('../models/user');

describe('User model test', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri(), { dbName: 'verifyMASTER' });
  });

  afterAll(async () => mongoose.disconnect());

  it('Has a model', () => {
    expect(User).toBeDefined();
  });

  describe('Check a user', () => {
    it('Create a user model', async () => {
      const user = new User({ name: 'Franek', photo: 'urlPhoto', email: 'email@gmail.com', password: 'Test123' });
      await user.save();

      const foundUser = await User.findOne({ id: user._id });

      const expectedName = 'Franek';
      const actualName = foundUser.name;
      expect(expectedName).toEqual(actualName);

      const expectedPhoto = 'urlPhoto';
      const actualPhoto = foundUser.photo;
      expect(expectedPhoto).toEqual(actualPhoto);

      const expectedTaskCount = 0;
      const actualTaskCount = foundUser.taskCount;
      expect(expectedTaskCount).toEqual(actualTaskCount);

      const expectedRole = 'Base';
      const actualRole = foundUser.role;
      expect(expectedRole).toEqual(actualRole);

      const expectedEmail = 'email@gmail.com';
      const actualEmail = foundUser.email;
      expect(expectedEmail).toEqual(actualEmail);

      const expectedPassword = 'Test123';
      const actualPassword = foundUser.password;
      expect(expectedPassword).toEqual(actualPassword);
    });
  });
});
