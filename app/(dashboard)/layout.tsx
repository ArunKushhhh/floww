import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <div className="flex flex-col flex-1 h-screen">
        <header className="flex items-center justify-between px-6 py-4 h-[50px] container">
          Floww
        </header>
      </div>
    </div>
  );
}

export default layout;
