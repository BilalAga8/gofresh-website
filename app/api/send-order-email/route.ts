import { Resend } from "resend";
import { NextResponse } from "next/server";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type OrderEmailPayload = {
  toEmail: string;
  emri: string;
  mbiemri: string;
  orderId: string;
  items: OrderItem[];
  total: number;
  adresa: string;
};

export async function POST(req: Request) {
  try {
    const body: OrderEmailPayload = await req.json();
    const { toEmail, emri, mbiemri, orderId, items, total, adresa } = body;

    const itemsHtml = items
      .map(
        (item) =>
          `<tr>
            <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">${item.name}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">x${item.quantity}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;">${(item.price * item.quantity).toFixed(2)} €</td>
          </tr>`
      )
      .join("");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <div style="background:linear-gradient(135deg,#16a34a,#4ade80);padding:32px 24px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;">🌱 Agro Fresh</h1>
          <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Porosia juaj u konfirmua!</p>
        </div>

        <div style="padding:28px 24px;">
          <p style="color:#374151;font-size:16px;margin:0 0 4px;">Përshëndetje, <strong>${emri} ${mbiemri}</strong>!</p>
          <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">Faleminderit për porosinë. Porosia juaj u regjistrua me sukses.</p>

          <div style="background:#f9fafb;border-radius:12px;padding:16px;margin-bottom:20px;">
            <p style="margin:0;font-size:13px;color:#6b7280;">Numri i porosisë</p>
            <p style="margin:4px 0 0;font-size:15px;font-weight:700;color:#111827;">#${orderId.slice(0, 8).toUpperCase()}</p>
          </div>

          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <thead>
              <tr style="background:#f3f4f6;">
                <th style="padding:10px 12px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Produkti</th>
                <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Sasia</th>
                <th style="padding:10px 12px;text-align:right;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Çmimi</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding:12px;font-weight:700;font-size:15px;color:#111827;">Totali</td>
                <td style="padding:12px;text-align:right;font-weight:700;font-size:16px;color:#16a34a;">${total.toFixed(2)} €</td>
              </tr>
            </tfoot>
          </table>

          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;margin-bottom:24px;">
            <p style="margin:0;font-size:13px;color:#15803d;font-weight:600;">📍 Adresa e dorëzimit</p>
            <p style="margin:4px 0 0;font-size:14px;color:#374151;">${adresa}</p>
          </div>

          <p style="color:#6b7280;font-size:13px;text-align:center;margin:0;">
            Do ju kontaktojmë së shpejti për konfirmimin e dorëzimit.<br/>
            Për çdo pyetje: <a href="mailto:info@agrofresh.al" style="color:#16a34a;">info@agrofresh.al</a>
          </p>
        </div>

        <div style="background:#f9fafb;padding:16px;text-align:center;border-top:1px solid #f0f0f0;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">© 2026 Agro Fresh. Tiranë, Shqipëri.</p>
        </div>
      </div>
    `;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "Agro Fresh <onboarding@resend.dev>",
      to: toEmail,
      subject: `✅ Porosia #${orderId.slice(0, 8).toUpperCase()} u konfirmua — Agro Fresh`,
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
