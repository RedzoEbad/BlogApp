import mongoose, { Document, Schema } from "mongoose";

export interface IBlog extends Document {
  title: string;
  description: string;
  image?: string;
  createdBy: mongoose.Types.ObjectId; 
  createdAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

const BlogModel = mongoose.model<IBlog>("Blog", blogSchema);

export default BlogModel;
