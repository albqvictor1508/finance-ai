"use server";

import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

export const createStripeCheckout = async () => {
  const { userId } = await auth();
  console.log("USER ID: ", userId);

  if (!userId) throw new Error("Unauthorized");

  if (!process.env.STRIPE_SECRET_KEY_PROD) {
    throw new Error("Stripe secret key not founded");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_PROD, {
    apiVersion: "2024-10-28.acacia",
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    success_url: "http://localhost:3000",
    cancel_url: "http://localhost:3000",
    line_items: [
      {
        price: process.env.STRIPE_PREMIUM_PLAN_PRICE_ID_PROD,
        quantity: 1,
      },
    ],
    subscription_data: {
      metadata: {
        clerk_user_id: userId,
      },
    },
  });
  console.log("SESSION ID: ", session.id);
  return { sessionId: session.id };
};
