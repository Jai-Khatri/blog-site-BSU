import express from "express"
import {
  createPost,
  listPosts,
  getPost,
  updatePost,
  deletePost
} from "../services/posts.js"

const router = express.Router()

router.get("/", async (req,res) => {
  const posts = await listPosts()
  res.json(posts)
})

router.post("/", async (req,res) => {
  const post = await createPost(req.body)
  res.status(201).json(post)
})

router.get("/:id", async (req,res) => {
  const post = await getPost(req.params.id)

  if (!post) {
    return res.status(404).json({message: "Post not found"})
  }

  res.json(post)
})

router.put("/:id", async (req,res) => {
  const post = await updatePost(req.params.id,req.body)
  res.json(post)
})

router.delete("/:id", async (req,res) => {
  await deletePost(req.params.id)
  res.json({message: "Post deleted"})
})

export default router