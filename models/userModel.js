const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'A user must have a name'],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, 'A user must have an email'],
      validate: [validator.isEmail, 'A user must have a valid email'],
    },
    photo: {
      type: String,
      default: 'default.jpg',
      trim: true,
    },
    role: {
      type: String,
      trim: true,
      enum: ['user', 'guide', 'lead-guide', 'admin'],
      default: 'user',
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'A user must have a password'],
      minLength: [8, 'Password must have more or equal than 8 characters'],
      select: false,
    },
    password_confirm: {
      type: String,
      trim: true,
      required: [true, 'A user must have a password'],
      minLength: [8, 'Password must have more or equal than 8 characters'],
      validate: {
        // This only works on SAVE!! not on UPDATE
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same',
      },
    },
    password_changed_at: {
      type: Date,
    },
    password_reset_token: {
      type: String,
    },
    password_reset_expires: {
      type: Date,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre(/^find/, function (next) {
  this.find({
    active: { $ne: false },
  });
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.password_changed_at = Date.now() - 1000;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.password_confirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.password_changed_at) {
    const changedTimestamp = parseInt(
      this.password_changed_at.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // False means password not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.password_reset_token = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.password_reset_expires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
