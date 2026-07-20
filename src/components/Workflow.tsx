import { motion } from 'framer-motion';
import { workflow } from '../data';

export default function Workflow() {
  return (
    <section id="workflow" className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-ember-400">Workflow</span>
        <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-5xl">工业交付级标准</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-neutral-400 sm:text-base">
          从需求深访到最终交付，五步标准化流程确保科学严谨与视觉品质兼得。
        </p>
      </motion.div>
      <div className="relative">
        <div className="absolute left-0 right-0 top-12 hidden h-px lg:block">
          {/* 【已修改】移除了流光动画，保留静态连接线 */}
          <div className="relative h-full w-full overflow-hidden bg-gradient-to-r from-transparent via-ember-500/30 to-transparent" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {workflow.map((step, i) => (
            <motion.div key={step.n} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="group relative">
              <div className="relative z-10 mx-auto mb-5 flex h-24 w-24 items-center justify-center lg:mx-0">
                <div className="absolute inset-0 rounded-full bg-ember-500/20 blur-xl transition-all duration-500 group-hover:bg-ember-500/40" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full glass-strong">
                  <span className="font-display text-2xl font-bold text-ember-500">{step.n}</span>
                </div>
              </div>
              {/* 【已恢复】保留了 group-hover:-translate-y-2，卡片上浮动效已恢复 */}
              <div className="glass rounded-2xl p-5 transition-all duration-300 group-hover:-translate-y-2 group-hover:border-ember-500/40">
                <h3 className="text-base font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-400">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}