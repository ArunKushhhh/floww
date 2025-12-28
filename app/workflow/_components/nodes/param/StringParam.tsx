"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ParamProps } from "@/types/appNode";
import { useId, useState } from "react";

export function StringParam({
  param,
  value,
  updateNodeParamValue,
}: ParamProps) {
  const id = useId();
  const [inputValue, setInputValue] = useState(value);
  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-destructive">*</p>}
      </Label>
      <Input
        id={id}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        //   updateNodeParamValue(e.target.value);
        }}
        onBlur={(e) => {
          updateNodeParamValue(e.target.value);
        }}
        placeholder="Enter value here"
        className="text-xs"
      />
      {param.helperText && (
        <p className="text-xs text-muted-foreground font-medium">
          {param.helperText}
        </p>
      )}
    </div>
  );
}
