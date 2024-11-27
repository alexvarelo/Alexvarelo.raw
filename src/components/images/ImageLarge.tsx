import Link from 'next/link';
import ImageBlurFallback from './ImageBlurFallback';
import { IMAGE_LARGE_WIDTH } from '@/site';

export default function ImageLarge({
  className,
  href,
  src,
  alt,
  aspectRatio,
  blurData,
  priority,
}: {
  className?: string
  href: string
  src: string
  alt: string
  aspectRatio: number
  blurData?: string
  priority?: boolean
}) {
  return (
    <Link
      href={href}
      className="active:brightness-75"
    >
      <ImageBlurFallback {...{
        className,
        src,
        alt,
        priority,
        blurDataURL: blurData,
        width: IMAGE_LARGE_WIDTH,
        height: Math.round(IMAGE_LARGE_WIDTH / aspectRatio),
      }} />
    </Link>
  );
};
ﬂ