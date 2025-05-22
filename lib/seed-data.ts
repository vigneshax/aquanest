import { createServerSupabaseClient } from "@/lib/supabase"

export async function seedProducts() {
  const supabase = createServerSupabaseClient()

  // Check if products already exist
  const { count, error: countError } = await supabase.from("products").select("*", { count: "exact", head: true })

  if (countError) {
    console.error("Error checking products count:", countError)
    return
  }

  // If products already exist, don't seed
  if (count && count > 0) {
    console.log("Products already seeded")
    return
  }

  // Sample products data
  const products = [
    // Fish Category
    {
      name: "Tropical Fish Food Flakes",
      price: 249.99,
      tag: "Bestseller",
      category: "fish",
      description: "Premium quality flakes for all tropical fish. Rich in nutrients and enhances color.",
      rating: 4.8,
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Aquarium Filter System",
      price: 1299.99,
      tag: "New",
      category: "fish",
      description: "Advanced 3-stage filtration system for crystal clear water. Suitable for tanks up to 100 liters.",
      rating: 4.5,
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "LED Aquarium Light",
      price: 899.99,
      category: "fish",
      description: "Full spectrum LED light with day/night modes. Promotes plant growth and enhances fish colors.",
      rating: 4.7,
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Aquarium Decorative Plants",
      price: 349.99,
      category: "fish",
      description: "Set of 5 realistic artificial plants. Safe for all fish and creates natural hiding spots.",
      rating: 4.3,
      image: "/placeholder.svg?height=300&width=300",
    },

    // Birds Category
    {
      name: "Premium Bird Seed Mix",
      price: 199.99,
      tag: "Organic",
      category: "birds",
      description: "Nutritious blend of seeds, nuts, and dried fruits. Perfect for parakeets, canaries, and finches.",
      rating: 4.9,
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Bird Cage Deluxe",
      price: 2499.99,
      category: "birds",
      description: "Spacious cage with multiple perches, feeding stations, and play areas. Easy to clean.",
      rating: 4.6,
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Bird Toys Variety Pack",
      price: 349.99,
      tag: "Sale",
      category: "birds",
      description: "Set of 10 colorful toys to keep your birds entertained. Includes bells, ladders, and swings.",
      rating: 4.4,
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Bird Bath Fountain",
      price: 599.99,
      category: "birds",
      description: "Automatic fountain with clean water circulation. Encourages birds to bathe regularly.",
      rating: 4.2,
      image: "/placeholder.svg?height=300&width=300",
    },

    // Dogs Category
    {
      name: "Premium Dry Dog Food",
      price: 899.99,
      tag: "Grain-Free",
      category: "dogs",
      description: "High-protein formula with real meat as the first ingredient. No artificial preservatives.",
      rating: 4.8,
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Orthopedic Dog Bed",
      price: 1499.99,
      category: "dogs",
      description: "Memory foam bed that provides joint support. Removable, machine-washable cover.",
      rating: 4.7,
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Interactive Dog Toy",
      price: 399.99,
      tag: "Bestseller",
      category: "dogs",
      description: "Treat-dispensing toy that challenges your dog mentally. Adjustable difficulty levels.",
      rating: 4.5,
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Reflective Dog Collar",
      price: 249.99,
      category: "dogs",
      description: "Durable nylon collar with reflective stitching for night visibility. Adjustable size.",
      rating: 4.6,
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  // Insert products
  const { error: insertError } = await supabase.from("products").insert(products)

  if (insertError) {
    console.error("Error seeding products:", insertError)
    return
  }

  console.log("Products seeded successfully")
}
