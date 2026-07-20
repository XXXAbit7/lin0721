import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { journalCovers, medicalIllustrations, materialViz, mechanismDiagrams, type Work } from '../data';

const categoriesData: Record<string, { title: string; subtitle: string; items: Work[] }> = {
  'journal': { title: '期刊封面设计', subtitle: '主力业务 · 顶级学术期刊封面艺术', items: journalCovers },
  'medical': { title: '医学插画', subtitle: '解剖 · 生理 · 病理可视化', items: medicalIllustrations },
  'material': { title: '材料化学可视化', subtitle: '分子 · 纳米 · 晶体结构', items: materialViz },
  'mechanism': { title: '机制图 / 流程图', subtitle: '信号通路 · 实验流程', items: mechanismDiagrams },
};

function WorkCard({ work, onOpen, index }: { work: Work; onOpen: (w: Work) => void; index: number }) {
  return (
    <motion.button layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: (index % 3) * 0.08 }} onClick={() => onOpen(work)}
      className="group glass relative block aspect-[4/5] overflow-hidden rounded-2xl text-left w-full">
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

export default function CategoryPage({ categoryId, onBack }: { categoryId: string; onBack: () => void }) {
  const category = categoriesData[categoryId];
  const [page, setPage] = useState(1);
  const [active, setActive] = useState<Work | null>(null);
  const close = useCallback(() => setActive(null), []);

  // 每次进入该页面，或者翻页时，强制滚动到网页最顶部
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [page]);

  if (!category) return null;

  const ITEMS_PER_PAGE = 9;
  // 限制最多显示 45 个作品
  const allItems = category.items.slice(0, 45);
  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
  const currentItems = allItems.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col pt-28">
      <div className="mx-auto max-w-7xl px-6 flex-1 w-full">
        {/* 返回按钮 */}
        <button onClick={onBack} className="group flex items-center gap-2 text-sm text-neutral-400 hover:text-ember-400 transition-colors mb-10">
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> 返回首页
        </button>
        
        <div className="mb-12">
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">{category.title}</h1>
          <p className="mt-3 text-sm text-neutral-400">{category.subtitle}</p>
        </div>

        {/* 作品网格 */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 mb-16">
          {currentItems.map((w, i) => <WorkCard key={w.id} work={w} onOpen={setActive} index={i} />)}
        </div>

        {/* 分页控制 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mb-20">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} 
              className="p-3 glass rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:text-ember-400 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium text-neutral-300 tracking-widest">
              {page} / {totalPages}
            </span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} 
              className="p-3 glass rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:text-ember-400 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* 专属纯净版页脚 */}
      <div className="mt-auto w-full border-t border-white/5 pt-8 pb-8 text-center bg-ink-950">
        <p className="text-xs text-neutral-500">© 2025 科学视觉 · 科研与医学插画设计工作室 · 保留所有权利</p>
      </div>

      {/* 弹窗查看器 */}
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
    </motion.div>
  );
}