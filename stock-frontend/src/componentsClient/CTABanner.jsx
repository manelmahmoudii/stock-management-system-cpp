// src/components/CTABanner.jsx
export default function CTABanner() {
  return (
    <section className="py-10 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="rounded-xl" style={{ background: 'linear-gradient(to right, #8b5cf6, #6366f1)' }}>
          <div className="max-w-md px-5 mx-auto text-center py-8 lg:py-16 bg-black/20 rounded-xl">
            <span className="text-xl font-semibold text-white">Upgrade Your Tech Game</span>
            <h2 className="py-3 text-3xl sm:text-5xl font-semibold text-white">Get upto 30% OFF all Products</h2>
            <p className="mb-5 sm:mb-10 text-base text-white">Save up to 30% on selected smart gadgets this week. Visti our sale page and buy now.</p>
            <a className="py-2.5 px-5 bg-white rounded-lg hover:bg-white/90 text-sm font-medium inline-flex items-center justify-center text-gray-800" href="/shop">Shop The Sale</a>
          </div>
        </div>
      </div>
    </section>
  );
}