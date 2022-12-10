const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

const User = require('../models/user');
const { editValidation, loginValidation, passwdEditValidation, registerValidation } = require('../routes/validation');

const isActive = 1;
const isInActive = 0;

const createUser = async (data) => {
  const { error } = registerValidation(data);

  if (error) return { status: 'invalid', message: error.details[0].message };

  const userExist = await User.find({ email: data.email, status: { $eq: isActive } });

  if (userExist[0] && userExist[0].status === isActive) return { status: 'invalid', message: 'Email jest już zajęty.' };

  if (data.password !== data.passwordRepeat) return { status: 'invalid', message: 'Podaj takie same hasła.' };

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(data.password, salt);
  try {
    const user = await User.create({
      email: data.email.toLowerCase(),
      password: hashedPassword,
    });

    return user;
  } catch (err) {
    return { status: 'invalid', message: 'Email jest już zajęty.', err };
  }
};

const loginUser = async (data) => {
  const { error } = loginValidation(data);
  if (error) return { status: 'invalid', message: error.details[0].message };

  const activeUser = await User.find({ email: data.email.toLowerCase(), status: { $eq: isActive } });
  if (!activeUser[0] || activeUser[0].status === isInActive)
    return { status: 'invalid', message: 'Podaj poprawny email i hasło.' };

  const validPass = await bcrypt.compare(data.password, activeUser[0].password);
  if (!validPass) return { status: 'invalid', message: 'Podaj poprawny email i hasło.' };

  const token = jsonwebtoken.sign({ _id: activeUser[0]._id }, process.env.TOKEN_SECRET);

  return { id: activeUser[0].id, token, role: activeUser[0].role };
};

const editUser = async (data, id, img) => {
  const { error } = editValidation(data);
  if (error) return { status: 'invalid', message: error.details[0].message };

  const userExist = await User.find({ _id: id });

  if (img === undefined || img.length === 0) {
    img = [userExist[0].avatar];
  }

  try {
    const user = await User.findOneAndUpdate(
      {
        _id: id,
      },
      {
        name: data.name,
        phone: data.phone,
        avatar: img[0].path ? img[0].path.replace('src\\', 'http://localhost:3001/') : img[0],
      },
      { new: true }
    );
    if (!user) return { status: 'invalid', message: 'Użytkownik nie został odnaleziony.' };
    return { data: user, message: 'Zaktualizowano.' };
  } catch (error) {
    return { status: 'invalid', message: error };
  }
};

const editPassword = async (data, id) => {
  const { error } = passwdEditValidation(data);
  if (error) return { status: 'invalid', message: error.details[0].message };

  const user = await User.findOne({ _id: id });
  if (!user) return { status: 'invalid', message: 'Użytkownik nie został odnaleziony.' };

  const validOldPass = await bcrypt.compare(data.password, user.password);
  if (!validOldPass) return { status: 'invalid', message: 'Stare hasło jest błędne.' };

  if (data.newPassword !== data.newPasswordRepeat)
    return { status: 'invalid', message: 'Nowe hasło nie pasują do siebie.' };

  const difOldNewPass = await bcrypt.compare(data.newPasswordRepeat, user.password);
  if (difOldNewPass) return { status: 'invalid', message: 'Stare hasło jak i nowe hasło muszą się róznić.' };

  data.password = data.newPasswordRepeat;

  const salt = await bcrypt.genSalt();
  data.password = await bcrypt.hash(data.password, salt);

  try {
    const user = await User.findOneAndUpdate(
      {
        _id: id,
      },
      {
        password: data.password,
      },
      { new: true }
    );
    if (!user) return { status: 'invalid', message: 'Użytkownik nie został odnaleziony.' };
    return { data: user, message: 'Zaktualizowano.' };
  } catch (error) {
    return { status: 'invalid', message: error };
  }
};

const toggleFavorites = async (data, id) => {
  const user = await User.findOne({ _id: id });
  if (!user) return { status: 'invalid', message: 'Użytkownik nie został odnaleziony.' };

  const dataFav = data.favorites;
  const fav = user.favorites;

  if (fav.includes(dataFav)) {
    try {
      const user = await User.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $pull: { favorites: dataFav },
        },
        { new: true }
      );
      if (!user) return { status: 'invalid', message: 'Użytkownik nie został odnaleziony.' };
      return { data: user, message: 'Zaktualizowano.' };
    } catch (error) {
      return { status: 'invalid', message: error };
    }
  }

  try {
    const user = await User.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $push: { favorites: dataFav },
      },
      { new: true }
    );
    if (!user) return { status: 'invalid', message: 'Użytkownik nie został odnaleziony.' };
    return { data: user, message: 'Zaktualizowano.' };
  } catch (error) {
    return { status: 'invalid', message: error };
  }
};

const deleteUser = async (id) => {
  const userExist = await User.findOne({ _id: id });

  if (!userExist || userExist.status === isInActive)
    return { status: 'invalid', message: 'Użytkownik nie został odnaleziony.' };

  await User.findOneAndUpdate(
    {
      _id: id,
    },
    { status: isInActive }
  );

  return { message: 'Użytkownik został zablokowany.' };
};

module.exports = { createUser, loginUser, editUser, editPassword, toggleFavorites, deleteUser };
