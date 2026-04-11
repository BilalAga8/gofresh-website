import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms and conditions for using the Agro Fresh website.",
};

export default function KushtetPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Terms of Use</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: April 2026</p>

        <div className="space-y-8 text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">1. Acceptance of Terms</h2>
            <p>By accessing or using the Agro Fresh website, you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use our website.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">2. Our Services</h2>
            <p>Agro Fresh provides an online platform for purchasing fresh agricultural and food products. We reserve the right to modify, suspend, or discontinue any service at any time without prior notice.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. Agro Fresh is not liable for any loss resulting from unauthorized access to your account. You must notify us immediately of any breach of security.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">4. Orders and Payments</h2>
            <p>All orders are subject to product availability. We reserve the right to refuse or cancel any order at our discretion. Prices are subject to change without prior notice. Payment is required at the time of ordering.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">5. Delivery</h2>
            <p>Agro Fresh makes every effort to meet estimated delivery times. However, we do not guarantee delivery at a specific time and are not responsible for delays caused by external factors beyond our control.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">6. Returns and Refunds</h2>
            <p>Due to the perishable nature of food products, returns are not accepted after delivery, except in cases where the product is damaged or does not match the order. In such cases, please contact us within 24 hours of delivery.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">7. Intellectual Property</h2>
            <p>All content on this website, including images, text, logos, and graphics, is the property of Agro Fresh and is protected by applicable intellectual property laws. Unauthorized reproduction or use is strictly prohibited.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">8. Limitation of Liability</h2>
            <p>Agro Fresh shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use our services. Our total liability shall not exceed the amount paid for the specific order in question.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">9. Changes to Terms</h2>
            <p>Agro Fresh reserves the right to update these terms at any time. Continued use of the website after any changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">10. Contact</h2>
            <p>For any questions regarding these terms, please contact us at: <a href="mailto:bilalaga097@gmail.com" className="text-green-600 hover:underline">bilalaga097@gmail.com</a></p>
          </section>

        </div>
      </div>
    </div>
  );
}
