import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center text-white text-center overflow-hidden border-b border-neutral-800">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/lnmiit_view.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-[1px]" />

      {/* Hero Content */}  
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 space-y-6">

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-100 font-serif">
          Explore the Legacy of LNMIIT
        </h1>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="#explore"
            className="bg-neutral-900/80 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-lg"
          >
            Explore LNMIIT
          </Link>
          <Link
            href="#heritage"
            className="bg-neutral-900/80 hover:bg-red-700 text-white border border-neutral-700 px-6 py-3 rounded-lg font-medium transition"
          >
            Discover Our Heritage
          </Link>
          <Link
            href="#tour"
            className="bg-neutral-900/80 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Take a Virtual Tour
          </Link>
          <Link
            href="#stories"
            className="bg-neutral-900/80 hover:bg-red-700 text-white border border-neutral-700 px-6 py-3 rounded-lg font-medium transition"
          >
            Listen to Campus Stories
          </Link>
        </div>
      </div>
    </section>
  );
}