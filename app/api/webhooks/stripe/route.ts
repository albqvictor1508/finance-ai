import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (request: Request) => {
  if (
    !process.env.STRIPE_SECRET_KEY_PROD ||
    !process.env.STRIPE_WEBHOOK_SECRET
  ) {
    return NextResponse.error();
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "faltando a signature do stripe" },
      { status: 400 },
    );
  }
  const text = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_PROD, {
    apiVersion: "2024-10-28.acacia",
  });

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      text,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("ERRO NA VERIFICAÇÃO DO STRIPE: ", error);
    return NextResponse.json(
      { error: "verificação do Webhook falhou" },
      { status: 400 },
    );
  }

  if (!event) {
    console.error("event é undefined");
    return;
  }

  switch (event.type) {
    case "invoice.paid": {
      // Atualizar o usuário com o seu novo plano
      const invoice = event.data.object;

      const clerkUserId = invoice.subscription_details?.metadata?.clerk_user_id;

      if (!clerkUserId) {
        console.error(
          "faltando o clerk user id nos metadados, valor do clerk user id: ",
          clerkUserId,
        );
        return NextResponse.json(
          { error: "Faltando user ID no clerk" },
          { status: 400 },
        );
      }

      await clerkClient().users.updateUser(clerkUserId, {
        privateMetadata: {
          stripeCustomerId: invoice.customer,
          stripeSubscriptionId: invoice.subscription,
        },
        publicMetadata: {
          subscriptionPlan: "premium",
        },
      });
      break;
    }
    case "customer.subscription.deleted": {
      // Remover plano premium do usuário
      const subscription = await stripe.subscriptions.retrieve(
        event.data.object.id,
      );
      const clerkUserId = subscription.metadata.clerk_user_id;

      if (!clerkUserId) {
        console.error("user id faltando nos metadados do clerk");
        return NextResponse.json(
          { error: "faltando user ID" },
          { status: 400 },
        );
      }
      await clerkClient().users.updateUser(clerkUserId, {
        privateMetadata: {
          stripeCustomerId: null,
          stripeSubscriptionId: null,
        },
        publicMetadata: {
          subscriptionPlan: null,
        },
      });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
};
