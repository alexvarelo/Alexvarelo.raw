"use client";

import { cn } from "@/lib/utils";
import { BsDownload } from "react-icons/bs";

interface DownloadButtonProps {
  url: string;
  className?: string;
  filename?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  url,
  className,
  filename = "photo.jpg"
}) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className={cn(
        "px-4 py-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all flex items-center gap-2",
        className
      )}
    >
      <BsDownload size={16} />
      <span>Download</span>
    </button>
  );
}; 