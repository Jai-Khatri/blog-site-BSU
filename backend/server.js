const http = require("http")
const { MongoClient } = require("mongodb")

const client = new MongoClient("mongodb://127.0.0.1:27017")

async function start() {
  await client.connect()

  const db = client.db("blog")
  const posts = db.collection("posts")

  let post = await posts.findOne()

  if (!post) {
    await posts.insertOne({
      message: "Hello from MongoDB"
    })

    post = await posts.findOne()
  }

  const server = http.createServer((req,res) => {
    if (req.url === "/" && req.method === "GET") {
      res.writeHead(200, {"Content-Type": "application/json"})
      res.end(JSON.stringify(post))
      return
    }

    res.writeHead(404, {"Content-Type": "text/plain"})
    res.end("Not found")
  })

  server.listen(3000, () => {
    console.log("Server running on port 3000")
  })
}

start().catch(console.error)