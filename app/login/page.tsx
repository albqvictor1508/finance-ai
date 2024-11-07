import Image from "next/image";

const Login = () => {
  return (
    <div className="grid h-full w-full grid-cols-2">
      <div>
        <Image src="/logo.svg" width={173} height={39} alt="Finance AI logo" />
        <h1>Welcome!</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Non repellat
          dignissimos officiis aliquam, fugiat vitae unde sint, harum labore
          aliquid enim provident qui cum temporibus velit, et quod aperiam
          quidem.
        </p>
      </div>
      <div className="relative h-full">
        <Image src="/login-bg.png" fill alt="Finance AI login background" />
      </div>
    </div>
  );
};

export default Login;
