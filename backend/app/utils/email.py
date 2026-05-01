"""
Email utility - sends verification codes via SendGrid API
"""
import random
import string
from datetime import datetime, timedelta
import httpx
from app.core.config import settings

# In-memory store: { email: { code, expires_at } }
_pending_codes: dict[str, dict] = {}

CODE_EXPIRE_MINUTES = 10


def generate_code(length: int = 6) -> str:
    return "".join(random.choices(string.digits, k=length))


def save_code(email: str, code: str) -> None:
    _pending_codes[email.lower()] = {
        "code": code,
        "expires_at": datetime.utcnow() + timedelta(minutes=CODE_EXPIRE_MINUTES),
    }


def verify_code(email: str, code: str) -> bool:
    entry = _pending_codes.get(email.lower())
    if not entry:
        return False
    if datetime.utcnow() > entry["expires_at"]:
        _pending_codes.pop(email.lower(), None)
        return False
    if entry["code"] != code:
        return False
    _pending_codes.pop(email.lower(), None)
    return True


def _build_html(code: str) -> str:
    return f"""
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0"
             style="background:#ffffff;border-radius:16px;overflow:hidden;
                    box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0D1B4B 0%,#00B89C 100%);
                     padding:32px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;
                       letter-spacing:-0.5px;">Finanzy</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:14px;">
              Control Financiero Total
            </p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px 32px;text-align:center;">
            <h2 style="margin:0 0 8px;color:#0D1B4B;font-size:20px;">
              Código de verificación
            </h2>
            <p style="margin:0 0 32px;color:#64748b;font-size:15px;">
              Usa el siguiente código para confirmar tu cuenta.<br>
              Expira en <strong>{CODE_EXPIRE_MINUTES} minutos</strong>.
            </p>
            <div style="display:inline-block;background:#f8fafc;border:2px solid #00B89C;
                        border-radius:12px;padding:20px 40px;">
              <span style="font-size:40px;font-weight:800;letter-spacing:12px;
                           color:#0D1B4B;font-family:monospace;">{code}</span>
            </div>
            <p style="margin:32px 0 0;color:#94a3b8;font-size:13px;">
              Si no solicitaste esto, ignora este correo.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:20px 32px;text-align:center;
                     border-top:1px solid #e2e8f0;">
            <p style="margin:0;color:#94a3b8;font-size:12px;">
              © 2026 Finanzy · Control a tu medida
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
"""


def send_verification_email(to_email: str, code: str) -> bool:
    """Send verification code email via SendGrid API."""

    # ── 1. SendGrid API ───────────────────────────────────────────────────────
    if settings.SENDGRID_API_KEY:
        from_addr = settings.FROM_EMAIL or "noreply@finanzy.app"
        try:
            resp = httpx.post(
                "https://api.sendgrid.com/v3/mail/send",
                headers={
                    "Authorization": f"Bearer {settings.SENDGRID_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "personalizations": [{"to": [{"email": to_email}]}],
                    "from": {"email": from_addr, "name": settings.FROM_NAME},
                    "subject": f"{code} es tu código de Finanzy",
                    "content": [{"type": "text/html", "value": _build_html(code)}],
                },
                timeout=15,
            )
            if resp.status_code == 202:
                print(f"[EMAIL] Sent via SendGrid to {to_email}")
                return True
            print(f"[EMAIL ERROR] SendGrid responded {resp.status_code}: {resp.text}")
        except Exception as e:
            print(f"[EMAIL ERROR] SendGrid exception: {e}")
        return False

    # ── 2. Dev mode ───────────────────────────────────────────────────────────
    print(f"\n{'='*40}")
    print(f"[DEV] Verification code for {to_email}: {code}")
    print(f"{'='*40}\n")
    return True
