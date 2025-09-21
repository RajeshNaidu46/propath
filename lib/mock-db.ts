import bcrypt from 'bcryptjs'

// Mock database for development (remove this in production)
export interface MockUser {
  id: string
  email: string
  password: string
  name?: string
  createdAt: string
}

class MockDatabase {
  private users: MockUser[] = []
  private initialized = false

  constructor() {
    this.initializeUsers()
  }

  private initializeUsers() {
    if (this.initialized) return
    
    // Use a consistent password hash for the test user
    // This ensures the password works every time
    const testPassword = "password123"
    
    // Check if we already have users (from previous initialization)
    if (this.users.length === 0) {
      // Generate a consistent hash for the test user
      const hashedPassword = bcrypt.hashSync(testPassword, 12)
      
      // Add a test user for development purposes
      this.users.push({
        id: '1',
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        createdAt: new Date().toISOString()
      })
      
      console.log('🔧 Test user created with consistent password hash')
      console.log('📧 Email: test@example.com')
      console.log('🔑 Password: password123')
      console.log('🔐 Hash: ' + hashedPassword.substring(0, 20) + '...')
    }
    
    this.initialized = true
  }

  findUserByEmail(email: string): MockUser | undefined {
    return this.users.find(u => u.email === email)
  }

  createUser(userData: Omit<MockUser, 'id' | 'createdAt'>): MockUser {
    const newUser: MockUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    this.users.push(newUser)
    console.log(`✅ New user created: ${newUser.email}`)
    return newUser
  }

  getAllUsers(): MockUser[] {
    return this.users
  }

  getUserCount(): number {
    return this.users.length
  }

  // Debug method to see current users (remove in production)
  debugUsers(): void {
    console.log('=== MOCK DATABASE STATUS ===')
    console.log(`Total users: ${this.users.length}`)
    this.users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.name || 'No name'}) - Created: ${user.createdAt}`)
      console.log(`   Password hash: ${user.password.substring(0, 20)}...`)
    })
    console.log('============================')
  }

  // Method to verify a password for testing
  verifyPassword(email: string, password: string): boolean {
    const user = this.findUserByEmail(email)
    if (!user) return false
    
    try {
      return bcrypt.compareSync(password, user.password)
    } catch (error) {
      console.error('Password verification error:', error)
      return false
    }
  }
}

export const mockDb = new MockDatabase()
