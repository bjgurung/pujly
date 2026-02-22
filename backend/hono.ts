import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

const app = new Hono();

app.use("*", cors());

app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
  })
);

app.get("/", (c) => {
  return c.json({ status: "ok", message: "PujariSewa API is running" });
});

app.get("/payment-success", (c) => {
  const sessionId = c.req.query("session_id");
  console.log("[Payment] Success callback, session:", sessionId);
  return c.html(`
    <html>
      <head><title>Payment Successful</title></head>
      <body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:system-ui;background:#FAFAF8;">
        <div style="text-align:center;padding:40px;">
          <div style="font-size:64px;margin-bottom:16px;">✅</div>
          <h1 style="color:#1A1A2E;margin-bottom:8px;">Payment Successful!</h1>
          <p style="color:#6B7280;">You can close this window and return to the app.</p>
        </div>
      </body>
    </html>
  `);
});

app.get("/payment-cancel", (c) => {
  return c.html(`
    <html>
      <head><title>Payment Cancelled</title></head>
      <body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:system-ui;background:#FAFAF8;">
        <div style="text-align:center;padding:40px;">
          <div style="font-size:64px;margin-bottom:16px;">❌</div>
          <h1 style="color:#1A1A2E;margin-bottom:8px;">Payment Cancelled</h1>
          <p style="color:#6B7280;">You can close this window and return to the app.</p>
        </div>
      </body>
    </html>
  `);
});

export default app;
