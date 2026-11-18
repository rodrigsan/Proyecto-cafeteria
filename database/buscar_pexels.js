const https = require("https");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
        },
        timeout: 15000,
      },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve({ status: res.statusCode, body: data }));
      }
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Timeout"));
    });
  });
}

function extraerUrlsImagenes(html) {
  // Buscar URLs de images.pexels.com en el HTML
  const regex = /https:\/\/images\.pexels\.com\/photos\/\d+\/pexels-photo-\d+\.(jpeg|jpg|png)/g;
  const urls = [...new Set(html.match(regex) || [])];
  return urls;
}

function extraerUrlsVideos(html) {
  // Buscar URLs de videos.pexels.com en el HTML
  const regex = /https:\/\/videos\.pexels\.com\/video-files\/\d+\/[^"' ]+\.mp4/g;
  const urls = [...new Set(html.match(regex) || [])];
  return urls;
}

async function verificarUrl(url) {
  return new Promise((resolve) => {
    const req = https.request(
      url,
      {
        method: "HEAD",
        timeout: 10000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      },
      (res) => {
        resolve({ url, status: res.statusCode, ok: res.statusCode === 200 });
      }
    );
    req.on("error", () => resolve({ url, status: "ERROR", ok: false }));
    req.on("timeout", () => {
      req.destroy();
      resolve({ url, status: "TIMEOUT", ok: false });
    });
    req.end();
  });
}

async function run() {
  console.log("=== BÚSQUEDA DE CONTENIDO DE CAFÉ EN PEXELS ===\n");

  // 1. Buscar videos de café
  console.log("--- Buscando videos de café ---");
  try {
    const videoHtml = await fetchUrl(
      "https://www.pexels.com/search/videos/coffee/"
    );
    const videoUrls = extraerUrlsVideos(videoHtml.body);
    console.log(`Videos encontrados en HTML: ${videoUrls.length}`);
    videoUrls.slice(0, 5).forEach((u) => console.log("  -", u));
  } catch (e) {
    console.log("Error buscando videos:", e.message);
  }

  // 2. Buscar imágenes de café
  console.log("\n--- Buscando imágenes de café ---");
  try {
    const imgHtml = await fetchUrl("https://www.pexels.com/search/coffee/");
    const imgUrls = extraerUrlsImagenes(imgHtml.body);
    console.log(`Imágenes encontradas en HTML: ${imgUrls.length}`);
    imgUrls.slice(0, 10).forEach((u) => console.log("  -", u));
  } catch (e) {
    console.log("Error buscando imágenes:", e.message);
  }

  console.log("\n=== BÚSQUEDA COMPLETADA ===");
}

run();
