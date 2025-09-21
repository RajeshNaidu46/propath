"use client"

import { MapPin, Phone, Mail, Heart } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Branding Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">ProPath</h3>
              <p className="text-gray-300 text-lg">
                Made with <Heart className="inline w-5 h-5 text-red-500 fill-red-500" /> for learners
              </p>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md">
              Empowering learners worldwide with comprehensive course recommendations, 
              AI-powered guidance, and seamless access to the best educational content 
              from YouTube and Udemy.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/privacy-policy" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-white transition-colors"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms-of-service" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-white transition-colors"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/courses" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-white transition-colors"></span>
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link 
                  href="/jobs" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-white transition-colors"></span>
                  Job Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 font-medium">Registered Address</p>
                  <p className="text-gray-400 text-sm">KSSEM, Bengaluru</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 font-medium">Phone</p>
                  <a 
                    href="tel:+919916285295" 
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    +91 9916285295
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 font-medium">Email</p>
                  <a 
                    href="mailto:support@propath.com" 
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    support@propath.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} ProPath. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">
                Terms
              </Link>
              <span>•</span>
              <span>Made in India 🇮🇳</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
