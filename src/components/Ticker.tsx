import { motion } from 'framer-motion';
import { journals } from '../data';

export default function Ticker() {
  // 定义统一的线条样式，确保两条线渲染参数 100% 一致
  const lineClass = "absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent";

  return (
    <div className="relative w-full py-6 overflow-hidden bg-transparent">
      
      {/* 统一容器，将线条、遮罩和滚动内容包裹在一起，确保对齐标准一致 */}
      <div className="relative mx-auto max-w-7xl w-full">
        
        {/* 使用统一变量渲染线条 */}
        <div className={`top-0 ${lineClass}`} />
        <div className={`bottom-0 ${lineClass}`} />

        {/* 遮罩层：作用于 max-w-7xl 内部，精准卡在容器边缘进行淡出 */}
        <div 
          className="w-full overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
          }}
        >
          <motion.div
            animate={{ x: "-50%" }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap items-center py-4"
          >
            {/* 循环数据：滚动内容 */}
            {[...journals, ...journals, ...journals].map((j, i) => (
              <span
                key={i}
                className="mx-8 sm:mx-12 font-display text-xl sm:text-2xl font-bold tracking-wider text-white/50 drop-shadow-[0_0_12px_rgba(255,107,0,0.5)]"
              >
                {j}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}