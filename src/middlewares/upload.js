const multer = require('multer');
const util = require('util');

const storage = multer.diskStorage({
  destination: (requset, file, cb) => {
    cb(null, './src/uploads/images');
  },

  filename: (requset, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadFiles = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
  // eslint-disable-next-line consistent-return
  fileFilter: (requset, file, cb) => {
    if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
}).any();

const uploadFilesMiddleware = util.promisify(uploadFiles);

module.exports = uploadFilesMiddleware;
