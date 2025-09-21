import { Shield, Lock, Eye, Users, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          At ProPath, we value your privacy and are committed to protecting your personal information. 
          This policy explains how we collect, use, and safeguard your data.
        </p>
      </div>

      {/* Last Updated */}
      <div className="text-center mb-8">
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Privacy Policy Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Eye className="w-6 h-6 text-blue-600" />
              Information We Collect
            </CardTitle>
            <CardDescription>
              We collect information to provide better services and improve your learning experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Personal Information</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Name and contact information when you create an account</li>
                <li>Profile information including skills, interests, and experience level</li>
                <li>Communication preferences and settings</li>
                <li>Payment information for premium services (if applicable)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Usage Information</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Course preferences and learning history</li>
                <li>Search queries and browsing patterns</li>
                <li>Interaction with our AI chatbot and recommendations</li>
                <li>Device information and browser type</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Users className="w-6 h-6 text-green-600" />
              How We Use Your Information
            </CardTitle>
            <CardDescription>
              Your information helps us provide personalized learning experiences and improve our services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Primary Uses</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Provide personalized course recommendations</li>
                <li>Generate AI-powered career guidance and roadmaps</li>
                <li>Improve our search and recommendation algorithms</li>
                <li>Send important updates about our services</li>
                <li>Provide customer support and respond to inquiries</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Analytics and Improvement</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Analyze usage patterns to improve user experience</li>
                <li>Develop new features based on user feedback</li>
                <li>Ensure platform security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Protection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-purple-600" />
              Data Protection and Security
            </CardTitle>
            <CardDescription>
              We implement industry-standard security measures to protect your information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Security Measures</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Secure data centers with physical security measures</li>
                <li>Employee training on data protection practices</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Data Retention</h4>
              <p className="text-muted-foreground">
                We retain your personal information only as long as necessary to provide our services 
                and comply with legal obligations. You can request deletion of your data at any time.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-red-600" />
              Data Sharing and Third Parties
            </CardTitle>
            <CardDescription>
              We do not sell your personal information and limit sharing to essential service providers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">We Do Not Sell Your Data</h4>
              <p className="text-muted-foreground">
                ProPath is committed to never selling, renting, or trading your personal information 
                to third parties for marketing purposes. Your data belongs to you.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Limited Sharing</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Service providers who help us operate our platform</li>
                <li>Legal authorities when required by law</li>
                <li>Business partners with your explicit consent</li>
                <li>Emergency situations to protect user safety</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Users className="w-6 h-6 text-orange-600" />
              Your Rights and Choices
            </CardTitle>
            <CardDescription>
              You have control over your personal information and how it's used
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Your Rights</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Access and review your personal information</li>
                <li>Update or correct inaccurate data</li>
                <li>Request deletion of your account and data</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data in a portable format</li>
                <li>Lodge complaints with data protection authorities</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How to Exercise Your Rights</h4>
              <p className="text-muted-foreground">
                Contact us at <a href="mailto:privacy@propath.com" className="text-blue-600 hover:underline">privacy@propath.com</a> 
                or through our support channels to exercise any of these rights. We'll respond to your 
                request within 30 days.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Policy Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 text-indigo-600" />
              Policy Updates and Changes
            </CardTitle>
            <CardDescription>
              We may update this privacy policy from time to time to reflect changes in our practices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Notification of Changes</h4>
              <p className="text-muted-foreground">
                When we make significant changes to this privacy policy, we will notify you through:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                <li>Email notifications to registered users</li>
                <li>Prominent notices on our website</li>
                <li>Updates to the "Last updated" date above</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Continued Use</h4>
              <p className="text-muted-foreground">
                Your continued use of ProPath after any changes to this policy constitutes acceptance 
                of the updated terms. We encourage you to review this policy periodically.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>
              If you have questions about this privacy policy or our data practices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-muted-foreground">
                <strong>Email:</strong> <a href="mailto:privacy@propath.com" className="text-blue-600 hover:underline">privacy@propath.com</a>
              </p>
              <p className="text-muted-foreground">
                <strong>Phone:</strong> <a href="tel:+919916285295" className="text-blue-600 hover:underline">+91 9916285295</a>
              </p>
              <p className="text-muted-foreground">
                <strong>Address:</strong> KSSEM, Bengaluru, India
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
