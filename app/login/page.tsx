import Image from "next/image";
import { Button } from "../_components/ui/button";
import { LogInIcon } from "lucide-react";

const Login = () => {
  return (
    <div className="grid h-full w-full grid-cols-2">
      <div className="mx-auto flex w-[550px] flex-col justify-center p-8">
        <Image src="/logo.svg" width={173} height={39} alt="Finance AI logo" />
        <h1 className="mb-3 text-4xl font-bold">Welcome!</h1>
        <p className="mb-8 text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Non repellat
          dignissimos officiis aliquam, fugiat vitae unde sint, harum labore
          aliquid enim provident qui cum temporibus velit, et quod aperiam
          quidem.
        </p>
        <Button variant={"outline"}>
          <LogInIcon className="mr-2" />
          Finance AI is a financial management platform that uses AI to monitor
          your movements and provide personalised insights, making it easier to
          manage your budget.
        </Button>
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
