import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // refers to User collection
      required: true,
    },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    company: { type: String },
    city: { type: String },
    state: { type: String },
    source: {
      type: String,
      enum: ["website", "facebook_ads", "google_ads",
         "referral", "events", "other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "lost", "won"],
      default: "new",
    },
    score: { type: Number, min: 0, max: 100, default: 0 },
    lead_value: { type: Number, default: 0 },
    last_activity_at: { type: Date, default: null },
    is_qualified: { type: Boolean, default: false },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

const Lead = mongoose.model("Lead", leadSchema);
export default Lead;
