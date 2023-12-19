import mongoose, { Schema } from "mongoose";


// structure of data is going to be like this.
// one user_id can have multiple children which is shelter_id
const lovedvisitSchema = new Schema(
  {
    user_id: {
      type: String,
      ref: "User",
      required: true,
    },
    shelter_id: {
      type: Number,
      ref: "Shelter",
      required: true,
    },
    name:{
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,

    },
    shelter_type: {
      type:String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const lovedVisit = mongoose.model("lovedVisits", lovedvisitSchema);

export { lovedVisit };
