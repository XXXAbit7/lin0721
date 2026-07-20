import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, ShoppingBag, Copy, Check } from 'lucide-react';

const wechatId = '梁晓博测试'; // [需替换] 替换为真实微信号
const email = '梁晓博测试2'; // [需替换] 替换为真实邮箱
const taobaoUrl = 'https://scivision.taobao.com'; // [需替换] 替换为淘宝店铺链接

function CopyCard({ icon, label, value, onCopy, copied }: { icon: React.ReactNode; label: string; value: string; onCopy: () => void; copied: boolean }) {
  return (
    <button onClick={onCopy} className="group glass-strong relative flex items-center gap-4 rounded-2xl p-5 text-left transition-all hover:-translate-y-1 hover:border-ember-500/40">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ember-500/10 text-ember-500 transition-all group-hover:bg-ember-500/20">{icon}</div> {/* [可修改] 图标容器尺寸 h-12 w-12 */}
      <div className="min-w-0 flex-1">
        <div className="text-xs text-neutral-400">{label}</div>
        <div className="truncate text-sm font-medium text-white">{value}</div>
      </div>
      <div className="text-neutral-400 transition-colors group-hover:text-ember-400">
        {copied ? <Check size={18} className="text-ember-400" /> : <Copy size={18} />}
      </div>
    </button>
  );
}

export default function Contact() {
  const [copiedWx, setCopiedWx] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const copy = async (text: string, set: (v: boolean) => void) => {
    try { await navigator.clipboard.writeText(text); set(true); setTimeout(() => set(false), 2000); } catch { set(false); }
  };

  return (
    <section id="contact" className="relative overflow-hidden px-6 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-600/20 blur-[120px]" /> {/* [可修改] 背景光晕颜色/大小 */}
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-gold-500/10 blur-[100px]" />
      </div>
      <div className="relative mx-auto max-w-5xl text-center">
        <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs uppercase tracking-[0.3em] text-ember-400">Contact</motion.span> {/* [可修改] 区块英文标签 */}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mx-auto mt-4 max-w-3xl font-display text-3xl font-bold leading-tight text-white sm:text-5xl"> {/* [可修改] 区块主标题字号 */}
          {/* [可修改] 区块主标题文字 */}
          准备好让您的<span className="text-gradient-ember">科研成果</span><br />惊艳世界了吗？
        </motion.h2>
        <p className="mx-auto mt-6 max-w-xl text-sm text-neutral-300 sm:text-base"> {/* [可修改] 区块描述字号 */}
          {/* [可修改] 区块描述文字 */}
          立即开启您的科研视觉项目，让严谨的科学故事拥有震撼人心的表达。
        </p>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-12 flex justify-center">
          <a href={taobaoUrl} target="_blank" rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-ember-500 to-ember-600 px-10 py-5 text-base font-semibold text-white shadow-[0_10px_50px_-10px_rgba(255,107,0,0.6)] transition-transform hover:scale-[1.03] sm:text-lg"> {/* [可修改] 主按钮内边距/字号/阴影 */}
            <span className="pointer-events-none absolute inset-0 rounded-full opacity-70" style={{ background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)', backgroundSize: '200% 100%', animation: 'shimmer 3s linear infinite' }} />
            <ShoppingBag size={22} className="relative z-10" />
            <span className="relative z-10">访问淘宝官方店</span> {/* [可修改] 主按钮文字 */}
          </a>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
          <CopyCard icon={<MessageCircle size={22} />} label="微信咨询" value={wechatId} copied={copiedWx} onCopy={() => copy(wechatId, setCopiedWx)} /> {/* [可修改] 卡片标签文字 */}
          <CopyCard icon={<Mail size={22} />} label="邮箱联系" value={email} copied={copiedEmail} onCopy={() => copy(email, setCopiedEmail)} /> {/* [可修改] 卡片标签文字 */}
        </motion.div>
      </div>
      <div className="mx-auto mt-24 max-w-7xl border-t border-white/5 pt-8 text-center">
        <p className="text-xs text-neutral-500">© 2025 科学视觉 · 科研与医学插画设计工作室 · 保留所有权利</p> {/* [可修改] 页脚版权文字 */}
      </div>
    </section>
  );
}
