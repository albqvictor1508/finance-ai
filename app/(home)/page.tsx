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

  const retryFetchUser = async (userId: string, retries = 3) : Promise<any> => { 
    for(let attempt = 1; attempt <= retries; attempt++) {
      try {
        const user = await clerkClient().users.getUser(userId);
        console.log("FETCHED USER: ", user);
        if(user) return user;
        
      } catch (error) {
        console.log(`Tentativa ${attempt}: ERRO AO BUSCAR O USUÁRIO PELO CLERK USER ID: `, error);
        if(attempt === retries) throw error;
      }
    }
  }
  
  const user = await retryFetchUser(userId);
  console.log("USER FETCHED: ", user); 
  
  if(!user) {
    console.log("ERRO! VALOR DE USER:", user);
    return;
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
