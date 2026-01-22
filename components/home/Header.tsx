import Navbar from "./Navbar";
import Image from "next/image";
import HeroImage from "@/public/hero-image.png";

const Header = () => {
  return (
    <header>
      <Navbar />
      <h1 className="text-9xl text-center mb-20">
        Make Learning <br /> More Interactive.
      </h1>
      <div className="hero-image">
        <Image alt="hero image" src={HeroImage} loading="eager" />
      </div>
    </header>
  );
};

export default Header;
