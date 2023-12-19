import mongoose, { Schema } from "mongoose";
import { User } from "./user";
import { Shelter } from "./shelter";

/** 쉼터 후기 스키마 */
const reviewSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
    },
    nickname: {
      type: String,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    nickname: {
      type: String,
      unique: true,
      ref: "User",
    },
    shelter_id: {
      type: Number,
      required: true,
      ref: "Shelter",
    },
    name: {
      type : String,
      required: true,
      ref: "Shelter",
    }
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);

export { Review };
