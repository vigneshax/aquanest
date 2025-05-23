// app/product/[id]/page.tsx

import { createServerSupabaseClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/product-detail";

type Params = {
  id: string;
};

type PageProps = {
  params: Params;
};

export default async function ProductPage({ params }: PageProps) {
  const { id } = params;

  const supabase = createServerSupabaseClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
