import { createTRPCRouter } from "./create-context";
import { authRouter } from "./routes/auth";
import { paymentsRouter } from "./routes/payments";
import { dataRouter } from "./routes/data";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  payments: paymentsRouter,
  data: dataRouter,
});

export type AppRouter = typeof appRouter;
