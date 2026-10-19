import mongoose from "mongoose"
import {
  beforeAll,
  afterAll,
  afterEach,
  test,
  expect
} from "@jest/globals"

import { User } from "../src/db/models/user.js"
import { Post } from "../src/db/models/post.js"
import { createPost } from "../src/services/posts.js"

beforeAll(async () => {
  const uri = process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/blog_test"

  await mongoose.connect(uri)
})

afterEach(async () => {
  await Post.deleteMany({})
  await User.deleteMany({})
})

afterAll(async () => {
  await mongoose.disconnect()
})

test("creates a post for a user", async () => {
  const user = await User.create({
    username: "testuser",
    email: "test@example.com",
    passwordHash: "fakehash"
  })

  const post = await createPost({
    title: "Test post",
    contents: "Testing the service",
    tags: ["test"]
  },user._id)

  expect(post.title).toBe("Test post")
  expect(post.author.toString()).toBe(user._id.toString())
})