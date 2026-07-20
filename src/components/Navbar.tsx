import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const links = [
  { label: '首页', href: '#home' },
  { label: '作品', href: '#portfolio' },
  { label: '专业能力', href: '#expertise' },
  { label: '服务流程', href: '#workflow' },
  { label: '联系我', href: '#contact' },
];

// 新增接收 onNavClick 函数
export default function Navbar({ onNavClick }: { onNavClick?: (href: string) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    if (onNavClick) {
      onNavClick(href);
    } else {
      if (href === '#home') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 sm:pt-4"
    >
      <div className={`glass-nav flex w-full max-w-6xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 sm:px-6 ${scrolled ? 'shadow-[0_8px_40px_-12px_rgba(255,107,0,0.25)]' : ''}`}>
        <button onClick={() => go('#home')} className="group flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight text-white sm:text-xl">
            测试测试测试<span className="text-ember-500">视觉</span>
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-ember-500 shadow-[0_0_10px_2px_rgba(255,107,0,0.7)] transition-transform group-hover:scale-150" />
        </button>
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <button key={l.href} onClick={() => go(l.href)} className="group relative px-4 py-2 text-sm text-neutral-300 transition-colors hover:text-white">
              {l.label}
              <span className="absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-ember-500 to-transparent transition-transform duration-300 group-hover:scale-x-100" />
            </button>
          ))}
        </div>
        <button onClick={() => setOpen((v) => !v)} className="rounded-lg p-2 text-neutral-200 hover:text-ember-500 md:hidden" aria-label="菜单">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="glass-nav absolute left-4 right-4 top-[68px] rounded-2xl p-3 md:hidden">
            {links.map((l) => (
              <button key={l.href} onClick={() => go(l.href)} className="block w-full rounded-xl px-4 py-3 text-left text-sm text-neutral-200 transition-colors hover:bg-ember-500/10 hover:text-ember-400">
                {l.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}