import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const usersPath = path.join(process.cwd(), "app/data/users.json")

function readUsers() {
  try {
    const raw = fs.readFileSync(usersPath, "utf-8")
    return JSON.parse(raw)
  } catch (err) {
    return []
  }
}

function writeUsers(users: any[]) {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2))
}

export async function GET() {
  const users = readUsers()
  // Strip passwords for security
  const safeUsers = users.map(({ password, ...rest }: any) => rest)
  return NextResponse.json(safeUsers)
}

export async function POST(req: Request) {
  try {
    const newUser = await req.json()
    const users = readUsers()
    
    // Check if user already exists
    if (users.find((u: any) => u.email === newUser.email)) {
      return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 })
    }

    const userWithId = {
      ...newUser,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString().split('T')[0],
      status: "active"
    }

    users.push(userWithId)
    writeUsers(users)

    const { password, ...safeUser } = userWithId
    return NextResponse.json(safeUser)
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
    try {
      const updatedUser = await req.json()
      const users = readUsers()
      const index = users.findIndex((u: any) => u.id === updatedUser.id)
  
      if (index === -1) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
      }
  
      // Update user, preserve password if not provided
      users[index] = { 
        ...users[index], 
        ...updatedUser,
        password: updatedUser.password || users[index].password 
      }
      
      writeUsers(users)
      const { password, ...safeUser } = users[index]
      return NextResponse.json(safeUser)
    } catch (error) {
      return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
      const { searchParams } = new URL(req.url)
      const id = searchParams.get('id')
      if (!id) return NextResponse.json({ success: false }, { status: 400 })

      let users = readUsers()
      users = users.filter((u: any) => u.id !== id)
      writeUsers(users)
      
      return NextResponse.json({ success: true })
    } catch (error) {
      return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
    }
}
