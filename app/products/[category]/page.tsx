import { Suspense } from "react"
import { notFound } from "next/navigation"
import ProductsGrid from "@/components/products-grid"
import { Fish, Bird, Dog } from "lucide-react"

type Params = {
  category: string;
};

type PageProps = {
  params: Promise<Params>;
};

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params
  console.log("Category:", category)

  // Validate category
  if (!["fish", "birds", "dogs"].includes(category)) {
    notFound()
  }

  const categoryInfo = {
    fish: {
      title: "Fish & Aquatics",
      description:
        "Discover a wide range of fish species, aquariums, and essential supplies for your underwater friends.",
      icon: <Fish className="h-6 w-6 text-primary-500" />,
      color: "teal",
    },
    birds: {
      title: "Birds & Accessories",
      description: "Find beautiful birds, cages, toys, and nutritious food to keep your feathered friends happy.",
      icon: <Bird className="h-6 w-6 text-primary-500" />,
      color: "orange",
    },
    dogs: {
      title: "Dogs & Supplies",
      description: "Shop premium dog food, toys, accessories, and grooming supplies for your loyal companion.",
      icon: <Dog className="h-6 w-6 text-primary-500" />,
      color: "purple",
    },
  }

  const info = categoryInfo[category as keyof typeof categoryInfo]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-4">
        {info.icon}
        <h1 className="text-3xl font-bold ml-2">{info.title}</h1>
      </div>
      <p className="text-gray-600 mb-8 max-w-3xl">{info.description}</p>

      <Suspense fallback={<div>Loading products...</div>}>
        <ProductsGrid category={category} variant={info.color as "teal" | "orange" | "purple"} />
      </Suspense>
    </div>
  )
}
