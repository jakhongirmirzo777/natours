const Review = require('../models/reviewModel');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');

exports.setTourIdAndQuery = (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  req.query = { ...req.query, ...filter };
  next();
};

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getReview = getOne(Review, {
  path: 'tour',
  select: 'name',
});

exports.getAllReviews = getAll(Review);

exports.createReview = createOne(Review);

exports.updateReview = updateOne(Review);

exports.deleteReview = deleteOne(Review);
