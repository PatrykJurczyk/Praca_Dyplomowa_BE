const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const bcrypt = require('bcryptjs');
const request = require('supertest');
const app = require('../App');

const User = require('../models/user');

describe('User router test', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri(), { dbName: 'verifyMASTER' });
  });

  afterAll(async () => mongoose.disconnect());

  test('GET /api/users', async () => {
    const user = await User.create({
      name: 'Patryk',
      photo: 'UrlPhoto',
      email: 'patryk@gmail.com',
      password: 'Patryk123',
    });

    await request(app)
      .get('/api/users')
      .expect(200)
      .then((response) => {
        // Check the response type and length
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toEqual(1);

        // Check the response data
        expect(response.body[0]._id).toBe(user.id);
        expect(response.body[0].name).toBe(user.name);
        expect(response.body[0].photo).toBe(user.photo);
        expect(response.body[0].taskCount).toBe(0);
        expect(response.body[0].role).toBe('Base');
        expect(response.body[0].email).toBe(user.email);
        expect(response.body[0].password).toBe(user.password);
      });
  });

  test('GET /api/users/:id', async () => {
    const user = await User.create({
      name: 'Patryk',
      photo: 'UrlPhoto',
      taskCount: 6,
      role: 'Admin',
      email: 'patryk@gmail.com',
      password: 'Patryk123',
    });

    await request(app)
      .get('/api/users/' + user.id)
      .expect(200)
      .then((response) => {
        // Check the response type and length
        expect(response.body._id).toBe(user.id);

        // Check the response data
        expect(response.body._id).toBe(user.id);
        expect(response.body.name).toBe(user.name);
        expect(response.body.photo).toBe(user.photo);
        expect(response.body.taskCount).toBe(user.taskCount);
        expect(response.body.role).toBe(user.role);
        expect(response.body.email).toBe(user.email);
        expect(response.body.password).toBe(user.password);
      });
  });

  test('POST /api/users', async () => {
    const data = {
      name: 'Patryk',
      photo: 'UrlPhoto',
      email: 'patrykKox@gmail.com',
      password: 'Patryk123',
    };

    await request(app)
      .post('/api/users')
      .send(data)
      .expect(201)
      .then(async (response) => {
        // Check the response
        const validPass = await bcrypt.compare(data.password, response.body.password);
        expect(response.body._id).toBeTruthy();
        expect(response.body.name).toBe(data.name);
        expect(response.body.photo).toBe(data.photo);
        expect(response.body.taskCount).toBe(0);
        expect(response.body.role).toBe('Base');
        expect(response.body.email).toBe(data.email);
        expect(true).toBe(validPass);

        // Check the data in the database
        const user = await User.findOne({ _id: response.body._id });
        const validPass2 = await bcrypt.compare(data.password, user.password);
        expect(user).toBeTruthy();
        expect(user.name).toBe(data.name);
        expect(user.photo).toBe(data.photo);
        expect(user.taskCount).toBe(0);
        expect(user.role).toBe('Base');
        expect(user.email).toBe(data.email);
        expect(true).toBe(validPass2);
      });
  });

  test('POST BAD_REQUEST /api/users', async () => {
    const data = {
      name: 'Patryk',
      photo: 'UrlPhoto',
      email: 'patrykKox@gmail.com',
      password: 'Patryk123',
    };

    await request(app)
      .post('/api/users')
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('invalid');
        expect(response.body.message).toBe('Email is already used');
      });
  });

  test('POST BAD_REQUEST /api/users', async () => {
    const data = {
      name: 'Patryk',
      photo: 'UrlPhoto',
      email: 'patrykKoxgmail.com',
      password: 'Patryk123',
    };

    await request(app)
      .post('/api/users')
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('invalid');
        expect(response.body.message).toBe('Please enter a valid email address.');
      });
  });

  test('POST BAD_REQUEST /api/users', async () => {
    const data = {
      name: 'Patryk',
      photo: 'UrlPhoto',
      email: 'patrykKoksik@gmail.com',
    };

    await request(app)
      .post('/api/users')
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('invalid');
        expect(response.body.message).toBe('Password is a required field');
      });
  });

  test('POST BAD_REQUEST /api/users', async () => {
    const data = {
      name: 'Patryk',
      photo: 'UrlPhoto',
      password: 'Patryk123',
    };

    await request(app)
      .post('/api/users')
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('invalid');
        expect(response.body.message).toBe('Email is a required field');
      });
  });

  test('POST BAD_REQUEST /api/users', async () => {
    const data = {
      photo: 'UrlPhoto',
      email: 'patrykKoksik@gmail.com',
      password: 'Patryk123',
    };

    await request(app)
      .post('/api/users')
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('invalid');
        expect(response.body.message).toBe('Name is a required field');
      });
  });

  test('POST /api/login', async () => {
    const data = {
      email: 'patrykKox@gmail.com',
      password: 'Patryk123',
    };

    await request(app)
      .post('/api/login')
      .send(data)
      .expect(200)
      .then(async (response) => {
        // Check the response
        const activeUser = await User.find({ email: data.email });
        expect(response.body.message).toBe(`Welcome ${activeUser[0].name}`);
      });
  });

  test('POST BAD_REQUEST /api/login', async () => {
    const data = {
      email: 'patrykKox@gmail.com',
      password: 'Patryk1234',
    };

    await request(app)
      .post('/api/login')
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('invalid');
        expect(response.body.message).toBe('Email or password is wrong');
      });
  });

  test('PATCH /api/users/:id', async () => {
    const user = await User.create({
      email: 'patryk@gmail.com',
      password: 'Patryk123',
      name: 'Patryk',
      photo: 'UrlPhoto',
    });

    const data = {
      name: 'Patryk',
      photo: 'UrlPhoto',
      role: 'Admin',
    };

    await request(app)
      .patch('/api/users/' + user.id)
      .send(data)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.data._id).toBe(user.id);
        expect(response.body.data.name).toBe(data.name);
        expect(response.body.data.photo).toBe(data.photo);
        expect(response.body.data.role).toBe(data.role);
        expect(response.body.message).toBe('Updated');

        // Check the data in the database
        const newUser = await User.findOne({ _id: response.body.data._id });
        expect(newUser).toBeTruthy();
        expect(newUser.email).toBe(user.email);
        expect(newUser.name).toBe(data.name);
        expect(newUser.photo).toBe(data.photo);
        expect(newUser.role).toBe(data.role);
      });
  });

  test('PATCH BAD_REQUEST /api/users/:id', async () => {
    const user = await User.create({
      email: 'patrykK@gmail.com',
      password: 'Patryk123',
      name: 'Patryk',
      photo: 'UrlPhoto',
    });

    const data = {
      name: 'Patryk',
      photo: 'UrlPhoto',
      role: 'Admin',
    };

    await request(app)
      .patch('/api/users/' + mongoose.Types.ObjectId('4edd40c86762e0fb12000003'))
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('User not found');
      });
  });

  test('PATCH /api/users/:id/password', async () => {
    const haslo = 'Patryk123';
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(haslo, salt);

    const user = await User.create({
      email: 'PatrykZmianaHasla@gmail.com',
      password: hashedPassword,
      name: 'Patryk',
    });

    const data = {
      password: 'Patryk123',
      newPassword: 'Patryk1234',
      newPasswordRepeat: 'Patryk1234',
    };

    await request(app)
      .patch(`/api/users/${user.id}/password`)
      .send(data)
      .expect(200)
      .then(async (response) => {
        // Check the response
        const validPass0 = await bcrypt.compare(data.password, user.password);
        expect(response.body.data._id).toBe(user.id);
        expect(true).toBe(validPass0);
        expect(response.body.message).toBe('Updated');

        // Check the data in the database
        const newUser = await User.findOne({ _id: response.body.data._id });
        const validPass1 = await bcrypt.compare(data.newPassword, newUser.password);
        expect(newUser).toBeTruthy();
        expect(newUser.email).toBe(user.email);
        expect(true).toBe(validPass1);
      });
  });

  test('PATCH BAD_REQUEST /api/users/:id/password', async () => {
    const haslo = 'Patryk123';
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(haslo, salt);

    const user = await User.create({
      email: 'PatrykZmianaHasla@gmail.com',
      password: hashedPassword,
      name: 'Patryk',
    });

    const data = {
      password: 'Patryk123',
      newPassword: 'Patryk1234',
      newPasswordRepeat: 'Patryk1234',
    };

    await request(app)
      .patch(`/api/users/${mongoose.Types.ObjectId('4edd40c86762e0fb12000003')}/password`)
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('User not found.');
      });
  });

  test('PATCH BAD_REQUEST /api/users/:id/password', async () => {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('Patryk123', salt);

    const user = await User.create({
      email: 'PatrykZmianaHasla1@gmail.com',
      password: hashedPassword,
      name: 'Patryk',
    });

    const data = {
      password: 'Patryk123',
      newPassword: 'Patryk123',
      newPasswordRepeat: 'Patryk123',
    };

    await request(app)
      .patch(`/api/users/${user.id}/password`)
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('The old password and the new password must be different.');
      });
  });

  test('PATCH BAD_REQUEST /api/users/:id/password', async () => {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('Patryk123', salt);

    const user = await User.create({
      email: 'PatrykZmianaHasla1@gmail.com',
      password: hashedPassword,
      name: 'Patryk',
    });

    const data = {
      password: 'Patryk12',
      newPassword: 'Patryk123',
      newPasswordRepeat: 'Patryk123',
    };

    await request(app)
      .patch(`/api/users/${user.id}/password`)
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('Old password is wrong.');
      });
  });

  test('PATCH BAD_REQUEST /api/users/:id/password', async () => {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('Patryk123', salt);

    const user = await User.create({
      email: 'PatrykZmianaHasla1@gmail.com',
      password: hashedPassword,
      name: 'Patryk',
    });

    const data = {
      password: 'Patryk123',
      newPassword: 'Patryk1234',
      newPasswordRepeat: 'Patryk1235',
    };

    await request(app)
      .patch(`/api/users/${user.id}/password`)
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('The passwords do not match.');
      });
  });

  test('POST /api/logout', async () => {
    await request(app)
      .post('/api/logout')
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('Logged out');
      });
  });

  test('DELETE /api/users/:id', async () => {
    const user = await User.create({
      name: 'Patryk',
      photo: 'UrlPhoto',
      email: 'PatrykDelete@gmail.com',
      password: 'Patryk123',
    });

    await request(app)
      .delete('/api/users/' + user.id)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('The account has been deleted');
      });
  });

  test('DELETE BAD_REQUEST /api/users/:id', async () => {
    const user = await User.create({
      name: 'Patryk',
      photo: 'UrlPhoto',
      email: 'PatrykDelete1@gmail.com',
      password: 'Patryk123',
    });

    await request(app)
      .delete('/api/users/' + mongoose.Types.ObjectId('4edd40c86762e0fb12000003'))
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('invalid');
        expect(response.body.message).toBe('User not found');
      });
  });
});
