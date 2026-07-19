import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: 'Timeless Elegance',
    subtitle: 'New Collection 2026',
    description: 'Discover our exquisite collection of handcrafted jewellery designed to celebrate life\'s most precious moments.',
    cta: 'Shop Collection',
    ctaLink: '/products',
    image: 'https://images.unsplash.com/photo-1515562141589-67f0d6ce4819?w=1600&h=900&fit=crop',
  },
  {
    id: 2,
    title: 'Bridal Splendour',
    subtitle: 'Wedding Season Exclusive',
    description: 'Make your special day unforgettable with our stunning bridal jewellery collection crafted for royalty.',
    cta: 'View Bridal Sets',
    ctaLink: '/categories/bridal',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1600&h=900&fit=crop',
  },
  {
    id: 3,
    title: 'Diamond Dreams',
    subtitle: 'Certified Brilliance',
    description: 'Each diamond is hand-selected for exceptional clarity, cut, and fire. Experience true luxury with Aparna Aura.',
    cta: 'Explore Diamonds',
    ctaLink: '/categories/rings',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&h=900&fit=crop',
  },
];

const HeroSlider = memo(() => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goToSlide = useCallback((index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = SLIDES[current];

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-[#382135]">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#382135]/90 via-[#382135]/60 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-xl">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-[#D4AF37] text-sm md:text-base font-medium uppercase tracking-[0.3em] mb-4"
              >
                {slide.subtitle}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
              >
                {slide.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-md"
              >
                {slide.description}
              </motion.p>
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                href={slide.ctaLink}
                className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#382135] font-semibold px-8 py-4 rounded-full hover:bg-[#e0c55c] transition-all duration-300 text-sm uppercase tracking-wider"
              >
                {slide.cta}
                <ChevronRight size={18} />
              </motion.a>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-[#D4AF37] hover:text-[#382135] backdrop-blur-sm transition-all duration-300"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-[#D4AF37] hover:text-[#382135] backdrop-blur-sm transition-all duration-300"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? 'w-8 h-2 bg-[#D4AF37]'
                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
});

HeroSlider.displayName = 'HeroSlider';

export default HeroSlider;
