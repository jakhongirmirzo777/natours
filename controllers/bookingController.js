const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  //  This solution is temporary and it is insecure
  const { tour, user, price } = req.query;
  if (!tour || !user || !price) return next();
  await Booking.create({ tour, user, price });
  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = createOne(Booking);
exports.getBooking = getOne(Booking);
exports.getAllBooking = getAll(Booking);
exports.updateBooking = updateOne(Booking);
exports.deleteBooking = deleteOne(Booking);
