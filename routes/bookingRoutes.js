const express = require('express');
const {
  getAllBooking,
  getBooking,
  updateBooking,
  deleteBooking,
  createBooking,
} = require('../controllers/bookingController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// Protect all routes after this line
router.use(protect);
router.use(restrictTo('admin', 'lead-guide'));

router.route('/').get(getAllBooking).post(createBooking);
router.route('/:id').get(getBooking).put(updateBooking).delete(deleteBooking);

module.exports = router;
