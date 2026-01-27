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
import advPic from "@/public/advLearn.jpg";
import logo from "@/public/logo.jpg";
import { Zalando_Sans_Expanded, Petit_Formal_Script, Red_Rose } from "next/font/google";
import { Button } from "@/components/ui/button";

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
  display: "swap",
});

const Zalando = Zalando_Sans_Expanded({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

const rrose = Red_Rose({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
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
      <main
      className="flex items-center justify-start gap-10 min-h-screen flex-col flex-1"
      >
        <SelectSubjectDialog
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          onClose={handleClose}
          onSubmit={handleSubmit}
        />
        <section className="text-center w-full">
          <h1 className="text-7xl ">
            Explore <span className={Zalando.className}>Science</span> Through{" "}
            <span className={"text-orange-400 " + formal.className}>
              Interactive Simulations
            </span>
          </h1>
          <p className="my-10 text-xl">
            Master physics, chemistry, math and biology with hadns-on virtual
            experiments and simulations designed for students
          </p>
        </section>
        <section id="benefits-section" className="w-full p-10">
          <div className="my-20 text-center">
            <p className={`mb-12 ${rrose.className}`}>Subjects to Interact</p>
            <h2 className="text-5xl my-4 mb-12">Made <span className={formal.className}>Learning</span> A Lot Fun...</h2>
            <p className={`mb-12 ${rrose.className}`}>
              SimuLearn provides easy interaction, without the overloading data
            </p>
          </div>
          <hr />
          <div className="flex gap-8 justify-evenly mb-8 mt-10">
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
          <hr />
          <div className="flex gap-5 justify-between w-full p-10 mt-9 min-h-dvh">
            <aside>
              <h1 className="text-7xl">
                Interactive <span className={formal.className}>Learning</span>{" "}
                Platform
              </h1>
              <ol className="min-h-125 flex flex-col justify-evenly mx-5 text-2xl">
                <hr />
                <li>
                  <span className="font-bold text-xl text-gray-600 mr-8">
                    01
                  </span>
                  See the Bigger Picture of Learning Through Interactive
                  Exploration.
                </li>
                <hr />
                <li>
                  <span className="font-bold text-xl text-gray-600 mr-8">
                    02
                  </span>
                  Understand Concepts Clearly by Visualizing How They Actually
                  Work.
                </li>
                <hr />
                <li>
                  <span className="font-bold text-xl text-gray-600 mr-8">
                    03
                  </span>
                  Move Beyond Memorization and Learn Through Real Understanding.
                </li>
                <hr />
                <li>
                  <span className="font-bold text-xl text-gray-600 mr-8">
                    04
                  </span>
                  Experience Learning by Exploring Concepts Step by Step.
                </li>
                <hr />
              </ol>
            </aside>
            <aside>
              <Image
                alt="Interactive Learning Platform"
                src={myNigga}
                width="900"
              ></Image>
            </aside>
          </div>
        </section>
        <section
          id="features-section"
          className="min-h-dvh h-auto w-11/12 flex flex-col justify-around"
        >
          <div>
            <h4 className="text-center text-xl my-10 text-gray-600">
              Features
            </h4>
            <h1 className="text-center text-8xl my-10">
              Why choose <span className={Zalando.className}>SimuLearn</span>?
            </h1>
            <p className=" text-center text-xl my-10 text-gray-600">
              Designed with students in mind, our platform makes learning
              science engaging and effective.
            </p>
            <div className="flex items-center justify-center m-10">
              <Button className="bg-lime-800 text-xl p-8 rounded-full">
                Explore More
              </Button>
            </div>
          </div>
          <hr />
          <div className="flex justify-between gap-20 m-5">
            <div>
              <h3 className="my-4 font-bold text-xl">
                Interactive Simulations
              </h3>
              <p className="text-gray-800">
                Engage with real-time,physics-based stimulations that bring
                abstract concept to life.
              </p>
            </div>
            <div>
              <h3 className="my-4 font-bold text-xl">Curriculum Alligned</h3>
              <p className="text-gray-800">
                All content is carefully designed to match standard educational
                curricular and learning objective.
              </p>
            </div>
            <div>
              <h3 className="my-4 font-bold text-xl">Collaborative Learning</h3>
              <p className="text-gray-800">
                Share experiments and insights with classmates and learn
                together in a supportive environment
              </p>
            </div>
            <div>
              <h3 className="my-4 font-bold text-xl">Instant Feedback</h3>
              <p className="text-gray-800">
                Get immediate results and explanations to understand concepts
                better and learn from mistakes.
              </p>
            </div>
          </div>
        </section>
        <section
          id="advanced-section"
          className="min-h-dvh h-auto overflow-clip"
        >
          <div className="flex justify-between m-20 items-center border-y border-gray-400 py-20">
            <h1 className="text-8xl">Advanced Learning</h1>
            <Button className="text-3xl p-11 rounded-full bg-lime-800">Discover</Button>
          </div>
          <div className="flex mx-10 gap-35">
            <div>
              <h1 className="text-9xl mb-12 text-gray-400">01</h1>
              <h3 className="text-2xl font-bold my-6">
                Explore Concept Visually
              </h3>
              <p className="text-xl text-gray-600 w-4/5">
                Understand complex topics through interactive simulations
                instead of memorizing theory.
              </p>
            </div>
            <div>
              <h1 className="text-9xl mb-12 text-gray-400">02</h1>
              <h3 className="text-2xl font-bold my-6">Learn By Doing</h3>
              <p className="text-xl text-gray-600 w-4/5">
                Experiment , change values and see real-time results to
                strengthen understanding.
              </p>
            </div>
            <div>
              <h1 className="text-9xl mb-12 text-gray-400">03</h1>
              <h3 className="text-2xl font-bold my-6">
                Master with Confidence
              </h3>
              <p className="text-xl text-gray-600 w-4/5">
                Practice until concepts feel natural and apply them easily in
                exams and real life.
              </p>
            </div>
          </div>
          <div className="h-auto mt-20">
            <Image src={advPic} alt="Alt Image"></Image>
          </div>
        </section>
        <section className="text-center my-15 mb-40">
          <h1 className={`text-5xl my-10 font-bold ${rrose.className}`}>Ready to Start Your Science Journey?</h1>
          <p className="text-gray-400 my-10">
            Join thousands of students already exploring and mastering science
            through interactive learning.
          </p>
          <Button className="rounded-full text-9xl px-60 py-5 bg-lime-800"><span className="text-xl">Get started↗</span></Button>
        </section>
      </main>
      <hr />
      <footer />
        <section className="w-full p-10">
          <div className={`flex gap-8 font-bold`}>
            <h1>Subjects</h1>
            <h1>Features</h1>
            <h1>Advanced Learning</h1>
          </div>
          <div className="mt-30 flex gap-10">
            <Image src={logo} alt="SimuLearn Logo"></Image>
            <p className="mt-12">© Simulearn.   2026</p>
            <p className="mt-12">All Rights Reserved</p>
          </div>
        </section>

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
      <h3 className="font-bold text-xl">{subjectName}</h3>
      <p>{description}</p>
    </div>
  );
}
