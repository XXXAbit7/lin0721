// @ts-nocheck
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

export interface WorkItem {
  id: string;
  title: string;
  category: string;
  src: string;
}

// ==========================================
// [可修改] 作品板块排序方向配置：
// 'asc'  = 按上传先后正序排列（先上传的排前面，后上传的依次往后排）
// 'desc' = 按上传先后倒序排列（最新上传的图片排在最前面）
// ==========================================
const SORT_ORDER: 'asc' | 'desc' = 'asc';

// 独立文件夹配置（包含首页 banner 与 4 个作品板块）
const SECTIONS_CONFIG = [
  { key: 'bannerItems', folder: 'banner', prefix: 'bn' },
  { key: 'journalCovers', folder: 'journal', prefix: 'jc' },
  { key: 'medicalIllustrations', folder: 'medical', prefix: 'mi' },
  { key: 'materialViz', folder: 'material', prefix: 'mv' },
  { key: 'mechanismDiagrams', folder: 'mechanism', prefix: 'md' },
] as const;

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif']);

function scanSectionFolder(rootDir: string, folder: string, prefix: string): WorkItem[] {
  const dirPath = path.resolve(rootDir, 'public', 'linimg', folder);

  // 如果独立文件夹不存在，自动创建
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

  // 读取当前文件夹下的所有图片文件
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const imageFiles = entries
    .filter((entry) => {
      if (!entry.isFile() || entry.name.startsWith('.')) return false;
      const ext = path.extname(entry.name).toLowerCase();
      return IMAGE_EXTENSIONS.has(ext);
    })
    .map((entry) => {
      const fullPath = path.join(dirPath, entry.name);
      const stat = fs.statSync(fullPath);
      const timestamp = stat.birthtimeMs || stat.ctimeMs || stat.mtimeMs;
      return {
        name: entry.name,
        timestamp,
      };
    });

  const currentFileSet = new Set(imageFiles.map((f) => f.name));

  // 1. 保留仍在文件夹中的已记录图片（维持原有上传顺序）
  const validSavedOrder = savedOrder.filter((name) => currentFileSet.has(name));
  const recordedSet = new Set(validSavedOrder);

  // 2. 找出新放入的图片，按放入时间戳排序（若同时拖入多张则按文件名自然顺序）
  const newlyAdded = imageFiles
    .filter((f) => !recordedSet.has(f.name))
    .sort((a, b) => {
      if (a.timestamp !== b.timestamp) return a.timestamp - b.timestamp;
      return a.name.localeCompare(b.name, 'zh-CN', { numeric: true });
    })
    .map((f) => f.name);

  // 3. 合并上传顺序并写入 .upload-order.json 持久化保存
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

  // banner 文件夹始终按上传正序记录，其余板块按 SORT_ORDER 排列
  const orderedList =
    folder === 'banner'
      ? finalUploadOrder
      : SORT_ORDER === 'desc'
        ? [...finalUploadOrder].reverse()
        : finalUploadOrder;

  // 4. 自动将文件名（去掉扩展名）作为网页展示区域的文字 title
  return orderedList.map((fileName, index) => {
    const titleText = path.parse(fileName).name;
    const encodedFileName = encodeURIComponent(fileName);
    return {
      id: `${prefix}_${index + 1}_${fileName}`,
      title: titleText,
      category: '',
      src: `/linimg/${folder}/${encodedFileName}`,
    };
  });
}

function autoPortfolioPlugin(): Plugin {
  const virtualModuleId = 'virtual:portfolio-data';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;
  let projectRoot = process.cwd();

  return {
    name: 'vite-plugin-auto-portfolio',
    configResolved(config) {
      projectRoot = config.root;
      for (const sec of SECTIONS_CONFIG) {
        const dirPath = path.resolve(projectRoot, 'public', 'linimg', sec.folder);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
      }
    },
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const result: Record<string, WorkItem[]> = {};
        for (const sec of SECTIONS_CONFIG) {
          result[sec.key] = scanSectionFolder(projectRoot, sec.folder, sec.prefix);
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
    configureServer(server) {
      const baseImgDir = path.resolve(projectRoot, 'public', 'linimg');
      if (!fs.existsSync(baseImgDir)) {
        fs.mkdirSync(baseImgDir, { recursive: true });
      }

      server.watcher.add(baseImgDir);

      const handleFileChange = (filePath: string) => {
        const normalized = path.normalize(filePath);
        if (!normalized.startsWith(baseImgDir)) return;
        if (path.basename(normalized) === '.upload-order.json') return;

        const mod = server.moduleGraph.getModuleById(resolvedVirtualModuleId);
        if (mod) {
          server.moduleGraph.invalidateModule(mod);
        }
        server.ws.send({ type: 'full-reload' });
      };

      server.watcher.on('add', handleFileChange);
      server.watcher.on('unlink', handleFileChange);
      server.watcher.on('change', handleFileChange);
    },
  };
}

export default defineConfig({
  plugins: [react(), autoPortfolioPlugin()],
});