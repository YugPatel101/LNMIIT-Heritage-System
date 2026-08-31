import Link from "next/link";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import TopBar from "@/components/TopBar";

// 1. Data array for the grid items
const allDepartments = [
  {
    name: "Communication and Computer Engineering",
    slug: "cce",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Computer Science and Engineering",
    slug: "cse",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Electronics and Communication Engineering",
    slug: "ece",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Mechanical-Mechatronics Engineering",
    slug: "mme",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Physics",
    slug: "physics",
    image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Mathematics",
    slug: "mathematics",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Humanities and Social Sciences",
    slug: "hss",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80",
  },
];

export default function DepartmentsPage() {
  return (
    <main className="min-h-screen bg-[#07131e] text-white">
      <TopBar />
      <NavBar />

      {/* 1. Hero Banner with Overlay */}
      <section className="relative h-72 md:h-96 w-full flex items-center justify-center overflow-hidden">
        <Image
          src="/department-bg.jpg"
          alt="LNMIIT Campus"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-black/50" />

        <h1 className="relative z-10 text-4xl md:text-6xl font-serif text-white tracking-wide">
          Departments
        </h1>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* 2. Intro Split Header */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-neutral-800 pb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-wide text-neutral-100">
            Departments At LNMIIT
          </h2>

          <div className="md:border-l-2 md:border-cyan-600 md:pl-8">
            <p className="text-neutral-300 text-sm md:text-base leading-relaxed font-light">
              The primary objectives of LNMIIT are to create a platform,
              comparable to the best in the world, for dissemination, creation,
              and application of knowledge in the broad area.
            </p>
          </div>
        </section>

        {/* 3. Spotlight Row (Lab Photo + Description) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative h-80 w-full rounded-2xl overflow-hidden shadow-2xl border border-neutral-800">
            <Image
              src="/BE-Lab-photo.jpg"
              alt="LNMIIT Laboratory"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4">
            <p className="text-neutral-300 text-sm md:text-base leading-relaxed font-light">
              Across LNMIIT, faculty help set the global standard of excellence
              in their disciplines. They are pioneering scholars who love to
              teach. Deeply engaged in practice, they push for deeper
              understanding and fresh ideas.
            </p>

            <p className="text-neutral-300 text-sm md:text-base leading-relaxed font-light">
              In fact, many faculty actively work towards the growth of each and
              every student. The faculty members are actively carrying out
              research at the individual level as well as in collaboration with
              researchers from other reputed institutes in India.
            </p>
          </div>
        </section>

        {/* 4. All Departments Grid Section */}
        <section className="pt-8">
          {/* Section Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pb-8 border-b border-neutral-800">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-100">
              All Departments
            </h2>

            <div className="md:border-l-2 md:border-cyan-600 md:pl-8">
              <p className="text-neutral-300 text-sm md:text-base leading-relaxed font-light">
                The curriculum at LNMIIT provides broad based knowledge and
                simultaneously builds a temper for the life long process of
                learning and exploring.
              </p>
            </div>
          </div>

          {/* 4-Column Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {allDepartments.map((dept) => (
              <Link
                key={dept.slug}
                href={`/departments/${dept.slug}`}
                className="bg-[#0b1b2b] border border-cyan-700/40 hover:border-cyan-400 rounded-2xl p-4 flex flex-col items-center text-center transition duration-300 group hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]"
              >
                {/* Card Image */}
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-neutral-950">
                  <img
                    src={dept.image}
                    alt={dept.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                {/* Centered Serif Department Title */}
                <h3 className="text-lg font-serif font-medium text-neutral-100 group-hover:text-cyan-300 transition mt-6 mb-3 px-2">
                  {dept.name}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}