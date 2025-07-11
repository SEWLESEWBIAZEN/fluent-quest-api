const mongoose = require("mongoose");
const coursesSchema = new mongoose.Schema(
  {
    code:{
      type:String,
      required: [true, "Code is required!"],      
    },
    title: {
      type: String,
      required: [true, "Title is required!"],
    },
    description: {
      type: String,
      required: [true, "Description is required!"]
    },
    language_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'languages',
      required: [true, "Language is required!"]
    },
    language_level: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'languageLevels',
      required: [true, "Language Level is required!"]
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: [true, "Teacher is required!"]
    },
    thumbnail: {
      type: String,
      required:false
    },
    duration: {
      type: Number,
      required: [true, "Duration is required!"]
    },    
    // lessons: {
    //   type: [mongoose.Schema.Types.ObjectId],
    //   ref: 'lessons',
    //   required: false
    // },
    rating: {
      type: Number,
      default: 0
    },
    // studentCount: {
    //   type: Number,
    //   default: 0
    // },
    price: {
      type: Number,
      default: 0,
      required: false
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const coursesModel = mongoose.model("courses", coursesSchema);
module.exports = coursesModel;