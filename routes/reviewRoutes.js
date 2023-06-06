const express = require('express');
const {
  setTourIdAndQuery,
  setTourUserIds,
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// Protect all routes after this line
router.use(protect);

router
  .route('/')
  .get(setTourIdAndQuery, getAllReviews)
  .post(restrictTo('user'), setTourUserIds, createReview);
router
  .route('/:id')
  .get(getReview)
  .put(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('user', 'admin'), deleteReview);

module.exports = router;
