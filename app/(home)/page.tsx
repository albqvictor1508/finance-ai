import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import SummaryCards from "./_components/summary-cards";
import TimeSelect from "../_components/time-select";
import { isMatch } from "date-fns";
import { getDashboard } from "../_data/get-dashboard";
import { TransactionsPieChart } from "./_components/transactions-pie-chart";
import ExpensePerCategory from "./_components/expense-per-category";
import LastTransactions from "./_components/last-transactions";
import { ScrollArea } from "../_components/ui/scroll-area";
import AIReportButton from "./_components/ai-report-button";
import CanUserAddTransactions from "../_data/can-user-add-transaction";

interface HomeProps {
  searchParams: {
    month: string;
  };
}

const Home = async ({ searchParams: { month } }: HomeProps) => {
  const { userId } = await auth();

  if (!userId) return redirect("/login");

  const monthIsInvalid = !month || !isMatch(month, "MM");
  if (monthIsInvalid) {
    redirect(`/?month=${new Date().getMonth() + 1}`);
  }

  const canUserAddTransactions = await CanUserAddTransactions();
  const dashboard = await getDashboard(month);

  let user;

  try {
    user = await clerkClient().users.getUser(userId);
  } catch (error) {
    console.log(`ERRO AO BUSCAR O USUÁRIO PELO CLERK USER ID: `, error);
    return redirect("/login");
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col space-y-6 overflow-hidden p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-3">
            <AIReportButton
              month={month}
              hasPremiumPlan={
                user.publicMetadata.subscriptionPlan === "premium"
              }
            />
            <TimeSelect />
          </div>
        </div>
        <div className="grid grid-cols-[2fr,1fr] gap-6 overflow-hidden">
          <div className="flex flex-col gap-6 overflow-hidden">
            <SummaryCards
              month={month}
              {...dashboard}
              usersCanAddTransactions={canUserAddTransactions}
            />
            <div className="grid grid-cols-3 grid-rows-1 gap-3 overflow-hidden">
              <ScrollArea>
                <TransactionsPieChart {...dashboard} />
              </ScrollArea>
              <ExpensePerCategory
                expensesPerCategory={dashboard.totalExpensePerCategory}
              />
            </div>
          </div>
          <LastTransactions lastTransactions={dashboard.lastTransactions} />
        </div>
      </div>
    </>
  );
};

export default Home;
