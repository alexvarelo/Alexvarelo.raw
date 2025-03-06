import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Scissors, Video, Globe } from "lucide-react";
import { FC } from "react";
import { SpinningText } from "../text/SpinningText";
import { useCollectionPhotos } from "@/apis/user/CollectionPhotosApis";

interface IAboutMeProps {
  images: string[];
}

export const AboutMeGrid: FC<IAboutMeProps> = ({ images }) => {
  const { data: gridImages } = useCollectionPhotos(
    process.env.NEXT_PUBLIC_UNSPLASH_LANDING_IMAGES_COLLECTION as string,
    { page: 1, resultsPerPage: 5 }
  );
  const portfolioSections = [
    {
      icon: <Camera className="w-5 md:w-8 h-5 md:h-8 text-white" />,
      title: "STREET PHOTOGRAPHY",
      background: gridImages?.[0].urls.regular,
    },
    {
      icon: <Video className="w-5 md:w-8 h-5 md:h-8 text-white" />,
      title: "VIDEOGRAPHY",
      background: gridImages?.[1].urls.regular,
    },
    {
      icon: <Scissors className="w-5 md:w-8 h-5 md:h-8 text-white" />,
      title: "EDITING",
      background: gridImages?.[2].urls.regular,
    },
    {
      icon: <Globe className="w-5 md:w-8 h-5 md:h-8 text-white" />,
      title: "TRAVEL",
      background: gridImages?.[3].urls.regular,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div initial="hidden" animate="visible" className="mt-10">
      <motion.div
        variants={containerVariants}
        className="mx-auto grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-3 md:gap-2 md:h-[500px]"
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="md:col-span-1 md:row-span-2 md:mb-0"
        >
          <Card className="bg-blue-950 text-white p-4 md:p-6 flex flex-col justify-between h-full border-none">
            <h2 className="text-xl md:text-2xl font-bold mb-2">About me</h2>
            <div className="mb-20 mt-20 md:mb-0 md:mt-0">
              <SpinningText>Alexvarelo.RAW</SpinningText>
            </div>
            <p className="text-xs md:text-sm my-2 max-w-4xl leading-tight md:leading-normal">
              I&apos;m a software engineer and one of my biggest passions is to
              travel. 🛫
              <br className="mb-1" />
              I&apos;m based on Spain, and my hometown is one of the best places
              in earth{" "}
              <span className="bg-gradient-to-r from-green-600 to-blue-300 bg-clip-text text-transparent font-extrabold">
                Galicia
              </span>
              <br />
              One of the best things to travel for me is to carry my camera
              everywhere, so I can create custom memories, that afterwards I
              like to share.
            </p>
          </Card>
        </motion.div>

        {/* Portfolio Sections */}
        {portfolioSections.map((section, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover="hover"
            className="h-48 md:h-auto"
          >
            <Card
              className={`relative overflow-hidden group cursor-pointer bg-cover bg-center h-full rounded-2xl border-none`}
            >
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all duration-300"></div>
              {section.background && (
                <Image
                  src={section.background}
                  alt={section.title}
                  fill
                  className="absolute inset-0 object-cover brightness-[0.6] group-hover:brightness-[1] transition-all duration-300 border-none"
                />
              )}
              <CardContent className="relative z-10 h-full flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="absolute top-2 md:top-4 left-2 md:left-4"
                >
                  {section.icon}
                </motion.div>
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="absolute bottom-2 md:bottom-4 left-2 p-1 md:p-0 md:left-4 text-white font-semibold text-xs"
                >
                  {section.title}
                </motion.span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
