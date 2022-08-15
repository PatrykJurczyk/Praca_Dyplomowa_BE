const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const request = require('supertest');
const app = require('../app');

const Task = require('../models/task');
const Column = require('../models/column');
const User = require('../models/user');
const Section = require('../models/section');

describe('Tasks router test', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri(), { dbName: 'verifyMASTER' });
  });

  afterAll(async () => mongoose.disconnect());

  test('GET /api/tasks', async () => {
    const task = await Task.create({
      name: 'Test',
      description: 'Opis taska',
      column: '626fc54929286784e3d759ab',
      color: '#ccc',
      idSection: '624dd994a600e8d34c3b6542',
      idUser: ['6254820ce0ab5eba8ac086e0'],
      index: 0,
    });

    await request(app)
      .get('/api/tasks')
      .expect(200)
      .then((response) => {
        // Check the response type and length
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toEqual(1);

        // Check the response data
        expect(response.body[0]._id).toBe(task.id);
        expect(response.body[0].name).toBe(task.name);
        expect(response.body[0].description).toBe(task.description);
        expect(response.body[0].column).toBe(task.column.toString());
        expect(response.body[0].color).toBe(task.color);
        expect(response.body[0].idSection).toBe(task.idSection.toString());
        expect(response.body[0].idUser[0]).toBe(task.idUser[0].toString());
        expect(response.body[0].index).toBe(task.index);
      });
  });

  test('POST /api/tasks', async () => {
    const user = await User.create({
      email: 'patryk@gmail.com',
      password: 'Patryk123',
      name: 'Patryk',
      taskCount: 0,
    });

    const column = await Column.create({
      name: 'Test',
      numberOfTasks: 20,
      arrayOfTasks: [],
    });

    const section = await Section.create({
      name: 'FrontEnd',
      taskLimit: 5,
    });

    const data = {
      name: 'Test',
      description: 'Opis Taska',
      column: `${column.id}`,
      color: '#ccc',
      idSection: `${section.id}`,
      idUser: [`${user.id}`],
      index: 0,
    };

    await request(app)
      .post('/api/tasks')
      .send(data)
      .expect(201)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBeTruthy();
        expect(response.body.name).toBe(data.name);
        expect(response.body.description).toBe(data.description);
        expect(response.body.column).toBe(data.column.toString());
        expect(response.body.color).toBe(data.color);
        expect(response.body.idSection).toBe(data.idSection.toString());
        expect(response.body.idUser[0]).toBe(data.idUser[0].toString());
        expect(response.body.index).toBe(data.index);

        // Check the data in the database
        const task = await Task.findOne({ _id: response.body._id });
        const user = await User.findOne({ _id: response.body.idUser[0] });
        const column = await Column.findOne({ _id: response.body.column });
        expect(task).toBeTruthy();
        expect(task.name).toBe(data.name);
        expect(task.description).toBe(data.description);
        expect(task.column.toString()).toBe(data.column.toString());
        expect(task.color).toBe(data.color);
        expect(task.idSection.toString()).toBe(data.idSection.toString());
        expect(task.idUser[0].toString()).toBe(data.idUser[0].toString());
        expect(task.index).toBe(data.index);
        expect(user.taskCount).toBe(1);
        expect(column.arrayOfTasks[0].toString()).toBe(task.id.toString());
      });
  });

  test('POST BAD_REQUEST /api/tasks', async () => {
    const user = await User.create({
      email: 'patryk@gmail.com',
      password: 'Patryk123',
      name: 'Patryk',
      taskCount: 0,
    });

    const column = await Column.create({
      name: 'Test',
      numberOfTasks: 20,
      arrayOfTasks: [],
    });

    const section = await Section.create({
      name: 'FrontEnd',
      taskLimit: 5,
    });

    const data = {
      description: 'Opis Taska',
      column: `${column.id}`,
      color: '#ccc',
      idSection: `${section.id}`,
      idUser: [`${user.id}`],
      index: 0,
    };

    await request(app)
      .post('/api/tasks')
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message.errors.name.message).toBe('Path `name` is required.');
      });
  });

  test('PUT /api/tasks/:id', async () => {
    const user = await User.create({
      email: 'patryk@gmail.com',
      password: 'Patryk123',
      name: 'Patryk',
      taskCount: 0,
    });

    const column = await Column.create({
      name: 'Test',
      numberOfTasks: 20,
      arrayOfTasks: ['62604e7108af9e84d7366221'],
    });

    const section = await Section.create({
      name: 'FrontEnd',
      taskLimit: 5,
    });

    const task = await Task.create({
      name: 'Test',
      description: 'Opis Taska',
      column: `${column.id}`,
      color: '#ccc',
      idSection: `${section.id}`,
      idUser: [`${user.id}`],
      index: 0,
    });

    const data = {
      name: 'Test po zmianie',
      description: 'Opis Taska jest inny',
      color: '#ccc',
      idUser: [`${user.id}`, '62604e7108af9e84d7366221'],
    };

    await request(app)
      .put('/api/tasks/' + task.id)
      .send(data)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.data._id).toBe(task.id);
        expect(response.body.data.name).toBe(data.name);
        expect(response.body.data.description).toBe(data.description);
        expect(response.body.data.color).toBe(data.color);
        expect(response.body.data.idUser[0]).toBe(data.idUser[0].toString());
        expect(response.body.data.idUser[1]).toBe(data.idUser[1].toString());
        expect(response.body.message).toBe('Updated');

        // Check the data in the database
        const newTask = await Task.findOne({ _id: response.body.data._id });
        expect(newTask).toBeTruthy();
        expect(newTask.name).toBe(data.name);
        expect(newTask.description).toBe(data.description);
        expect(newTask.color).toBe(data.color);
        expect(newTask.idUser.length).toBe(2);
        expect(newTask.idUser[0].toString()).toBe(data.idUser[0].toString());
      });
  });

  test('PUT BAD_REQUEST /api/tasks/:id', async () => {
    const task = await Task.create({
      name: 'Test',
      description: 'Opis taska',
      column: '626fc54929286784e3d759ab',
      color: '#ccc',
      idSection: '624dd994a600e8d34c3b6542',
      idUser: ['6254820ce0ab5eba8ac086e0'],
      index: 0,
    });

    const data = {
      name: 'Test po zmianie',
      description: 'Opis Taska jest inny',
      color: '#ccc',
      idUser: ['62604e7108af9e84d7366221', '62604e7108af9e84d7366222'],
      index: 1,
    };

    await request(app)
      .put('/api/tasks/' + mongoose.Types.ObjectId('4edd40c86762e0fb12000003'))
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('Task was not found.');
      });
  });

  test('PATCH /api/tasks/:id', async () => {
    const user = await User.create({
      email: 'patryk@gmail.com',
      password: 'Patryk123',
      name: 'Patryk',
      taskCount: 0,
    });

    const column = await Column.create({
      name: 'Test',
      numberOfTasks: 20,
      arrayOfTasks: ['62604e7108af9e84d7366221'],
    });

    const section = await Section.create({
      name: 'FrontEnd',
      taskLimit: 5,
    });

    const task = await Task.create({
      name: 'Test',
      description: 'Opis Taska',
      column: `62604e7108af9e84d7366221`,
      color: '#ccc',
      idSection: `62604e7108af9e84d7366221`,
      idUser: [`${user.id}`],
      index: 0,
    });

    const data = {
      column: `${column.id}`,
      index: 1,
      idSection: `${section.id}`,
      prevColumn: `${column.id}`,
    };

    await request(app)
      .patch('/api/tasks/' + task.id)
      .send(data)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.data._id).toBe(task.id);
        expect(response.body.data.column[0].toString()).toBe(data.column[0].toString());
        expect(response.body.data.index).toBe(data.index);
        expect(response.body.data.idSection[0].toString()).toBe(data.idSection[0].toString());

        // Check the data in the database
        const newTask = await Task.findOne({ _id: response.body.data._id });
        expect(newTask).toBeTruthy();
        expect(newTask.column.toString()).toBe(data.column.toString());
        expect(newTask.index).toBe(0);
        expect(newTask.idSection.toString()).toBe(data.idSection.toString());
      });
  });

  test('PATCH BAD_REQUEST /api/tasks/:id', async () => {
    const task = await Task.create({
      name: 'Test',
      description: 'Opis taska',
      column: '626fc54929286784e3d759ab',
      color: '#ccc',
      idSection: '624dd994a600e8d34c3b6542',
      idUser: ['6254820ce0ab5eba8ac086e0'],
      index: 0,
    });

    const data = {
      column: `626fc54929286784e3d759ab`,
      index: 1,
      idSection: `626fc54929286784e3d759ab`,
      prevColumn: `626fc54929286784e3d759ab`,
    };

    await request(app)
      .patch('/api/tasks/' + mongoose.Types.ObjectId('4edd40c86762e0fb12000003'))
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('Task was not found.');
      });
  });

  test('PATCH /api/tasks/:id/addUser', async () => {
    const user = await User.create({
      email: 'patryk@gmail.com',
      password: 'Patryk123',
      name: 'Patryk',
      taskCount: 0,
    });

    const column = await Column.create({
      name: 'Test',
      numberOfTasks: 20,
      arrayOfTasks: ['62604e7108af9e84d7366221'],
    });

    const section = await Section.create({
      name: 'FrontEnd',
      taskLimit: 5,
    });

    const task = await Task.create({
      name: 'Test',
      description: 'Opis Taska',
      column: `62604e7108af9e84d7366221`,
      color: '#ccc',
      idSection: `62604e7108af9e84d7366221`,
      idUser: [],
      index: 0,
    });

    const data = {
      idUser: `${user.id}`,
    };

    await request(app)
      .patch('/api/tasks/' + task.id + '/addUser')
      .send(data)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.data._id).toBe(task.id);
        expect(response.body.data.idUser[0].toString()).toBe(data.idUser.toString());

        // Check the data in the database
        const newTask = await Task.findOne({ _id: response.body.data._id });
        expect(newTask).toBeTruthy();
        expect(newTask.idUser[0].toString()).toBe(data.idUser.toString());
      });
  });

  test('PATCH BAD_REQUEST /api/tasks/:id/addUser', async () => {
    const task = await Task.create({
      name: 'Test',
      description: 'Opis taska',
      column: '626fc54929286784e3d759ab',
      color: '#ccc',
      idSection: '624dd994a600e8d34c3b6542',
      idUser: [],
      index: 0,
    });

    const data = {
      idUser: '6254820ce0ab5eba8ac086e0',
    };

    await request(app)
      .patch('/api/tasks/' + mongoose.Types.ObjectId('4edd40c86762e0fb12000003') + '/addUser')
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('Task was not found.');
      });
  });

  test('PATCH /api/tasks/:id/deleteUser', async () => {
    const user = await User.create({
      email: 'patryk@gmail.com',
      password: 'Patryk123',
      name: 'Patryk',
      taskCount: 0,
    });

    const column = await Column.create({
      name: 'Test',
      numberOfTasks: 20,
      arrayOfTasks: ['62604e7108af9e84d7366221'],
    });

    const section = await Section.create({
      name: 'FrontEnd',
      taskLimit: 5,
    });

    const task = await Task.create({
      name: 'Test',
      description: 'Opis Taska',
      column: `62604e7108af9e84d7366221`,
      color: '#ccc',
      idSection: `62604e7108af9e84d7366221`,
      idUser: [`${user.id}`],
      index: 0,
    });

    const data = {
      idUser: `${user.id}`,
    };

    await request(app)
      .patch('/api/tasks/' + task.id + '/deleteUser')
      .send(data)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.data._id).toBe(task.id);
        expect(response.body.data.idUser[0]).toBe(undefined);

        // Check the data in the database
        const newTask = await Task.findOne({ _id: response.body.data._id });
        expect(newTask).toBeTruthy();
        expect(newTask.idUser[0]).toBe(undefined);
      });
  });

  test('PATCH BAD_REQUEST /api/tasks/:id/deleteUser', async () => {
    const task = await Task.create({
      name: 'Test',
      description: 'Opis taska',
      column: '626fc54929286784e3d759ab',
      color: '#ccc',
      idSection: '624dd994a600e8d34c3b6542',
      idUser: ['6254820ce0ab5eba8ac086e0'],
      index: 0,
    });

    const data = {
      idUser: '6254820ce0ab5eba8ac086e0',
    };

    await request(app)
      .patch('/api/tasks/' + mongoose.Types.ObjectId('4edd40c86762e0fb12000003') + '/deleteUser')
      .send(data)
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('User was not found.');
      });
  });

  test('DELETE /api/tasks/:id', async () => {
    const task = await Task.create({
      name: 'Test',
      description: 'Opis taska',
      column: '626fc54929286784e3d759ab',
      color: '#ccc',
      idSection: '624dd994a600e8d34c3b6542',
      idUser: ['6254820ce0ab5eba8ac086e0'],
      index: 0,
    });

    await request(app)
      .delete('/api/tasks/' + task.id)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('Task was deleted.');
      });
  });

  test('DELETE BAD_REQUEST /api/tasks/:id', async () => {
    const task = await Task.create({
      name: 'Test',
      description: 'Opis taska',
      column: '626fc54929286784e3d759ab',
      color: '#ccc',
      idSection: '624dd994a600e8d34c3b6542',
      idUser: ['6254820ce0ab5eba8ac086e0'],
      index: 0,
    });

    await request(app)
      .delete('/api/tasks/' + mongoose.Types.ObjectId('4edd40c86762e0fb12000003'))
      .expect(400)
      .then(async (response) => {
        // Check the response
        expect(response.body.message).toBe('Task was not found.');
      });
  });
});
