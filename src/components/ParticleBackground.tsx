import { useEffect, useRef } from 'react';

// [可修改] 粒子背景：调整 N（粒子数量）、颜色、连线距离可改变视觉密度
export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const N = Math.min(70, Math.floor((w * h) / 26000)); // [可修改] 粒子数量上限 70
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, // [可修改] 粒子运动速度 0.25
      r: Math.random() * 1.6 + 0.4,                                     // [可修改] 粒子半径范围 0.4-2.0
    }));

    // [可修改] 三个漂浮光斑：位置 x/y、半径 r、颜色 hue、运动方向 dx/dy
    const blobs = [
      { x: w * 0.2, y: h * 0.3, r: 320, hue: 'rgba(255,107,0,0.06)', dx: 0.15, dy: 0.1 },
      { x: w * 0.8, y: h * 0.7, r: 380, hue: 'rgba(34,211,238,0.04)', dx: -0.12, dy: -0.08 },
      { x: w * 0.5, y: h * 0.5, r: 300, hue: 'rgba(245,158,11,0.05)', dx: 0.08, dy: -0.12 },
    ];

    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      blobs.forEach((b) => {
        b.x += b.dx; b.y += b.dy;
        if (b.x < -200 || b.x > w + 200) b.dx *= -1;
        if (b.y < -200 || b.y > h + 200) b.dy *= -1;
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, b.hue); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      });
      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 140) { // [可修改] 粒子连线距离阈值 140
            ctx.strokeStyle = `rgba(255,140,50,${0.12 * (1 - d / 140)})`; // [可修改] 连线颜色与透明度
            ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      pts.forEach((p) => {
        ctx.fillStyle = 'rgba(255,180,120,0.5)'; // [可修改] 粒子点颜色
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 h-full w-full opacity-70" aria-hidden />; // [可修改] 整体透明度 opacity-70
}
