"use client";
import SelectSubjectDialog from "@/modules/simulations/components/SelectSubjectDialog";
import Image from "next/image";
import { FormEventHandler, useState } from "react";
import { Subjects } from "@/modules/simulations/components/SelectSubjectDialog";
import { useRouter } from "next/navigation";

export default function Home() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  

  const handleClose = () => {
    setIsModalOpen(() => false);
  }

  const handleSubmit = (data: Subjects | null): FormEventHandler | undefined => {
      router.push(`/simulations/${data as string}`);
      return undefined;
  }

  return (
    <main className="flex items-center justify-center h-screen flex-col">
      <h1 className="text-center text-2xl font-bold">Hello World</h1>
      <SelectSubjectDialog isOpen={isModalOpen} setIsOpen={setIsModalOpen} onClose={handleClose} onSubmit={handleSubmit}/>
    </main>
  );
}
