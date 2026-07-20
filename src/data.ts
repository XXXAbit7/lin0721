export type Work = { id: string; title: string; category: string; src: string };

// [可修改] 图片尺寸辅助函数：w=宽度, h=高度, q=画质(0-100)
const u = (id: string, w = 800, h = 1000) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

// [新增] 动态滚动条的期刊名称数据
export const journals = [
  'Nature', 'Science', 'Cell', 'JACS', 'Angewandte Chemie', 
  'Advanced Materials', 'PNAS', 'Nature Chemistry', 'Matter', 'Joule', 'Chem'
];

/* 
 * ==========================================
 * [可修改] 作品添加说明（支持二级页面自动排版）：
 * 1. 你可以在下面的数组中不断添加新作品。
 * 2. 首页会自动截取并只显示前 9 个作品。
 * 3. 点击“查看全部”进入二级页面后，系统会自动将这里的所有作品进行分页（每页9个）。
 * 4. 每个分类最多支持添加 45 个作品（即自动生成5页）。
 * ==========================================
 */

// 期刊封面作品
export const journalCovers: Work[] = [
  { id: 'jc1', title: 'JACS 2025 封面', category: '期刊封面设计', src: '/linimg/ss (1).webp' },
  { id: 'jc2', title: 'Nature Chemistry 封面', category: '期刊封面设计', src: '/linimg/ss (10).webp' },
  { id: 'jc3', title: 'Advanced Materials', category: '期刊封面设计', src: '/linimg/ss (11).webp' },
  { id: 'jc4', title: 'Cell 封面艺术', category: '期刊封面设计', src: '/linimg/ss (1).webp' },
  { id: 'jc5', title: 'Science 封面', category: '期刊封面设计', src: u('1554475901-45353dd4d56f') },
  { id: 'jc6', title: 'Angewandte Chemie', category: '期刊封面设计', src: u('1582719471384-894fbb16e074') },
  { id: 'jc7', title: 'PNAS 封面', category: '期刊封面设计', src: u('1532094349884-543bc11b42ec') },
  { id: 'jc8', title: 'ACS Nano', category: '期刊封面设计', src: u('1576086137411-9571c9c0b3a0') },
  { id: 'jc9', title: 'Joule 封面', category: '期刊封面设计', src: u('1554475901-45353dd4d56f') },
  { id: 'jc10', title: 'Matter 封面', category: '期刊封面设计', src: u('1582719471384-894fbb16e074') },
  { id: 'jc11', title: 'Chem 封面', category: '期刊封面设计', src: u('1532094349884-543bc11b42ec') },
  { id: 'jc12', title: 'Nano Letters', category: '期刊封面设计', src: u('1576086137411-9571c9c0b3a0') },
  { id: 'jc13', title: 'Nature Energy', category: '期刊封面设计', src: u('1554475901-45353dd4d56f') },
  { id: 'jc14', title: 'Nature Catalysis', category: '期刊封面设计', src: u('1582719471384-894fbb16e074') },
  { id: 'jc15', title: 'Chemical Reviews', category: '期刊封面设计', src: u('1532094349884-543bc11b42ec') },
  // 你可以在这里继续往下添加，直到 45 个...
];

// 医学插画作品
export const medicalIllustrations: Work[] = [
  { id: 'mi1', title: '心脏解剖示意', category: '医学插画', src: u('1559757148-5c350d0d3c56') },
  { id: 'mi2', title: '神经元突触', category: '医学插画', src: u('1576086137411-9571c9c0b3a0') },
  { id: 'mi3', title: 'DNA 双螺旋艺术', category: '医学插画', src: u('1530026405186-ed1f139313f8') },
  { id: 'mi4', title: '细胞分裂过程', category: '医学插画', src: u('1583912267550-d4cda2c0b3a0') },
  { id: 'mi5', title: '病毒结构示意', category: '医学插画', src: u('1583912267550-d4cda2c0b3a0') },
  { id: 'mi6', title: '骨骼系统解剖', category: '医学插画', src: u('1559757148-5c350d0d3c56') },
];

// 材料化学可视化作品
export const materialViz: Work[] = [
  { id: 'mv1', title: 'MOF 框架结构', category: '材料化学可视化', src: u('1582719471384-894fbb16e074') },
  { id: 'mv2', title: '纳米颗粒组装', category: '材料化学可视化', src: u('1532094349884-543bc11b42ec') },
  { id: 'mv3', title: '晶体生长过程', category: '材料化学可视化', src: u('1554475901-45353dd4d56f') },
  { id: 'mv4', title: '分子自组装', category: '材料化学可视化', src: u('1576086137411-9571c9c0b3a0') },
  { id: 'mv5', title: '催化反应机理', category: '材料化学可视化', src: u('1582719471384-894fbb16e074') },
  { id: 'mv6', title: '电镜结构重建', category: '材料化学可视化', src: u('1532094349884-543bc11b42ec') },
];

// 机制图/流程图作品
export const mechanismDiagrams: Work[] = [
  { id: 'md1', title: '信号通路机制图', category: '机制图/流程图', src: u('1576086137411-9571c9c0b3a0') },
  { id: 'md2', title: '药物递送流程', category: '机制图/流程图', src: u('1559757148-5c350d0d3c56') },
  { id: 'md3', title: '实验流程图', category: '机制图/流程图', src: u('1554475901-45353dd4d56f') },
  { id: 'md4', title: '代谢通路示意', category: '机制图/流程图', src: u('1530026405186-ed1f139313f8') },
  { id: 'md5', title: '免疫机制图', category: '机制图/流程图', src: u('1583912267550-d4cda2c0b3a0') },
  { id: 'md6', title: '基因调控网络', category: '机制图/流程图', src: u('1576086137411-9571c9c0b3a0') },
];

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

export const heroVideoSrc = '/vd/123456.mp4';
export const heroFeaturedSrc = '/linimg/ss (3).webp';