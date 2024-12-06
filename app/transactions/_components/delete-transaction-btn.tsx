import { Button } from "@/app/_components/ui/button";
import { Transaction } from "@prisma/client";
import { TrashIcon } from "lucide-react";

interface DeleteTransactionProps {
  transaction: Transaction;
}

const DeleteTransactionButton = ({}: DeleteTransactionProps) => {
  // function handleDelete() {} //comentei e tirei tudo pq o lint-staged ta enchendo o saco
  //criar um dialog pra perguntar se o usuário tem certeza e criar a server action que vai deletar a transaction na pasta "_actions"
  return (
    <Button variant={"ghost"}>
      <TrashIcon />
    </Button>
  );
};

export default DeleteTransactionButton;
