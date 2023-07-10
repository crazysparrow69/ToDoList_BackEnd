const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    categories: [{
      type: Schema.Types.ObjectId,
      ref: "category"
    }],
    sharedWith: {
      type: Array,
      default: [],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    deadline: {
      type: Date,
      default: null,
    },
    dateOfCompletion: {
      type: Date,
      default: null,
    },
    links: {
      type: Array,
      default: []
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("task", taskSchema);
