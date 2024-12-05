import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import UniqueCard from "./unique-summary-card";

interface SummaryCardsProps {
  month: string;
  balance: number;
  expensesTotal: number;
  depositsTotal: number;
  investmentsTotal: number;
  usersCanAddTransactions?: boolean;
}

const SummaryCards = async ({
  balance,
  expensesTotal,
  depositsTotal,
  investmentsTotal,
  usersCanAddTransactions,
}: SummaryCardsProps) => {
  return (
    <section className="space-y-6">
      <UniqueCard
        icon={<WalletIcon size={16} />}
        title="Balance"
        amount={balance}
        size="large"
        usersCanAddTransactions={usersCanAddTransactions}
      />

      <div className="grid grid-cols-3 gap-6">
        <UniqueCard
          icon={<PiggyBankIcon size={16} />}
          title="Invested"
          amount={investmentsTotal}
        />
        <UniqueCard
          icon={<TrendingUpIcon size={16} className="text-primary" />}
          title="Income"
          amount={depositsTotal}
        />
        <UniqueCard
          icon={<TrendingDownIcon size={16} className="text-red-500" />}
          title="Expenses"
          amount={expensesTotal}
        />
      </div>
    </section>
  );
};

export default SummaryCards;
