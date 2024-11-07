import Image from "next/image";
import { Button } from "../_components/ui/button";
import { LogInIcon } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Login = async () => {
  const { userId } = await auth();

  if (userId) return redirect("/");

  return (
    <div className="grid h-full w-full grid-cols-2">
      <div className="mx-auto flex w-[550px] flex-col justify-center p-8">
        <Image
          src="/logo.svg"
          width={173}
          height={39}
          alt="Finance AI logo "
          className="mb-8"
        />
        <h1 className="mb-3 text-4xl font-bold">Welcome!</h1>
        <p className="mb-8 text-muted-foreground">
          Finance AI is a financial management platform that uses AI to monitor
          your movements and provide personalised insights, making it easier to
          manage your budget.
        </p>
        <SignInButton>
          <Button variant={"outline"}>
            <LogInIcon className="mr-2" />
            Log in or create account.
          </Button>
        </SignInButton>
      </div>
      <div className="relative h-full w-full">
        <Image
          src="/login-bg.png"
          fill
          alt="Finance AI login background"
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
