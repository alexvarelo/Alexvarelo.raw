import Image from "next/image";
import Link from "next/link";
import { FunctionComponent } from "react";

interface PhotoCardProps {
    imgSrc: string;
    title: string;
    content: string;
    collectionId: string;
}

const PhotoCard: FunctionComponent<PhotoCardProps> = ({imgSrc, title, content, collectionId}) => {
  return (
    <div className="card lg:card-side bg-base-100 shadow-xl">
      <figure className="relative w-full sm:w-1/2 md:w-1/3 lg:w-3/4 xl:w-1/5 h-52">
        <Image
          src={imgSrc}
          alt="Album"
          layout="fill"
          objectFit="cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{content}</p>
        <div className="card-actions justify-end">
          <Link className="text-2xl" href={`/collections/${collectionId}`}>👀</Link>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
