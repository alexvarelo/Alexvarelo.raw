import Footer from "@/components/Footer";
import { Inter } from "next/font/google";

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white min-h-screen w-full overflow-x-hidden">
      {/* Custom Collection Header */}
      <div className="absolute top-0 left-0 z-20 md:p-8 p-4">
        <h1 className="text-lg md:text-xl font-light text-white drop-shadow-lg">
          Alejandro Varela
        </h1>
        <p className="text-xs md:text-sm text-gray-300 drop-shadow">
          Photographer
        </p>
      </div>
      {children}
      {/* Custom Collection Footer (optional) */}
    </div>
  );
}
