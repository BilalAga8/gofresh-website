import Link from "next/link";

export default function LoginPage() {
  return (
    <section className="pt-24 px-6 text-center">
      <h1 className="text-3xl font-bold text-green-700 mb-8">Zgjidh Login</h1>

      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <Link
          href="/login-client"
          className="bg-blue-500 text-white px-6 py-4 rounded-lg shadow hover:bg-blue-600 w-64"
        >
          Login Klient
        </Link>

        <Link
          href="/register-client"
          className="bg-green-600 text-white px-6 py-4 rounded-lg shadow hover:bg-green-700 w-64"
        >
          Rregjistrohu si Klient
        </Link>

        <Link
          href="/login-admin"
          className="bg-red-600 text-white px-6 py-4 rounded-lg shadow hover:bg-red-700 w-64 font-bold border-2 border-black"
        >
          Login Admin
        </Link>
      </div>
    </section>
  );
}
