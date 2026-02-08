'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView, Variants } from 'framer-motion';
import Link from 'next/link';
import { Facebook, GraduationCap, Instagram, Linkedin,  MessageCircle, Phone, Twitter, Youtube } from 'lucide-react';

// Animation variants with proper typing
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const scaleIn: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Course Card Component
const CourseCard = ({ title, level, color, icon, badge, delay = 0 }: any) => {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ duration: 0.3 }}
      className="relative group"
    >
      <div className={`${color} rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden`}>
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10">
          <div className="text-white font-bold text-3xl mb-2">{title}</div>
          <div className="text-white text-lg opacity-90">{level}</div>
          {icon && <div className="absolute top-4 right-4 text-5xl">{icon}</div>}
        </div>
      </div>
      
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.3 }}
          className="mt-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-center font-semibold shadow-lg"
        >
          {badge}
        </motion.div>
      )}
    </motion.div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, color }: any) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.03, y: -5 }}
      className={`${color} rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group`}
    >
      <div className="relative">
        <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <h3 className="text-white font-bold text-2xl mb-3">{title}</h3>
        <p className="text-white/90 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

// Benefit Card Component
const BenefitCard = ({ icon, title, description, gradient }: any) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className={`${gradient} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300`}
    >
      <div className="flex flex-col items-center text-center">
        {icon && <div className="text-6xl mb-4">{icon}</div>}
        <h3 className="text-white font-bold text-xl mb-3">{title}</h3>
        <p className="text-white/90 text-base leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

// Testimonial Slider Component
const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "রাফিয়া তাসনিম",
      role: "HSC 26 Student",
      image: "👩‍🎓",
      text: "10 Minute School এর কোর্সগুলো আমার পড়াশোনায় অসাধারণ পরিবর্তন এনেছে। শিক্ষকরা অত্যন্ত দক্ষ এবং বিষয়গুলো সহজভাবে বোঝান।",
      rating: 5,
      gradient: "from-purple-600 to-pink-600"
    },
    {
      id: 2,
      name: "তানভীর হাসান",
      role: "SSC 27 Student",
      image: "👨‍🎓",
      text: "লাইভ ক্লাস এবং রেকর্ডেড লেকচার দুটোই অসাধারণ। যেকোনো সময় যেকোনো জায়গা থেকে পড়তে পারি। এটা সত্যিই গেইম চেঞ্জার!",
      rating: 5,
      gradient: "from-blue-600 to-cyan-600"
    },
    {
      id: 3,
      name: "নাজিফা আক্তার",
      role: "IELTS Student",
      image: "👩‍💼",
      text: "Munzereen Shahid স্যারের IELTS কোর্স করে আমি ৭.৫ স্কোর পেয়েছি। তার শেখানোর পদ্ধতি অনন্য এবং কার্যকর।",
      rating: 5,
      gradient: "from-green-600 to-emerald-600"
    },
    {
      id: 4,
      name: "সাকিব রহমান",
      role: "Class 9 Student",
      image: "👨‍🏫",
      text: "MCQ প্র্যাকটিস এবং মডেল টেস্টগুলো পরীক্ষার জন্য খুবই উপকারী। সপ্তাহে ১০টি লাইভ ক্লাস থাকায় সব টপিক ভালোভাবে কভার হয়।",
      rating: 5,
      gradient: "from-orange-600 to-red-600"
    },
    {
      id: 5,
      name: "ফাতিমা জাহান",
      role: "Parent",
      image: "👨‍👩‍👧",
      text: "আমার মেয়ের পড়াশোনায় উল্লেখযোগ্য উন্নতি দেখেছি। শিক্ষকরা খুবই যত্নশীল এবং নিয়মিত ফিডব্যাক দেন।",
      rating: 5,
      gradient: "from-pink-600 to-purple-600"
    },
    {
      id: 6,
      name: "আরিফ হোসেন",
      role: "HSC 27 Student",
      image: "👨‍💻",
      text: "TenTen AI সাপোর্ট ২৪/৭ পাওয়া যায়। যেকোনো সমস্যার সমাধান তাৎক্ষণিক পাই। এটা সত্যিই চমৎকার!",
      rating: 5,
      gradient: "from-teal-600 to-blue-600"
    }
  ];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection;
      if (newIndex < 0) newIndex = testimonials.length - 1;
      if (newIndex >= testimonials.length) newIndex = 0;
      return newIndex;
    });
  }, [testimonials.length]);

  // Auto-play functionality
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [paginate]);

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Slider Container */}
      <div className="relative h-[500px] md:h-[400px] flex items-center justify-center overflow-hidden">
        {/* Slides */}
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute w-full"
        >
          <div className="max-w-4xl mx-auto px-4">
            <div className={`bg-gradient-to-br ${testimonials[currentIndex].gradient} rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group cursor-grab active:cursor-grabbing`}>
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-32 -translate-y-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl transform -translate-x-24 translate-y-24" />
              
              <div className="relative z-10">
                {/* Quote icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="text-7xl text-white/20 mb-6"
                >
                  "
                </motion.div>

                {/* Testimonial text */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-xl md:text-2xl text-white leading-relaxed mb-8 min-h-[120px]"
                >
                  {testimonials[currentIndex].text}
                </motion.p>

                {/* Rating stars */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex gap-1 mb-6"
                >
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="text-yellow-400 text-2xl"
                    >
                      ⭐
                    </motion.span>
                  ))}
                </motion.div>

                {/* Author info */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
                    {testimonials[currentIndex].image}
                  </div>
                  <div>
                    <p className="text-white font-bold text-xl">
                      {testimonials[currentIndex].name}
                    </p>
                    <p className="text-white/80">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => paginate(-1)}
          className="pointer-events-auto w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-xl"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => paginate(1)}
          className="pointer-events-auto w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-xl"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-3 mt-8">
        {testimonials.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`relative h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-12 bg-gradient-to-r from-purple-500 to-pink-500' : 'w-3 bg-white/30'
            }`}
          >
            {index === currentIndex && (
              <motion.div
                layoutId="activeSlide"
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="mt-6 max-w-md mx-auto">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            key={currentIndex}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          />
        </div>
      </div>
    </div>
  );
};

// Main Home Component
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section with Space Theme */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated space background */}
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-black" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-radial from-red-500/30 via-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
          
          {/* Animated stars */}
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          {/* Hero Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Let learning be
              </span>{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                fun!
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
            >
              Complete preparation for school and
              <br /> college in one place!
            </motion.p>
          </motion.div>

          {/* Course Cards Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12"
          >
            <CourseCard 
              title="HSC 26" 
              level="HSC 26" 
              color="bg-gradient-to-br from-blue-400 to-blue-600" 
              icon="🎓"
              delay={0}
            />
            <CourseCard 
              title="HSC 27" 
              level="HSC 27" 
              color="bg-gradient-to-br from-blue-500 to-indigo-600" 
              icon="🎯"
              delay={0.1}
            />
            <CourseCard 
              title="SSC 26" 
              level="SSC 26" 
              color="bg-gradient-to-br from-orange-400 to-orange-600" 
              icon="📚"
              delay={0.2}
            />
            <CourseCard 
              title="SSC 27" 
              level="Class 10" 
              color="bg-gradient-to-br from-orange-500 to-red-500" 
              icon="✏️"
              badge="২০২৬ সালে ভর্তি চলছে"
              delay={0.3}
            />
            <CourseCard 
              title="CLASS 9" 
              level="Class 9" 
              color="bg-gradient-to-br from-green-400 to-green-600" 
              icon="📖"
              badge="২০২৬ সালে ভর্তি চলছে"
              delay={0.4}
            />
            <CourseCard 
              title="CLASS 6-8" 
              level="Class 6-8" 
              color="bg-gradient-to-br from-green-500 to-teal-600" 
              icon="🎒"
              badge="২০২৬ সালে ভর্তি চলছে"
              delay={0.5}
            />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
            >
              Free class (6-10) →
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
            >
              Free class (HSC) →
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* English Learning Section */}
      <section className="relative py-24 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Let's continue learning English
              </span>{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                online from home
              </span>
              <br />
              <span className="text-white">without interruption</span>
            </h2>
            <p className="text-xl text-gray-400">
              The best learning opportunities are both online and offline.
            </p>
          </motion.div>

          {/* English Courses Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {[
              { title: 'IELTS Course by Munzereen Shahid', tag: 'IELTS', color: 'bg-gradient-to-br from-red-500 to-pink-600' },
              { title: 'ঘরে বসে Spoken English', tag: 'Spoken', color: 'bg-gradient-to-br from-blue-500 to-cyan-600' },
              { title: 'IELTS LIVE Batch', tag: 'LIVE', color: 'bg-gradient-to-br from-purple-500 to-pink-600' },
              { title: 'Complete English Grammar Course', tag: 'Grammar', color: 'bg-gradient-to-br from-indigo-500 to-blue-600' },
              { title: 'English Communication for Professionals', tag: 'Professional', color: 'bg-gradient-to-br from-teal-500 to-green-600' },
              { title: 'IELTS Reading & Listening Mock Tests', tag: 'Mock Test', color: 'bg-gradient-to-br from-orange-500 to-red-600' },
            ].map((course, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.03, y: -5 }}
                className={`${course.color} rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-semibold mb-3">
                    {course.tag}
                  </span>
                  <h3 className="text-white font-bold text-xl mb-2">{course.title}</h3>
                  <p className="text-white/80 text-sm">Munzereen Shahid</p>
                  <div className="mt-4 flex items-center text-white/90">
                    <span className="text-sm">Explore →</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Explore →
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Learn at Your Own Pace Section */}
      <section className="relative py-24 bg-gradient-to-b from-black via-blue-900/20 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Learn online
              </span>{' '}
              <span className="text-white">at your own pace!</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto">
              Classes from the country's best teachers, recorded lectures, and uninterrupted practice are all online.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            <FeatureCard
              icon="🎥"
              title="SuperLive Class"
              description="Participate in live classes with university students and alumni and see your position in national rankings."
              color="bg-gradient-to-br from-red-600 to-pink-600"
            />
            <FeatureCard
              icon="📝"
              title="SuperPrep"
              description="Learn and identify your weaknesses through daily/weekly quizzes, MCQ banks, and full model tests."
              color="bg-gradient-to-br from-blue-600 to-indigo-600"
            />
            <FeatureCard
              icon="💬"
              title="SuperSolve"
              description="TenTen is your 24/7 learning partner. Always by your side to solve tough questions and prepare for exams."
              color="bg-gradient-to-br from-teal-600 to-cyan-600"
            />
          </motion.div>
        </div>
      </section>

      {/* Online Batches Benefits Section */}
      <section className="relative py-24 bg-gradient-to-b from-black via-purple-900/10 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Students are getting</span>{' '}
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                form Online Batches
              </span>
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <BenefitCard
              icon="📡"
              title="10 Weekly live classes"
              description=""
              gradient="bg-gradient-to-br from-gray-800 to-gray-900"
            />
            <BenefitCard
              icon="📚"
              title="Printed masterbook with extra notes"
              description=""
              gradient="bg-gradient-to-br from-gray-800 to-gray-900"
            />
            <BenefitCard
              icon=""
              title={
                <div>
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold">Super</span>
                  <span className="text-white font-bold">Prep</span>
                  <div className="text-base font-normal mt-2">Exam Preparation through Unlimited MCQ Practice</div>
                </div>
              }
              description=""
              gradient="bg-gradient-to-br from-gray-800 to-gray-900"
            />
            <BenefitCard
              icon="📹"
              title={
                <div>
                  <span className="text-cyan-400 font-semibold">Recorded classes</span>
                  <div className="text-base font-normal mt-2">is there.</div>
                </div>
              }
              description="Missed class? No issue!"
              gradient="bg-gradient-to-br from-gray-800 to-gray-900"
            />
            <BenefitCard
              icon="✍️"
              title="Homework and weekly tests in addition to classes"
              description=""
              gradient="bg-gradient-to-br from-gray-800 to-gray-900"
            />
            <BenefitCard
              icon=""
              title={
                <div>
                  <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent font-bold">Super</span>
                  <span className="text-white font-bold">Solve</span>
                  <div className="text-base font-normal mt-2">TenTen is your study partner for 24-hour doubt solving.</div>
                </div>
              }
              description=""
              gradient="bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600"
            />
          </motion.div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="relative py-24 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-pink-900/50 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent" />
              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="text-6xl text-pink-400 mb-6">"</div>
                  <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6">
                    আমার মেয়ে সায়মাৱর সাৱাৰ্জইগুলা নিয়ে আলোক স্টুৰিল কৰতো। সঠিত তাইখো না চেন মিনিট স্কুলে ভর্তি কৰানোৰ সৰ থেকে ওর এই ড্ৰফা দেখোনা। আলেখাইমুলিলিবাহা ধন্যবাদ চেন মিনিট স্কুলেৰ টিচাৰদেৰ।
                  </p>
                  <div>
                    <p className="text-white font-bold text-lg">মোহাম্মদ রফিবুল হাসান</p>
                    <p className="text-pink-400">বাবা</p>
                    <p className="text-gray-400">শিক্ষার্থী: তামান্না মেহবরিন ইসলাম</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Animated Testimonial Slider */}
      <section className="relative py-24 bg-gradient-to-b from-black via-indigo-950/20 to-black overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                What Our Students Say
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Real experiences from our learning community
            </p>
          </motion.div>

          <TestimonialSlider />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 bg-black border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 ">
            {/* Brand Section */}
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mb-6"
              >
                  <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">
                      <span className="text-primary">Tutor</span>Platform</span>
              </Link>
              <p className="text-sm text-muted-foreground mb-4">
                Connecting students with expert tutors for personalized learning experiences.
              </p>
              <div className="flex gap-4">
                <Facebook className="w-5 h-5 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer" />
                <Instagram className="w-5 h-5 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer" />
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer" />
                <Youtube className="w-5 h-5 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer" />
                <Twitter className="w-5 h-5 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer" />

              </div>
            </div>
              </motion.div>
            </div>

            {/* For Students Links */}
             <div>
              <h3 className="font-semibold mb-4">For Students</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/tutors" className="hover:text-primary">Find Tutors</Link></li>
                <li><Link href="/register" className="hover:text-primary">Sign Up</Link></li>
                <li><Link href="/dashboard" className="hover:text-primary">My Dashboard</Link></li>
                <li><Link href="/dashboard/bookings" className="hover:text-primary">My Bookings</Link></li>
              </ul>
            </div>

            {/* For Tutors Links */}
           <div>
              <h3 className="font-semibold mb-4">For Tutors</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/register" className="hover:text-primary">Become a Tutor</Link></li>
                <li><Link href="/tutor/dashboard" className="hover:text-primary">Tutor Dashboard</Link></li>
                <li><Link href="/tutor/profile" className="hover:text-primary">My Profile</Link></li>
                <li><Link href="/tutor/availability" className="hover:text-primary">Set Availability</Link></li>
              </ul>
            </div>
            {/* Company Links */}
           <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-semibold mb-4">Keep up with us at</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Call Us:+8801580496676</li>
                <li>whatsapp:+8801580496676</li>
                <li>Email:mohammad.yusuf12309@gmail.com</li>
              </ul>
              
            </div>
          </div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm"
          >
            © 2026 TutorPlatform. All rights reserved.
          </motion.div>
        </div>
      </footer>

      {/* Floating Chat Button */}
        {/* Floating Action Buttons */}
      <div className="fixed right-6 bottom-6 flex flex-col gap-4 z-50">
        <button className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] group">
          <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>
        <button className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] group">
          <Phone className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
}