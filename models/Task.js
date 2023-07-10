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

// taskSchema.methods.getStatsFor = async function (userId) {
//   const date = new Date();
//   const year = date.getFullYear();
//   const month =
//     date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
//   const day = date.getDate();
//   const tomorrowMidnight = new Date(`${year}-${month}-${day + 1}`);

//   const today = new Date(`${year}-${month}-${day}`);
//   const foundTasks = await this.find({
//     user: userId,
//     dateOfCompletion: {
//       $lte: tomorrowMidnight,
//       $gte: new Date(today.setDate(today.getDate() - 10)),
//     },
//   });

//   const stats = [];

//   for (let i = 0; i < 10; i++) {
//     const now = new Date(`${year}-${month}-${day}`);
//     const now2 = new Date(`${year}-${month}-${day}`);
//     const now3 = new Date(`${year}-${month}-${day}`);

//     const dayStats = {
//       date: new Date(now.setDate(now.getDate() - i)),
//       counter: 0,
//     };

//     const dayBefore = new Date(now2.setDate(now2.getDate() - i));
//     const dayAfter = new Date(now3.setDate(now3.getDate() - i + 1));

//     foundTasks.forEach((task) => {
//       if (
//         task.dateOfCompletion >= dayBefore &&
//         task.dateOfCompletion < dayAfter
//       ) {
//         dayStats.counter++;
//       }
//     });

//     stats.push(dayStats);
//   }

//   stats.reverse();

//   return stats;
// };

module.exports = mongoose.model("task", taskSchema);
