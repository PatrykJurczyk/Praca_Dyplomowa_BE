const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

const userUpdated = require('../constants/userUpdated');
const User = require('../models/user');
const { editValidation, loginValidation, passwdEditValidation, registerValidation } = require('../routes/validation');

export const createUser = async (data) => {
  const { error } = registerValidation(data);
  if (error) return { status: 'invalid', message: error.details[0].message };

  const userExist = await User.find({ email: data.email, status: { $eq: 1 } });

  if (userExist[0] && userExist[0].status === 1) return { status: 'invalid', message: 'Email already exists' };

  if (data.password !== data.passwordRepeat) return { status: 'invalid', message: 'The passwords do not match.' };

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(data.password, salt);
  try {
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role, // user / admin / manager
    });

    return user;
  } catch (err) {
    return { status: 'invalid', message: 'Email already exists', err };
  }
};

export const loginUser = async (data) => {
  const { error } = loginValidation(data);
  if (error) return { status: 'invalid', message: error.details[0].message };

  const activeUser = await User.find({ email: data.email, status: { $eq: 1 } });
  if (!activeUser[0] || activeUser[0].status === 0) return { status: 'invalid', message: 'Email or password is wrong' };

  const validPass = await bcrypt.compare(data.password, activeUser[0].password);
  if (!validPass) return { status: 'invalid', message: 'Email or password is wrong' };

  const token = jsonwebtoken.sign({ _id: activeUser[0]._id }, process.env.TOKEN_SECRET);

  return { id: activeUser[0].id, token, role: activeUser[0].role, message: `Welcome ${activeUser[0].name}` };
};

export const editUser = async (data, id) => {
  const { error } = editValidation(data);
  if (error) return { status: 'invalid', message: error.details[0].message };

  return userUpdated({ name: data.name, photo: data.photo, role: data.role }, id);
};

export const editPassword = async (data, id) => {
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

  return userUpdated({ password: data.password }, id);
};

export const deleteUser = async (id) => {
  const userExist = await User.findOne({ _id: id });

  if (!userExist || userExist.status === 0) return { status: 'invalid', message: 'User not found' };

  await User.findOneAndUpdate(
    {
      _id: id,
    },
    { status: 0 }
  );

  return { message: 'The account has been deleted' };
};

module.exports = { createUser, loginUser, editUser, editPassword, deleteUser };
