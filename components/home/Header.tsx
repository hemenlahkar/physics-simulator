import Navbar from "./Navbar";
import Image from "next/image";
import HeroImage from "@/public/hero-image.png";
import { Petit_Formal_Script } from "next/font/google";

const formal = Petit_Formal_Script({
  subsets: ["latin"],
  weight: "400",
  display: "swap"
});


const Header = () => {
  return (
    <header className="w-full ">
      <Navbar />
      <h1 className="text-9xl text-center m-20">
        Make <span className={formal.className}>Learning</span> <br />More Interactive.
      </h1>
      <div className="hero-image">
        <Image alt="hero image" src={HeroImage} loading="eager" />
      </div>
    </header>
  );
};

export default Header;
