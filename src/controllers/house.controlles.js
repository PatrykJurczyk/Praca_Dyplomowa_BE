import House from '../models/house';

//Dodawanie domu 
export const createHouse = async (data) => {
  const house = new House(data);
  console.log(data)
  try {
    const newHouse = await house.save();
    return { status: 'succes', newHouse };
  } catch(e) {
    return { status: 'invalid', message: e};
  }
};


//Edycja domu
export const editHouse = async (data, id) => {
  try {
    const house = await House.findOneAndUpdate(
      {
        _id: id,
      },
      data,
      { new: true }
    );
    if (!house) return { status: 'invalid', message: 'House not found' };
    return { data: house, message: 'Updated' };
  } catch {
    return { status: 'invalid', message: 'House not found' };
  }
};


// Usuwanie/Usuwanie domu tutaj findOneAndUpdate na archiwizowany. W data ma przyść czy usuwamy czy przywracamy
export const deleteHouse = async (data, id) => {
  const house = await House.findOneAndDelete({ _id: id });
  if (!house || !house._id) {
    return { status: 'invalid', message: 'House was not found.' };
  }

  return { message: 'House was deleted.' };
};

//Dodawanie/Usuwanie z ulubionych
//Akceptowanie/Odrzucanie 