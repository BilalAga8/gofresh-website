import { Resend } from "resend";
import { NextResponse } from "next/server";

type StatusEmailPayload = {
  toEmail: string;
  emri: string;
  mbiemri: string;
  orderId: string;
  status: string;
};

const statusMessages: Record<string, { label: string; description: string; color: string; icon: string }> = {
  confirmed: {
    label: "Porosia u Konfirmua",
    description: "Porosia juaj u konfirmua dhe është duke u përgatitur.",
    color: "#2563eb",
    icon: "✅",
  },
  delivered: {
    label: "Porosia u Dorëzua",
    description: "Porosia juaj u dorëzua me sukses. Faleminderit që zgjodhët Ferma Fresh!",
    color: "#16a34a",
    icon: "🚚",
  },
  cancelled: {
    label: "Porosia u Anulua",
    description: "Porosia juaj u anulua. Për çdo pyetje na kontaktoni.",
    color: "#dc2626",
    icon: "❌",
  },
};

export async function POST(req: Request) {
  try {
    const body: StatusEmailPayload = await req.json();
    const { toEmail, emri, mbiemri, orderId, status } = body;

    const info = statusMessages[status];
    if (!info) return NextResponse.json({ success: false, error: "Status i panjohur" }, { status: 400 });

    const html = `
      <div lang="sq" style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <div style="background:linear-gradient(135deg,#16a34a,#4ade80);padding:32px 24px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;" translate="no">🌱 Ferma Fresh</h1>
          <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Përditësim Porosie</p>
        </div>

        <div style="padding:32px 24px;">
          <p style="color:#374151;font-size:16px;margin:0 0 8px;">Përshëndetje, <strong>${emri} ${mbiemri}</strong>!</p>

          <div style="background:#f9fafb;border-left:4px solid ${info.color};border-radius:8px;padding:16px 20px;margin:20px 0;">
            <p style="margin:0;font-size:18px;font-weight:700;color:${info.color};">${info.icon} ${info.label}</p>
            <p style="margin:8px 0 0;font-size:14px;color:#6b7280;">${info.description}</p>
          </div>

          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;margin-bottom:24px;">
            <p style="margin:0;font-size:13px;color:#15803d;font-weight:600;">Numri i porosisë</p>
            <p style="margin:4px 0 0;font-size:15px;font-weight:700;color:#111827;">#${orderId.slice(0, 8).toUpperCase()}</p>
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
      subject: `${info.icon} ${info.label} — #${orderId.slice(0, 8).toUpperCase()}`,
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
