import { useEffect,useState } from "react"
import "./App.css"

const API_URL = import.meta.env.VITE_API_URL || ""

function App() {
  const [posts,setPosts] = useState([])

  const [signupUsername,setSignupUsername] = useState("")
  const [signupEmail,setSignupEmail] = useState("")
  const [signupPassword,setSignupPassword] = useState("")

  const [loginEmail,setLoginEmail] = useState("")
  const [loginPassword,setLoginPassword] = useState("")

  const [title,setTitle] = useState("")
  const [contents,setContents] = useState("")
  const [tags,setTags] = useState("")

  const [message,setMessage] = useState("")

  const [token,setToken] = useState(
    localStorage.getItem("token") || ""
  )

  const [user,setUser] = useState(() => {
    const savedUser = localStorage.getItem("user")

    return savedUser ? JSON.parse(savedUser) : null
  })

  useEffect(() => {
    getPosts()
  },[])

  async function getPosts() {
    const response = await fetch(`${API_URL}/api/posts`)
    const data = await response.json()

    setPosts(data)
  }

  async function signup(e) {
    e.preventDefault()
    setMessage("")

    const response = await fetch(`${API_URL}/api/users/signup`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: signupUsername,
        email: signupEmail,
        password: signupPassword
      })
    })

    const data = await response.json()

    if (!response.ok) {
      setMessage(data.message)
      return
    }

    setSignupUsername("")
    setSignupEmail("")
    setSignupPassword("")
    setMessage("Account created. You can login now.")
  }

  async function login(e) {
    e.preventDefault()
    setMessage("")

    const response = await fetch(`${API_URL}/api/users/login`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword
      })
    })

    const data = await response.json()

    if (!response.ok) {
      setMessage(data.message)
      return
    }

    localStorage.setItem("token",data.token)
    localStorage.setItem("user",JSON.stringify(data.user))

    setToken(data.token)
    setUser(data.user)

    setLoginEmail("")
    setLoginPassword("")
    setMessage(`Logged in as ${data.user.username}`)
  }

  function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    setToken("")
    setUser(null)
    setMessage("Logged out")
  }

  async function submitPost(e) {
    e.preventDefault()
    setMessage("")

    const response = await fetch(`${API_URL}/api/posts`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        contents,
        tags: tags
          .split(",")
          .map(tag => tag.trim())
          .filter(Boolean)
      })
    })

    const data = await response.json()

    if (!response.ok) {
      setMessage(data.message)
      return
    }

    setPosts(current => [data,...current])

    setTitle("")
    setContents("")
    setTags("")
    setMessage("Post created")
  }

  return (
    <main>
      <h1>Blog</h1>

      {message && <p className="message">{message}</p>}

      {!user && (
        <div className="accountForms">
          <form onSubmit={signup}>
            <h2>Sign up</h2>

            <input
              value={signupUsername}
              onChange={e => setSignupUsername(e.target.value)}
              placeholder="Username"
              required
            />

            <input
              value={signupEmail}
              onChange={e => setSignupEmail(e.target.value)}
              placeholder="Email"
              type="email"
              required
            />

            <input
              value={signupPassword}
              onChange={e => setSignupPassword(e.target.value)}
              placeholder="Password"
              type="password"
              required
            />

            <button>Sign up</button>
          </form>

          <form onSubmit={login}>
            <h2>Login</h2>

            <input
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
              placeholder="Email"
              type="email"
              required
            />

            <input
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              placeholder="Password"
              type="password"
              required
            />

            <button>Login</button>
          </form>
        </div>
      )}

      {user && (
        <>
          <div className="loggedIn">
            <span>Logged in as {user.username}</span>
            <button onClick={logout}>Logout</button>
          </div>

          <form onSubmit={submitPost}>
            <h2>Create post</h2>

            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title"
              required
            />

            <textarea
              value={contents}
              onChange={e => setContents(e.target.value)}
              placeholder="Write your post"
            />

            <input
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="Tags separated by commas"
            />

            <button>Create post</button>
          </form>
        </>
      )}

      <section>
        <h2>Posts</h2>

        {posts.map(post => (
          <article key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.contents}</p>

            <small>
              by {post.author?.username || "Unknown"}
            </small>

            {post.tags?.length > 0 && (
              <p className="tags">
                {post.tags.join(", ")}
              </p>
            )}
          </article>
        ))}
      </section>
    </main>
  )
}

export default App