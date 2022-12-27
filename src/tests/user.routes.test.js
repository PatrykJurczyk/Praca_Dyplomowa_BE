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
      email: 'patryk@gmail.com',
      password: 'Patryk123',
      name: 'Patryk',
      phone: '123456789',
      avatar: 'UrlPhoto',
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
        expect(response.body[0].email).toBe(user.email);
        expect(response.body[0].password).toBe(user.password);
        expect(response.body[0].name).toBe(user.name);
        expect(response.body[0].avatar).toBe(user.avatar);
        expect(response.body[0].role).toBe('User');
        expect(response.body[0].status).toBe(1);
        expect(response.body[0].favorites.length).toBe(0);
      });
  });

  test('GET /api/users/:id', async () => {
    const user = await User.create({
      email: 'patryk@gmail.com',
      password: 'Patryk123',
      name: 'Patryk',
      phone: '123456789',
      avatar: 'UrlPhoto',
      role: 'Admin',
      // status: 1,
      favorites: ['Pierwszy', 'Drugi'],
    });

    await request(app)
      .get('/api/users/' + user.id)
      .expect(200)
      .then((response) => {
        // Check the response type and length
        expect(Array.isArray(response.body)).toBe(false);

        // Check the response data
        expect(response.body._id).toBe(user.id);
        expect(response.body.email).toBe(user.email);
        expect(response.body.password).toBe(user.password);
        expect(response.body.name).toBe(user.name);
        expect(response.body.avatar).toBe(user.avatar);
        expect(response.body.role).toBe(user.role);
        expect(response.body.status).toBe(1);
        expect(response.body.favorites.length).toBe(user.favorites.length);
      });
  });

  test('GET BAD_REQUEST /api/users/:id', async () => {
    await request(app)
      .get('/api/users/' + mongoose.Types.ObjectId('4edd40c86762e0fb12000003'))
      .expect(400)
      .then((response) => {
        // Check the response data
        expect(response.body.message).toBe('Użytkownik nie został odnaleziony.');
      });
  });

  test('POST /api/users', async () => {
    const data = {
      email: 'patrykKox@gmail.com',
      password: 'Patryk123',
      passwordRepeat: 'Patryk123',
    };

    await request(app)
      .post('/api/users')
      .send(data)
      .expect(201)
      .then(async (response) => {
        // Check the response
        const validPass = await bcrypt.compare(data.password, response.body.password);
        expect(response.body._id).toBeTruthy();
        expect(response.body.name).toBe('');
        expect(response.body.avatar).toBe('');
        expect(response.body.role).toBe('User');
        expect(response.body.favorites.length).toBe(0);
        expect(response.body.status).toBe(1);
        expect(response.body.phone).toBe('');
        expect(response.body.email).toBe(data.email.toLowerCase());
        expect(true).toBe(validPass);

        // Check the data in the database
        const user = await User.findOne({ _id: response.body._id });
        const validPass2 = await bcrypt.compare(data.password, user.password);
        expect(user).toBeTruthy();
        expect(user.name).toBe('');
        expect(user.avatar).toBe('');
        expect(user.role).toBe('User');
        expect(user.favorites.length).toBe(0);
        expect(user.status).toBe(1);
        expect(user.phone).toBe('');
        expect(user.email).toBe(data.email.toLowerCase());
        expect(true).toBe(validPass2);
      });
  });

  test('POST BAD_REQUEST /api/users', async () => {
    const data = {
      email: 'patrykKox@gmail.com',
      password: 'Patryk123',
      passwordRepeat: 'Patryk123',
    };

    await request(app)
      .post('/api/users')
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('invalid');
        expect(response.body.message).toBe('Email jest już zajęty.');
      });
  });

  test('POST BAD_REQUEST /api/users', async () => {
    const data = {
      email: 'patrykKoxgmail.com',
      password: 'Patryk123',
      passwordRepeat: 'Patryk123',
    };

    await request(app)
      .post('/api/users')
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('invalid');
        expect(response.body.message).toBe('Wprowadź poprawny adress email.');
      });
  });

  test('POST BAD_REQUEST /api/users', async () => {
    const data = {
      email: 'patrykKox@gmail.com',
    };

    await request(app)
      .post('/api/users')
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('invalid');
        expect(response.body.message).toBe('Hasło jest wymaganym polem.');
      });
  });

  test('POST BAD_REQUEST /api/users', async () => {
    const data = {
      password: 'Patryk123',
      passwordRepeat: 'Patryk123',
    };

    await request(app)
      .post('/api/users')
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('invalid');
        expect(response.body.message).toBe('Email jest wymaganym polem.');
      });
  });

  test('POST BAD_REQUEST /api/users', async () => {
    const data = {
      email: 'patrykKox1@gmail.com',
      password: 'Patryk123',
      passwordRepeat: 'Patryk12',
    };

    await request(app)
      .post('/api/users')
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('invalid');
        expect(response.body.message).toBe('Podaj takie same hasła.');
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
        const activeUser = await User.find({ email: data.email.toLowerCase() });
        expect(response.body.role).toBe('User');
        expect(response.body.id).toBe(activeUser[0]._id.toString());
        expect(response.body.token).toBeTruthy();
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
        expect(response.body.message).toBe('Podaj poprawny email i hasło.');
      });
  });

  test('PATCH /api/users/:id', async () => {
    const user = await User.create({
      email: 'patryk@gmail.com',
      password: 'Patryk123',
      passwordRepeat: 'Patryk123',
    });

    const data = {
      name: 'Patryk',
    };

    await request(app)
      .patch('/api/users/' + user.id)
      .send(data)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.data._id).toBe(user.id);
        expect(response.body.data.name).toBe(data.name);
        expect(response.body.message).toBe('Zaktualizowano.');

        // Check the data in the database
        const newUser = await User.findOne({ _id: response.body.data._id });
        expect(newUser).toBeTruthy();
        expect(newUser.email).toBe(user.email);
        expect(newUser.name).toBe(data.name);
      });
  });

  test('PATCH /api/users/:id', async () => {
    const user = await User.create({
      email: 'patryk@gmail.com',
      password: 'Patryk123',
      passwordRepeat: 'Patryk123',
    });

    const data = {
      phone: '123456789',
    };

    await request(app)
      .patch('/api/users/' + user.id)
      .send(data)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.data._id).toBe(user.id);
        expect(response.body.data.phone).toBe(data.phone);
        expect(response.body.message).toBe('Zaktualizowano.');

        // Check the data in the database
        const newUser = await User.findOne({ _id: response.body.data._id });
        expect(newUser).toBeTruthy();
        expect(newUser.email).toBe(user.email);
        expect(newUser.phone).toBe(data.phone);
      });
  });

  test('PATCH /api/users/:id', async () => {
    const user = await User.create({
      email: 'patryk@gmail.com',
      password: 'Patryk123',
      passwordRepeat: 'Patryk123',
    });

    const data = {
      role: 'Admin',
    };

    await request(app)
      .patch('/api/users/' + user.id)
      .send(data)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.data._id).toBe(user.id);
        expect(response.body.data.role).toBe(data.role);
        expect(response.body.message).toBe('Zaktualizowano.');

        // Check the data in the database
        const newUser = await User.findOne({ _id: response.body.data._id });
        expect(newUser).toBeTruthy();
        expect(newUser.email).toBe(user.email);
        expect(newUser.role).toBe(data.role);
      });
  });

  // todo
  test('PATCH /api/users/:id', async () => {
    const user = await User.create({
      email: 'patryk@gmail.com',
      password: 'Patryk123',
      passwordRepeat: 'Patryk123',
    });

    const Image = `${__dirname}/../uploads/images/HELLjpg.jpg`;

    await request(app)
      .patch('/api/users/' + user.id)
      .attach('avatar', Image)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.data._id).toBe(user.id);
        expect(response.body.data.avatar.split('-').includes('HELLjpg.jpg')).toBe(true);
        expect(response.body.message).toBe('Zaktualizowano.');

        // Check the data in the database
        const newUser = await User.findOne({ _id: response.body.data._id });
        expect(newUser).toBeTruthy();
        expect(newUser.email).toBe(user.email);
        expect(newUser.avatar.split('-').includes('HELLjpg.jpg')).toBe(true);
      });
  });

  test('PATCH BAD_REQUEST /api/users/:id', async () => {
    const user = await User.create({
      email: 'patryk@gmail.com',
      password: 'Patryk123',
      passwordRepeat: 'Patryk123',
    });

    const data = {
      phone: '12345678',
    };

    await request(app)
      .patch('/api/users/' + user.id)
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.status).toBe('invalid');
        expect(response.body.message).toBe('Number telefonu musi mieć 9 cyfr.');
      });
  });

  test('PATCH BAD_REQUEST /api/users/:id', async () => {
    const data = {
      name: 'Patryk',
    };

    await request(app)
      .patch('/api/users/' + mongoose.Types.ObjectId('4edd40c86762e0fb12000003'))
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('Użytkownik nie został odnaleziony.');
      });
  });

  test('PATCH /api/users/:id/password', async () => {
    const haslo = 'Patryk123';
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(haslo, salt);

    const user = await User.create({
      email: 'PatrykZmianaHasla@gmail.com',
      password: hashedPassword,
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
        expect(response.body.message).toBe('Zaktualizowano.');

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
        expect(response.body.message).toBe('Użytkownik nie został odnaleziony.');
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
        expect(response.body.message).toBe('Stare hasło jak i nowe hasło muszą się róznić.');
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
        expect(response.body.message).toBe('Stare hasło jest błędne.');
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
        expect(response.body.message).toBe('Nowe hasło nie pasują do siebie.');
      });
  });

  test('POST /api/logout', async () => {
    await request(app)
      .post('/api/logout')
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('Wylogowano.');
      });
  });

  test('PATCH /api/users/:id/deletion', async () => {
    const user = await User.create({
      email: 'patryk@gmail.com',
      password: 'Patryk123',
      passwordRepeat: 'Patryk123',
    });

    await request(app)
      .patch('/api/users/' + user.id + '/deletion')
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('Użytkownik został zablokowany.');
      });
  });

  test('PATCH BAD_REQUEST  /api/users/:id/deletion', async () => {
    await request(app)
      .patch('/api/users/' + mongoose.Types.ObjectId('4edd40c86762e0fb12000003') + '/deletion')
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('Użytkownik nie został odnaleziony.');
      });
  });

  test('PATCH /api/users/:id/restore', async () => {
    const user = await User.create({
      email: 'patryk@gmail.com',
      password: 'Patryk123',
      passwordRepeat: 'Patryk123',
    });

    await request(app)
      .patch('/api/users/' + user.id + '/restore')
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('Użytkownik został odblokowany.');
      });
  });

  test('PATCH BAD_REQUEST  /api/users/:id/restore', async () => {
    await request(app)
      .patch('/api/users/' + mongoose.Types.ObjectId('4edd40c86762e0fb12000003') + '/restore')
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('Użytkownik nie został odnaleziony.');
      });
  });

  test('PATCH /api/users/:id/favorite', async () => {
    const user = await User.create({
      email: 'patryk@gmail.com',
      password: 'Patryk123',
      passwordRepeat: 'Patryk123',
    });

    const data = {
      favorites: 'Drugi',
    };

    const data1 = {
      favorites: 'Pierwszy',
    };

    await request(app)
      .patch('/api/users/' + user.id + '/favorite')
      .send(data);

    await request(app)
      .patch('/api/users/' + user.id + '/favorite')
      .send(data1)
      .expect(200)
      .then(async (response) => {
        // Check the response

        expect(response.body.data._id).toBe(user.id);
        expect(response.body.data.favorites[0]).toBe(data.favorites);
        expect(response.body.data.favorites[1]).toBe(data1.favorites);
        expect(response.body.data.favorites.length).toBe(2);
        expect(response.body.message).toBe('Zaktualizowano.');

        // Check the data in the database
        const newUser = await User.findOne({ _id: response.body.data._id });
        expect(newUser).toBeTruthy();
        expect(newUser.email).toBe(user.email);
        expect(response.body.data.favorites[1]).toBe(data1.favorites);
        expect(response.body.data.favorites[0]).toBe(data.favorites);
        expect(response.body.data.favorites.length).toBe(2);
      });
  });

  test('PATCH BAD_REQUEST  /api/users/:id/favorite', async () => {
    await request(app)
      .patch('/api/users/' + mongoose.Types.ObjectId('4edd40c86762e0fb12000003') + '/favorite')
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('Użytkownik nie został odnaleziony.');
      });
  });
});
