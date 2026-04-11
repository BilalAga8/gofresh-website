import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kushtet e Përdorimit",
  description: "Kushtet dhe rregullat e përdorimit të faqes Agro Fresh.",
};

export default function KushtetPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Kushtet e Përdorimit</h1>
        <p className="text-sm text-gray-400 mb-8">Përditësuar: Prill 2026</p>

        <div className="space-y-8 text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">1. Pranimi i Kushteve</h2>
            <p>Duke përdorur faqen e internetit të Agro Fresh, ju pranoni plotësisht këto kushte përdorimi. Nëse nuk jeni dakord, ju lutemi mos e përdorni faqen.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">2. Shërbimet Tona</h2>
            <p>Agro Fresh ofron shitje online të produkteve bujqësore dhe ushqimore. Ne rezervojmë të drejtën të ndryshojmë, pezullojmë ose ndërpresim çdo shërbim në çdo kohë pa njoftim paraprak.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">3. Llogaritë e Përdoruesve</h2>
            <p>Ju jeni përgjegjës për ruajtjen e konfidencialitetit të kredencialeve të llogarisë suaj. Agro Fresh nuk mban përgjegjësi për çdo humbje që rrjedh nga aksesi i paautorizuar në llogarinë tuaj.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">4. Porositë dhe Pagesat</h2>
            <p>Të gjitha porositë i nënshtrohen disponibilitetit të produkteve. Ne rezervojmë të drejtën të refuzojmë ose anulojmë çdo porosi. Çmimet mund të ndryshojnë pa njoftim paraprak.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">5. Dorëzimi</h2>
            <p>Agro Fresh bën çmos për të respektuar afatet e dorëzimit. Megjithatë, nuk garantojmë dorëzim në kohë të caktuar dhe nuk mbajmë përgjegjësi për vonesa të shkaktuara nga faktorë të jashtëm.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">6. Kthimi i Produkteve</h2>
            <p>Produktet ushqimore nuk pranohen për kthim pas dorëzimit, me përjashtim të rasteve kur produkti është i dëmtuar ose nuk korrespondon me porosinë. Në rast problemi, kontaktoni brenda 24 orëve.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">7. Pronësia Intelektuale</h2>
            <p>Të gjitha imazhet, tekstet dhe materialet e tjera në këtë faqe janë pronë e Agro Fresh dhe mbrohen nga ligjet e pronësisë intelektuale. Ndalohet kopjimi pa leje.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">8. Ndryshimet e Kushteve</h2>
            <p>Agro Fresh rezervon të drejtën të ndryshojë këto kushte në çdo kohë. Vazhdimi i përdorimit të faqes pas ndryshimeve nënkupton pranimin e kushteve të reja.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">9. Kontakti</h2>
            <p>Për çdo pyetje lidhur me këto kushte, na kontaktoni në: <a href="mailto:bilalaga097@gmail.com" className="text-green-600 hover:underline">bilalaga097@gmail.com</a></p>
          </section>

        </div>
      </div>
    </div>
  );
}
