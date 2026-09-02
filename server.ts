import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import app from "./server/src/app";
import { startScheduledJobs } from "./server/src/jobs/scheduler";

const PORT = 3000;

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: "0.0.0.0", port: PORT },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mentor Assistant AI listening on port ${PORT} [http://0.0.0.0:${PORT}]`);
    try {
      startScheduledJobs();
    } catch (err) {
      console.warn("Scheduler start notice:", err);
    }
  });
}

startServer();
