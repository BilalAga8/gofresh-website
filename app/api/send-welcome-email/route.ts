import { Resend } from "resend";
import { NextResponse } from "next/server";

type WelcomeEmailPayload = {
  toEmail: string;
  emri: string;
  mbiemri: string;
};

export async function POST(req: Request) {
  try {
    const body: WelcomeEmailPayload = await req.json();
    const { toEmail, emri, mbiemri } = body;

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <div style="background:linear-gradient(135deg,#16a34a,#4ade80);padding:32px 24px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;">🌱 Ferma Fresh</h1>
          <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Mirë se erdhët në familjen tonë!</p>
        </div>

        <div style="padding:32px 24px;">
          <p style="color:#374151;font-size:18px;margin:0 0 8px;">Përshëndetje, <strong>${emri} ${mbiemri}</strong>! 👋</p>
          <p style="color:#6b7280;font-size:15px;margin:0 0 24px;">
            Llogaria juaj u krijua me sukses. Tani mund të shfletoni produktet tona të freskëta dhe të bëni porosi direkt nga ferma.
          </p>

          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin-bottom:24px;">
            <h3 style="margin:0 0 12px;color:#15803d;font-size:15px;">Çfarë mund të bëni tani:</h3>
            <ul style="margin:0;padding-left:20px;color:#374151;font-size:14px;line-height:2;">
              <li>🛒 Shfletoni produktet tona të freskëta</li>
              <li>❤️ Ruani produktet tuaja të preferuara</li>
              <li>📦 Bëni porosi dhe ne i dorëzojmë tek ju</li>
            </ul>
          </div>

          <div style="text-align:center;margin-bottom:24px;">
            <a href="https://fermafresh.com/produktet" style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;">
              Shfletoni Produktet →
            </a>
          </div>

          <p style="color:#6b7280;font-size:13px;text-align:center;margin:0;">
            Për çdo pyetje na kontaktoni:<br/>
            <a href="mailto:info@fermafresh.com" style="color:#16a34a;">info@fermafresh.com</a>
          </p>
        </div>

        <div style="background:#f9fafb;padding:16px;text-align:center;border-top:1px solid #f0f0f0;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">© 2026 Ferma Fresh. Shqipëri.</p>
        </div>
      </div>
    `;

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: "Ferma Fresh <noreply@fermafresh.com>",
      to: toEmail,
      subject: "Mirë se erdhët në Ferma Fresh! 🌱",
      html,
    });

    if (error) {
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
