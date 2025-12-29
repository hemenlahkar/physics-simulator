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

export enum Subjects {
    PHYSICS,
    CHEMITRY,
    BIOLOGY
}

interface SelectSubjectDialogProps {
  onClose: () => void;
  onSubmit: (data:Subjects | null) => FormEventHandler | undefined;
}

const SelectSubjectDialog = ({
  onClose,
  onSubmit,
}: SelectSubjectDialogProps) => {
  const [subject, setSubject] = useState<Subjects | null>(Subjects.PHYSICS);
  const [isOpen, setIsOpen] = useState(false);
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
      <form onSubmit={(e) => {onSubmit(subject)}}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={()=>{setIsOpen(true)}}>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default SelectSubjectDialog;
