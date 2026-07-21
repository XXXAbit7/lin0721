import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function AboutUs({ onBack }: { onBack: () => void }) {
  return (
    <section className="relative min-h-screen w-full pt-28 pb-12 sm:pt-36 lg:pt-40">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* 返回按钮 */}
        <button 
          onClick={onBack} 
          className="group mb-12 flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-ember-500"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> 返回首页
        </button>

        {/* 核心布局：左图右字 */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* 左侧：特效图片区域 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.92, x: -20 }} 
            animate={{ opacity: 1, scale: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
            className="relative mx-auto w-full max-w-[500px] lg:max-w-none"
          >
            {/* 复用了你首页 Hero.tsx 里的玻璃质感（glass-strong）卡片效果 */}
            <div className="glass-strong overflow-hidden rounded-3xl p-2 shadow-[0_20px_60px_-20px_rgba(255,107,0,0.45)]">
              <div className="overflow-hidden rounded-2xl">
                {/* 宽高比改为 4:3 */}
                <img 
                  src="/linimg/aboutus.jpg" 
                  alt="关于我们图片" 
                  className="aspect-[4/3] w-full object-cover" 
                />
              </div>
              <div className="px-4 py-3">
                <div className="text-[10px] uppercase tracking-wider text-ember-400">About Us</div>
                <div className="text-sm font-medium text-white">关于我们团队</div>
              </div>
            </div>
            {/* 背后发光特效 */}
            <div className="absolute -inset-4 -z-10 rounded-full bg-ember-500/20 blur-3xl" />
          </motion.div>

          {/* 右侧：文字区域（左对齐） */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-left"
          >
            <h1 className="font-display text-4xl font-bold leading-[1.2] tracking-tight text-white sm:text-5xl">
              关于 <span className="text-gradient-ember">我们的团队</span>
            </h1>
            
            <div className="mt-8 space-y-6 text-sm leading-relaxed text-neutral-300 sm:text-base">
              <p>
                我们是一支专注于科研可视化、医学插画与期刊封面艺术的专业团队。多年来，我们致力于将严谨的科学研究转化为生动、直观、富有美感的视觉艺术作品。
              </p>
              <p>
                团队成员具备深厚的学术背景和卓越的艺术表现力，能够精准把握科研的核心内容，用最前沿的视觉语言向世界讲述您的科学故事。无论是顶刊封面、复杂的机制原理图，还是三维动画演示，我们都能提供最高水准的定制化服务。
              </p>
              <p>
                期待与您合作，共同探索科学与艺术交融的无限可能，助推您的科研成果在世界舞台上闪耀。
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}