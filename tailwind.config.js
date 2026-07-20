/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // [可修改] 主题色板：ink 为深色背景，ember 为主橙红色，gold 为辅金色
        ink: { 950: '#050505', 900: '#0a0a0a', 800: '#111111', 700: '#1a1a1a' },   // [可修改] 背景深色梯度
        ember: { 400: '#FF8A33', 500: '#FF6B00', 600: '#E55A00' },                   // [可修改] 主品牌橙红色梯度
        gold: { 400: '#FBBF24', 500: '#F59E0B' },                                   // [可修改] 辅金色梯度
      },
      fontFamily: {
        // [可修改] 字体：可替换为思源黑体 / 苹方 / Inter 等
        sans: ['"PingFang SC"', '"Noto Sans SC"', '"Helvetica Neue"', 'system-ui', 'sans-serif'],
        display: ['"PingFang SC"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        breathe: {                                                                   // [可修改] 按钮呼吸光晕动画
          '0%, 100%': { boxShadow: '0 0 40px 0 rgba(255,107,0,0.45), 0 0 0 1px rgba(255,107,0,0.4) inset' },
          '50%': { boxShadow: '0 0 70px 8px rgba(255,107,0,0.65), 0 0 0 1px rgba(255,107,0,0.7) inset' },
        },
        shimmer: { '0%': { backgroundPosition: '0% 50%' }, '100%': { backgroundPosition: '200% 50%' } }, // [可修改] 流光动画
      },
      animation: { breathe: 'breathe 4s ease-in-out infinite', shimmer: 'shimmer 3s linear infinite' }, // [可修改] 动画时长/速度
    },
  },
  plugins: [],
};
