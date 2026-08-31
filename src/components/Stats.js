const stats = [
  {
    value: "2002",
    label: "Foundation",
    
  },
  {
    value: "100+",
    label: "Campus Area",
    
  },
  {
    value: "2,500+",
    label: "Active Scholars",
    
  },
  {
    value: "15+",
    label: "Specialized Labs",
    
  },
  {
    value: "??",
    label: "Placement Rate",
    
  },
];

export default function Stats() {
  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      {/* Main Single Box Container */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
        
        {/* Centered Top Heading */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl md:text-4xl font-serif font-bold tracking-tight text-neutral-100 mt-3">
            LNMIIT at a Glance
          </h2>
        </div>

        {/* 5 Stats Display Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
          {stats.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-3 rounded-xl bg-neutral-950/40 border border-neutral-800/60"
            >
              <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-amber-400 font-serif">
                {item.value}
              </div>
              <div className="text-sm font-semibold text-neutral-200 mt-2">
                {item.label}
              </div>
              <p className="text-xs text-neutral-400 mt-1 leading-snug">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Small Bottom Note */}
        <div className="mt-8 pt-4 border-t border-neutral-800/70 text-center text-xs text-neutral-500">
          
        </div>

      </div>
    </section>
  );
}