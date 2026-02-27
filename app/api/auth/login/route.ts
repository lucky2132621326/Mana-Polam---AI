import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import fs from "fs"
import path from "path"

const usersPath = path.join(process.cwd(), "app/data/users.json")

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const raw = fs.readFileSync(usersPath, "utf-8")
    const users = JSON.parse(raw)

    const user = users.find((u: any) => u.email === email && u.password === password)

    if (user) {
      // Create a simplified session token (in a real app, use JWT)
      const sessionData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        iat: Date.now(),
      }

      const token = Buffer.from(JSON.stringify(sessionData)).toString("base64")

      cookies().set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      })

      return NextResponse.json({ 
        success: true, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        } 
      })
    }

    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
