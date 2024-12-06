import { DataTable } from "../_components/ui/data-table";
import { transactionColumns } from "./columns/index";
import { db } from "../_lib/prisma";
import TransactionButton from "../_components/transaction-btn";
import Navbar from "../_components/navbar";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { ScrollArea } from "../_components/ui/scroll-area";
import CanUserAddTransactions from "../_data/can-user-add-transaction";

//só posso marcar como async a function do componente pq é um server component, em client component como no react n pode
const Transactions = async () => {
  const { userId } = await auth();

  if (!userId) return redirect("/login");

  const transactions = await db.transaction.findMany({
    where: {
      userId,
    },
  }); //busca tudo q tem no banco
  const canUserAddTransactions = await CanUserAddTransactions(); //adicionar isso na home
  return (
    <>
      <Navbar />
      <div className="space-y-6 overflow-hidden p-6">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Transactions</h1>
          <TransactionButton usersCanAddTransactions={canUserAddTransactions} />
        </div>
        <ScrollArea>
          <DataTable columns={transactionColumns} data={transactions} />
        </ScrollArea>
      </div>
    </>
  );
};

export default Transactions;
