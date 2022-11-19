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

  if (userExist[0] && userExist[0].status === isActive) return { status: 'invalid', message: 'Email already exists' };

  if (data.password !== data.passwordRepeat) return { status: 'invalid', message: 'The passwords do not match.' };

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(data.password, salt);
  try {
    const user = await User.create({
      email: data.email,
      password: hashedPassword,
    });

    return user;
  } catch (err) {
    return { status: 'invalid', message: 'Email already exists', err };
  }
};

const loginUser = async (data) => {
  const { error } = loginValidation(data);
  if (error) return { status: 'invalid', message: error.details[0].message };

  const activeUser = await User.find({ email: data.email, status: { $eq: isActive } });
  if (!activeUser[0] || activeUser[0].status === isInActive)
    return { status: 'invalid', message: 'Email or password is wrong' };

  const validPass = await bcrypt.compare(data.password, activeUser[0].password);
  if (!validPass) return { status: 'invalid', message: 'Email or password is wrong' };

  const token = jsonwebtoken.sign({ _id: activeUser[0]._id }, process.env.TOKEN_SECRET);

  return { id: activeUser[0].id, token, role: activeUser[0].role };
};

const editUser = async (data, id, img) => {
  const { error } = editValidation(data);
  if (error) return { status: 'invalid', message: error.details[0].message };

  if (img === undefined || img.length === 0) {
    img = [''];
  }

  try {
    const user = await User.findOneAndUpdate(
      {
        _id: id,
      },
      {
        name: data.name,
        phone: data.phone,
        avatar: img[0].path,
      },
      { new: true }
    );
    if (!user) return { status: 'invalid', message: 'User not found' };
    return { data: user, message: 'Updated' };
  } catch (error) {
    return { status: 'invalid', message: error };
  }
};

const editPassword = async (data, id) => {
  const { error } = passwdEditValidation(data);
  if (error) return { status: 'invalid', message: error.details[0].message };

  const user = await User.findOne({ _id: id });
  if (!user) return { status: 'invalid', message: 'User not found.' };

  const validOldPass = await bcrypt.compare(data.password, user.password);
  if (!validOldPass) return { status: 'invalid', message: 'Old password is wrong.' };

  if (data.newPassword !== data.newPasswordRepeat) return { status: 'invalid', message: 'The passwords do not match.' };

  const difOldNewPass = await bcrypt.compare(data.newPasswordRepeat, user.password);
  if (difOldNewPass) return { status: 'invalid', message: 'The old password and the new password must be different.' };

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
    if (!user) return { status: 'invalid', message: 'User not found' };
    return { data: user, message: 'Updated' };
  } catch (error) {
    return { status: 'invalid', message: error };
  }
};

const toggleFavorites = async (data, id) => {
  const user = await User.findOne({ _id: id });
  if (!user) return { status: 'invalid', message: 'User not found.' };

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
      if (!user) return { status: 'invalid', message: 'User not found' };
      return { data: user, message: 'Updated' };
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
    if (!user) return { status: 'invalid', message: 'User not found' };
    return { data: user, message: 'Updated' };
  } catch (error) {
    return { status: 'invalid', message: error };
  }
};

const deleteUser = async (id) => {
  const userExist = await User.findOne({ _id: id });

  if (!userExist || userExist.status === isInActive) return { status: 'invalid', message: 'User not found' };

  await User.findOneAndUpdate(
    {
      _id: id,
    },
    { status: isInActive }
  );

  return { message: 'The user has been blocked' };
};

module.exports = { createUser, loginUser, editUser, editPassword, toggleFavorites, deleteUser };
