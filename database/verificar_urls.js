const https = require("https");

const candidatosVideo = [
  "https://videos.pexels.com/video-files/3509/3509-hd_1920_1080_25fps.mp4",
  "https://videos.pexels.com/video-files/5702/5702-hd_1920_1080_25fps.mp4",
  "https://videos.pexels.com/video-files/855263/855263-hd_1920_1080_25fps.mp4",
];

const candidatosImagenes = [
  "https://images.pexels.com/photos/302853/pexels-photo-302853.jpeg",
  "https://images.pexels.com/photos/373763/pexels-photo-373763.jpeg",
  "https://images.pexels.com/photos/374616/pexels-photo-374616.jpeg",
  "https://images.pexels.com/photos/374624/pexels-photo-374624.jpeg",
];

function verificarUrl(url) {
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
  console.log("=== VERIFICACIÓN DE VIDEOS DE CAFÉ ===\n");
  for (const url of candidatosVideo) {
    const r = await verificarUrl(url);
    console.log(`${r.ok ? "✅" : "❌"} ${r.status} ${url}`);
  }

  console.log("\n=== VERIFICACIÓN DE IMÁGENES DE CAFÉ ===\n");
  for (const url of candidatosImagenes) {
    const r = await verificarUrl(url);
    console.log(`${r.ok ? "✅" : "❌"} ${r.status} ${url}`);
  }
}

run();
