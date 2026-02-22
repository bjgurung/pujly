import { createTRPCRouter } from "./create-context";
import { authRouter } from "./routes/auth";
import { paymentsRouter } from "./routes/payments";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  payments: paymentsRouter,
});

export type AppRouter = typeof appRouter;
