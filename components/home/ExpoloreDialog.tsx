"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import React, { FormEventHandler, useState } from "react";
import Dropdown from "./Dropdown";

export enum Subjects {
  PHYSICS = "physics",
  CHEMITRY = "chemistry",
  BIOLOGY = "biology",
}

interface ExploreDialogProps {
  isOpen: boolean;
  setIsOpen: (e: boolean) => void;
  onClose: () => void;
}

const ExploreDialog = ({
  isOpen,
  setIsOpen,
  onClose,
}: ExploreDialogProps) => {
  const [subject, setSubject] = useState<Subjects | null>(Subjects.PHYSICS);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          setSubject(null);
        }
      }}
    >
      <form>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(true);
            }}
            className="text-3xl p-11 rounded-full bg-lime-800 text-white outline-none border-none"
          >
            Discover
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Other Website with similar motive</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <ul className="grid gap-3 list-disc">
              <li>
                <a
                  href="https://phet.colorado.edu/en/simulations/filter?type=html"
                  className="text-2xl text-blue-400"
                >
                  Phet
                </a>
              </li>
              <li>
                <a
                  href="https://olabs.edu.in/"
                  className="text-2xl text-blue-400"
                >
                  Olab
                </a>
              </li>
            </ul>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default ExploreDialog;
