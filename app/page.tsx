"use client";
import SelectSubjectDialog from "@/modules/simulations/components/SelectSubjectDialog";
import Image from "next/image";
import { FormEventHandler, useState } from "react";
import { Subjects } from "@/modules/simulations/components/SelectSubjectDialog";

export default function Home() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  

  const handleClose = () => {
    setIsModalOpen(() => false);
  }

  const handleSubmit = (data: Subjects | null): FormEventHandler | undefined => {
      return undefined;
  }

  return (
    <main className="flex items-center justify-center h-screen flex-col">
      <h1 className="text-center text-2xl font-bold">Hello World</h1>
      <SelectSubjectDialog onClose={handleClose} onSubmit={handleSubmit}/>
    </main>
  );
}
