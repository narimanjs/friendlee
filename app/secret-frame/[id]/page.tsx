import dynamic from "next/dynamic";

const Home = dynamic(() => import("../../page"), { ssr: false });

const SecretFrame = () => {
  return <Home />;
};

export default SecretFrame;
