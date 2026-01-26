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
import { Zalando_Sans_Expanded, Petit_Formal_Script } from "next/font/google";
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
            Explore <span className={Zalando.className}>Science</span> Through{" "}
            <span className={"text-orange-400 " + formal.className}>
              Interactive Simulations
            </span>
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
          <div className="flex gap-8 justify-evenly mb-8">
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
                  <span className="font-bold text-gray-600 mr-8">01</span>See
                  the Bigger Picture of Learning Through Interactive
                  Exploration.
                </li>
                <hr />
                <li>
                  <span className="font-bold text-gray-600 mr-8">02</span>
                  Understand Concepts Clearly by Visualizing How They Actually
                  Work.
                </li>
                <hr />
                <li>
                  <span className="font-bold text-gray-600 mr-8">03</span>Move
                  Beyond Memorization and Learn Through Real Understanding.
                </li>
                <hr />
                <li>
                  <span className="font-bold text-gray-600 mr-8">04</span>
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
        <section id="features-section" className="">
          <h4 className="text-center">Features</h4>
          <h1 className="text-center">Why choose SimuLearn?</h1>
          <p>
            Designed with students in mind, our platform makes learning science
            engaging and effective.
          </p>
          <Button className="">Explore More</Button>

          <div>
            <div>
              <h3>Interactive Simulations</h3>
              <p>
                Engage with real-time,physics-based stimulations that bring
                abstract concept to life.
              </p>
            </div>
            <div>
              <h3>Curriculum Alligned</h3>
              <p>
                All content is carefully designed to match standard educational
                curricular and learning objective.
              </p>
            </div>
            <div>
              <h3>Collaborative Learning</h3>
              <p>
                Share experiments and insights with classmates and learn
                together in a supportive environment
              </p>
            </div>
            <div>
              <h3>Instant Feedback</h3>
              <p>
                Get immediate results and explanations to understand concepts
                better and learn from mistakes.
              </p>
            </div>
          </div>
        </section>
        <section id="advanced-section">
          <div>
            <h1>Advanced Learning</h1>
            <Button>Discover</Button>
          </div>
          <div>
            <div>
              <h1>01</h1>
              <h3>Explore Concept Visually</h3>
              <p>Understand complex topics through interactive simulations instead of memorizing theory.</p>
            </div>
            <div>
              <h1>02</h1>
              <h3>Learn By Doing</h3>
              <p>Experiment , change values and see real-time results to strengthen understanding.</p>
            </div>
            <div>
              <h1>03</h1>
              <h3>Master with Confidence</h3>
              <p>Practice until concepts feel natural and apply them easily in exams and real life.</p>
            </div>
          </div>
          <Image src={advPic} alt="Alt Image"></Image>
        </section>
        <section>
          <h1>Ready to Start Your Science Journey</h1>
          <p>Join thousands of students already exploring and mastering science through interactive learning.</p>
          <Button>Get Started↗</Button>
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
