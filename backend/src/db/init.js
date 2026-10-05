import mongoose from "mongoose"

export async function connectDb(uri = "mongodb://127.0.0.1:27017/blog") {
  await mongoose.connect(uri)
}