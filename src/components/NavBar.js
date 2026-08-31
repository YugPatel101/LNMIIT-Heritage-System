import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-red-900 text-white px-6 py-4 flex items-center justify-between shadow-md">

      <div className="w-32 hidden md:block">
        {}
      </div>

      <div className="hidden md:flex space-x-6 text-sm font-medium">
        <Link href="/" className="hover:text-amber-300 transition">Home</Link>
        <Link href="#heritage" className="hover:text-amber-300 transition">Heritage</Link>
        <Link href="#tour" className="hover:text-amber-300 transition">Virtual Tour</Link>
        <Link href="#audio-guide" className="hover:text-amber-300 transition">Audio Guide</Link>
        <Link href="/departments" className="hover:text-amber-300 transition">Academics</Link>
      </div>

      <div className="flex items-center">
        <Image
          src="/LNMIIT-Logo-Text.png"   /* replace with your exact filename in public/ */
          alt="LNMIIT Logo"
          width={120}
          height={40}
          className="object-contain h-10 w-auto"
        />
      </div>

    </nav>
  );
}   