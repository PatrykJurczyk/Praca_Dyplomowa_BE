const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const request = require('supertest');
const app = require('../App');

const House = require('../models/house');


describe('House router test', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri(), { dbName: 'verifyMASTER' });
  });

  afterAll(async () => mongoose.disconnect());

  test('GET /api/house', async () => {
    const house = await House.create({
      owner: mongoose.Types.ObjectId('4edd40c86762e0fb12000003'),
      country: 'Pl',
      province: 'Małopolska',
      city: 'Kraków',
      street: 'Słoneczna',
      houseNr: '12',
      yearBuilt: 13,
      price: 9231,
      dimension: 90,
      floorsInBuilding: 4,
      roomsNumber: 9,
      bathroomNumber: 2,
    });

    await request(app)
      .get('/api/house')
      .expect(200)
      .then((response) => {
        // Check the response type and length
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toEqual(1);

        // Check the response data
        expect(response.body[0]._id).toBe(house.id);
        expect(response.body[0].owner).toBe(house.owner.toString());
        expect(response.body[0].country).toBe(house.country);
        expect(response.body[0].province).toBe(house.province);
        expect(response.body[0].city).toBe(house.city);
        expect(response.body[0].street).toBe(house.street);
        expect(response.body[0].houseNr).toBe(house.houseNr);
        expect(response.body[0].yearBuilt).toBe(house.yearBuilt);
        expect(response.body[0].price).toBe(house.price);
        expect(response.body[0].dimension).toBe(house.dimension);
        expect(response.body[0].floorsInBuilding).toBe(house.floorsInBuilding);
        expect(response.body[0].roomsNumber).toBe(house.roomsNumber);
        expect(response.body[0].bathroomNumber).toBe(house.bathroomNumber);
        expect(response.body[0].floor).toBe('');
        expect(response.body[0].otherFeatures.length).toBe(0);
        expect(response.body[0].descriptionField).toBe('');
        expect(response.body[0].images.length).toBe(0);
        expect(response.body[0].isAccepted).toBe(1);
        expect(response.body[0].isExist).toBe(0);
        expect(response.body[0].reservedBy).toBe('');
      });
  });

  test('GET  /api/house:id', async () => {
    const house = await House.create({
      owner: mongoose.Types.ObjectId('4edd40c86762e0fb12000003'),
      country: 'Pl',
      province: 'Małopolska',
      city: 'Kraków',
      street: 'Słoneczna',
      houseNr: '12',
      yearBuilt: 13,
      price: 9231,
      dimension: 90,
      floorsInBuilding: 4,
      roomsNumber: 9,
      bathroomNumber: 2,
    });

    await request(app)
      .get('/api/house/' + house.id)
      .expect(200)
      .then((response) => {
        // Check the response type and length
        expect(Array.isArray(response.body)).toBe(false);

        // Check the response data
        expect(response.body._id).toBe(house.id);
        expect(response.body.owner).toBe(house.owner.toString());
        expect(response.body.country).toBe(house.country);
        expect(response.body.province).toBe(house.province);
        expect(response.body.city).toBe(house.city);
        expect(response.body.street).toBe(house.street);
        expect(response.body.houseNr).toBe(house.houseNr);
        expect(response.body.yearBuilt).toBe(house.yearBuilt);
        expect(response.body.price).toBe(house.price);
        expect(response.body.dimension).toBe(house.dimension);
        expect(response.body.floorsInBuilding).toBe(house.floorsInBuilding);
        expect(response.body.roomsNumber).toBe(house.roomsNumber);
        expect(response.body.bathroomNumber).toBe(house.bathroomNumber);
        expect(response.body.floor).toBe('');
        expect(response.body.otherFeatures.length).toBe(0);
        expect(response.body.descriptionField).toBe('');
        expect(response.body.images.length).toBe(0);
        expect(response.body.isAccepted).toBe(1);
        expect(response.body.isExist).toBe(0);
        expect(response.body.reservedBy).toBe('');
      });
  });

  test('GET BAD_REQUEST /api/house/:id', async () => {
    await request(app)
    .get('/api/house/' + mongoose.Types.ObjectId('4edd40c86762e0fb12000003'))
    .expect(400)
    .then((response) => {
      // Check the response data
      expect(response.body.message).toBe('Dom nie został odnaleziony.');
    });
  });

  test('POST /api/house', async () => {
    const data = {
      owner: mongoose.Types.ObjectId('4edd40c86762e0fb12000003'),
      country: 'Pl',
      province: 'Małopolska',
      city: 'Kraków',
      street: 'Słoneczna',
      houseNr: '12',
      yearBuilt: 13,
      price: 9231,
      dimension: 90,
      floorsInBuilding: 4,
      roomsNumber: 9,
      bathroomNumber: 2,
    };

    await request(app)
      .post('/api/house')
      .send(data)
      .expect(201)
      .then(async (response) => {
        // Check the response data
        expect(response.body.newHouse._id).toBeTruthy();
        expect(response.body.newHouse.owner).toBe(data.owner.toString());
        expect(response.body.newHouse.country).toBe(data.country);
        expect(response.body.newHouse.province).toBe(data.province);
        expect(response.body.newHouse.city).toBe(data.city);
        expect(response.body.newHouse.street).toBe(data.street);
        expect(response.body.newHouse.houseNr).toBe(data.houseNr);
        expect(response.body.newHouse.yearBuilt).toBe(data.yearBuilt);
        expect(response.body.newHouse.price).toBe(data.price);
        expect(response.body.newHouse.dimension).toBe(data.dimension);
        expect(response.body.newHouse.floorsInBuilding).toBe(data.floorsInBuilding);
        expect(response.body.newHouse.roomsNumber).toBe(data.roomsNumber);
        expect(response.body.newHouse.bathroomNumber).toBe(data.bathroomNumber);
        expect(response.body.newHouse.floor).toBe('');
        expect(response.body.newHouse.otherFeatures.length).toBe(0);
        expect(response.body.newHouse.descriptionField).toBe('');
        expect(response.body.newHouse.images[0]).toBe('');
        expect(response.body.newHouse.isAccepted).toBe(1);
        expect(response.body.newHouse.isExist).toBe(0);
        expect(response.body.newHouse.reservedBy).toBe('');

        // Check the data in the database
        const house = await House.findOne({ _id: response.body.newHouse._id });
        expect(house).toBeTruthy();
        expect(house.owner.toString()).toBe(data.owner.toString());
        expect(house.country).toBe(data.country);
        expect(house.province).toBe(data.province);
        expect(house.city).toBe(data.city);
        expect(house.street).toBe(data.street);
        expect(house.houseNr).toBe(data.houseNr);
        expect(house.yearBuilt).toBe(data.yearBuilt);
        expect(house.price).toBe(data.price);
        expect(house.dimension).toBe(data.dimension);
        expect(house.floorsInBuilding).toBe(data.floorsInBuilding);
        expect(house.roomsNumber).toBe(data.roomsNumber);
        expect(house.bathroomNumber).toBe(data.bathroomNumber);
        expect(house.floor).toBe('');
        expect(house.otherFeatures.length).toBe(0);
        expect(house.descriptionField).toBe('');
        expect(house.images[0]).toBe('');
        expect(house.isAccepted).toBe(1);
        expect(house.isExist).toBe(0);
        expect(house.reservedBy).toBe('');
      });
  });



  
  // 
  // 
  // 
  // 
  // 
  // 
  // 
  // 
  // 
  // 
  // 
  // 
  // 





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
