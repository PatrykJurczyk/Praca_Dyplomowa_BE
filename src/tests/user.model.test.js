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
      const user = new User({ name: 'Franek', avatar: 'urlPhoto', email: 'email@gmail.com', password: 'Test123', phone: '123456789' });
      await user.save();

      const foundUser = await User.findOne({ id: user._id });

      const expectedName = 'Franek';
      const actualName = foundUser.name;
      expect(expectedName).toEqual(actualName);

      const expectedPhoto = 'urlPhoto';
      const actualPhoto = foundUser.avatar;
      expect(expectedPhoto).toEqual(actualPhoto);

      const expectedEmail = 'email@gmail.com';
      const actualEmail = foundUser.email;
      expect(expectedEmail).toEqual(actualEmail);

      const expectedPhone = '123456789';
      const actualPhone = foundUser.phone;
      expect(expectedPhone).toEqual(actualPhone);

      const expectedPassword = 'Test123';
      const actualPassword = foundUser.password;
      expect(expectedPassword).toEqual(actualPassword);

      const expectedRole = 'User';
      const actualRole = foundUser.role;
      expect(expectedRole).toEqual(actualRole);

      const expectedStatus = 1;
      const actualStatus = foundUser.status;
      expect(expectedStatus).toEqual(actualStatus);

      const expectedFavoritesLength = 0;
      const actualFavoritesLength = foundUser.favorites.length;
      expect(expectedFavoritesLength).toEqual(actualFavoritesLength);
    });
  });
});
