export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string
): Promise<{ success: boolean; error?: string }> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY || process.env.VITE_TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    return { success: false, error: "Server misconfiguration" };
  }

  if (!token) {
    return { success: false, error: "Missing CAPTCHA token" };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (remoteIp) formData.append("remoteip", remoteIp);

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: formData }
    );

    const data = await res.json();

    if (!data.success) {
      return { success: false, error: "CAPTCHA verification failed" };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: "Could not verify CAPTCHA, please try again" };
  }
}