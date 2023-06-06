const express = require('express');
const {
  protect,
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  restrictTo,
  logout,
} = require('../controllers/authController');
const {
  deleteMe,
  updateMe,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getMe,
  uploadUserPhoto,
  resizeUserPhoto,
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

// Protect all routes after this line
router.use(protect);

router.patch('/update-password', updatePassword);

router.get('/me', getMe, getUser);
router.patch('/update-me', uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete('/delete-me', deleteMe);

// Protect all routes after this line
router.use(restrictTo('admin'));

router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
