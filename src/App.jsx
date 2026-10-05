import { useEffect, useState } from "react"
import "./App.css"

function App() {
  const [posts,setPosts] = useState([])
  const [title,setTitle] = useState("")
  const [author,setAuthor] = useState("")
  const [contents,setContents] = useState("")
  const [tags,setTags] = useState("")

  useEffect(() => {
    getPosts()
  },[])

  async function getPosts() {
    const response = await fetch("/api/posts")
    const data = await response.json()

    setPosts(data)
  }

  async function submitPost(e) {
    e.preventDefault()

    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        author,
        contents,
        tags: tags.split(",").map(tag => tag.trim()).filter(Boolean)
      })
    })

    const post = await response.json()

    setPosts([post,...posts])

    setTitle("")
    setAuthor("")
    setContents("")
    setTags("")
  }

  return (
    <main>
      <h1>Blog</h1>

      <form onSubmit={submitPost}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          required
        />

        <input
          value={author}
          onChange={e => setAuthor(e.target.value)}
          placeholder="Author"
        />

        <textarea
          value={contents}
          onChange={e => setContents(e.target.value)}
          placeholder="Write your post"
        />

        <input
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="Tags"
        />

        <button>Create post</button>
      </form>

      <section>
        {posts.map(post => (
          <article key={post._id}>
            <h2>{post.title}</h2>
            <p>{post.contents}</p>
            <small>{post.author}</small>
          </article>
        ))}
      </section>
    </main>
  )
}

export default App