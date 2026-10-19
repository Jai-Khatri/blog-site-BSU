import "dotenv/config"
import express from "express"
import cors from "cors"

import { connectDb } from "./db/init.js"
import postsRouter from "./routes/posts.js"
import usersRouter from "./routes/users.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/posts",postsRouter)
app.use("/api/users",usersRouter)

app.get("/api/health",(req,res) => {
  res.json({
    message: "Backend running"
  })
})

async function start() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing")
  }

  await connectDb()

  const port = process.env.PORT || 3000

  app.listen(port,"0.0.0.0",() => {
    console.log(`Server running on port ${port}`)
  })
}

start().catch(console.error)