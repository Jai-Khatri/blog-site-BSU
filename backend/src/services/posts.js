import { Post } from "../db/models/post.js"

export async function createPost(data,userId) {
  return await Post.create({
    title: data.title,
    contents: data.contents,
    tags: data.tags || [],
    author: userId
  })
}

export async function listPosts() {
  return await Post.find()
    .populate("author","username")
    .sort({createdAt: -1})
}

export async function getPost(id) {
  return await Post.findById(id)
    .populate("author","username")
}

export async function updatePost(id,userId,data) {
  const changes = {}

  if (data.title !== undefined) changes.title = data.title
  if (data.contents !== undefined) changes.contents = data.contents
  if (data.tags !== undefined) changes.tags = data.tags

  return await Post.findOneAndUpdate(
    {_id: id,author: userId},
    changes,
    {new: true,runValidators: true}
  ).populate("author","username")
}

export async function deletePost(id,userId) {
  return await Post.findOneAndDelete({
    _id: id,
    author: userId
  })
}