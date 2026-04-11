import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Agro Fresh collects, uses and protects your personal data.",
};

export default function PrivatesiaPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: April 2026</p>

        <div className="space-y-8 text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">1. Who We Are</h2>
            <p>Agro Fresh is a family-owned farm based in Tirana, Albania. Our website is <strong>gofresh-website.vercel.app</strong>. For any privacy-related inquiries, contact us at: <a href="mailto:bilalaga097@gmail.com" className="text-green-600 hover:underline">bilalaga097@gmail.com</a></p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account information:</strong> first name, last name, email address, phone number</li>
              <li><strong>Order information:</strong> delivery address, ordered products, order history</li>
              <li><strong>Technical data:</strong> IP address, browser type, pages visited (via Vercel Analytics)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To process and fulfill your orders</li>
              <li>To send order confirmation and status emails</li>
              <li>To improve our products and services</li>
              <li>To contact you regarding issues with your order</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">4. Data Storage</h2>
            <p>Your data is securely stored using <strong>Supabase</strong> (servers located in Europe). Passwords are never stored in plain text — we use full encryption. We retain your data for as long as your account is active or as needed to provide services.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">5. Cookies</h2>
            <p>We use only essential cookies required for account functionality and the shopping cart. We do not use third-party advertising or tracking cookies.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">6. Third-Party Services</h2>
            <p>We do not sell or share your personal data with third parties, except with the following service providers who help us operate our platform:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Supabase</strong> — database and authentication</li>
              <li><strong>Resend</strong> — transactional email delivery</li>
              <li><strong>Vercel</strong> — website hosting and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="mt-2">To exercise these rights, contact us at: <a href="mailto:bilalaga097@gmail.com" className="text-green-600 hover:underline">bilalaga097@gmail.com</a></p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">8. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, or alteration. However, no method of transmission over the internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">9. Children&apos;s Privacy</h2>
            <p>Our services are not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you by email if the changes are significant. The date of the latest revision is always shown at the top of this page.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
