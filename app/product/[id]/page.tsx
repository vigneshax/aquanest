import { createServerSupabaseClient } from "@/lib/supabase"
import { notFound } from "next/navigation"
import ProductDetail from "@/components/product-detail"
// import { use } from "react";

type Params = {
  id: string;
};

type PageProps = {
  params: Params;
};

export default async function ProductPage({ params }: PageProps) {
  const id = params.id;
  
  const supabase = createServerSupabaseClient()

  const { data: product, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error || !product) {
    notFound()
  }

  return <ProductDetail product={product} />
}
