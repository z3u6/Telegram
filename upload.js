import Busboy from "busboy";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ error: "Telegram environment variables are not configured." });
  }

  try {
    const bb = Busboy({
      headers: req.headers,
      limits: { fileSize: 10 * 1024 * 1024, files: 1 }
    });

    let photoBuffer = null;
    let photoMime = "image/jpeg";
    let tooLarge = false;

    bb.on("file", (name, file, info) => {
      if (name !== "photo") {
        file.resume();
        return;
      }

      photoMime = info.mimeType || "image/jpeg";
      const chunks = [];

      file.on("data", chunk => chunks.push(chunk));
      file.on("limit", () => { tooLarge = true; });
      file.on("end", () => {
        photoBuffer = Buffer.concat(chunks);
      });
    });

    await new Promise((resolve, reject) => {
      bb.on("finish", resolve);
      bb.on("error", reject);
      req.pipe(bb);
    });

    if (tooLarge) {
      return res.status(413).json({ error: "Photo is too large." });
    }

    if (!photoBuffer) {
      return res.status(400).json({ error: "No photo received." });
    }

    const form = new FormData();
    form.append("chat_id", chatId);
    form.append(
      "photo",
      new Blob([photoBuffer], { type: photoMime }),
      "selfie.jpg"
    );

    const telegram = await fetch(
      `https://api.telegram.org/bot${token}/sendPhoto`,
      { method: "POST", body: form }
    );

    const result = await telegram.json();

    if (!telegram.ok || !result.ok) {
      console.error(result);
      return res.status(502).json({ error: "Telegram rejected the photo." });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error." });
  }
}
