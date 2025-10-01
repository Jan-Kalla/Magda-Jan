import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-black">
      <h1 className="text-5xl font-bold">
        <span className="text-white">Strona internetowa z </span>
        <span className="text-[#8B4513]">gówna </span>
        <span className="text-white">i </span>
        <span className="text-[#D2B48C]">dykty</span>
      </h1>
      <p className="mt-4 text-xl text-white">Zapraszamy na nasz ślub! 💍</p>
    </main>
  );
}
