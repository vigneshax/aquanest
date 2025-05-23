import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

export default function AboutSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">About AquaNest</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your trusted partner in pet care for over a decade, providing quality products and expert advice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
            <Image src="/Designer.png?height=400&width=600" alt="About AquaNest" fill className="object-cover" />
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4">Our Story</h3>
            <p className="text-gray-700 mb-6">
              Founded in 2010, AquaNest began as a small aquarium shop with a passion for aquatic life. Over the years,
              we&apos;ve expanded our expertise to include birds and dogs, becoming a comprehensive pet care destination.
            </p>

            <h4 className="text-xl font-semibold mb-3">Our Commitment</h4>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-primary-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Providing the highest quality products for your beloved pets</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-primary-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Expert advice from our team of pet care specialists</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-primary-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Sustainable and ethical sourcing of all our products</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-primary-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Supporting animal welfare organizations in our community</span>
              </li>
            </ul>

            <p className="text-gray-700">
              At AquaNest, we believe that pets are family, and they deserve the best care possible. Our mission is to
              help you provide a happy, healthy life for your aquatic, avian, and canine companions.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
