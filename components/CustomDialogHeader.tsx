"use client";

import { LucideIcon } from "lucide-react";
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Separator } from "./ui/separator";

interface Props {
  title?: string;
  subTitle?: string;
  icon?: LucideIcon;

  iconClassname?: string;
  titleClassname?: string;
  subTitleClassname?: string;
}

export function CustomDialogHeader(props: Props) {
  return (
    <DialogHeader>
      <DialogTitle asChild>
        <div className="flex items-center gap-2">
          {props.icon && <props.icon className={props.iconClassname} size={20} />}
          {props.title ? (
            <h1 className={props.titleClassname}>{props.title}</h1>
          ) : (
            "Create Workflow"
          )}
        </div>
      </DialogTitle>
      <DialogDescription>
        {props.subTitle ? props.subTitle : "Create a new workflow"}
      </DialogDescription>
      <Separator/>
    </DialogHeader>
  );
}
