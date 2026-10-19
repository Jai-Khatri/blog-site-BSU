import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { User } from "../db/models/user.js"

export async function signupUser(data) {
  const username = data.username.trim()
  const email = data.email.trim().toLowerCase()

  const existingUser = await User.findOne({
    $or: [{email},{username}]
  })

  if (existingUser) return null

  const passwordHash = await bcrypt.hash(data.password,10)

  const user = await User.create({
    username,
    email,
    passwordHash
  })

  return {
    id: user._id,
    username: user.username,
    email: user.email
  }
}

export async function loginUser(email,password) {
  const user = await User.findOne({
    email: email.trim().toLowerCase()
  })

  if (!user) return null

  const validPassword = await bcrypt.compare(password,user.passwordHash)

  if (!validPassword) return null

  const token = jwt.sign(
    {userId: user._id.toString()},
    process.env.JWT_SECRET,
    {expiresIn: "7d"}
  )

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  }
}