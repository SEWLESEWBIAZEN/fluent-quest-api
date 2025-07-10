const mongoose = require("mongoose");
const userType = require('../enums/userType')
const Counter = require('./common/counter')

const usersSchema = new mongoose.Schema(
  {
    userId: { type: Number, unique: true },
    username: {
      type: String,
      required: [true, "User Name is required!"],
    },
    name: {
      type: String,
      required: [true, "Name is Required"]
    },
    role: {
      type: String,
      enum: Object.values(userType),
      default: userType.USER
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone Number is Required"]
    },
    avatar: {
      type: String,
      required: false,
    },
    streakDays: {
      type: Number,
      default: 0
    },
    points: {
      type: Number,
      default: 0
    },
    enrolledCourses: {
      type: [mongoose.Schema.Types.ObjectId],
      required: false,
      ref: 'courses',
      default: [],
    },
    verified: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      required: false,
      default: 0,
    },
    createdAt: {
      type: Date,
      required: false,
    },

  },
  {
    timestamps: true,
  }
);

//generate user id based on our requirement
usersSchema.pre('save', async function (next) {
  if (!this.isNew || this.userId) return next();

  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'userId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.userId = counter.seq;
    next();
  } catch (err) {
    next(err);
  }
});

const usersModel = mongoose.model("users", usersSchema);
module.exports = usersModel;