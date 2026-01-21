import { 
  HeartIcon, 
  CameraIcon, 
  PhotoIcon, 
  SparklesIcon, 
  FaceSmileIcon 
} from "@heroicons/react/24/solid";

export type AccessLevel = "basic" | "extended" | "vip";

export type Album = {
  id: string;
  title: string;
  coverImage: string;
  icon: React.ReactNode;
  isLockedFuture: boolean; 
  requiredLevel: AccessLevel; 
  description: string;
};

// Wagi poziomów dostępu
export const ACCESS_WEIGHTS: Record<AccessLevel, number> = {
  basic: 1,
  extended: 2,
  vip: 3
};

export const ALBUMS: Album[] = [
  {
    id: "wedding",
    title: "Ceremonia Ślubna",
    coverImage: "/fotki/kosciol1.jpg", 
    icon: <HeartIcon className="w-6 h-6" />,
    isLockedFuture: true,
    requiredLevel: "basic",
    description: "Oficjalne zdjęcia z zaślubin"
  },
  {
    id: "party",
    title: "Wesele i Zabawa",
    coverImage: "/fotki/Szwajcaria1.jpg", 
    icon: <CameraIcon className="w-6 h-6" />,
    isLockedFuture: true,
    requiredLevel: "basic",
    description: "Szaleństwo do białego rana"
  },
  {
    id: "us",
    title: "Nasza Historia",
    coverImage: "/fotki/raczki.jpg", 
    icon: <PhotoIcon className="w-6 h-6" />,
    isLockedFuture: false,
    requiredLevel: "basic",
    description: "Jak to się wszystko zaczęło..."
  },
  {
    id: "moments",
    title: "Najlepsze Momenty",
    coverImage: "/fotki/Szwajcaria2.jpg", 
    icon: <SparklesIcon className="w-6 h-6" />,
    isLockedFuture: false,
    requiredLevel: "extended",
    description: "Podróże, pasje i chwile warte zapamiętania"
  },
  {
    id: "memes",
    title: "Strefa 51 (VIP)",
    coverImage: "/fotki/raczki.jpg", 
    icon: <FaceSmileIcon className="w-6 h-6" />,
    isLockedFuture: false,
    requiredLevel: "vip",
    description: "Memy i zdjęcia, o których wolelibyśmy zapomnieć..."
  }
];