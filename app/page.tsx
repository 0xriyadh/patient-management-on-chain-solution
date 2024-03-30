import Image from "next/image";
import Test from "./components/Test";
import GetName from "./components/GetName";

export default function Home() {
  return (
    <main className="container mx-auto">
      <GetName />
      {/* <Test /> */}
    </main>
  );
}
