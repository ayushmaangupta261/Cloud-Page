import mongoose, { Schema, Document, Types } from "mongoose";

export interface INote extends Document {
  user: Types.ObjectId;        // owner
  title: string;
  content: string;
  sharedWith: Types.ObjectId[]; // array of user IDs
}

const noteSchema = new Schema<INote>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  sharedWith: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }] // store user IDs
}, { timestamps: true });

export default mongoose.model<INote>("Note", noteSchema);
