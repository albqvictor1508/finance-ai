import { Badge } from "@/app/_components/ui/badge";
import { Transaction, TransactionType } from "@prisma/client";
import { Circle } from "lucide-react";

interface TransactionBadgeProps {
  transaction: Transaction;
}

const TypeBadge = ({ transaction }: TransactionBadgeProps) => {
  if (transaction.type === TransactionType.DEPOSIT) {
    return (
      <Badge className="bg-muted font-bold text-primary hover:bg-muted">
        <Circle className="mr-1.5 fill-primary" size={10} />
        Earned
      </Badge>
    );
  }
  if (transaction.type === TransactionType.EXPENSE) {
    return (
      <Badge className="bg-danger bg-opacity-10 font-bold text-danger hover:bg-danger hover:bg-opacity-10">
        <Circle className="mr-1.5 fill-danger" size={10} />
        Spent
      </Badge>
    );
  }

  return (
    <Badge className="bg-muted font-bold text-white hover:bg-muted">
      <Circle className="mr-1.5 fill-white" size={10} />
      Investment
    </Badge>
  );
};

export default TypeBadge;
