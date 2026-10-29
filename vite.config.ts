// @ts-nocheck
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export interface WorkItem {
  id: string;
  title: string;
  category: string;
  src: string;
}

const SECTIONS_CONFIG = [
  { key: 'iconItems', folder: 'icon', prefix: 'ic' },
  { key: 'bannerItems', folder: 'banner', prefix: 'bn' },
  { key: 'journalCovers', folder: 'journal', prefix: 'jc' },
  { key: 'medicalIllustrations', folder: 'medical', prefix: 'mi' },
  { key: 'materialViz', folder: 'material', prefix: 'mv' },
  { key: 'mechanismDiagrams', folder: 'mechanism', prefix: 'md' },
] as const;

const IMAGE_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif', '.bmp', '.jfif', '.ico',
]);

// 动态读取根目录下的 网站配置.js（带时间戳防缓存，支持保存即热更新）
async function loadUserSiteConfig(rootDir: string): Promise<any> {
  const configPath = path.resolve(rootDir, '网站配置.js');
  if (!fs.existsSync(configPath)) return null;
  try {
    const stat = fs.statSync(configPath);
    const fileUrl = `${pathToFileURL(configPath).href}?t=${stat.mtimeMs}_${Date.now()}`;
    const mod = await import(fileUrl);
    return mod.default || null;
  } catch (err) {
    console.error('[网站配置.js 读取失败，请检查标点符号是否完整]:', err);
    return null;
  }
}

function scanSectionFolder(
  rootDir: string,
  folder: string,
  prefix: string,
  sortOrder: 'asc' | 'desc'
): WorkItem[] {
  const dirPath = path.resolve(rootDir, 'public', 'linimg', folder);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const orderFilePath = path.join(dirPath, '.upload-order.json');
  let savedOrder: string[] = [];

  if (fs.existsSync(orderFilePath)) {
    try {
      const raw = fs.readFileSync(orderFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        savedOrder = parsed;
      }
    } catch {
      savedOrder = [];
    }
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const imageFiles = entries
    .filter((entry) => {
      if (!entry.isFile() || entry.name.startsWith('.')) return false;
      const ext = path.extname(entry.name).toLowerCase();
      return IMAGE_EXTENSIONS.has(ext);
    })
    .map((entry) => {
      const fullPath = path.join(dirPath, entry.name);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.size === 0) return null;
        const timestamp = Math.max(stat.ctimeMs || 0, stat.birthtimeMs || 0, stat.mtimeMs || 0);
        return {
          name: entry.name,
          timestamp,
          size: stat.size,
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean) as { name: string; timestamp: number; size: number }[];

  const currentFileMap = new Map(imageFiles.map((f) => [f.name, f]));

  const validSavedOrder = savedOrder.filter((name) => currentFileMap.has(name));
  const recordedSet = new Set(validSavedOrder);

  const newlyAdded = imageFiles
    .filter((f) => !recordedSet.has(f.name))
    .sort((a, b) => {
      if (a.timestamp !== b.timestamp) return a.timestamp - b.timestamp;
      return a.name.localeCompare(b.name, 'zh-CN', { numeric: true });
    })
    .map((f) => f.name);

  const finalUploadOrder = [...validSavedOrder, ...newlyAdded];

  if (
    newlyAdded.length > 0 ||
    validSavedOrder.length !== savedOrder.length ||
    !fs.existsSync(orderFilePath)
  ) {
    try {
      fs.writeFileSync(orderFilePath, JSON.stringify(finalUploadOrder, null, 2), 'utf-8');
    } catch {
      // 忽略只读文件系统写入异常
    }
  }

  const orderedList =
    folder === 'banner' || folder === 'icon'
      ? finalUploadOrder
      : sortOrder === 'desc'
        ? [...finalUploadOrder].reverse()
        : finalUploadOrder;

  return orderedList.map((fileName, index) => {
    const titleText = path.parse(fileName).name;
    const safeFileName = encodeURI(fileName)
      .replace(/#/g, '%23')
      .replace(/\?/g, '%3F');
    const fileInfo = currentFileMap.get(fileName);
    const cacheBuster = fileInfo ? `?v=${fileInfo.size}_${Math.floor(fileInfo.timestamp)}` : '';

    return {
      id: `${prefix}_${index + 1}_${fileName}`,
      title: titleText,
      category: '',
      src: `/linimg/${folder}/${safeFileName}${cacheBuster}`,
    };
  });
}

function autoPortfolioAndConfigPlugin(): Plugin {
  const virtualModuleId = 'virtual:portfolio-data';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;
  let projectRoot = process.cwd();

  return {
    name: 'vite-plugin-auto-portfolio-and-config',
    enforce: 'pre',
    configResolved(config) {
      projectRoot = config.root;
      for (const sec of SECTIONS_CONFIG) {
        const dirPath = path.resolve(projectRoot, 'public', 'linimg', sec.folder);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
      }
    },
    // 自动替换 index.html 的浏览器标签页标题与标签页图标（Favicon）
    async transformIndexHtml(html) {
      const cfg = await loadUserSiteConfig(projectRoot);
      let outputHtml = html;

      // 1. 替换浏览器标签页标题
      if (cfg?.browserTitle) {
        outputHtml = outputHtml.replace(/<title>[\s\S]*?<\/title>/, `<title>${cfg.browserTitle}</title>`);
      }

      // 2. 自动检测 public/linimg/icon 文件夹中的最新图标，若无则使用 网站配置.js 中的 browserIcon
      const iconItems = scanSectionFolder(projectRoot, 'icon', 'ic', 'asc');
      const latestIcon = iconItems.length > 0 ? iconItems[iconItems.length - 1].src : cfg?.browserIcon;

      if (latestIcon) {
        const cleanUrl = latestIcon.split('?')[0].toLowerCase();
        let linkTag = `<link rel="icon" type="image/png" sizes="32x32" href="${latestIcon}" />`;
        if (cleanUrl.endsWith('.svg')) {
          linkTag = `<link rel="icon" type="image/svg+xml" sizes="any" href="${latestIcon}" />`;
        } else if (cleanUrl.endsWith('.ico')) {
          linkTag = `<link rel="icon" type="image/x-icon" href="${latestIcon}" />`;
        }

        // 如果原 html 已有 rel="icon" 则替换，没有则自动插入到 </head> 前
        if (/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*>/i.test(outputHtml)) {
          outputHtml = outputHtml.replace(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*>/i, linkTag);
        } else {
          outputHtml = outputHtml.replace('</head>', `  ${linkTag}\n  </head>`);
        }
      }

      return outputHtml;
    },
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id) {
      if (id === resolvedVirtualModuleId) {
        const cfg = await loadUserSiteConfig(projectRoot);
        const sortOrder: 'asc' | 'desc' = cfg?.portfolio?.sortOrder === 'asc' ? 'asc' : 'desc';

        const result: Record<string, WorkItem[]> = {};
        for (const sec of SECTIONS_CONFIG) {
          result[sec.key] = scanSectionFolder(projectRoot, sec.folder, sec.prefix, sortOrder);
        }
        return [
          `export const bannerItems = ${JSON.stringify(result.bannerItems, null, 2)};`,
          `export const journalCovers = ${JSON.stringify(result.journalCovers, null, 2)};`,
          `export const medicalIllustrations = ${JSON.stringify(result.medicalIllustrations, null, 2)};`,
          `export const materialViz = ${JSON.stringify(result.materialViz, null, 2)};`,
          `export const mechanismDiagrams = ${JSON.stringify(result.mechanismDiagrams, null, 2)};`,
        ].join('\n');
      }
    },
    // 在内存中将 网站配置.js 的内容自动注入各个组件，无需修改原组件文件
    async transform(code, id) {
      const cleanId = id.split('?')[0].replace(/\\/g, '/');
      if (!cleanId.includes('/src/')) return null;

      const cfg = await loadUserSiteConfig(projectRoot);
      if (!cfg) return null;

      // 1. 注入 src/data.ts
      if (cleanId.endsWith('/src/data.ts')) {
        const sections = cfg.portfolio?.sections || [
          { id: 'journal', title: '期刊封面设计', subtitle: '主力业务 · 顶级学术期刊封面艺术', folder: 'public/linimg/journal' },
          { id: 'medical', title: '医学插画', subtitle: '解剖 · 生理 · 病理可视化', folder: 'public/linimg/medical' },
          { id: 'material', title: '材料化学可视化', subtitle: '分子 · 纳米 · 晶体结构', folder: 'public/linimg/material' },
          { id: 'mechanism', title: '机制图 / 流程图', subtitle: '信号通路 · 实验流程', folder: 'public/linimg/mechanism' },
        ];

        return `
import {
  bannerItems as autoBannerItems,
  journalCovers as autoJournalCovers,
  medicalIllustrations as autoMedicalIllustrations,
  materialViz as autoMaterialViz,
  mechanismDiagrams as autoMechanismDiagrams,
} from 'virtual:portfolio-data';

export type Work = { id: string; title: string; category: string; src: string };
export type PortfolioSection = { id: string; title: string; subtitle: string; folder: string; items: Work[] };

export const journals = ${JSON.stringify(cfg.journals || [])};

const latestBanner = autoBannerItems[autoBannerItems.length - 1];
export const heroFeatured = {
  tag: ${JSON.stringify(cfg.hero?.bannerTag ?? '近期')},
  title: latestBanner ? latestBanner.title : ${JSON.stringify(cfg.hero?.bannerDefaultTitle ?? 'JACS 2025 封面艺术')},
  src: latestBanner ? latestBanner.src : '/linimg/ss (3).webp',
};

export const heroVideoSrc = '/vd/bg.mp4';
export const heroFeaturedSrc = heroFeatured.src;

const rawMap: Record<string, Work[]> = {
  journal: autoJournalCovers,
  medical: autoMedicalIllustrations,
  material: autoMaterialViz,
  mechanism: autoMechanismDiagrams,
};

const userSections = ${JSON.stringify(sections)};

export const portfolioSections: PortfolioSection[] = userSections.map((sec: any) => ({
  id: sec.id,
  title: sec.title,
  subtitle: sec.subtitle,
  folder: sec.folder,
  items: (rawMap[sec.id] || []).map((item) => ({
    ...item,
    category: sec.title,
  })),
}));

export const journalCovers: Work[] = portfolioSections.find((s) => s.id === 'journal')?.items ?? [];
export const medicalIllustrations: Work[] = portfolioSections.find((s) => s.id === 'medical')?.items ?? [];
export const materialViz: Work[] = portfolioSections.find((s) => s.id === 'material')?.items ?? [];
export const mechanismDiagrams: Work[] = portfolioSections.find((s) => s.id === 'mechanism')?.items ?? [];

export const tools = ${JSON.stringify(cfg.expertise?.tools || [])};
export const workflow = ${JSON.stringify(cfg.workflowSection?.steps || [])};
`;
      }

      let updated = code;

      // 2. 注入 Navbar.tsx
      if (cleanId.endsWith('/Navbar.tsx')) {
        if (cfg.navLinks) {
          updated = updated.replace(/const links = \[[\s\S]*?\];/, `const links = ${JSON.stringify(cfg.navLinks)};`);
        }
        if (cfg.brandPrefix !== undefined && cfg.brandHighlight !== undefined) {
          updated = updated.replace(
            /测试02060724\s*<span className="text-ember-500">视觉<\/span>/,
            `${cfg.brandPrefix} <span className="text-ember-500">${cfg.brandHighlight}</span>`
          );
        }
        return updated;
      }

      // 3. 注入 Hero.tsx
      if (cleanId.endsWith('/Hero.tsx') && cfg.hero) {
        const h = cfg.hero;
        if (h.stats) {
          updated = updated.replace(/const stats = \[[\s\S]*?\];/, `const stats = ${JSON.stringify(h.stats)};`);
        }
        if (h.badge !== undefined) {
          updated = updated.replace('科研可视化 · 医学插画 · 期刊封面艺术', h.badge);
        }
        if (h.titleLine1 !== undefined && h.titleHighlight !== undefined) {
          updated = updated.replace(
            /将严谨科研，<br \/>\s*<span className="text-gradient-ember">转化为视觉艺术<\/span>/,
            `${h.titleLine1}<br /><span className="text-gradient-ember">${h.titleHighlight}</span>`
          );
        }
        if (h.description !== undefined) {
          updated = updated.replace('专注于严谨学术期刊封面、医学插画与科研可视化表达。', h.description);
        }
        if (h.primaryBtnText !== undefined) {
          updated = updated.replace(/查看作品\s*<ArrowRight/, `${h.primaryBtnText} <ArrowRight`);
        }
        if (h.secondaryBtnText !== undefined) {
          updated = updated.replace('联系合作', h.secondaryBtnText);
        }
        return updated;
      }

      // 4. 注入 Portfolio.tsx
      if (cleanId.endsWith('/Portfolio.tsx') && cfg.portfolio) {
        const p = cfg.portfolio;
        if (p.englishTag !== undefined) {
          updated = updated.replace('>Portfolio</span>', `>${p.englishTag}</span>`);
        }
        if (p.title !== undefined) {
          updated = updated.replace('>作品展示</h2>', `>${p.title}</h2>`);
        }
        if (p.description !== undefined) {
          updated = updated.replace(
            '覆盖期刊封面、医学插画、材料化学可视化与机制流程图的完整科研视觉作品集。',
            p.description
          );
        }
        if (p.viewAllBtnText !== undefined) {
          updated = updated.replace('查看全部 →', p.viewAllBtnText);
        }
        return updated;
      }

      // 5. 注入 Expertise.tsx
      if (cleanId.endsWith('/Expertise.tsx') && cfg.expertise) {
        const e = cfg.expertise;
        if (e.specs) {
          updated = updated.replace(/const specs = \[[\s\S]*?\];/, `const specs = ${JSON.stringify(e.specs)};`);
        }
        if (e.englishTag !== undefined) {
          updated = updated.replace('>Expertise</span>', `>${e.englishTag}</span>`);
        }
        if (e.titleLine1 !== undefined && e.titleHighlight !== undefined) {
          updated = updated.replace(
            /工业级<br \/><span className="text-gradient-ember">制作标准<\/span>/,
            `${e.titleLine1}<br /><span className="text-gradient-ember">${e.titleHighlight}</span>`
          );
        }
        if (e.description !== undefined) {
          updated = updated.replace(
            '以工业级精度打磨每一帧画面。从分子级科学准确到电影级光影渲染，确保每一件作品既能通过同行评审，也能登上顶级期刊封面。',
            e.description
          );
        }
        if (e.cardTitle !== undefined) {
          updated = updated.replace('>多规格清晰输出</h3>', `>${e.cardTitle}</h3>`);
        }
        if (e.cardDescription !== undefined) {
          updated = updated.replace(
            '同时支持打印、屏幕、视频清晰输出规格，满足期刊投稿、学术演讲、科研宣传等全场景需求。',
            e.cardDescription
          );
        }
        return updated;
      }

      // 6. 注入 Workflow.tsx
      if (cleanId.endsWith('/Workflow.tsx') && cfg.workflowSection) {
        const w = cfg.workflowSection;
        if (w.englishTag !== undefined) {
          updated = updated.replace('>Workflow</span>', `>${w.englishTag}</span>`);
        }
        if (w.title !== undefined) {
          updated = updated.replace('>工业交付级标准</h2>', `>${w.title}</h2>`);
        }
        if (w.description !== undefined) {
          updated = updated.replace(
            '从需求深访到最终交付，五步标准化流程确保科学严谨与视觉品质兼得。',
            w.description
          );
        }
        return updated;
      }

      // 7. 注入 Contact.tsx
      if (cleanId.endsWith('/Contact.tsx') && cfg.contact) {
        const c = cfg.contact;
        if (c.wechatId !== undefined) {
          updated = updated.replace(/const wechatId = ['"].*?['"];/, `const wechatId = ${JSON.stringify(c.wechatId)};`);
        }
        if (c.email !== undefined) {
          updated = updated.replace(/const email = ['"].*?['"];/, `const email = ${JSON.stringify(c.email)};`);
        }
        if (c.taobaoUrl !== undefined) {
          updated = updated.replace(/const taobaoUrl = ['"].*?['"];/, `const taobaoUrl = ${JSON.stringify(c.taobaoUrl)};`);
        }
        if (c.englishTag !== undefined) {
          updated = updated.replace('>Contact</span>', `>${c.englishTag}</span>`);
        }
        if (c.titlePrefix !== undefined && c.titleHighlight !== undefined && c.titleSuffix !== undefined) {
          updated = updated.replace(
            /准备好让您的<span className="text-gradient-ember">科研成果<\/span><br \/>惊艳世界了吗？/,
            `${c.titlePrefix}<span className="text-gradient-ember">${c.titleHighlight}</span><br />${c.titleSuffix}`
          );
        }
        if (c.description !== undefined) {
          updated = updated.replace(
            '立即开启您的科研视觉项目，让严谨的科学故事拥有震撼人心的表达。',
            c.description
          );
        }
        if (c.taobaoBtnText !== undefined) {
          updated = updated.replace('>访问淘宝官方店</span>', `>${c.taobaoBtnText}</span>`);
        }
        if (c.wechatLabel !== undefined) {
          updated = updated.replace('label="微信咨询"', `label=${JSON.stringify(c.wechatLabel)}`);
        }
        if (c.emailLabel !== undefined) {
          updated = updated.replace('label="邮箱联系"', `label=${JSON.stringify(c.emailLabel)}`);
        }
        if (c.copyright !== undefined) {
          updated = updated.replace(
            '>© 2025 科学视觉 · 科研与医学插画设计工作室 · 保留所有权利</p>',
            `>${c.copyright}</p>`
          );
        }
        return updated;
      }

      // 8. 注入 CategoryPage.tsx 底部版权
      if (cleanId.endsWith('/CategoryPage.tsx') && cfg.contact?.copyright !== undefined) {
        updated = updated.replace(
          '>© 2025 科学视觉 · 科研与医学插画设计工作室 · 保留所有权利</p>',
          `>${cfg.contact.copyright}</p>`
        );
        return updated;
      }

      // 9. 注入 AboutUs.tsx
      if (cleanId.endsWith('/AboutUs.tsx') && cfg.aboutUs) {
        const a = cfg.aboutUs;
        if (a.imageSrc !== undefined) {
          updated = updated.replace('src="/linimg/aboutus.jpg"', `src=${JSON.stringify(a.imageSrc)}`);
        }
        if (a.imageEnglishTag !== undefined) {
          updated = updated.replace('>About Us</div>', `>${a.imageEnglishTag}</div>`);
        }
        if (a.imageTitle !== undefined) {
          updated = updated.replace('>关于我们团队</div>', `>${a.imageTitle}</div>`);
        }
        if (a.titlePrefix !== undefined && a.titleHighlight !== undefined) {
          updated = updated.replace(
            /关于\s*<span className="text-gradient-ember">我们的团队<\/span>/,
            `${a.titlePrefix} <span className="text-gradient-ember">${a.titleHighlight}</span>`
          );
        }
        if (Array.isArray(a.paragraphs)) {
          const paragraphsHtml = a.paragraphs.map((p: string) => `<p>${p}</p>`).join('\n              ');
          updated = updated.replace(
            /<div className="mt-8 space-y-6 text-sm leading-relaxed text-neutral-300 sm:text-base">[\s\S]*?<\/div>/,
            `<div className="mt-8 space-y-6 text-sm leading-relaxed text-neutral-300 sm:text-base">\n              ${paragraphsHtml}\n            </div>`
          );
        }
        return updated;
      }

      return null;
    },
    configureServer(server) {
      const baseImgDir = path.resolve(projectRoot, 'public', 'linimg');
      const siteConfigFile = path.resolve(projectRoot, '网站配置.js');

      if (!fs.existsSync(baseImgDir)) {
        fs.mkdirSync(baseImgDir, { recursive: true });
      }

      server.watcher.add(baseImgDir);
      server.watcher.add(siteConfigFile);

      let reloadTimer: ReturnType<typeof setTimeout> | null = null;

      const handleFileChange = (filePath: string) => {
        const normalized = path.normalize(filePath).toLowerCase();
        const normalizedBase = path.normalize(baseImgDir).toLowerCase();
        const normalizedConfig = path.normalize(siteConfigFile).toLowerCase();

        const isImgChange =
          normalized.startsWith(normalizedBase) &&
          path.basename(normalized) !== '.upload-order.json';
        const isConfigChange = normalized === normalizedConfig;

        if (!isImgChange && !isConfigChange) return;

        if (reloadTimer) clearTimeout(reloadTimer);
        reloadTimer = setTimeout(() => {
          server.moduleGraph.invalidateAll();
          server.ws.send({ type: 'full-reload' });
        }, 250);
      };

      server.watcher.on('add', handleFileChange);
      server.watcher.on('unlink', handleFileChange);
      server.watcher.on('change', handleFileChange);
    },
  };
}

export default defineConfig({
  plugins: [autoPortfolioAndConfigPlugin(), react()],
});