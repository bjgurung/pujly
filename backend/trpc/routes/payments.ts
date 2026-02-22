import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";

const getStripeKey = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return key;
};

const stripeRequest = async (endpoint: string, body: Record<string, string>) => {
  const key = getStripeKey();
  const response = await fetch(`https://api.stripe.com/v1/${endpoint}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body).toString(),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("[Stripe] API error:", JSON.stringify(error));
    throw new Error(error?.error?.message || "Stripe API error");
  }

  return response.json();
};

const stripeGet = async (endpoint: string) => {
  const key = getStripeKey();
  const response = await fetch(`https://api.stripe.com/v1/${endpoint}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${key}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("[Stripe] API error:", JSON.stringify(error));
    throw new Error(error?.error?.message || "Stripe API error");
  }

  return response.json();
};

const buildCheckoutParams = (
  lineItems: Array<{ name: string; price: number; quantity: number; image?: string }>,
  successUrl: string,
  cancelUrl: string,
  customerEmail?: string,
  metadata?: Record<string, string>,
) => {
  const params: Record<string, string> = {
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
  };

  lineItems.forEach((item, i) => {
    params[`line_items[${i}][price_data][currency]`] = "usd";
    params[`line_items[${i}][price_data][product_data][name]`] = item.name;
    params[`line_items[${i}][price_data][unit_amount]`] = String(Math.round(item.price * 100));
    params[`line_items[${i}][quantity]`] = String(item.quantity);
    if (item.image) {
      params[`line_items[${i}][price_data][product_data][images][0]`] = item.image;
    }
  });

  if (customerEmail) {
    params.customer_email = customerEmail;
  }

  if (metadata) {
    Object.entries(metadata).forEach(([key, value]) => {
      params[`metadata[${key}]`] = value;
    });
  }

  return params;
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

      const baseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || "https://example.com";
      const successUrl = input.successUrl || `${baseUrl}/api/payment-success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = input.cancelUrl || `${baseUrl}/api/payment-cancel`;

      const allItems = [...input.items];
      if (input.deliveryCharge > 0) {
        allItems.push({
          name: "Delivery Charge",
          price: input.deliveryCharge,
          quantity: 1,
        });
      }

      const params = buildCheckoutParams(allItems, successUrl, cancelUrl, input.customerEmail, input.metadata);
      const session = await stripeRequest("checkout/sessions", params);

      console.log("[Payments] Checkout session created:", session.id);

      return {
        sessionId: session.id as string,
        url: (session.url || null) as string | null,
      };
    }),

  getPaymentStatus: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      console.log("[Payments] Checking payment status for:", input.sessionId);

      const session = await stripeGet(`checkout/sessions/${input.sessionId}`);

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

      const baseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || "https://example.com";

      const items = [{
        name: input.serviceTitle,
        price: input.price,
        quantity: 1,
      }];

      const metadata: Record<string, string> = {
        type: "booking",
        bookingId: input.bookingId || "",
        serviceTitle: input.serviceTitle,
      };

      const params = buildCheckoutParams(
        items,
        `${baseUrl}/api/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        `${baseUrl}/api/payment-cancel`,
        input.customerEmail,
        metadata,
      );

      params[`line_items[0][price_data][product_data][description]`] =
        `Pandit: ${input.panditName} | Date: ${input.date}`;

      const session = await stripeRequest("checkout/sessions", params);

      console.log("[Payments] Booking payment session created:", session.id);

      return {
        sessionId: session.id as string,
        url: (session.url || null) as string | null,
      };
    }),
});
