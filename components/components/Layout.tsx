import Sidebar from "../Sidebar";
import { ReactNode, useState } from "react";
import MobileMenu from "./MobileMenu";

export default function Layout({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />

      <main className="flex-1 p-6 md:ml-64 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
