import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const SLIDE_DURATION = 6000;

// Floating gold particle
const GoldParticle = ({ delay, size, left, duration }) => (
  <motion.div
    className="absolute rounded-full bg-[#D4AF37]/20"
    style={{ width: size, height: size, left: `${left}%` }}
    initial={{ y: '100%', opacity: 0 }}
    animate={{ y: '-100%', opacity: [0, 0.6, 0] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
  />
);

const HeroSlider = memo(() => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToSlide = useCallback((index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
    setProgress(0);
  }, [current]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % SLIDES.length);
    setProgress(0);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    setProgress(0);
  }, []);

  // Auto-advance with progress tracking
  useEffect(() => {
    if (isPaused) return;
    const interval = 50;
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (interval / SLIDE_DURATION) * 100;
        if (next >= 100) {
          nextSlide();
          return 0;
        }
        return next;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [nextSlide, prevSlide]);

  const slide = SLIDES[current];

  return (
    <section
      className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-[#382135]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Floating gold particles */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <GoldParticle delay={0} size={4} left={15} duration={8} />
        <GoldParticle delay={1.5} size={3} left={35} duration={10} />
        <GoldParticle delay={3} size={5} left={55} duration={7} />
        <GoldParticle delay={0.5} size={3} left={75} duration={9} />
        <GoldParticle delay={2.5} size={4} left={90} duration={11} />
      </div>

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={slide.id}
          custom={direction}
          initial={(dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 })}
          animate={{ x: 0, opacity: 1 }}
          exit={(dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 })}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          {/* Background Image with Ken Burns */}
          <div className="absolute inset-0">
            <motion.img
              key={`img-${slide.id}`}
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = '/image-fallback.svg';
              }}
              initial={{ scale: 1 }}
              animate={{ scale: 1.08 }}
              transition={{ duration: SLIDE_DURATION / 1000, ease: 'linear' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#382135]/90 via-[#382135]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#382135]/40 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-xl">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-[#D4AF37] text-sm md:text-base font-medium uppercase tracking-[0.3em] mb-4"
              >
                {slide.subtitle}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                {slide.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-md"
              >
                {slide.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <Link
                  to={slide.ctaLink}
                  className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#382135] font-bold px-8 py-4 rounded-full hover:bg-[#e0c55c] transition-all duration-300 text-sm uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20 hover:shadow-xl hover:-translate-y-0.5"
                >
                  {slide.cta}
                  <ChevronRight size={18} />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 text-white hover:bg-[#D4AF37] hover:text-[#382135] backdrop-blur-sm transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 text-white hover:bg-[#D4AF37] hover:text-[#382135] backdrop-blur-sm transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className="relative h-1 rounded-full overflow-hidden transition-all duration-300 bg-white/20"
            style={{ width: i === current ? 48 : 16 }}
            aria-label={`Go to slide ${i + 1}`}
          >
            {i === current && (
              <motion.div
                className="absolute inset-0 bg-[#D4AF37] rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.05, ease: 'linear' }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
});

HeroSlider.displayName = 'HeroSlider';

export default HeroSlider;
