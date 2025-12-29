"use client";

import { ParamProps } from "@/types/appNode";
import { Label } from "@/components/ui/label";

export function BrowserInstanceParam({ param }: ParamProps) {
  return <Label className="text-xs flex">{param.name}</Label>;
}
