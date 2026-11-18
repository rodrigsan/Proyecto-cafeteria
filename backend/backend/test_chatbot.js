const https = require("https");
const http = require("http");

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      "http://127.0.0.1:3000" + path,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => resolve({ status: res.statusCode, body }));
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  try {
    const r = await post("/api/chatbot", { prompt: "Hola, que precios tienen?" });
    console.log("Status:", r.status);
    console.log("Respuesta:", r.body);
  } catch (e) {
    console.error("Error:", e.message);
  }
}

run();
