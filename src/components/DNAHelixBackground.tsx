import { useEffect, useRef } from 'react';

// 螺旋动态 DNA 双链微观动图背景（深色）
export default function DNAHelixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let t = 0;

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // 深色基底渐变
      const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
      bg.addColorStop(0, 'rgba(15,12,8,1)');
      bg.addColorStop(1, 'rgba(5,5,5,1)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // 两条 DNA 链 + 碱基对横档
      const cx = w / 2;
      const helixHeight = h * 1.15;
      const startY = -helixHeight * 0.08;
      const amplitude = Math.min(w * 0.16, 240);
      const rungCount = 34;
      const speed = 0.012;

      const points: { x1: number; y1: number; x2: number; y2: number; depth: number }[] = [];

      for (let i = 0; i <= rungCount; i++) {
        const p = i / rungCount;
        const y = startY + p * helixHeight;
        const angle = p * Math.PI * 4 + t;
        const x1 = cx + Math.cos(angle) * amplitude;
        const x2 = cx + Math.cos(angle + Math.PI) * amplitude;
        // 深度（用于透视缩放与透明度）
        const z1 = Math.sin(angle);
        const z2 = Math.sin(angle + Math.PI);
        points.push({ x1, y1: y, x2, y2: y, depth: (z1 + z2) / 2 });
      }

      // 碱基对横档
      for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        const alpha = 0.08 + 0.22 * (Math.abs(pt.depth) + 1) / 2;
        const grad = ctx.createLinearGradient(pt.x1, pt.y1, pt.x2, pt.y2);
        grad.addColorStop(0, `rgba(255,140,50,${alpha})`);
        grad.addColorStop(0.5, `rgba(245,158,11,${alpha * 0.7})`);
        grad.addColorStop(1, `rgba(34,211,238,${alpha})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(pt.x1, pt.y1);
        ctx.lineTo(pt.x2, pt.y2);
        ctx.stroke();
      }

      // 链 A
      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        const angle = (i / rungCount) * Math.PI * 4 + t;
        const z = Math.sin(angle);
        const x = cx + Math.cos(angle) * amplitude;
        const y = points[i].y1;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const gradA = ctx.createLinearGradient(0, 0, w, 0);
      gradA.addColorStop(0, 'rgba(255,107,0,0.55)');
      gradA.addColorStop(1, 'rgba(255,180,100,0.55)');
      ctx.strokeStyle = gradA;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // 链 B
      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        const angle = (i / rungCount) * Math.PI * 4 + t + Math.PI;
        const x = cx + Math.cos(angle) * amplitude;
        const y = points[i].y1;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const gradB = ctx.createLinearGradient(0, 0, w, 0);
      gradB.addColorStop(0, 'rgba(34,211,238,0.45)');
      gradB.addColorStop(1, 'rgba(120,200,255,0.45)');
      ctx.strokeStyle = gradB;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // 碱基节点光点
      for (let i = 0; i < points.length; i++) {
        const angle = (i / rungCount) * Math.PI * 4 + t;
        const z = Math.sin(angle);
        const scale = 0.6 + (z + 1) / 2 * 0.9;
        // 链 A 节点
        const xa = cx + Math.cos(angle) * amplitude;
        const ya = points[i].y1;
        const ra = 2.4 * scale;
        const ga = ctx.createRadialGradient(xa, ya, 0, xa, ya, ra * 4);
        ga.addColorStop(0, `rgba(255,160,80,${0.7 * scale})`);
        ga.addColorStop(1, 'rgba(255,107,0,0)');
        ctx.fillStyle = ga;
        ctx.beginPath();
        ctx.arc(xa, ya, ra * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,200,140,${0.9 * scale})`;
        ctx.beginPath();
        ctx.arc(xa, ya, ra, 0, Math.PI * 2);
        ctx.fill();

        // 链 B 节点
        const xb = cx + Math.cos(angle + Math.PI) * amplitude;
        const zb = Math.sin(angle + Math.PI);
        const scaleB = 0.6 + (zb + 1) / 2 * 0.9;
        const rb = 2.4 * scaleB;
        const gb = ctx.createRadialGradient(xb, ya, 0, xb, ya, rb * 4);
        gb.addColorStop(0, `rgba(120,220,255,${0.6 * scaleB})`);
        gb.addColorStop(1, 'rgba(34,211,238,0)');
        ctx.fillStyle = gb;
        ctx.beginPath();
        ctx.arc(xb, ya, rb * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(180,230,255,${0.85 * scaleB})`;
        ctx.beginPath();
        ctx.arc(xb, ya, rb, 0, Math.PI * 2);
        ctx.fill();
      }

      // 微粒漂浮
      for (let i = 0; i < 40; i++) {
        const px = (Math.sin(i * 12.9 + t * 0.5) * 0.5 + 0.5) * w;
        const py = (Math.cos(i * 7.3 + t * 0.3) * 0.5 + 0.5) * h;
        ctx.fillStyle = `rgba(255,140,50,${0.04 + (i % 5) * 0.01})`;
        ctx.beginPath();
        ctx.arc(px, py, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      t += speed;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 -z-10 h-full w-full" aria-hidden />;
}
