"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Subjects } from "./SelectSubjectDialog";

export default function Dropdown({
  subject,
  setSubject,
}: {
  subject: Subjects | null;
  setSubject: React.Dispatch<React.SetStateAction<Subjects | null>>;
}) {

  const handleValueChange = (e: string) => {
    if(e === "physics"){
        setSubject(Subjects.PHYSICS);
    }
    else if(e === "chemistry") {
        setSubject(Subjects.CHEMITRY);
    }
    else if(e === "biology") {
        setSubject(Subjects.BIOLOGY);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{subject || "--Select Subject--"}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select Subject</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={subject as string} onValueChange={handleValueChange}>
          <DropdownMenuRadioItem value={Subjects.PHYSICS}>
            Physics
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={Subjects.CHEMITRY}>
            Chemistry
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={Subjects.BIOLOGY}>
            Biology
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
