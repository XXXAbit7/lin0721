import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { tools } from '../data';

// [可修改] 输出规格说明文字（显示在"专业能力"区块卡片中）
const specs = [
  '打印规格：600dpi / CMYK / 矢量输出',
  '屏幕规格：4K 高清 / 适配网页与演示',
  '视频规格：4K / 60fps / 透明通道支持',
  '源文件交付：可编辑分层工程文件',
];

export default function Expertise() {
  return (
    <section id="expertise" className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span className="text-xs uppercase tracking-[0.3em] text-ember-400">Expertise</span>
          {/* [可修改] 区块主标题文字与字号 */}
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
            工业级<br /><span className="text-gradient-ember">制作标准</span>
          </h2>
          {/* [可修改] 区块描述文字与字号 */}
          <p className="mt-6 max-w-md text-sm leading-relaxed text-neutral-300 sm:text-base">
            以工业级精度打磨每一帧画面。从分子级科学准确到电影级光影渲染，确保每一件作品既能通过同行评审，也能登上顶级期刊封面。
          </p>
        </motion.div>
        {/* [可修改] 工具图标网格列数与间距 */}
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {tools.map((t, i) => (
            <motion.div key={t} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="group relative flex items-center justify-center overflow-hidden rounded-2xl glass px-4 py-6 text-center transition-all hover:-translate-y-1">
              <span className="relative z-10 text-sm font-medium text-neutral-200 transition-colors group-hover:text-white">{t}</span>
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:from-ember-500/20 group-hover:to-gold-500/10 group-hover:opacity-100" />
              <div className="absolute -bottom-8 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full bg-ember-500/0 blur-2xl transition-all duration-500 group-hover:bg-ember-500/40" />
            </motion.div>
          ))}
        </motion.div>
      </div>
      {/* [可修改] 卡片内边距 p-8 / p-12 */}
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
        className="glass-strong relative mt-12 overflow-hidden rounded-3xl p-8 sm:p-12">
        {/* [可修改] 装饰光斑颜色与大小 */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-ember-500/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            {/* [可修改] 卡片标题文字与字号 */}
            <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">多规格清晰输出</h3>
            {/* [可修改] 卡片描述文字与字号 */}
            <p className="mt-3 max-w-md text-sm text-neutral-300 sm:text-base">
              同时支持打印、屏幕、视频清晰输出规格，满足期刊投稿、学术演讲、科研宣传等全场景需求。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {specs.map((s) => (
              <div key={s} className="flex items-start gap-3 rounded-xl glass px-4 py-3">
                <Check size={16} className="mt-0.5 shrink-0 text-ember-500" />
                <span className="text-xs text-neutral-200 sm:text-sm">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
