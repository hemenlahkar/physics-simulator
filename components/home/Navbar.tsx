import Link from "next/link";
import { Button } from "../ui/button";

const Navbar = () => {
  return (
    <nav className="flex justify-between h-10 my-3">
      <div className="logo text-xl p-2 font-bold">SimuLearn</div>
      <div className="buttons flex gap-6 items-center">
        <Link href="#">Subjects</Link>
        <Link href="#">Features</Link>
        <Link href="#">Advance Learning</Link>
        <Link href="#">Contact Us</Link>
      </div>
      <div className="get-started m-2">
        <Link href="/simulations"><Button className="font-bold py-2">Get Started</Button></Link>
      </div>
    </nav>
  );
};

export default Navbar;
