import express from "express"
import { connectDb } from "./db/init.js"
import postsRouter from "./routes/posts.js"

const app = express()

app.use(express.json())

app.use("/api/posts",postsRouter)

async function start() {
  await connectDb()

  app.listen(3000, () => {
    console.log("Server running on port 3000")
  })
}

start().catch(console.error)