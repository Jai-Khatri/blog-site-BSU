import express from "express"
import {
  createPost,
  listPosts,
  getPost,
  updatePost,
  deletePost
} from "../services/posts.js"
import { requireAuth } from "../middleware/auth.js"

const router = express.Router()

router.get("/", async (req,res) => {
  try {
    const posts = await listPosts()
    res.json(posts)
  }
  catch {
    res.status(500).json({
      message: "Could not load posts"
    })
  }
})

router.get("/:id", async (req,res) => {
  try {
    const post = await getPost(req.params.id)

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      })
    }

    res.json(post)
  }
  catch {
    res.status(500).json({
      message: "Could not load post"
    })
  }
})

router.post("/",requireAuth, async (req,res) => {
  try {
    const post = await createPost(
      req.body,
      req.user.userId
    )

    await post.populate("author","username")

    res.status(201).json(post)
  }
  catch {
    res.status(400).json({
      message: "Could not create post"
    })
  }
})

router.put("/:id",requireAuth, async (req,res) => {
  try {
    const post = await updatePost(
      req.params.id,
      req.user.userId,
      req.body
    )

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      })
    }

    res.json(post)
  }
  catch {
    res.status(400).json({
      message: "Could not update post"
    })
  }
})

router.delete("/:id",requireAuth, async (req,res) => {
  try {
    const post = await deletePost(
      req.params.id,
      req.user.userId
    )

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      })
    }

    res.json({
      message: "Post deleted"
    })
  }
  catch {
    res.status(400).json({
      message: "Could not delete post"
    })
  }
})

export default router