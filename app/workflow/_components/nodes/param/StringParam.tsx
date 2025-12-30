"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ParamProps } from "@/types/appNode";
import { useEffect, useId, useState } from "react";

export function StringParam({
  param,
  value,
  updateNodeParamValue,
  disabled,
}: ParamProps) {
  const id = useId();
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  let Component: any = Input;
  if (param.variant === "textarea") {
    Component = Textarea;
  }
  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-destructive">*</p>}
      </Label>
      <Component
        id={id}
        disabled={disabled}
        value={inputValue}
        onChange={(e: any) => {
          setInputValue(e.target.value);
          //   updateNodeParamValue(e.target.value);
        }}
        onBlur={(e: any) => {
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
