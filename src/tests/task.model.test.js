const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const Task = require('../models/task');

describe('Task model test', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri(), { dbName: 'verifyMASTER' });
  });

  afterAll(async () => mongoose.disconnect());

  it('Has a model', () => {
    expect(Task).toBeDefined();
  });

  describe('Check a task', () => {
    it('Create a task model', async () => {
      const task = new Task({
        name: 'To do',
        description: 'Opis zadania',
        column: mongoose.Types.ObjectId('4edd40c86762e0fb12000003'),
        color: '#ccc',
        idTask: '12341234',
        idSection: mongoose.Types.ObjectId('4edd40c86762e0fb12000003'),
        idUser: [mongoose.Types.ObjectId('4edd40c86762e0fb12000003')],
      });
      await task.save();

      const foundTask = await Task.findOne({ id: task._id });

      const expectedName = 'To do';
      const actualName = foundTask.name;
      expect(expectedName).toEqual(actualName);

      const expectedDescription = 'Opis zadania';
      const actualDescription = foundTask.description;
      expect(expectedDescription).toEqual(actualDescription);

      const expectedIdColumn = mongoose.Types.ObjectId('4edd40c86762e0fb12000003').toHexString();
      const actualIdColumn = foundTask.column.toHexString();
      expect(expectedIdColumn).toEqual(actualIdColumn);

      const expectedColor = '#ccc';
      const actualColor = foundTask.color;
      expect(expectedColor).toEqual(actualColor);

      const expectedIdTask = '12341234';
      const actualIdTask = foundTask.idTask;
      expect(expectedIdTask).toEqual(actualIdTask);

      const expectedIdSection = mongoose.Types.ObjectId('4edd40c86762e0fb12000003').toHexString();
      const actualIdSection = foundTask.idSection.toHexString();
      expect(expectedIdSection).toEqual(actualIdSection);

      const expectedidUser = mongoose.Types.ObjectId('4edd40c86762e0fb12000003').toHexString();
      const actualidUser = foundTask.idUser[0].toHexString();
      expect(expectedidUser).toEqual(actualidUser);
    });
  });
});
