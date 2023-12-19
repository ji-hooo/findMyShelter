import mongoose, { Schema } from "mongoose";

/**쉼터 */
const shelterSchema = new Schema(
  {
    id: {
      type: Number,
      index: true,
      unique: true,
    },
    name: {
      type: String,
      index: true,
      required: true,
    },
    rating: {
      type: Number,
    },
    shelter_type: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    authority_name: {
      type: String,
    },
    authority_contact: {
      type: String,
    },
    open_at_night: {
      type: String,
    },
    open_on_weekends: {
      type: String,
    },
    overnight_stay: {
      type: String,
    },
    season_end_date: {
      type: Date,
    },
    season_start_date: {
      type: Date,
    },
    fan_count: {
      type: Number,
    },
    ac_count: {
      type: Number,
    },
    heater_count: {
      type: Number,
    },
    area: {
      tyep: Number,
    },
    capacity: {
      type: Number,
    },
    discription: {
      type: String,
    },
    create_at: {
      type: Date,
    },
    update_at: {
      type: Date,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  {
    timstamps: true,
  }
);

shelterSchema.index({ name: "text" });

const Shelter = mongoose.model("Shelter", shelterSchema);

export { Shelter };
