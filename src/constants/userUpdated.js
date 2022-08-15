const User = require('../models/user');

const userUpdated = async (data, id) => {
  try {
    const user = await User.findOneAndUpdate(
      {
        _id: id,
      },
      data,
      { new: true }
    );
    if (!user) return { status: 'invalid', message: 'User not found' };
    return { data: user, message: 'Updated' };
  } catch {
    return { status: 'invalid', message: 'User not found' };
  }
};

module.exports = userUpdated;
