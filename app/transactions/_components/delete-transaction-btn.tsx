import DeleteTransaction from "@/app/_actions/delete-transaction";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { useState } from "react";

interface DeleteTransactionProps {
  transactionId: string;
}

const DeleteTransactionButton = ({ transactionId }: DeleteTransactionProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const onSubmit = async () => {
    try {
      await DeleteTransaction(transactionId);
      setDialogIsOpen(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Dialog open={dialogIsOpen} onOpenChange={(open) => setDialogIsOpen(open)}>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <TrashIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Transaction</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <span>Are you sure?</span>
        </DialogDescription>
        <DialogFooter>
          <DialogClose>
            <Button type="button" variant={"outline"}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" onClick={onSubmit}>
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTransactionButton;
