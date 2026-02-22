import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";

const getStripe = async () => {
  const StripeModule = await import("stripe");
  const Stripe = StripeModule.default;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(key, { apiVersion: "2026-01-28.clover" });
};

export const paymentsRouter = createTRPCRouter({
  createCheckoutSession: publicProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            name: z.string(),
            price: z.number(),
            quantity: z.number(),
            image: z.string().optional(),
          })
        ),
        deliveryCharge: z.number().default(0),
        successUrl: z.string().optional(),
        cancelUrl: z.string().optional(),
        customerEmail: z.string().email().optional(),
        metadata: z
          .record(z.string(), z.string())
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      console.log("[Payments] Creating checkout session for", input.items.length, "items");

      const stripe = await getStripe();

      const lineItems: Array<{
        price_data: {
          currency: string;
          product_data: { name: string; images?: string[] };
          unit_amount: number;
        };
        quantity: number;
      }> = input.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            ...(item.image ? { images: [item.image] } : {}),
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      if (input.deliveryCharge > 0) {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: "Delivery Charge",
            },
            unit_amount: Math.round(input.deliveryCharge * 100),
          },
          quantity: 1,
        });
      }

      const baseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || "https://example.com";

      const sessionParams: Record<string, unknown> = {
        line_items: lineItems,
        mode: "payment",
        success_url: input.successUrl || `${baseUrl}/api/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: input.cancelUrl || `${baseUrl}/api/payment-cancel`,
        metadata: input.metadata || {},
      };

      if (input.customerEmail) {
        sessionParams.customer_email = input.customerEmail;
      }

      const session = await (stripe.checkout.sessions.create as Function)(sessionParams);

      console.log("[Payments] Checkout session created:", session.id);

      return {
        sessionId: session.id as string,
        url: session.url as string | null,
      };
    }),

  getPaymentStatus: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      console.log("[Payments] Checking payment status for:", input.sessionId);

      const stripe = await getStripe();
      const session = await stripe.checkout.sessions.retrieve(input.sessionId);

      return {
        status: session.payment_status,
        amountTotal: session.amount_total,
        currency: session.currency,
        customerEmail: session.customer_details?.email ?? null,
      };
    }),

  createBookingPayment: publicProcedure
    .input(
      z.object({
        serviceTitle: z.string(),
        price: z.number(),
        panditName: z.string(),
        date: z.string(),
        customerEmail: z.string().email().optional(),
        bookingId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      console.log("[Payments] Creating booking payment for:", input.serviceTitle);

      const stripe = await getStripe();
      const baseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || "https://example.com";

      const sessionParams: Record<string, unknown> = {
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: input.serviceTitle,
                description: `Pandit: ${input.panditName} | Date: ${input.date}`,
              },
              unit_amount: Math.round(input.price * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${baseUrl}/api/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/api/payment-cancel`,
        metadata: {
          type: "booking",
          bookingId: input.bookingId || "",
          serviceTitle: input.serviceTitle,
        },
      };

      if (input.customerEmail) {
        sessionParams.customer_email = input.customerEmail;
      }

      const session = await (stripe.checkout.sessions.create as Function)(sessionParams);

      console.log("[Payments] Booking payment session created:", session.id);

      return {
        sessionId: session.id as string,
        url: session.url as string | null,
      };
    }),
});
