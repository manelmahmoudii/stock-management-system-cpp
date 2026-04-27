// src/components/Hero.jsx
import heroImg from '/client/imagesClient/hero/image-1.jpg';
import smartwatchImg from '/client/imagesClient/hero/image-2.png';
import tabletImg from '/client/imagesClient/hero/image-3.png';
import phoneImg from '/client/imagesClient/hero/image-4.png';

export default function Hero() {
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 xl:px-0">
        <div className="grid gap-2.5 grid-cols-1 md:grid-cols-2 xl:grid-cols-[581px_339px_339px]">
          {/* Grande carte VR */}
          <div className="relative overflow-hidden rounded-xl">
            <img className="hero-img w-full h-full object-cover" alt="Hero image" src={heroImg} />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent"></div>
            <div className="absolute bottom-0 left-0 z-10 w-full p-5 sm:p-6 lg:p-10">
              <span className="mb-3 inline-flex rounded-full bg-white px-2.5 py-1 text-sm font-medium">Just Launched</span>
              <h3 className="mb-3 text-2xl sm:text-3xl lg:text-4xl font-medium text-white">Immersive VR Experience</h3>
              <p className="mb-8 max-w-xs text-sm sm:text-base leading-6 text-white/80">Feel every detail with smooth motion, clear visuals, and total comfort.</p>
              <a className="inline-flex items-center justify-center rounded-lg bg-violet-500 px-4 py-2.5 text-white font-medium transition hover:bg-violet-600" href="/shop">Discover Collection</a>
            </div>
          </div>
          {/* Colonne du milieu */}
          <div className="grid gap-2.5">
            <a className="flex flex-col items-center rounded-xl bg-indigo-500/10 p-6 text-center" href="/shop">
              <span className="mb-2.5 inline-flex rounded bg-white px-3 py-1 text-sm text-gray-700">Just Launched</span>
              <p className="mb-3 text-base font-normal text-gray-700">Style That Moves With You</p>
              <img className="max-w-full category-img w-1000 h-50 object-contain" alt="Smartwatch" src={smartwatchImg} />
            </a>
            <a className="flex flex-col items-center rounded-xl bg-sky-500/10 p-6 text-center" href="/shop">
              <span className="mb-2.5 inline-flex rounded bg-white px-3 py-1 text-sm text-gray-700">Tablet</span>
              <p className="text-base font-normal text-gray-700">A Bigger Screen for Bigger Ideas</p>
              <img className="max-w-full category-img w-1000 h-50 object-contain" alt="Tablet" src={tabletImg} />
            </a>
          </div>
          {/* Dernière carte */}
          <div className="rounded-xl bg-blue-500/10 p-6 md:col-span-2 xl:col-span-1">
            <a className="flex flex-col items-center justify-center text-center" href="/shop">
              <span className="mb-2.5 inline-flex rounded bg-white px-3 py-1 text-sm text-gray-700">Smartphone</span>
              <p className="mb-6 text-base font-normal text-gray-700">Power and Performance Designed for Everyday Use</p>
              <img className="max-w-full category-img w-1000 h-100  object-contain" alt="Smartphone" src={phoneImg} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}