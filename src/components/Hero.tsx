import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { heroVideoSrc, heroFeaturedSrc } from '../data';

const stats = [
  { num: '120+', label: '封面艺术' },
  { num: '30+', label: '顶刊发表' },
  { num: '8年', label: '专注科研可视化' },
];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yFeatured = useTransform(scrollYProgress, [0, 1], [0, -80]);  
  const yText = useTransform(scrollYProgress, [0, 1], [0, 60]);       
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);    

  // 添加状态，用来控制图片是否被放大显示
  const [isFullscreen, setIsFullscreen] = useState(false);

  const scrollTo = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section ref={ref} id="home" className="relative min-h-screen w-full overflow-hidden">
      
      {/* 修复后的视频背景区域 */}
      <div className="absolute inset-0 z-0">
        <video 
          className="h-full w-full object-cover opacity-100" 
          autoPlay 
          muted 
          loop 
          playsInline 
        > 
          <source src="/vd/bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/85 to-ink-950" /> 
      </div>

      <motion.div style={{ y: yText, opacity }} className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 pt-28 pb-12 sm:pt-36 lg:pt-40">
        <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-neutral-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember-500" />
              科研可视化 · 医学插画 · 期刊封面艺术
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl"> 
              将严谨科研，<br />
              <span className="text-gradient-ember">转化为视觉艺术</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }}
              className="mt-5 max-w-xl text-sm leading-relaxed text-neutral-300 sm:text-base"> 
              专注于严谨学术期刊封面、医学插画与科研可视化表达。
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center gap-4">
              <button onClick={() => scrollTo('#portfolio')}
                className="group relative animate-breathe overflow-hidden rounded-full bg-gradient-to-r from-ember-500 to-ember-600 px-7 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"> 
                <span className="relative z-10 flex items-center gap-2">
                  查看作品 <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </button>
              <button onClick={() => scrollTo('#contact')}
                className="glass-strong rounded-full px-7 py-3 text-sm font-semibold text-white transition-all hover:border-ember-500/50 hover:text-ember-400">
                联系合作
              </button>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-9 flex flex-wrap gap-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-2xl font-bold text-white sm:text-3xl">{s.num}</div> 
                  <div className="mt-1 text-xs text-neutral-400 sm:text-sm">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div style={{ y: yFeatured }} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="relative mx-auto w-[230px] sm:w-[260px] lg:w-full lg:max-w-[320px]"> 
            
            {/* 👇 修改点：去掉了整体放大的 hover:scale-[1.02]，加上了 group 类名，用于触发内部元素的悬浮态 */}
            <motion.div 
              layout
              onClick={() => setIsFullscreen(true)} 
              className="group glass-strong cursor-pointer overflow-hidden rounded-3xl p-2 shadow-[0_20px_60px_-20px_rgba(255,107,0,0.45)]"
            >
              <div className="overflow-hidden rounded-2xl">
                {/* 👇 修改点：将 Portfolio 里的同款动画 (duration-700 ease-out group-hover:scale-110) 移到了图片上 */}
                <img 
                  src={heroFeaturedSrc} 
                  alt="近期 JACS 2025 封面艺术" 
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                /> 
              </div>
              <div className="flex items-center justify-between px-3 py-2.5">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-ember-400">近期</div> 
                  <div className="text-sm font-medium text-white transition-colors group-hover:text-ember-400">JACS 2025 封面艺术</div> 
                </div>
                {/* 箭头也加上了悬浮变色的呼应效果 */}
                <ArrowUpRight size={18} className="text-neutral-400 transition-colors group-hover:text-ember-400" />
              </div>
            </motion.div>

            <div className="absolute -inset-4 -z-10 rounded-full bg-ember-500/20 blur-3xl" /> 
          </motion.div>
        </div>
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink-950 to-transparent" /> 

      {/* 弹出的大图全屏视图 */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setIsFullscreen(false)} 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10"
            style={{ background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(20px)' }}
          >
            <button 
              onClick={() => setIsFullscreen(false)} 
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full glass-strong text-white transition-colors hover:text-ember-400" 
              aria-label="关闭"
            >
              <X size={22} />
            </button>

            <motion.div 
              layoutId="hero-featured-image"
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 26 }} 
              onClick={(e) => e.stopPropagation()} 
              className="glass-strong relative max-h-[85vh] overflow-hidden rounded-3xl p-2"
            >
              <img src={heroFeaturedSrc.replace(/w=\d+&h=\d+/, 'w=1200&h=1500')} alt="近期 JACS 2025 封面艺术" className="max-h-[80vh] w-auto rounded-2xl object-contain" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl glass px-4 py-2.5">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-ember-400">近期</div>
                  <div className="text-sm font-medium text-white">JACS 2025 封面艺术</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </section>
  );
}