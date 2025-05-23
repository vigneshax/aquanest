import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-700 border-t border-gray-200">
      <div className="relative overflow-hidden">
        {/* Wave SVG */}
        <div className="absolute top-0 left-0 w-full transform -translate-y-1/2 text-primary-500 opacity-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            className="w-full h-20"
          >
            <path
              fill="currentColor"
              fillOpacity="1"
              d="M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,138.7C672,139,768,181,864,181.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-primary-700">AquaNest</h3>
              <p className="text-gray-600 mb-4">
                Your one-stop shop for all pet needs. Quality products for fish, birds, dogs, and more.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-500 hover:text-primary-500 transition-colors">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-gray-500 hover:text-primary-500 transition-colors">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="text-gray-500 hover:text-primary-500 transition-colors">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Shop</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/products/fish" className="text-gray-600 hover:text-primary-500 transition-colors">
                    Fish & Aquatics
                  </Link>
                </li>
                <li>
                  <Link href="/products/birds" className="text-gray-600 hover:text-primary-500 transition-colors">
                    Birds & Accessories
                  </Link>
                </li>
                <li>
                  <Link href="/products/dogs" className="text-gray-600 hover:text-primary-500 transition-colors">
                    Dogs & Supplies
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-gray-600 hover:text-primary-500 transition-colors">
                    All Products
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary-500 mt-0.5" />
                  <span className="text-gray-600">123 Pet Street, Aquarium City, AC 12345</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary-500" />
                  <span className="text-gray-600">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary-500" />
                  <span className="text-gray-600">info@aquanest.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} AquaNest. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
