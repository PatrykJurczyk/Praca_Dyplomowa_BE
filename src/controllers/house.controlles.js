import House from '../models/house';

const createHouse = async (data, img) => {
  if (img === undefined || img.length === 0) {
    img = [''];
  }

  try {
    const newHouse = await House.create({
      owner: data.owner,
      email: data.email,
      country: data.country,
      province: data.province,
      city: data.city,
      street: data.street,
      houseNr: data.houseNr,
      yearBuilt: data.yearBuilt,
      price: data.price,
      dimension: data.dimension,
      floorsInBuilding: data.floorsInBuilding,
      floor: data.floor,
      roomsNumber: data.roomsNumber,
      bathroomNumber: data.bathroomNumber,
      otherFeatures: data.otherFeatures.map((feature) => feature),
      descriptionField: data.descriptionField,
      images: img.map((img) => (img.path ? img.path : '')),
    });

    return { status: 'succes', newHouse };
  } catch (error) {
    return { status: 'invalid', message: error };
  }
};

const editHouse = async (data, id, img) => {
  const addedImages = [];
  const deletedImages = [];
  const addedFeatures = [];
  const deletedFeatures = [];
  const house = await House.find({ _id: id });
  if (house[0] === undefined) return { status: 'invalid', message: 'House was not found.' };

  if (img === undefined || img.length === 0) {
    img = [''];
  }

  let arrayOfExistingImages = house[0].images.map((image) => image.split('-')).map((nameImg) => nameImg);

  const arrayOfIncomingImages = img.map((image) => image.path ? image.path.split('-') : '')
  let arrayOfExistingFeatures = house[0].otherFeatures;
  const arrayOfIncomingFeatures = data.otherFeatures;

  for (const i in arrayOfExistingImages) {
    if (!arrayOfIncomingImages.includes(arrayOfExistingImages[i]) || !arrayOfExistingImages[i] === '') {
      deletedImages.push(arrayOfExistingImages[i]);
    }
  }
  for (const i in arrayOfIncomingImages) {
    if (!arrayOfExistingImages.includes(arrayOfIncomingImages[i])) {
      addedImages.push(arrayOfIncomingImages[i]);
    }
  }
  for (let i in deletedImages) {
    if (arrayOfExistingImages.includes(deletedImages[i])) {
      arrayOfExistingImages = arrayOfExistingImages.filter((item) => item !== deletedImages[i]);
    }
  }

  if (addedImages.length) {
    addedImages.map((item) => arrayOfExistingImages.push(item));
  }

  arrayOfExistingImages = arrayOfExistingImages.filter((item, index) => arrayOfExistingImages.indexOf(item) === index);
  

  if (arrayOfExistingImages[0] !== '') {
    arrayOfExistingImages = arrayOfExistingImages.map((item) => item.join('-'));
  }

  arrayOfExistingImages =arrayOfExistingImages.map(item => item.replace('src\\', 'http://localhost:3001/'))

  for (const i in arrayOfExistingFeatures) {
    if (arrayOfIncomingFeatures) {
      if (!arrayOfIncomingFeatures.includes(arrayOfExistingFeatures[i]) || !arrayOfExistingFeatures[i] === '') {
        deletedFeatures.push(arrayOfExistingFeatures[i]);
      }
    }
  }
  for (const i in arrayOfIncomingFeatures) {
    if (!arrayOfExistingFeatures.includes(arrayOfIncomingFeatures[i])) {
      addedFeatures.push(arrayOfIncomingFeatures[i]);
    }
  }
  for (let i in deletedFeatures) {
    if (arrayOfExistingFeatures.includes(deletedFeatures[i])) {
      arrayOfExistingFeatures = arrayOfExistingFeatures.filter((item) => item !== deletedFeatures[i]);
    }
  }
  if (addedFeatures.length) {
    addedFeatures.map((item) => arrayOfExistingFeatures.push(item));
  }

  arrayOfExistingFeatures = arrayOfExistingFeatures.filter(
    (item, index) => arrayOfExistingFeatures.indexOf(item) === index
  );

  try {
    const house = await House.findOneAndUpdate(
      {
        _id: id,
      },
      {
        data,
        otherFeatures: arrayOfExistingFeatures.map((feature) => feature),
        images: arrayOfExistingImages.map((img) => img),
      },
      { new: true }
    );

    if (!house) return { status: 'invalid', message: 'House not found' };
    return { data: house, message: 'Updated' };
  } catch (error) {
    return { status: 'invalid', message: error };
  }
};
//
//
//
//

const editStatusAccepted = async (data, id) => {
  // 0 - niezaakceptowany, 1 - do akcepracji, 2 - zaakceptowany
  const house = await House.find({ _id: id });
  if (house[0] === undefined) return { status: 'invalid', message: 'House was not found.' };

  try {
    const house = await House.findOneAndUpdate(
      {
        _id: id,
      },
      {
        isAccepted: data.isAccepted,
      },
      { new: true }
    );
    if (!house) return { status: 'invalid', message: 'House not found' };
    return { data: house, message: 'Updated' };
  } catch (error) {
    return { status: 'invalid', message: error };
  }
};

const editHouseStatusExist = async (data, id) => {
  // 0 - niezarezerwowany, 1 - do rezerwacji, 2 - zarezerwowany, 3 - archiwizowany
  const house = await House.find({ _id: id });
  if (house[0] === undefined) return { status: 'invalid', message: 'House was not found.' };

  try {
    const house = await House.findOneAndUpdate(
      {
        _id: id,
      },
      {
        isExist: data.isExist,
      },
      { new: true }
    );

    if (!house) return { status: 'invalid', message: 'House not found' };
    return { data: house, message: 'Updated' };
  } catch (error) {
    return { status: 'invalid', message: error };
  }
};

const deleteHouse = async (data, id) => {
  const house = await House.findOneAndDelete({ _id: id });
  if (!house || !house._id) {
    return { status: 'invalid', message: 'House was not found.' };
  }

  return { message: 'House was deleted.' };
};

module.exports = { createHouse, editHouse, deleteHouse, editStatusAccepted, editHouseStatusExist };
