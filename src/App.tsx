import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import Portfolio from './components/Portfolio';
import Expertise from './components/Expertise';
import Workflow from './components/Workflow';
import Contact from './components/Contact';
import CategoryPage from './components/CategoryPage';
import AboutUs from './components/AboutUs'; // 引入新建的页面

export default function App() {
  // 控制当前展示的页面：null (首页), 'about' (关于我们), 或者 其他字符 (分类作品页)
  const [currentView, setCurrentView] = useState<string | null>(null);

  const handleNavClick = (href: string) => {
    // 1. 如果点击了“关于我们”，立即切换到关于我们页面
    if (href === '#about') {
      setCurrentView('about');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 2. 如果当前在二级页面（关于我们或作品集），点击了其他主页按钮
    if (currentView) {
      setCurrentView(null); // 退回主页
      setTimeout(() => {
        if (href === '#home') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // 3. 如果当前已经在主页，直接平滑滚动
      if (href === '#home') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-ink-950 text-white">
      <div className="fixed inset-0 -z-20 bg-ink-950"></div>

      <Navbar onNavClick={handleNavClick} />

      {/* 核心页面切换逻辑 */}
      {currentView === 'about' ? (
        <AboutUs onBack={() => setCurrentView(null)} />
      ) : currentView ? (
        <CategoryPage categoryId={currentView} onBack={() => setCurrentView(null)} />
      ) : (
        <main>
          <Hero />
          <Ticker />
          {/* 将状态更新函数传给作品展示组件 */}
          <Portfolio onViewAll={setCurrentView} /> 
          <Expertise />
          <Workflow />
          <Contact />
        </main>
      )}
    </div>
  );
}