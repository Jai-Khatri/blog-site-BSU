import mongoose from "mongoose"
import { beforeAll,afterAll,afterEach,test,expect } from "@jest/globals"
import { Post } from "../src/db/models/post.js"
import { createPost } from "../src/services/posts.js"

beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/blog_test")
})

afterEach(async () => {
  await Post.deleteMany({})
})

afterAll(async () => {
  await mongoose.disconnect()
})

test("creates a post", async () => {
  const post = await createPost({
    title: "Test post",
    author: "Test author",
    contents: "This is a test post",
    tags: ["test"]
  })

  expect(post.title).toBe("Test post")
})