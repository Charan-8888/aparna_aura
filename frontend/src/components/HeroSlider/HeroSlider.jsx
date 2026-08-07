import React, { memo, useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Gem,
  Gift,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Frontend-only showcase data. Later this array can be replaced by API/database data
// without changing the component structure or visual layout.
const SHOWCASE_ITEMS = [
  {
    id: 1,
    eyebrow: 'The Royal Edit',
    title: 'Ruby Heirloom Necklace',
    note: 'Hand-finished gold, ruby tones and timeless ceremonial detail.',
    image: '/images/featured-ruby-necklace.jpg',
    link: '/products?search=kundan',
  },
  {
    id: 2,
    eyebrow: 'Signature Collection',
    title: 'Diamond Light Bracelet',
    note: 'A refined statement designed for celebrations and modern evenings.',
    image: '/images/featured-bracelet.jpg',
    link: '/products?search=bracelet',
  },
  {
    id: 3,
    eyebrow: 'New Season',
    title: 'Delicate Gold Layers',
    note: 'Fine chains and subtle brilliance for effortless everyday elegance.',
    image: '/images/featured-delicate-necklace.jpg',
    link: '/products?search=necklace',
  },
];

const AUTOPLAY_MS = 5000;

const HeroSlider = memo(() => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const goTo = useCallback((index) => {
    setCurrent((index + SHOWCASE_ITEMS.length) % SHOWCASE_ITEMS.length);
  }, []);

  const next = useCallback(() => {
    setCurrent((value) => (value + 1) % SHOWCASE_ITEMS.length);
  }, []);

  const previous = useCallback(() => {
    setCurrent((value) => (value - 1 + SHOWCASE_ITEMS.length) % SHOWCASE_ITEMS.length);
  }, []);

  useEffect(() => {
    if (isPaused || reduceMotion) return undefined;
    const timer = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [isPaused, next, reduceMotion]);

  const activeItem = SHOWCASE_ITEMS[current];

  return (
    <section
      className="relative isolate min-h-[760px] overflow-hidden bg-[#050506] pt-36 md:min-h-[850px] lg:h-[min(940px,100vh)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      aria-label="Featured jewellery collection"
    >
      <img
        src="/images/aparna-hero-jewellery.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,2,3,.97)_0%,rgba(3,3,4,.88)_32%,rgba(3,3,4,.35)_58%,rgba(3,3,4,.62)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_36%,rgba(183,132,47,.13),transparent_32%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050506] to-transparent" />

      <div className="relative mx-auto grid h-full max-w-[1480px] grid-cols-1 items-center gap-14 px-5 pb-20 sm:px-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,.72fr)] lg:gap-16 lg:px-12 xl:px-16">
        <div className="max-w-[690px] pt-8 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-7 flex items-center gap-4"
          >
            <span className="h-px w-11 bg-[#cda552]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#e0bc68]">
              The New Standard
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08 }}
            className="max-w-[650px] text-[clamp(4rem,8vw,7.4rem)] font-medium leading-[0.84] tracking-[-0.045em] text-[#fffdf8]"
          >
            Elegance,
            <span className="mt-3 block italic text-[#d5ab52]">Redefined.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 max-w-[560px] text-base leading-8 text-white/66 md:text-lg"
          >
            Exquisite jewellery shaped by master artisans—created to make everyday moments feel ceremonial and life’s milestones unforgettable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              to="/products"
              className="group inline-flex min-h-14 items-center justify-center gap-4 rounded-full bg-[linear-gradient(135deg,#f2d28a,#bd8731)] px-8 text-sm font-bold uppercase tracking-[0.13em] text-[#1b1113] shadow-[0_18px_45px_rgba(183,132,47,.22)] transition duration-300 hover:-translate-y-0.5 hover:brightness-105"
            >
              Explore Collection
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/try-on"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-[#d1aa55]/55 bg-black/30 px-8 text-sm font-semibold uppercase tracking-[0.12em] text-[#f0cf82] backdrop-blur-md transition duration-300 hover:border-[#edcc80] hover:bg-[#d1aa55]/10"
            >
              <Camera size={17} />
              Virtual Try-On
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.42 }}
            className="mt-12 grid max-w-[660px] grid-cols-1 gap-5 border-t border-white/12 pt-7 sm:grid-cols-3"
          >
            {[
              { icon: Gem, title: 'Master Crafted', note: 'Detailed by hand' },
              { icon: ShieldCheck, title: 'Certified', note: 'Authenticity assured' },
              { icon: Gift, title: 'Gift Ready', note: 'Luxury presentation' },
            ].map(({ icon: Icon, title, note }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d5ab52]/30 bg-[#d5ab52]/8 text-[#e4bd68]">
                  <Icon size={18} strokeWidth={1.6} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/90">{title}</p>
                  <p className="mt-0.5 text-[11px] tracking-wide text-white/38">{note}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative mx-auto w-full max-w-[470px] lg:mx-0 lg:justify-self-end">
          <div className="absolute -inset-10 rounded-full bg-[#b98638]/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(155deg,rgba(255,255,255,.12),rgba(255,255,255,.025))] p-3 shadow-[0_40px_90px_rgba(0,0,0,.46)] backdrop-blur-xl">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.45rem] bg-[#110d10]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeItem.id}
                  src={activeItem.image}
                  alt={activeItem.title}
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.035 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.65, ease: 'easeOut' }}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading={current === 0 ? 'eager' : 'lazy'}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = '/image-fallback.svg';
                  }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#090609] via-transparent to-black/10" />

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`copy-${activeItem.id}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: reduceMotion ? 0 : 0.35 }}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#e0b95f]">
                      {activeItem.eyebrow}
                    </p>
                    <h2 className="mt-2 text-2xl font-medium leading-tight text-white md:text-3xl">
                      {activeItem.title}
                    </h2>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-white/60">{activeItem.note}</p>
                    <Link
                      to={activeItem.link}
                      className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#e9c779] transition hover:text-white"
                    >
                      View the piece <ArrowRight size={15} />
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center justify-between px-2 pb-1 pt-4">
              <div className="flex items-center gap-2">
                {SHOWCASE_ITEMS.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goTo(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      current === index ? 'w-8 bg-[#d8af57]' : 'w-2 bg-white/24 hover:bg-white/45'
                    }`}
                    aria-label={`Show ${item.title}`}
                    aria-current={current === index ? 'true' : undefined}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={previous}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white/75 transition hover:border-[#d8af57]/60 hover:text-[#e8c36f]"
                  aria-label="Previous jewellery"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white/75 transition hover:border-[#d8af57]/60 hover:text-[#e8c36f]"
                  aria-label="Next jewellery"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSlider.displayName = 'HeroSlider';

export default HeroSlider;
