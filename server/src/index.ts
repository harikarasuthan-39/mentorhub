import app from "./app";
import { env } from "./config/env";
import { startScheduledJobs } from "./jobs/scheduler";

app.listen(env.port, () => {
  console.log(`Mentor Assistant API listening on port ${env.port} [${env.nodeEnv}]`);
  startScheduledJobs();
});
