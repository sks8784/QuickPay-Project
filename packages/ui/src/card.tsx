import React from "react";

export function Card({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <div
      className="border p-6 bg-white rounded-xl bg-[#ededed]"
    >
      <h1 className="text-xl border-b pb-2 font-medium">
        {title}
      </h1>
      <div className="w-full">{children}</div>
    </div>
  );
}
