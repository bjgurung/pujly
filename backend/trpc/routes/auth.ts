import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";
import { supabaseAdmin } from "../../lib/supabase";

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

      const { data: existingUsers, error: lookupError } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("email", googleUser.email)
        .limit(1);

      if (lookupError) {
        console.error("[Auth] Supabase lookup error:", lookupError);
      }

      let dbUser = existingUsers?.[0];

      if (!dbUser) {
        console.log("[Auth] Creating new user in Supabase for:", googleUser.email);

        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: googleUser.email,
          email_confirm: true,
          user_metadata: {
            name: googleUser.name,
            avatar_url: googleUser.picture,
            provider: "google",
          },
        });

        if (authError) {
          console.error("[Auth] Supabase auth create error:", authError);
          if (authError.message?.includes("already been registered")) {
            const { data: existingAuth } = await supabaseAdmin.auth.admin.listUsers();
            const found = existingAuth?.users?.find(u => u.email === googleUser.email);
            if (found) {
              const { data: insertedUser, error: insertError } = await supabaseAdmin
                .from("users")
                .upsert({
                  id: found.id,
                  email: googleUser.email,
                  name: googleUser.name,
                  avatar: googleUser.picture || null,
                  role: input.role,
                  provider: "google",
                  google_id: googleUser.sub,
                  verified: googleUser.email_verified ?? false,
                  created_at: new Date().toISOString(),
                })
                .select()
                .single();

              if (insertError) {
                console.error("[Auth] Supabase insert error:", insertError);
              }
              dbUser = insertedUser;
            }
          }
          if (!dbUser) {
            throw new Error("Failed to create user account");
          }
        } else if (authUser?.user) {
          const { data: insertedUser, error: insertError } = await supabaseAdmin
            .from("users")
            .insert({
              id: authUser.user.id,
              email: googleUser.email,
              name: googleUser.name,
              avatar: googleUser.picture || null,
              role: input.role,
              provider: "google",
              google_id: googleUser.sub,
              verified: googleUser.email_verified ?? false,
              created_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (insertError) {
            console.error("[Auth] Supabase user insert error:", insertError);
          }
          dbUser = insertedUser;
        }
      }

      const user = {
        id: dbUser?.id || `google_${googleUser.sub}`,
        name: dbUser?.name || googleUser.name,
        email: dbUser?.email || googleUser.email,
        avatar: dbUser?.avatar || googleUser.picture || null,
        role: (dbUser?.role || input.role) as "user" | "pandit" | "admin",
        verified: dbUser?.verified ?? googleUser.email_verified ?? false,
        createdAt: dbUser?.created_at || new Date().toISOString(),
      };

      console.log("[Auth] Google sign-in success:", user.email, "id:", user.id);

      return {
        user,
        token: `session_${Date.now()}_${user.id}`,
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

      const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (authError) {
        console.error("[Auth] Login error:", authError.message);
        throw new Error(authError.message || "Invalid email or password");
      }

      const { data: dbUser } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      const user = {
        id: dbUser?.id || authData.user.id,
        name: dbUser?.name || authData.user.user_metadata?.name || input.email.split("@")[0],
        email: dbUser?.email || authData.user.email || input.email,
        avatar: dbUser?.avatar || null,
        role: (dbUser?.role || "user") as "user" | "pandit" | "admin",
        verified: dbUser?.verified ?? false,
        createdAt: dbUser?.created_at || new Date().toISOString(),
      };

      console.log("[Auth] Login success:", user.email);

      return {
        user,
        token: authData.session?.access_token || `session_${Date.now()}_${user.id}`,
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

      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: input.email,
        password: input.password,
        email_confirm: true,
        user_metadata: {
          name: input.name,
          phone: input.phone,
        },
      });

      if (authError) {
        console.error("[Auth] Registration error:", authError.message);
        throw new Error(authError.message || "Registration failed");
      }

      const { data: dbUser, error: insertError } = await supabaseAdmin
        .from("users")
        .insert({
          id: authData.user.id,
          name: input.name,
          email: input.email,
          phone: input.phone || null,
          avatar: null,
          role: input.role,
          provider: "email",
          verified: false,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        console.error("[Auth] User insert error:", insertError);
      }

      const user = {
        id: dbUser?.id || authData.user.id,
        name: dbUser?.name || input.name,
        email: dbUser?.email || input.email,
        phone: dbUser?.phone || input.phone,
        avatar: null,
        role: (dbUser?.role || input.role) as "user" | "pandit" | "admin",
        verified: false,
        createdAt: dbUser?.created_at || new Date().toISOString(),
      };

      console.log("[Auth] Registration success:", user.email);

      return {
        user,
        token: `session_${Date.now()}_${user.id}`,
      };
    }),

  getProfile: publicProcedure.query(async ({ ctx }) => {
    console.log("[Auth] Get profile, token:", ctx.token ? "present" : "missing");

    if (!ctx.token) {
      return null;
    }

    const userId = ctx.token.split("_").pop();
    if (!userId) return null;

    const { data: dbUser } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (!dbUser) return null;

    return {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      phone: dbUser.phone,
      avatar: dbUser.avatar,
      role: dbUser.role as "user" | "pandit" | "admin",
      verified: dbUser.verified,
    };
  }),

  updateProfile: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        name: z.string().optional(),
        phone: z.string().optional(),
        avatar: z.string().optional(),
        bio: z.string().optional(),
        location: z.string().optional(),
        languages: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      console.log("[Auth] Updating profile for:", input.userId);

      const updateData: Record<string, unknown> = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.phone !== undefined) updateData.phone = input.phone;
      if (input.avatar !== undefined) updateData.avatar = input.avatar;
      if (input.bio !== undefined) updateData.bio = input.bio;
      if (input.location !== undefined) updateData.location = input.location;
      if (input.languages !== undefined) updateData.languages = input.languages;

      const { data, error } = await supabaseAdmin
        .from("users")
        .update(updateData)
        .eq("id", input.userId)
        .select()
        .single();

      if (error) {
        console.error("[Auth] Profile update error:", error);
        throw new Error("Failed to update profile");
      }

      console.log("[Auth] Profile updated for:", data?.email);
      return data;
    }),
});
