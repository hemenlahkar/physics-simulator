"use client";
import SelectSubjectDialog from "@/components/home/SelectSubjectDialog";
import Image, { StaticImageData } from "next/image";
import { FormEventHandler, useState } from "react";
import { Subjects } from "@/components/home/SelectSubjectDialog";
import { useRouter } from "next/navigation";
import Header from "@/components/home/Header";
import HeroImage from "@/public/hero-image.png";
import PhysicsPic from "@/public/physicsPic.jpg";
import MathPic from "@/public/mathsPic.jpg";
import ChemPic from "@/public/chemPic.jpg";
import BioPic from "@/public/bioPic.jpg";
import myNigga from "@/public/smillingnigga.jpg";
import { Inter, Petit_Formal_Script } from "next/font/google";

class SubjectCardCls {
  subjectName: string;
  altText: string;
  src: StaticImageData;
  description: string;

  constructor(config: {
    subjectName: string;
    altText: string;
    src: StaticImageData;
    description: string;
  }) {
    this.subjectName = config.subjectName;
    this.altText = config.altText;
    this.src = config.src;
    this.description = config.description;
  }
}

const formal = Petit_Formal_Script({
  subsets: ["latin"],
  weight: "400",
  display: "swap"
});

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    setIsModalOpen(() => false);
  };

  const handleSubmit = (
    data: Subjects | null,
  ): FormEventHandler | undefined => {
    router.push(`/simulations/${data as string}`);
    return undefined;
  };

  let arrayOfSubject: SubjectCardCls[] = [];
  const physics = new SubjectCardCls({
    subjectName: "Physics",
    altText: "alt txt",
    src: PhysicsPic,
    description:
      "Explore mechanics, electricity, magnetism and quantum physics through interactive simulations.",
  });
  const chemistry = new SubjectCardCls({
    subjectName: "Chemistry",
    altText: "alt txt",
    src: ChemPic,
    description:
      "Conduct virtual experiments with chemical reactions, molecular structure and lab techniques.",
  });
  const maths = new SubjectCardCls({
    subjectName: "Maths",
    altText: "alt txt",
    src: MathPic,
    description: "Geometry, probability through examples in real life.",
  });
  const biology = new SubjectCardCls({
    subjectName: "Biology",
    altText: "alt txt",
    src: BioPic,
    description:
      "Discover Living organisms, cellular processes genetics and ecosystems in stunning details.",
  });

  arrayOfSubject.push(physics, chemistry, biology, maths);

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
            Explore Science Through{" "}
            <span className={"text-orange-400 " + formal.className}>Interactive Simulations</span>
          </h1>
          <p>
            Master physics, chemistry, math and biology with hadns-on virtual
            experiments and simulations designed for students
          </p>
        </section>
        <section id="benefits-section" className="w-full p-10 min-h-dvh">
          <div className="my-20">
            <p>Subjects to Interact</p>
            <h2 className="text-5xl my-4">Made Learning A Lot Fun...</h2>
            <p>
              SimuLearn provides easy interaction, without the overloading data
            </p>
          </div>
          <div className="flex gap-8 justify-evenly">
            {arrayOfSubject.map((a, index) => (
              <SubjectCard
                key={index}
                altText={a.altText}
                description={a.description}
                src={a.src}
                subjectName={a.subjectName}
              />
            ))}
          </div>
        </section>
        <section className="flex gap-5 justify-between w-full p-10 min-h-dvh">
          <aside>
            <h1 className="text-8xl">
              Interactive <span className={formal.className}>Learning</span> Platform
            </h1>
            <ol className="min-h-125 flex flex-col justify-evenly mx-5 text-2xl">
              <li>
                <span className="font-bold text-gray-600 mr-8">01</span>See the
                Bigger Picture of Learning Through Interactive Exploration.
              </li>
              <li>
                <span className="font-bold text-gray-600 mr-8">02</span>
                Understand Concepts Clearly by Visualizing How They Actually
                Work.
              </li>
              <li>
                <span className="font-bold text-gray-600 mr-8">03</span>Move
                Beyond Memorization and Learn Through Real Understanding.
              </li>
              <li>
                <span className="font-bold text-gray-600 mr-8">04</span>
                Experience Learning by Exploring Concepts Step by Step.
              </li>
            </ol>
          </aside>
          <aside>
            <Image
              alt="Interactive Learning Platform"
              src={myNigga}
              width="900"
            ></Image>
          </aside>
        </section>
      </main>
    </>
  );
}

function SubjectCard({
  subjectName,
  altText,
  src,
  description,
}: SubjectCardCls) {
  return (
    <div className="flex flex-col w-[20vw] justify-between">
      <Image alt={altText} src={src}></Image>
      <h3 className="font-bold">{subjectName}</h3>
      <p>{description}</p>
    </div>
  );
}
