import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { mockDb } from '@/lib/mock-db'

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 LOGIN REQUEST RECEIVED')
    
    const { email, password } = await request.json()
    console.log(`📧 Login attempt for: ${email}`)

    // Enhanced input validation
    if (!email || !password) {
      console.log('❌ Missing email or password')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format')
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      console.log('❌ Password too short')
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Find user in mock database
    const user = mockDb.findUserByEmail(email)
    console.log(`👤 User found: ${user ? 'YES' : 'NO'}`)

    if (!user) {
      console.log('❌ Invalid credentials - user not found')
      return NextResponse.json(
        { error: 'Invalid email or password. Please check your credentials and try again.' },
        { status: 401 }
      )
    }

    // Verify password using the mock database method
    const isPasswordValid = mockDb.verifyPassword(email, password)
    console.log(`🔑 Password valid: ${isPasswordValid ? 'YES' : 'NO'}`)

    if (!isPasswordValid) {
      console.log('❌ Invalid credentials - wrong password')
      console.log(`🔍 Attempted password: ${password}`)
      console.log(`🔍 Stored hash: ${user.password.substring(0, 20)}...`)
      
      // Additional debugging
      try {
        const manualCheck = await bcrypt.compare(password, user.password)
        console.log(`🔍 Manual bcrypt check: ${manualCheck}`)
      } catch (bcryptError) {
        console.error('🔍 Bcrypt comparison error:', bcryptError)
      }
      
      return NextResponse.json(
        { error: 'Invalid email or password. Please check your credentials and try again.' },
        { status: 401 }
      )
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user
    console.log(`✅ Login successful for: ${userWithoutPassword.email}`)
    
    // Show current database status
    mockDb.debugUsers()

    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('💥 Login error:', error)
    
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
