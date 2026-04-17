"use client";

import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

type Lang = "sq" | "en";

const faqs: Record<Lang, { q: string; a: string }[]> = {
  sq: [
    {
      q: "Si mund të bëj një porosi?",
      a: "Zgjidhni produktet nga faqja 'Produktet', shtojini në shportë dhe ndiqni hapat e checkout-it. Pas konfirmimit do të merrni një email me detajet e porosisë.",
    },
    {
      q: "Cilat zona mbulon dërgesa?",
      a: "Aktualisht dërgojmë brenda Tiranës dhe zonave të afërta. Për zona të tjera ju lutemi na kontaktoni direkt.",
    },
    {
      q: "Sa kohë zgjat dërgesa?",
      a: "Dorëzimi bëhet brenda 24–48 orëve nga konfirmimi i porosisë. Për porosi urgjente mund të na kontaktoni.",
    },
    {
      q: "A janë produktet 100% natyrale?",
      a: "Po. Të gjitha produktet tona rriten pa pesticide dhe kimikate artificiale, direkt nga ferma jonë familjare.",
    },
    {
      q: "Si mund të anuloj ose ndryshoj një porosi?",
      a: "Mund të na kontaktoni brenda 2 orëve nga porosia. Pas fillimit të përgatitjes nuk mund të bëhen ndryshime.",
    },
    {
      q: "Cilat janë mënyrat e pagesës?",
      a: "Aktualisht pranojmë pagesë me para në dorë gjatë dorëzimit (Cash on Delivery).",
    },
    {
      q: "Si mund të krijoj llogari?",
      a: "Klikoni 'Regjistrohu' në navbar, plotësoni formularin dhe konfirmoni emailin tuaj. Llogaria krijohet menjëherë.",
    },
    {
      q: "Çfarë bëj nëse produkti ka problem?",
      a: "Na kontaktoni brenda 24 orëve nga dorëzimi me foto të produktit. Do ta zëvendësojmë ose rimbursojmë plotësisht.",
    },
  ],
  en: [
    {
      q: "How can I place an order?",
      a: "Browse products on the 'Products' page, add them to your cart, and follow the checkout steps. You will receive a confirmation email with your order details.",
    },
    {
      q: "Which areas do you deliver to?",
      a: "We currently deliver within Tirana and nearby areas. For other locations please contact us directly.",
    },
    {
      q: "How long does delivery take?",
      a: "Delivery is made within 24–48 hours of order confirmation. For urgent orders please contact us.",
    },
    {
      q: "Are the products 100% natural?",
      a: "Yes. All our products are grown without pesticides or artificial chemicals, directly from our family farm.",
    },
    {
      q: "How can I cancel or change an order?",
      a: "You can contact us within 2 hours of placing the order. Once preparation begins, changes cannot be made.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We currently accept Cash on Delivery.",
    },
    {
      q: "How do I create an account?",
      a: "Click 'Register' in the navbar, fill out the form, and confirm your email. Your account is created instantly.",
    },
    {
      q: "What should I do if a product has an issue?",
      a: "Contact us within 24 hours of delivery with a photo of the product. We will fully replace or refund it.",
    },
  ],
};

export default function FAQPage() {
  const [lang, setLang] = useState<Lang>("sq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header + lang toggle */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">
              {lang === "sq" ? "Pyetje të Shpeshta" : "Frequently Asked Questions"}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {lang === "sq"
                ? "Gjeni përgjigjet për pyetjet më të zakonshme."
                : "Find answers to the most common questions."}
            </p>
          </div>
          <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setLang("sq")}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
                lang === "sq"
                  ? "bg-green-600 text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              SQ
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
                lang === "en"
                  ? "bg-green-600 text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs[lang].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left text-gray-800 font-semibold hover:bg-gray-50 transition"
              >
                <span>{item.q}</span>
                {openIndex === i ? (
                  <FaChevronUp className="text-green-600 flex-shrink-0 ml-3" />
                ) : (
                  <FaChevronDown className="text-gray-400 flex-shrink-0 ml-3" />
                )}
              </button>
              {openIndex === i && (
                <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
