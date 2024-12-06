"use client";

import { Transaction } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import TypeBadge from "../_components/type-badge";
import {
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_PAYMENT_METHOD_LABELS,
} from "@/app/_constants/transactions";
import EditTransactionButton from "@/app/_components/edit-transaction-btn";
import DeleteTransactionButton from "../_components/delete-transaction-btn";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row: { original: transaction } }) => (
      <TypeBadge transaction={transaction} />
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row: { original: transaction } }) =>
      TRANSACTION_CATEGORY_LABELS[transaction.category],
  },
  {
    accessorKey: "method",
    header: "Payment Method",
    cell: ({ row: { original: transaction } }) =>
      TRANSACTION_PAYMENT_METHOD_LABELS[transaction.method],
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row: { original: transaction } }) =>
      new Date(transaction.date).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row: { original: transaction } }) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(transaction.amount)),
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row: { original: transaction } }) => (
      <div className="space-x-1">
        <EditTransactionButton transaction={transaction} />
        <DeleteTransactionButton transaction={transaction} />
      </div>
    ),
  },
];
