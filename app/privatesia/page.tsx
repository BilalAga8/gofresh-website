import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politika e Privatësisë",
  description: "Si Agro Fresh mbledh, përdor dhe mbron të dhënat tuaja personale.",
};

export default function PrivatesiaPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Politika e Privatësisë</h1>
        <p className="text-sm text-gray-400 mb-8">Përditësuar: Prill 2026</p>

        <div className="space-y-8 text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">1. Kush Jemi</h2>
            <p>Agro Fresh është një fermë familjare me bazë në Tiranë, Shqipëri. Faqja jonë është <strong>gofresh-website.vercel.app</strong>. Kontakt: <a href="mailto:bilalaga097@gmail.com" className="text-green-600 hover:underline">bilalaga097@gmail.com</a></p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">2. Të Dhënat që Mbledhim</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Të dhëna llogarie:</strong> emri, mbiemri, email-i, numri i telefonit</li>
              <li><strong>Të dhëna porosie:</strong> adresa e dorëzimit, produktet e porositura</li>
              <li><strong>Të dhëna teknike:</strong> adresa IP, lloji i shfletuesit (via Vercel Analytics)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">3. Si i Përdorim të Dhënat</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Për të procesuar dhe dorëzuar porositë tuaja</li>
              <li>Për të dërguar email konfirmimi të porosisë</li>
              <li>Për të përmirësuar shërbimet tona</li>
              <li>Për të ju kontaktuar në rast problemi me porosinë</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">4. Ruajtja e të Dhënave</h2>
            <p>Të dhënat tuaja ruhen në mënyrë të sigurt përmes <strong>Supabase</strong> (server në Europë). Fjalëkalimet kurrë nuk ruhen në tekst të qartë — përdorim enkriptim të plotë.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">5. Cookies</h2>
            <p>Faqja përdor cookies të nevojshme për funksionimin e llogarisë dhe shportës. Nuk përdorim cookies reklamuese të palëve të treta.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">6. Ndarja me Palë të Treta</h2>
            <p>Nuk shesim dhe nuk ndajmë të dhënat tuaja me palë të treta, me përjashtim të ofruesve të shërbimeve si:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Supabase</strong> — ruajtja e të dhënave</li>
              <li><strong>Resend</strong> — dërgimi i email-eve</li>
              <li><strong>Vercel</strong> — hosting i faqes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">7. Të Drejtat Tuaja</h2>
            <p>Keni të drejtë të:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Aksesoni të dhënat tuaja personale</li>
              <li>Kërkoni fshirjen e llogarisë dhe të dhënave</li>
              <li>Korrigjoni të dhënat e pasakta</li>
            </ul>
            <p className="mt-2">Për të ushtruar këto të drejta, kontaktoni: <a href="mailto:bilalaga097@gmail.com" className="text-green-600 hover:underline">bilalaga097@gmail.com</a></p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">8. Siguria</h2>
            <p>Marrim masa teknike dhe organizative për të mbrojtur të dhënat tuaja nga aksesi i paautorizuar, humbja ose ndryshimi.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">9. Ndryshimet</h2>
            <p>Mund të përditësojmë këtë politikë herë pas here. Do të njoftoheni me email nëse ndryshimet janë të rëndësishme.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
