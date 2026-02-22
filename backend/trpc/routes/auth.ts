import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";

export const authRouter = createTRPCRouter({
  googleSignIn: publicProcedure
    .input(
      z.object({
        accessToken: z.string(),
        role: z.enum(["user", "pandit", "admin"]).default("user"),
      })
    )
    .mutation(async ({ input }) => {
      console.log("[Auth] Google sign-in attempt with role:", input.role);

      const userInfoResponse = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${input.accessToken}` },
        }
      );

      if (!userInfoResponse.ok) {
        console.error("[Auth] Failed to verify Google token");
        throw new Error("Invalid Google access token");
      }

      const googleUser = (await userInfoResponse.json()) as {
        sub: string;
        email: string;
        name: string;
        picture?: string;
        email_verified?: boolean;
      };

      console.log("[Auth] Google user verified:", googleUser.email);

      const user = {
        id: `google_${googleUser.sub}`,
        name: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.picture ?? null,
        role: input.role as "user" | "pandit" | "admin",
        verified: googleUser.email_verified ?? false,
        createdAt: new Date().toISOString(),
      };

      return {
        user,
        token: `session_${Date.now()}_${googleUser.sub}`,
      };
    }),

  emailLogin: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      console.log("[Auth] Email login attempt:", input.email);

      const user = {
        id: `email_${Date.now()}`,
        name: input.email.split("@")[0],
        email: input.email,
        avatar: null,
        role: "user" as const,
        verified: false,
        createdAt: new Date().toISOString(),
      };

      return {
        user,
        token: `session_${Date.now()}_email`,
      };
    }),

  emailRegister: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        password: z.string().min(6),
        role: z.enum(["user", "pandit", "admin"]).default("user"),
      })
    )
    .mutation(async ({ input }) => {
      console.log("[Auth] Email register attempt:", input.email, "role:", input.role);

      const user = {
        id: `email_${Date.now()}`,
        name: input.name,
        email: input.email,
        phone: input.phone,
        avatar: null,
        role: input.role as "user" | "pandit" | "admin",
        verified: false,
        createdAt: new Date().toISOString(),
      };

      return {
        user,
        token: `session_${Date.now()}_email`,
      };
    }),

  getProfile: publicProcedure.query(async ({ ctx }) => {
    console.log("[Auth] Get profile, token:", ctx.token ? "present" : "missing");

    if (!ctx.token) {
      return null;
    }

    return {
      id: "demo",
      name: "Demo User",
      email: "demo@example.com",
      role: "user" as const,
    };
  }),
});
