import Image from "next/image";
import Test from "./components/Test";
import GetName from "./components/GetName";
import { InputForm } from "./components/InputForm";

export default function Home() {
  return (
      <main className="container mx-auto">
          {/* <GetName /> */}
          <InputForm />
          {/* <Test /> */}
      </main>
  );
}
