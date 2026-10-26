/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // [已更新] 主题色板：ink 为深邃蓝黑背景，ember 为 #4663b5 主蓝梯度，gold 为冰川青蓝辅助色梯度
        ink: { 950: '#05070f', 900: '#0a0e1c', 800: '#11172b', 700: '#1a223d' }, // [可修改] 背景深色梯度
        ember: { 400: '#6b87d6', 500: '#4663b5', 600: '#354e96' }, // [可修改] 主品牌 #4663b5 蓝色梯度
        gold: { 400: '#67c6f5', 500: '#3898d4' }, // [可修改] 辅青蓝色梯度
      },
      fontFamily: {
        // [可修改] 字体：可替换为思源黑体 / 苹方 / Inter 等
        sans: ['"PingFang SC"', '"Noto Sans SC"', '"Helvetica Neue"', 'system-ui', 'sans-serif'],
        display: ['"PingFang SC"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        breathe: { // [已更新] 按钮呼吸光晕动画（基于 #4663b5 -> rgb(70,99,181)）
          '0%, 100%': { boxShadow: '0 0 40px 0 rgba(70,99,181,0.45), 0 0 0 1px rgba(70,99,181,0.4) inset' },
          '50%': { boxShadow: '0 0 70px 8px rgba(70,99,181,0.65), 0 0 0 1px rgba(70,99,181,0.7) inset' },
        },
        shimmer: { '0%': { backgroundPosition: '0% 50%' }, '100%': { backgroundPosition: '200% 50%' } }, // [可修改] 流光动画
      },
      animation: { breathe: 'breathe 4s ease-in-out infinite', shimmer: 'shimmer 3s linear infinite' }, // [可修改] 动画时长/速度
    },
  },
  plugins: [],
};