"use client";

import { Button } from "@/app/_components/ui/button";
import { createStripeCheckout } from "../_actions/create-stripe-checkout";
import { loadStripe } from "@stripe/stripe-js";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const AcquirePlanButton = () => {
  const { user } = useUser();
  const handleAcquirePlanClick = async () => {
    const { sessionId } = await createStripeCheckout();
    console.log(sessionId);

    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_PROD) {
      throw new Error("stripe public key not founded");
    }
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_PROD,
    );
    if (!stripe) {
      throw new Error("Stripe not found");
    }
    await stripe.redirectToCheckout({ sessionId });
  };
  const hasPremiumPlan = user?.publicMetadata.subscriptionPlan === "premium";
  console.log(user);
  console.log("metadata", user?.publicMetadata);
  if (hasPremiumPlan) {
    return (
      <Button className="w-full rounded-full font-bold">
        <Link
          href={`${process.env.NEXT_PUBLIC_STRIPE_COSTUMER_PUBLIC_URL as string}?prefilled_email=${user.emailAddresses[0].emailAddress}`}
        >
          Manage Plan
        </Link>
      </Button>
    );
  }
  return (
    <Button
      className="w-full rounded-full font-bold"
      onClick={handleAcquirePlanClick}
      variant={hasPremiumPlan ? "link" : "default"}
    >
      Acquire Plan
    </Button>
  );
};

export default AcquirePlanButton;
