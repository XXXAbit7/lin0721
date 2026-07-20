import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import Portfolio from './components/Portfolio';
import Expertise from './components/Expertise';
import Workflow from './components/Workflow';
import Contact from './components/Contact';
import CategoryPage from './components/CategoryPage';

export default function App() {
  // 控制当前是否展示二级页面。为 null 时代表首页
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);

  // 处理导航栏点击：如果在二级页面，先退回首页，再滚动
  const handleNavClick = (href: string) => {
    if (currentCategory) {
      setCurrentCategory(null);
      setTimeout(() => {
        if (href === '#home') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      if (href === '#home') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-ink-950 text-white">
      {/* 
        [修改要求]：删除了粒子动画 ParticleBackground，留出位置。
        以后你可以直接在这个 div 里放入你的全屏 <video> 或者 <img> 背景 
      */}
      <div className="fixed inset-0 -z-20 bg-ink-950">
        
      </div>

      <Navbar onNavClick={handleNavClick} />

      {/* 如果选中了分类，则只渲染二级页面并隐藏其余所有内容 */}
      {currentCategory ? (
        <CategoryPage categoryId={currentCategory} onBack={() => setCurrentCategory(null)} />
      ) : (
        <main>
          <Hero />
          {/* 新增的期刊动态条放在视频Banner和作品集之间 */}
          <Ticker />
          <Portfolio onViewAll={setCurrentCategory} />
          <Expertise />
          <Workflow />
          <Contact />
        </main>
      )}
    </div>
  );
}