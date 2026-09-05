export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'DISCOVER',
      description: 'Find the best fashion deals curated across top online platforms in real-time.'
    },
    {
      num: '02',
      title: 'COMPARE',
      description: 'See verified original prices, current deal rates, and genuine discounts in one minimal view.'
    },
    {
      num: '03',
      title: 'SHOP',
      description: 'Click the deal and purchase directly on Amazon, Myntra, Meesho, or Shopsy with zero markup.'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white border-b border-[#111111]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b-2 border-[#111111]">
          <div>
            <span className="text-xs font-pixel text-[#FF6A00] tracking-widest uppercase block mb-1">
              THE WORKFLOW
            </span>
            <h2 className="font-pixel text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] uppercase tracking-tight">
              HOW TARZER WORKS
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono text-[#111111]/60 uppercase tracking-wider mt-2 md:mt-0">
            TRANSPARENT AFFILIATE DISCOVERY SYSTEM
          </p>
        </div>

        {/* 3 Steps Minimal Typography Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="relative p-6 sm:p-8 bg-[#F5F5F5] border border-[#111111]/10 flex flex-col justify-between space-y-6"
            >
              {/* Big Step Number */}
              <div className="flex items-center justify-between">
                <span className="font-pixel text-5xl sm:text-6xl font-black text-[#111111]/20">
                  {step.num}
                </span>
                <span className="w-3 h-3 bg-[#FF6A00] inline-block"></span>
              </div>

              {/* Step Title & Copy */}
              <div className="space-y-2">
                <h3 className="font-pixel text-2xl sm:text-3xl font-bold text-[#111111] uppercase tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-[#111111]/70 leading-relaxed font-sans">
                  {step.description}
                </p>
              </div>

              {/* Accent bottom line */}
              <div className="pt-2">
                <div className="w-full h-1 bg-[#111111]/10">
                  <div
                    className="h-full bg-[#FF6A00]"
                    style={{ width: `${((idx + 1) / 3) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
