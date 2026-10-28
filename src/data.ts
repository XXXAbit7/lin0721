import {
  bannerItems as autoBannerItems,
  journalCovers as autoJournalCovers,
  medicalIllustrations as autoMedicalIllustrations,
  materialViz as autoMaterialViz,
  mechanismDiagrams as autoMechanismDiagrams,
} from 'virtual:portfolio-data';

export type Work = { id: string; title: string; category: string; src: string };

export type PortfolioSection = {
  id: string;
  title: string;
  subtitle: string;
  folder: string;
  items: Work[];
};

// 动态滚动条的期刊名称数据
export const journals = [
  'Nature', 'Science', 'Cell', 'JACS', 'Angewandte Chemie',
  'Advanced Materials', 'PNAS', 'Nature Chemistry', 'Matter', 'Joule', 'Chem',
];

/*
 * ============================================================================
 * ★ [首页顶部 Banner 卡片配置]
 * 对应独立文件夹：public/linimg/banner/
 * - 只要把图片放进 public/linimg/banner/ 文件夹，首页右上角就会自动展示最新放入的那张图片
 * - 图片的文件名（去掉扩展名）会自动变成卡片下方的标题文字
 * ============================================================================
 */
const HERO_BANNER_TAG = '近期'; // <-- 卡片标题上方的小标签文字（随时可改）
const latestBanner = autoBannerItems[autoBannerItems.length - 1];

export const heroFeatured = {
  tag: HERO_BANNER_TAG,
  title: latestBanner ? latestBanner.title : 'JACS 2025 封面艺术',
  src: latestBanner ? latestBanner.src : '/linimg/ss (3).webp',
};

export const heroVideoSrc = '/vd/bg.mp4';
export const heroFeaturedSrc = heroFeatured.src;

/*
 * ============================================================================
 * ★ [唯一修改处] 4个作品板块名称与独立文件夹配置中心
 * 1. 板块1 对应独立文件夹：public/linimg/journal/
 * 2. 板块2 对应独立文件夹：public/linimg/medical/
 * 3. 板块3 对应独立文件夹：public/linimg/material/
 * 4. 板块4 对应独立文件夹：public/linimg/mechanism/
 * ============================================================================
 */
const SECTION_CONFIGS = [
  {
    id: 'journal',
    title: '期刊封面设计',                     // <-- 板块1名称（随时可改）
    subtitle: '主力业务 · 顶级学术期刊封面艺术', // <-- 板块1副标题（随时可改）
    folder: 'public/linimg/journal',
    rawItems: autoJournalCovers,
  },
  {
    id: 'medical',
    title: '医学插画',                         // <-- 板块2名称（随时可改）
    subtitle: '解剖 · 生理 · 病理可视化',       // <-- 板块2副标题（随时可改）
    folder: 'public/linimg/medical',
    rawItems: autoMedicalIllustrations,
  },
  {
    id: 'material',
    title: '材料化学可视化',                   // <-- 板块3名称（随时可改）
    subtitle: '分子 · 纳米 · 晶体结构',         // <-- 板块3副标题（随时可改）
    folder: 'public/linimg/material',
    rawItems: autoMaterialViz,
  },
  {
    id: 'mechanism',
    title: '机制图 / 流程图',                  // <-- 板块4名称（随时可改）
    subtitle: '信号通路 · 实验流程',            // <-- 板块4副标题（随时可改）
    folder: 'public/linimg/mechanism',
    rawItems: autoMechanismDiagrams,
  },
];

// 自动将板块名称（title）绑定到该板块下所有图片的分类标签中
export const portfolioSections: PortfolioSection[] = SECTION_CONFIGS.map((sec) => ({
  id: sec.id,
  title: sec.title,
  subtitle: sec.subtitle,
  folder: sec.folder,
  items: sec.rawItems.map((item) => ({
    ...item,
    category: sec.title,
  })),
}));

// 兼容导出
export const journalCovers: Work[] = portfolioSections.find((s) => s.id === 'journal')?.items ?? [];
export const medicalIllustrations: Work[] = portfolioSections.find((s) => s.id === 'medical')?.items ?? [];
export const materialViz: Work[] = portfolioSections.find((s) => s.id === 'material')?.items ?? [];
export const mechanismDiagrams: Work[] = portfolioSections.find((s) => s.id === 'mechanism')?.items ?? [];

// 专业工具名称列表
export const tools = ['Blender', 'Cinema 4D', 'Maya', 'ZBrush', 'Illustrator', 'Photoshop', 'PyMOL', 'Procreate'];

// 服务流程步骤
export const workflow = [
  { n: '01', title: '需求深访', desc: '深入了解研究背景、目标期刊与核心科学故事。' },
  { n: '02', title: '保密协议', desc: '所有项目数据资料与相关草稿严格加密储存，项目中止或项目结束后回收。' },
  { n: '03', title: '初稿构建', desc: '基于科学逻辑构建视觉骨架，呈现核心概念。' },
  { n: '04', title: '核对细化', desc: '支持多轮精细修改，与研究者逐项核对科学准确性。' },
  { n: '05', title: '最终交付', desc: '按期刊规格输出高分辨率文件，支持打印/屏幕/视频多规格。' },
];