import Image from "next/image";
import Test from "./components/Test";
import GetName from "./components/GetName";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <GetName />
      <Test />
    </main>
  );
}
