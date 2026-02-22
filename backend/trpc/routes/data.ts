import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";
import { supabaseAdmin } from "../../lib/supabase";

export const dataRouter = createTRPCRouter({
  getServices: publicProcedure.query(async () => {
    console.log("[Data] Fetching services");
    const { data, error } = await supabaseAdmin
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Data] Services fetch error:", error);
      return [];
    }
    return data || [];
  }),

  getServiceById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { data, error } = await supabaseAdmin
        .from("services")
        .select("*")
        .eq("id", input.id)
        .single();

      if (error) {
        console.error("[Data] Service fetch error:", error);
        return null;
      }
      return data;
    }),

  getPandits: publicProcedure.query(async () => {
    console.log("[Data] Fetching pandits");
    const { data, error } = await supabaseAdmin
      .from("pandits")
      .select("*")
      .order("rating", { ascending: false });

    if (error) {
      console.error("[Data] Pandits fetch error:", error);
      return [];
    }
    return data || [];
  }),

  getPanditById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { data, error } = await supabaseAdmin
        .from("pandits")
        .select("*")
        .eq("id", input.id)
        .single();

      if (error) {
        console.error("[Data] Pandit fetch error:", error);
        return null;
      }
      return data;
    }),

  getCategories: publicProcedure.query(async () => {
    console.log("[Data] Fetching categories");
    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .order("title", { ascending: true });

    if (error) {
      console.error("[Data] Categories fetch error:", error);
      return [];
    }
    return data || [];
  }),

  getProducts: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        featured: z.boolean().optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      console.log("[Data] Fetching products", input);
      let query = supabaseAdmin.from("products").select("*");

      if (input?.category) {
        query = query.eq("category", input.category);
      }
      if (input?.featured) {
        query = query.eq("featured", true);
      }
      if (input?.search) {
        query = query.or(`name.ilike.%${input.search}%,description.ilike.%${input.search}%`);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        console.error("[Data] Products fetch error:", error);
        return [];
      }
      return data || [];
    }),

  getProductById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { data, error } = await supabaseAdmin
        .from("products")
        .select("*")
        .eq("id", input.id)
        .single();

      if (error) {
        console.error("[Data] Product fetch error:", error);
        return null;
      }
      return data;
    }),

  getProductCategories: publicProcedure.query(async () => {
    console.log("[Data] Fetching product categories");
    const { data, error } = await supabaseAdmin
      .from("product_categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("[Data] Product categories fetch error:", error);
      return [];
    }
    return data || [];
  }),

  getBookings: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      console.log("[Data] Fetching bookings for user:", input.userId);
      const { data, error } = await supabaseAdmin
        .from("bookings")
        .select("*")
        .eq("user_id", input.userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[Data] Bookings fetch error:", error);
        return [];
      }
      return data || [];
    }),

  createBooking: publicProcedure
    .input(
      z.object({
        service_id: z.string(),
        service_title: z.string(),
        pandit_id: z.string(),
        pandit_name: z.string(),
        pandit_image_url: z.string().optional(),
        user_id: z.string(),
        date: z.string(),
        time: z.string(),
        duration: z.number(),
        location: z.string(),
        price: z.number(),
        status: z.string().default("pending"),
        payment_status: z.string().default("pending"),
      })
    )
    .mutation(async ({ input }) => {
      console.log("[Data] Creating booking for service:", input.service_title);

      const { data, error } = await supabaseAdmin
        .from("bookings")
        .insert({
          ...input,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("[Data] Booking create error:", error);
        throw new Error("Failed to create booking");
      }

      console.log("[Data] Booking created:", data?.id);
      return data;
    }),

  updateBookingStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.string(),
        payment_status: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      console.log("[Data] Updating booking status:", input.id, "to", input.status);

      const updateData: Record<string, string> = { status: input.status };
      if (input.payment_status) {
        updateData.payment_status = input.payment_status;
      }

      const { data, error } = await supabaseAdmin
        .from("bookings")
        .update(updateData)
        .eq("id", input.id)
        .select()
        .single();

      if (error) {
        console.error("[Data] Booking update error:", error);
        throw new Error("Failed to update booking");
      }
      return data;
    }),

  getOrders: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      console.log("[Data] Fetching orders for user:", input.userId);
      const { data, error } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("user_id", input.userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[Data] Orders fetch error:", error);
        return [];
      }
      return data || [];
    }),

  createOrder: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
        items: z.string(),
        total: z.number(),
        address: z.string(),
        payment_method: z.string(),
        status: z.string().default("pending"),
        estimated_delivery: z.string().optional(),
        stripe_session_id: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      console.log("[Data] Creating order for user:", input.user_id);

      const { data, error } = await supabaseAdmin
        .from("orders")
        .insert({
          ...input,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("[Data] Order create error:", error);
        throw new Error("Failed to create order");
      }

      console.log("[Data] Order created:", data?.id);
      return data;
    }),

  updateOrderStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { data, error } = await supabaseAdmin
        .from("orders")
        .update({ status: input.status })
        .eq("id", input.id)
        .select()
        .single();

      if (error) {
        console.error("[Data] Order update error:", error);
        throw new Error("Failed to update order");
      }
      return data;
    }),

  searchAll: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      console.log("[Data] Searching for:", input.query);
      const q = `%${input.query}%`;

      const [servicesRes, panditsRes, productsRes] = await Promise.all([
        supabaseAdmin
          .from("services")
          .select("*")
          .or(`title.ilike.${q},description.ilike.${q}`)
          .limit(10),
        supabaseAdmin
          .from("pandits")
          .select("*")
          .or(`name.ilike.${q},specialization.ilike.${q}`)
          .limit(10),
        supabaseAdmin
          .from("products")
          .select("*")
          .or(`name.ilike.${q},description.ilike.${q}`)
          .limit(10),
      ]);

      return {
        services: servicesRes.data || [],
        pandits: panditsRes.data || [],
        products: productsRes.data || [],
      };
    }),
});
