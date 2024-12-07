"use client";

import { ArrowDownUp } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import UpsertTransactionDialog from "./upsert-transaction-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface AddTransactionButtonProps {
  usersCanAddTransactions?: boolean;
}

const TransactionButton = ({
  usersCanAddTransactions,
}: AddTransactionButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="rounded-full font-bold"
              onClick={() => setDialogIsOpen(true)}
              disabled={!usersCanAddTransactions}
            >
              Add transaction
              <ArrowDownUp className="ml-0.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {!usersCanAddTransactions &&
              "You've reached your transaction limit, upgrade your plan to access unlimited transactions"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <UpsertTransactionDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
      />
    </>
  );
};

export default TransactionButton;
