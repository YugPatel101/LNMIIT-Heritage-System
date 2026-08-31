import Link from "next/link";

const quickCards = [
  {
    title: "Campus Map",
    tag: "Navigation",
    image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80",
    href: "#map",
  },
  {
    title: "Departments",
    tag: "Academics",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
    href: "/departments",
  },
  {
    title: "Research Labs",
    tag: "Innovation",
    image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=600&q=80",
    href: "#labs",
  },
  {
    title: "Student Clubs",
    tag: "Campus Life",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80",
    href: "#clubs",
  },
  {
    title: "Research Centers",
    tag: "Discovery",
    image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80",
    href: "#research",
  },
  {
    title: "Hostel Life",
    tag: "Living",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
    href: "#hostels",
  },
  {
    title: "Sports Facilities",
    tag: "Athletics",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
    href: "#sports",
  },
  {
    title: "Innovation Ecosystem",
    tag: "Startups",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    href: "#innovation",
  },
  {
    title: "Heritage Audio Tour",
    tag: "Smart Guide",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80",
    href: "#audio-tour",
  },
  {
    title: "Admission Journey",
    tag: "Prospective",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
    href: "#admissions",
  },
];

export default function QuickAccess() {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-white mt-3">
            Explore Campus Modules
          </h2>
        </div>
      </div>

      {/* Horizontally Scrollable Track */}
      <div className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-thin scrollbar-thumb-neutral-800 snap-x">
        {quickCards.map((card, index) => (
          <Link
            key={index}
            href={card.href}
            className="flex-shrink-0 w-64 md:w-72 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl flex flex-col snap-start group hover:border-amber-500/40 transition duration-300 cursor-pointer"
          >
            {/* Card Image */}
            <div className="relative h-44 w-full overflow-hidden bg-neutral-950">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            </div>

            {/* Overlapping Maroon Badge */}
            <div className="px-5 -mt-4 relative z-10">
              <span className="inline-block bg-red-900 text-amber-300 text-xs font-bold px-3 py-1 rounded shadow-md border border-red-800">
                {card.tag}
              </span>
            </div>

            {/* Card Title */}
            <div className="p-5">
              <h3 className="text-lg font-serif font-bold text-neutral-100 group-hover:text-amber-400 transition">
                {card.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}