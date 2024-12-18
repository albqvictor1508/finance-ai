import { clerkClient } from "@clerk/nextjs/server";
import { error } from "console";
import { NextResponse } from "next/server";
import Stripe from "stripe";

console.log("Webhook running");

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY_DEV || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.log("faltando as variáveis de ambiente");
    return NextResponse.error();
  }

  console.log("Estou dentro da função POST");

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    console.log("faltando a signature do stripe")
    return NextResponse.error();
  }
  const text = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_DEV, {
    apiVersion: "2024-10-28.acacia",
  });

  let event;

  try {
    event = stripe.webhooks.constructEvent(text,signature,process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    console.log("ERRO NA VERIFICAÇÃO DO STRIPE: ", error);
    return NextResponse.json({error: "verificação do Webhook falhou"}, {status: 400})
  }
  console.log("ouvindo eventos...")  

  if(!event) {
    console.log("event é undefined");
    return;
  };

  switch (event.type) {
    case "invoice.paid": {
      // Atualizar o usuário com o seu novo plano
      const invoice = event.data.object as Stripe.Invoice // coloquei o invoice em geral em vez do distructuring
      const clerkUserId = invoice.metadata?.clerk_user_id;

      if (!clerkUserId) {
        console.log("faltando o clerk user id nos metadados");
        return NextResponse.json({error: "Faltando user ID no clerk"}, {status: 400});
      }

      console.log("LOG DOS INVOICES: ",invoice.customer, invoice.subscription);

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
        console.error("user id faltando nos metadados do clerk")
        return NextResponse.json({error: "faltando user ID"}, {status: 400});
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

  console.log("fim da função");
  return NextResponse.json({ received: true }, {status: 200});
};
