import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { mockDb } from '@/lib/mock-db'

export async function POST(request: NextRequest) {
  try {
    console.log('📝 REGISTRATION REQUEST RECEIVED')
    
    const { email, password, name } = await request.json()
    console.log(`📧 New user registration: ${email}`)

    // Validate input
    if (!email || !password) {
      console.log('❌ Missing email or password')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      console.log('❌ Password too short')
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = mockDb.findUserByEmail(email)
    console.log(`👤 User already exists: ${existingUser ? 'YES' : 'NO'}`)

    if (existingUser) {
      console.log('❌ User with this email already exists')
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    console.log('🔐 Password hashed successfully')

    // Create user in mock database
    const newUser = mockDb.createUser({
      email,
      password: hashedPassword,
      name: name || null
    })

    console.log(`✅ New user created: ${email}`)
    console.log(`📊 Total users in database: ${mockDb.getUserCount()}`)
    mockDb.debugUsers()

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: userWithoutPassword
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('💥 Registration error:', error)
    
    // Ensure we always return JSON, never HTML
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
