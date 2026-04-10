"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ProductList from "../components/ProductList";

function ProduktetContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? undefined;

  return <ProductList title="Të gjitha Produktet" category={category} />;
}

export default function ProduktetPage() {
  return (
    <Suspense fallback={<div className="pt-24 text-center">Duke ngarkuar...</div>}>
      <ProduktetContent />
    </Suspense>
  );
}
