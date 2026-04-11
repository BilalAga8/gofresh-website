import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import ProductPageClient from "./ProductPageClient";

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabaseServer.from("products").select("name, category, image").eq("id", id).single();

  if (!data) {
    return { title: "Produkt | Agro Fresh" };
  }

  const description = `Bli ${data.name} të freskët direkt nga ferma. Dërgesa brenda 24 orëve në Tiranë.`;

  return {
    title: `${data.name} | Agro Fresh`,
    description,
    openGraph: {
      title: `${data.name} | Agro Fresh`,
      description,
      images: data.image ? [{ url: data.image }] : [],
    },
  };
}

export default function ProductPage() {
  return <ProductPageClient />;
}
