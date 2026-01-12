import React from "react";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

export const ChartCard = ({ title, children }: ChartCardProps) => (
  <div className="bg-white p-4 shadow border">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="h-[300px]">{children}</div>
  </div>
);
