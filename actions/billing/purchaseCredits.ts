"use server";

import { getAppUrl } from "@/lib/helper/appUrl";
import { stripe } from "@/lib/stripe/stripe";
import { getCreditsPack, PackId } from "@/types/billing";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function purchaseCredits(packId: PackId) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const selectedPack = getCreditsPack(packId);
  if (!selectedPack) {
    throw new Error("Invalid pack");
  }
  const priceId = selectedPack.priceId;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    invoice_creation: {
      enabled: true,
    },
    success_url: getAppUrl("/billing"),
    cancel_url: getAppUrl("/billing"),
    metadata: {
      userId,
      packId,
    },
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
  });

  if (!session.url) {
    throw new Error("Cannot create stripe session");
  }

  redirect(session.url);
}
