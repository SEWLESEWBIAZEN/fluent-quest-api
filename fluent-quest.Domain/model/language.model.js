const mongoose = require("mongoose");

const languagesSchema = new mongoose.Schema(
  {   
    name: {
      type: String,
      required: [true, "language name is required!"],
    },    

    code: {
      type: String,
      required: [true, "language code is required"],
      unique: true,
    },
    description: {
      type: String,
      required: false,
    },
    flag: {
      type: String,
      required: [true, "Flag is Required"]
    } 
   
  },
  {
    timestamps: true,
  }
);
const languagesModel = mongoose.model("languages", languagesSchema);
module.exports = languagesModel;