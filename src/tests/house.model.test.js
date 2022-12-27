const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const House = require('../models/house');

describe('House model test', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri(), { dbName: 'verifyMASTER' });
  });

  afterAll(async () => mongoose.disconnect());

  it('Has a model', () => {
    expect(House).toBeDefined();
  });

  describe('Check a house', () => {
    it('Create a house model', async () => {
      const house = new House({
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
        // floor,
        // otherFeatures,
        // descriptionField,
        // images,
        // isAccepted,
        // isExist,
        // reservedBy,
      });
      await house.save();

      const foundHouse = await House.findOne({ id: house._id });

      const expectedOwner = '4edd40c86762e0fb12000003';
      const actualOwner = foundHouse.owner.toString();
      expect(expectedOwner).toEqual(actualOwner);

      const expectedCountry = 'Pl';
      const actualCountry = foundHouse.country;
      expect(expectedCountry).toEqual(actualCountry);

      const expectedProvince = 'Małopolska';
      const actualProvince = foundHouse.province;
      expect(expectedProvince).toEqual(actualProvince);

      const expectedCity = 'Kraków';
      const actualCity = foundHouse.city;
      expect(expectedCity).toEqual(actualCity);

      const expectedStreet = 'Słoneczna';
      const actualStreet = foundHouse.street;
      expect(expectedStreet).toEqual(actualStreet);

      const expectedHouseNr = '12';
      const actualHouseNr = foundHouse.houseNr;
      expect(expectedHouseNr).toEqual(actualHouseNr);

      const expectedYearBuild = 13;
      const actualYearBuild = foundHouse.yearBuilt;
      expect(expectedYearBuild).toEqual(actualYearBuild);

      const expectedPrice = 9231;
      const actualPrice = foundHouse.price;
      expect(expectedPrice).toEqual(actualPrice);

      const expectedDimension = 90;
      const actualDimension = foundHouse.dimension;
      expect(expectedDimension).toEqual(actualDimension);

      const expectedFloorsInBuilding = 4;
      const actualFloorsInBuilding = foundHouse.floorsInBuilding;
      expect(expectedFloorsInBuilding).toEqual(actualFloorsInBuilding);

      const expectedRoomsNumber = 9;
      const actualRoomsNumber = foundHouse.roomsNumber;
      expect(expectedRoomsNumber).toEqual(actualRoomsNumber);

      const expectedBathroomNumber = 2;
      const actualBathroomNumber = foundHouse.bathroomNumber;
      expect(expectedBathroomNumber).toEqual(actualBathroomNumber);

      const expectedFloor = '';
      const actualFloor = foundHouse.floor;
      expect(expectedFloor).toEqual(actualFloor);

      const expectedOtherFeatures = 0;
      const actualOtherFeatures = foundHouse.otherFeatures.length;
      expect(expectedOtherFeatures).toEqual(actualOtherFeatures);

      const expectedDescription = '';
      const actualDescription = foundHouse.descriptionField;
      expect(expectedDescription).toEqual(actualDescription);

      const expectedImages = [];
      const actualImages = foundHouse.images;
      expect(expectedImages).toEqual(actualImages);

      const expectedIsAccepted = 1;
      const actualIsAccepted = foundHouse.isAccepted;
      expect(expectedIsAccepted).toEqual(actualIsAccepted);

      const expectedIsExist = 0;
      const actualIsExist = foundHouse.isExist;
      expect(expectedIsExist).toEqual(actualIsExist);

      const expectedReservedBy = '';
      const actualReservedBy = foundHouse.reservedBy;
      expect(expectedReservedBy).toEqual(actualReservedBy);
    });
  });
});
