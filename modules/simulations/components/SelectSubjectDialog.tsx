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

interface SelectSubjectDialogProps {
  isOpen: boolean;
  setIsOpen: (e : boolean) => void;
  onClose: () => void;
  onSubmit: (data: Subjects | null) => FormEventHandler | undefined;
}

const SelectSubjectDialog = ({
  isOpen,
  setIsOpen,
  onClose,
  onSubmit,
}: SelectSubjectDialogProps) => {
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
      <form
        onSubmit={(e) => {
          onSubmit(subject);
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant="outline"
            onClick={() => {
                setIsOpen(true)
            }}
          >
            See Simulations
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Subject</DialogTitle>
            <DialogDescription>
              Select the subject to see the available simulations
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Subject</Label>
              <Dropdown subject={subject} setSubject={setSubject} />
            </div>
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
            <Button type="submit" onClick={() => {
                onSubmit(subject)
            }}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default SelectSubjectDialog;
