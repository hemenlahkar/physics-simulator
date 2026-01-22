"use client";
import SelectSubjectDialog from "@/components/home/SelectSubjectDialog";
import Image from "next/image";
import { FormEventHandler, useState } from "react";
import { Subjects } from "@/components/home/SelectSubjectDialog";
import { useRouter } from "next/navigation";
import Header from "@/components/home/Header";
import HeroImage from "@/public/hero-image.png";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    setIsModalOpen(() => false);
  };

  const handleSubmit = (
    data: Subjects | null
  ): FormEventHandler | undefined => {
    router.push(`/simulations/${data as string}`);
    return undefined;
  };

  return (
    <>
      <Header />
      <main className="flex items-center justify-start gap-10 h-screen flex-col">
        <SelectSubjectDialog
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          onClose={handleClose}
          onSubmit={handleSubmit}
        />
        <section className="text-center w-full">
          <h1 className="text-7xl ">
            Explore Science Through
            <span className="text-orange-400">Interactive Simulations</span>
          </h1>
          <p>
            Master physics, chemistry, math and biology with hadns-on virtual
            experiments and simulations designed for students
          </p>
        </section>
        <section id="benefits-section" className="w-full p-10">
          <div className="my-20">
            <p>Subjects to Interact</p>
            <h2 className="text-5xl my-4">Made Learning A Lot Fun...</h2>
            <p>
              SimuLearn provides easy interaction, without the overloading data
            </p>
          </div>
        </section>
        <div></div>
      </main>
    </>
  );
}
