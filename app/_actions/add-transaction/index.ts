"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";
import { addTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";

interface UpsertTransactionParams {
  id?: string;
  name: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  method: TransactionPaymentMethod;
  date: Date;
}
//tem que ser protegida e validada porque é uma rota HTTP, ou seja, pode ser acessada
export const upsertTransaction = async (params: UpsertTransactionParams) => {
  addTransactionSchema.parse(params);
  const { userId } = auth();

  if (!userId) throw new Error("Unauthorized");

  console.log(params);

  await db.transaction.upsert({
    update: { ...params, userId },
    create: { ...params, userId },
    where: {
      id: params?.id ?? "",
    },
  });

  revalidatePath("/transactions");
};
