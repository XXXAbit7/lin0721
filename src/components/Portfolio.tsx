import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import { journalCovers, medicalIllustrations, materialViz, mechanismDiagrams, type Work } from '../data';

type Section = { id: string; title: string; subtitle: string; items: Work[] };

const sections: Section[] = [
  { id: 'journal', title: '期刊封面设计', subtitle: '主力业务 · 顶级学术期刊封面艺术', items: journalCovers },
  { id: 'medical', title: '医学插画', subtitle: '解剖 · 生理 · 病理可视化', items: medicalIllustrations },
  { id: 'material', title: '材料化学可视化', subtitle: '分子 · 纳米 · 晶体结构', items: materialViz },
  { id: 'mechanism', title: '机制图 / 流程图', subtitle: '信号通路 · 实验流程', items: mechanismDiagrams },
];

function WorkCard({ work, onOpen, index }: { work: Work; onOpen: (w: Work) => void; index: number }) {
  return (
    <motion.button layout initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }} onClick={() => onOpen(work)}
      className="group glass relative block aspect-[4/5] overflow-hidden rounded-2xl text-left">
      <img src={work.src} alt={work.title} loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-ember-500/60 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute right-3 top-3 flex h-9 w-9 translate-x-12 items-center justify-center rounded-full bg-ember-500 text-white opacity-0 shadow-lg transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
        <ArrowUpRight size={18} />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="text-[10px] uppercase tracking-wider text-ember-400">{work.category}</div>
        <div className="mt-1 text-sm font-medium text-white">{work.title}</div>
      </div>
    </motion.button>
  );
}

// 修改这里：接收 id 和 onViewAll 函数
function SectionHeader({ title, subtitle, id, onViewAll }: { title: string; subtitle: string; id: string; onViewAll?: (id: string) => void }) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="font-display text-2xl font-bold text-white sm:text-3xl">{title}</motion.h2>
        <p className="mt-2 text-sm text-neutral-400">{subtitle}</p>
      </div>
      <button onClick={() => onViewAll && onViewAll(id)} className="glass rounded-full px-5 py-2 text-xs text-neutral-200 transition-all hover:border-ember-500/50 hover:text-ember-400">
        查看全部 →
      </button>
    </div>
  );
}

// 修改这里：接收 onViewAll 函数
export default function Portfolio({ onViewAll }: { onViewAll?: (id: string) => void }) {
  const [active, setActive] = useState<Work | null>(null);
  const close = useCallback(() => setActive(null), []);

  return (
    <section id="portfolio" className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-ember-400">Portfolio</span>
        <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-5xl">作品展示</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-neutral-400 sm:text-base">
          覆盖期刊封面、医学插画、材料化学可视化与机制流程图的完整科研视觉作品集。
        </p>
      </motion.div>
      {sections.map((sec) => (
        <div key={sec.id} className="mb-20">
          <SectionHeader title={sec.title} subtitle={sec.subtitle} id={sec.id} onViewAll={onViewAll} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
            {/* 修改这里：强制首页每个分类只显示前 9 个 */}
            {sec.items.slice(0, 9).map((w, i) => <WorkCard key={w.id} work={w} onOpen={setActive} index={i} />)}
          </div>
        </div>
      ))}
      <AnimatePresence>
        {active && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10"
            style={{ background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(20px)' }}>
            <button onClick={close} className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full glass-strong text-white transition-colors hover:text-ember-400" aria-label="关闭">
              <X size={22} />
            </button>
            <motion.div layoutId={active.id} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 26 }} onClick={(e) => e.stopPropagation()}
              className="glass-strong relative max-h-[85vh] overflow-hidden rounded-3xl p-2">
              <img src={active.src.replace(/w=\d+&h=\d+/, 'w=1200&h=1500')} alt={active.title} className="max-h-[80vh] w-auto rounded-2xl object-contain" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl glass px-4 py-2.5">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-ember-400">{active.category}</div>
                  <div className="text-sm font-medium text-white">{active.title}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}