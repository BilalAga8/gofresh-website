"use client";

import { useSearchParams } from "next/navigation";
import ProductList from "../components/ProductList";

export default function ProduktetClient() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? undefined;

  return <ProductList title="Të gjitha Produktet" category={category} />;
}
