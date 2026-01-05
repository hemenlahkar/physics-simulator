"use client";

import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";
import CarSimulation from "@/modules/simulations/CarSimulation";

const page = () => {

  const [isActive, setIsActive] = useState(false);
  const handleClick = (e: any) => {
    console.log(e);
    setIsActive(()=>true);
  }
  return (
    <div id="main-div">
      {isActive ?
      (<CarSimulation/>) :
      (<>Available simulations:
      <Button onClick={handleClick}>Car simulation</Button></>)}
    </div>
  );
};

export default page;
