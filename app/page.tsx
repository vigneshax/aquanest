import HeroSection from "@/components/hero-section"
import CategoryCard from "@/components/category-card"
import FeaturedProducts from "@/components/featured-products"
import NewsletterSection from "@/components/newsletter-section"
import TestimonialsSection from "@/components/testimonials-section"
import AboutSection from "@/components/about-section"
import ContactSection from "@/components/contact-section"
import { Fish, Bird, Dog } from "lucide-react"

export default function Home() {
  return (
    <div>
      <HeroSection />

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop By Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CategoryCard
              title="Fish & Aquatics"
              description="Discover a wide range of fish species, aquariums, and essential supplies for your underwater friends."
              image="https://img.freepik.com/free-photo/close-up-vibrant-clown-fish-swimming-coral-reef-generated-by-ai_188544-151620.jpg?uid=R56299312&ga=GA1.1.120496150.1741877174&semt=ais_hybrid&w=740"
              href="/products/fish"
              color="teal"
              icon={<Fish className="h-6 w-6 text-white" />}
            />
            <CategoryCard
              title="Birds & Accessories"
              description="Find beautiful birds, cages, toys, and nutritious food to keep your feathered friends happy."
              image="https://img.freepik.com/free-photo/beautiful-tropical-colorful-bird_23-2151875489.jpg?uid=R56299312&ga=GA1.1.120496150.1741877174&semt=ais_hybrid&w=740"
              href="/products/birds"
              color="orange"
              icon={<Bird className="h-6 w-6 text-white" />}
            />
            <CategoryCard
              title="Dogs & Supplies"
              description="Shop premium dog food, toys, accessories, and grooming supplies for your loyal companion."
              image="https://img.freepik.com/free-photo/beautiful-autumn-lifestyle_23-2151867759.jpg?uid=R56299312&ga=GA1.1.120496150.1741877174&semt=ais_hybrid&w=740"
              href="/products/dogs"
              color="purple"
              icon={<Dog className="h-6 w-6 text-white" />}
            />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <FeaturedProducts
        category="fish"
        title="Featured Fish Products"
        description="Explore our top-rated fish food, aquariums, and accessories to create the perfect underwater environment."
        variant="teal"
      />
      <FeaturedProducts
        category="birds"
        title="Popular Bird Supplies"
        description="Discover premium bird food, toys, and accessories that your feathered friends will love."
        variant="orange"
      />

      <FeaturedProducts
        category="dogs"
        title="Best Dog Products"
        description="Shop our selection of high-quality dog food, toys, and accessories for your canine companion."
        variant="purple"
      />

      {/* About Us Section */}
      <AboutSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Contact Us Section */}
      <ContactSection />

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  )
}
