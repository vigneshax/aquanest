import { Suspense } from "react"
import ProductsGrid from "@/components/products-grid"
import { ShoppingBag } from "lucide-react"

export default function AllProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-4">
        <ShoppingBag className="h-6 w-6 text-primary-500" />
        <h1 className="text-3xl font-bold ml-2">All Products</h1>
      </div>
      <p className="text-gray-600 mb-8 max-w-3xl">
        Browse our complete collection of high-quality products for fish, birds, and dogs.
      </p>

      <Suspense fallback={<div>Loading products...</div>}>
        <ProductsGrid category="" variant="teal" />
      </Suspense>
    </div>
  )
}
