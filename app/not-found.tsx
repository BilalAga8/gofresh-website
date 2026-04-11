import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🌿</div>
        <h1 className="text-6xl font-extrabold text-green-600 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Faqja nuk u gjet</h2>
        <p className="text-gray-500 mb-8">
          Faqja që po kërkoni nuk ekziston ose është zhvendosur.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
          >
            Kthehu në Home
          </Link>
          <Link
            href="/produktet"
            className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
          >
            Shiko Produktet
          </Link>
        </div>
      </div>
    </div>
  );
}
