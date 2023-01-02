const House = require('../models/house');
const cron = require('node-cron');

cron.schedule('0 0 * * *', async () => {
  const houses = await House.find();

  houses.forEach(async (value) => {
    if (value.isExist === 2) {
      try {
        const house = await House.findOneAndUpdate(
          {
            _id: value._id,
          },
          {
            isExist: 0,
            reservedBy: '',
          },
          { new: true }
        );

        if (!house) return { status: 'invalid', message: 'Dom nie został odnaleziony.' };
        return { data: house, message: 'Zaktualizowano' };
      } catch (error) {
        return { status: 'invalid', message: error };
      }
    }
  });
});
