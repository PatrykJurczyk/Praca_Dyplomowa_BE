// const { StatusCodes } = require('http-status-codes');
// const jsonwebtoken = require('jsonwebtoken');

// const auth = (req, res, next) => {
//   // const { authorization } = req.headers;
//   // const token = authorization ? authorization.split(' ')[1] : null;
//   const token = req.cookies.auth;

//   if (!token) return res.status(StatusCodes.UNAUTHORIZED).json('Dostęp zabroniony.');

//   try {
//     const verified = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
//     req.user = verified;
//     return next();
//   } catch (err) {
//     return res.status(StatusCodes.BAD_REQUEST).json('Błędny token użytkownika');
//   }
// };

// module.exports = auth;
