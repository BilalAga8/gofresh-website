"use client";

import { useSearchParams } from "next/navigation";
import ProductList from "../components/ProductList";

export default function ProduktetClient() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const offer = searchParams.get("offer") === "true";

  return (
    <ProductList
      title={offer ? "Ofertat" : "Të gjitha Produktet"}
      category={category}
      onlyDiscounted={offer}
    />
  );
}
