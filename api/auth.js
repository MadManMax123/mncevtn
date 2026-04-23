export default async function handler(req, res) {
  const { password } = req.body;

  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  if (hashHex === process.env.ADMIN_HASH) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ success: false });
  }
}
