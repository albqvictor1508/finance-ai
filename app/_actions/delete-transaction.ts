"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "../_lib/prisma";
import { revalidatePath } from "next/cache";

const DeleteTransaction = async (transactionId: string) => {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  await db.transaction.delete({
    where: {
      id: transactionId ?? "",
    },
  });

  revalidatePath("/transactions");
};

export default DeleteTransaction;
