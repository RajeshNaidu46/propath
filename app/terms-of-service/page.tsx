import { FileText, Shield, Users, AlertTriangle, Scale, Gavel } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <FileText className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          These terms govern your use of ProPath's educational platform and services. 
          By using our platform, you agree to these terms and conditions.
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

      {/* Terms of Service Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Acceptance of Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-blue-600" />
              Acceptance of Terms
            </CardTitle>
            <CardDescription>
              By accessing and using ProPath, you accept and agree to be bound by these terms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              These Terms of Service ("Terms") constitute a legally binding agreement between you 
              and ProPath regarding your use of our educational platform, services, and applications. 
              If you do not agree to these terms, please do not use our services.
            </p>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. Continued use of our services 
              after such modifications constitutes acceptance of the updated terms.
            </p>
          </CardContent>
        </Card>

        {/* Description of Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Users className="w-6 h-6 text-green-600" />
              Description of Services
            </CardTitle>
            <CardDescription>
              ProPath provides comprehensive educational and career development services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Our Services Include:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Course recommendations from YouTube and Udemy</li>
                <li>AI-powered career guidance and roadmaps</li>
                <li>Personalized learning recommendations</li>
                <li>Job search and career opportunities</li>
                <li>Educational content and resources</li>
                <li>Community features and support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Service Availability</h4>
              <p className="text-muted-foreground">
                While we strive to maintain high service availability, we do not guarantee uninterrupted 
                access to our platform. We may temporarily suspend services for maintenance, updates, 
                or technical issues.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* User Accounts and Registration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Users className="w-6 h-6 text-purple-600" />
              User Accounts and Registration
            </CardTitle>
            <CardDescription>
              Requirements and responsibilities for creating and maintaining user accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Account Creation</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>You must be at least 13 years old to create an account</li>
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>You are responsible for all activities under your account</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Account Termination</h4>
              <p className="text-muted-foreground">
                We reserve the right to terminate or suspend accounts that violate these terms, 
                engage in fraudulent activities, or pose security risks to our platform.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Acceptable Use Policy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              Acceptable Use Policy
            </CardTitle>
            <CardDescription>
              Guidelines for ethical and responsible use of our platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">You May Use Our Services To:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Access educational content and course recommendations</li>
                <li>Receive personalized career guidance</li>
                <li>Search for job opportunities and career resources</li>
                <li>Connect with other learners and professionals</li>
                <li>Improve your skills and knowledge</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">You May NOT Use Our Services To:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Spread malware, viruses, or harmful code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use automated tools to scrape or collect data</li>
                <li>Engage in commercial activities without permission</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Scale className="w-6 h-6 text-indigo-600" />
              Intellectual Property Rights
            </CardTitle>
            <CardDescription>
              Understanding of intellectual property rights and usage permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Our Intellectual Property</h4>
              <p className="text-muted-foreground">
                ProPath retains all rights to our platform, software, content, and branding. 
                Our services are protected by copyright, trademark, and other intellectual property laws.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Third-Party Content</h4>
              <p className="text-muted-foreground">
                We provide access to content from YouTube, Udemy, and other third-party sources. 
                The intellectual property rights for such content remain with their respective owners. 
                We do not claim ownership of third-party content.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">User-Generated Content</h4>
              <p className="text-muted-foreground">
                You retain ownership of content you create and share on our platform. By sharing content, 
                you grant us a license to use, display, and distribute it in connection with our services.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Privacy and Data Protection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-red-600" />
              Privacy and Data Protection
            </CardTitle>
            <CardDescription>
              How we handle your personal information and protect your privacy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your privacy is important to us. Our collection, use, and protection of your personal 
              information is governed by our Privacy Policy, which is incorporated into these terms 
              by reference.
            </p>
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational measures to protect your data 
              against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <p className="text-muted-foreground">
              By using our services, you consent to our collection and use of your information 
              as described in our Privacy Policy.
            </p>
          </CardContent>
        </Card>

        {/* Disclaimers and Limitations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              Disclaimers and Limitations of Liability
            </CardTitle>
            <CardDescription>
              Important limitations and disclaimers regarding our services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Service Disclaimers</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Our services are provided "as is" without warranties of any kind</li>
                <li>We do not guarantee the accuracy of course recommendations or career advice</li>
                <li>Third-party content is not endorsed or verified by ProPath</li>
                <li>We are not responsible for external websites or services we link to</li>
                <li>Career outcomes depend on individual effort and market conditions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Limitation of Liability</h4>
              <p className="text-muted-foreground">
                To the maximum extent permitted by law, ProPath shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages arising from your use of our services.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Governing Law and Jurisdiction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Gavel className="w-6 h-6 text-gray-600" />
              Governing Law and Jurisdiction
            </CardTitle>
            <CardDescription>
              Legal framework and jurisdiction for resolving disputes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Governing Law</h4>
              <p className="text-muted-foreground">
                These terms are governed by and construed in accordance with the laws of India. 
                Any disputes arising from these terms or your use of our services shall be subject 
                to the exclusive jurisdiction of the courts in Bengaluru, Karnataka, India.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Compliance with Indian Laws</h4>
              <p className="text-muted-foreground">
                Our services comply with applicable Indian laws and regulations, including the 
                Information Technology Act, 2000, and other relevant data protection and 
                consumer protection laws.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Alternative Dispute Resolution</h4>
              <p className="text-muted-foreground">
                We encourage resolving disputes through good faith negotiations. If disputes cannot 
                be resolved amicably, they shall be subject to binding arbitration in accordance 
                with the Arbitration and Conciliation Act, 1996.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>
              If you have questions about these terms of service
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-muted-foreground">
                <strong>Email:</strong> <a href="mailto:legal@propath.com" className="text-blue-600 hover:underline">legal@propath.com</a>
              </p>
              <p className="text-muted-foreground">
                <strong>Phone:</strong> <a href="tel:+919916285295" className="text-blue-600 hover:underline">+91 9916285295</a>
              </p>
              <p className="text-muted-foreground">
                <strong>Address:</strong> KSSEM, Bengaluru, Karnataka, India
              </p>
              <p className="text-muted-foreground">
                <strong>Legal Department:</strong> ProPath Technologies
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
