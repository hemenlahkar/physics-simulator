import Image from "next/image";

const page = () => {
  return (
    <main className="min-h-screen">
      <section className="mb-5 flex flex-1 justify-between gap-10">
        <div className="min-w-[45vw] p-12">
          <h1 className="text-5xl my-5">Why Learn Through Simulations?</h1>
          <h3 className="text-3xl my-5">
            Understanding concepts <br />{" "}
            <span className="text-red-400">NOT memorizing</span>
          </h3>
        </div>
        <aside className="min-w-[45vw]">
          <div>{/* <Image src="null" alt=""></Image> */}</div>
        </aside>
      </section>
      <section className="mb-5 p-12">
        <h1 className="text-5xl">How SimuLearn Helps?</h1>
        <ul className="list-disc">
          <li>
            Helps Visualize complex concepts with models for better
            understanding
          </li>
          <li>Provides a virtual lab for interactive learning</li>
        </ul>
      </section>
      <section className="ml-14">
        <h1 className="text-5xl">Website for interactive simulations</h1>
        <ul className="list-disc">
          <li>
            <a
              href="https://phet.colorado.edu/en/simulations/filter?type=html"
              className="text-3xl text-blue-400"
            >
              Phet
            </a>
          </li>
          <li>
            <a
              href="https://phet.colorado.edu/en/simulations/filter?type=html"
              className="text-3xl text-blue-400"
            >
              Olab
            </a>
          </li>
        </ul>
      </section>
      <section></section>
    </main>
  );
};

export default page;
