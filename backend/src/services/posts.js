import { Post } from "../db/models/post.js"

export async function createPost(data) {
  return await Post.create(data)
}

export async function listPosts() {
  return await Post.find().sort({ _id: -1 })
}

export async function getPost(id) {
  return await Post.findById(id)
}

export async function updatePost(id,data) {
  return await Post.findByIdAndUpdate(id,data,{ new: true })
}

export async function deletePost(id) {
  return await Post.findByIdAndDelete(id)
}