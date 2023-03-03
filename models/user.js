const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const userSchema = new mongoose.Schema(
  {
 
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      // enum: [0, 1, 2,3, 4], /*   0 = Admin, 1 = Nusing Home, 2 = Assisted Living, 3 = Physicians, 4 = Nurses*/
      required: true,
    },
    password: {
      type: String,
      default: "",
    },
    image: {
      type: String,
    },
   
    location: {
      type: String,
    },

    
   

    status: {
      type: Number,
      enum:[0,1,2], /* 0 = Active, 1 = inActive, 2 = Deleted */
      default: 0,
    },
    
    token: {
      type: String,
      default: null,
    },
    
  },

  {
    timestamps: true,
  }
);

userSchema.plugin(mongoosePaginate);
userSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("user", userSchema);
