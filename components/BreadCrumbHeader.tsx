"use client";

import { usePathname } from "next/navigation";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

function BreadCrumbHeader() {
  const pathName = usePathname();
  const paths = pathName === "/" ? [""] : pathName.split("/");
  return (
    <div className="flex items-center flex-start">
      <Breadcrumb>
        <BreadcrumbList>
          {paths.map((path, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink href={path} className="text-xs capitalize">
                  {path === "" ? "Home" : path}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {paths.length - 1 !== index && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

export default BreadCrumbHeader;
