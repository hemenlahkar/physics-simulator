import { Link as LinkS } from "react-scroll";
import { Button } from "../ui/button";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center h-18 my-2 mx-[1%] fixed top-0 backdrop-blur-3xl w-[98%] rounded-full invert">
      <div className="logo text-xl px-10 font-bold cursor-pointer">
        <Link href="/">SimuLearn</Link>
      </div>
      <div className="buttons flex gap-6 items-center font-bold">
        <LinkS
          to="benefits-section"
          smooth={true}
          duration={500}
          className="cursor-pointer"
        >
          Subjects
        </LinkS>
        <span className="font-bold">|</span>
        <LinkS to="features-section" smooth={true} duration={500} className="cursor-pointer">
          Features
        </LinkS>
        <span className="font-bold">|</span>
        <LinkS to="advanced-section" smooth={true} duration={500} className="cursor-pointer">
          Advance Learning
        </LinkS>
        <span className="font-bold">|</span>
        <LinkS to="#" smooth={true} duration={500} className="cursor-pointer">
          Contact Us
        </LinkS>
      </div>
      <div className="get-started mx-2 px-10">
        <Link href="/simulations">
          <Button className="font-bold py-2 cursor-pointer bg-cyan-500 hover:bg-pink-500">
            Get Started
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
