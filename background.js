/* ============================================================
   ULTRA INTERACTIVE BACKGROUND ENGINE v2
   Each section = unique visual universe — HIGH INTENSITY
   ============================================================ */
(function () {
    'use strict';

    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W, H, viewW, viewH;
    let mouse = { x: -9999, y: -9999, px: -9999, py: -9999, vx: 0, vy: 0, speed: 0, active: false };
    let scrollY = 0;
    let time = 0;
    let sections = [];

    /* ========================
       PERLIN NOISE
       ======================== */
    const PERM = new Uint8Array(512);
    const GRAD = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
    (function () {
        const p = [];
        for (let i = 0; i < 256; i++) p[i] = i;
        for (let i = 255; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
        for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
    })();

    function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    function lerp(a, b, t) { return a + t * (b - a); }

    function noise2D(x, y) {
        const xi = Math.floor(x) & 255, yi = Math.floor(y) & 255;
        const xf = x - Math.floor(x), yf = y - Math.floor(y);
        const u = fade(xf), v = fade(yf);
        const aa = PERM[PERM[xi] + yi], ab = PERM[PERM[xi] + yi + 1];
        const ba = PERM[PERM[xi + 1] + yi], bb = PERM[PERM[xi + 1] + yi + 1];
        const g = (hash, fx, fy) => { const gr = GRAD[hash & 7]; return gr[0] * fx + gr[1] * fy; };
        return lerp(lerp(g(aa, xf, yf), g(ba, xf - 1, yf), u), lerp(g(ab, xf, yf - 1), g(bb, xf - 1, yf - 1), u), v);
    }

    function fbm(x, y, oct) {
        let v = 0, a = 1, f = 1, m = 0;
        for (let i = 0; i < oct; i++) { v += noise2D(x * f, y * f) * a; m += a; a *= 0.5; f *= 2; }
        return v / m;
    }

    /* ========================
       SECTION INFO
       ======================== */
    function mapSections() {
        sections = [];
        ['hero', 'about', 'projects', 'skills', 'experience', 'contact'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const rect = el.getBoundingClientRect();
                sections.push({ id, top: rect.top + scrollY, bottom: rect.bottom + scrollY, height: rect.height });
            }
        });
    }

    function getCurrentSection(y) {
        for (const s of sections) { if (y >= s.top && y < s.bottom) return s; }
        return sections[0] || { id: 'hero', top: 0, bottom: viewH, height: viewH };
    }

    /* ========================
       COLOR SYSTEM
       ======================== */
    const palettes = {
        hero:       { p: [99,102,241], s: [168,85,247], t: [236,72,153] },
        about:      { p: [16,185,129], s: [34,197,94],  t: [5,150,105] },
        projects:   { p: [244,63,94],  s: [251,146,60], t: [234,179,8] },
        skills:     { p: [59,130,246], s: [14,165,233], t: [6,182,212] },
        experience: { p: [139,92,246], s: [168,85,247], t: [192,38,211] },
        contact:    { p: [99,102,241], s: [79,70,229],  t: [67,56,202] },
    };
    function rgba(c, a) { return `rgba(${c[0]},${c[1]},${c[2]},${a})`; }
    function mix(c1, c2, t) { return [Math.round(lerp(c1[0],c2[0],t)), Math.round(lerp(c1[1],c2[1],t)), Math.round(lerp(c1[2],c2[2],t))]; }

    /* ========================
       RESIZE
       ======================== */
    function resize() {
        viewW = window.innerWidth;
        viewH = window.innerHeight;
        W = viewW * DPR;
        H = document.documentElement.scrollHeight * DPR;
        canvas.width = W;
        canvas.height = H;
        canvas.style.width = viewW + 'px';
        canvas.style.height = document.documentElement.scrollHeight + 'px';
        mapSections();
        initAll();
    }

    /* ===============================================================
       ███  HERO — Massive Gradient Orbs + Flowing Particle Constellation
       =============================================================== */
    const hero = {
        particles: [],
        orbs: [],
        init() {
            this.particles = [];
            for (let i = 0; i < 350; i++) {
                this.particles.push({
                    x: Math.random() * viewW, y: Math.random() * viewH,
                    vx: 0, vy: 0,
                    size: Math.random() * 3 + 1,
                    speed: Math.random() * 0.5 + 0.2,
                    hue: Math.random(),
                    pulse: Math.random() * Math.PI * 2,
                });
            }
            this.orbs = [];
            for (let i = 0; i < 6; i++) {
                this.orbs.push({
                    x: Math.random() * viewW, y: Math.random() * viewH,
                    r: Math.random() * 250 + 150,
                    vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.6,
                    phase: Math.random() * Math.PI * 2,
                    colorIdx: i / 6,
                });
            }
        },
        draw(secTop, mx, my) {
            const pal = palettes.hero;

            // === MASSIVE GRADIENT ORBS ===
            for (const orb of this.orbs) {
                orb.x += Math.sin(time * 0.001 + orb.phase) * 1.2 + orb.vx;
                orb.y += Math.cos(time * 0.0008 + orb.phase) * 0.9 + orb.vy;
                // Mouse repulsion
                if (mouse.active) {
                    const dx = orb.x - mx, dy = orb.y - my;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 350) {
                        const f = (1 - dist / 350) * 4;
                        orb.x += (dx / dist) * f;
                        orb.y += (dy / dist) * f;
                    }
                }
                // Wrap
                if (orb.x < -orb.r) orb.x = viewW + orb.r;
                if (orb.x > viewW + orb.r) orb.x = -orb.r;
                if (orb.y < -orb.r) orb.y = viewH + orb.r;
                if (orb.y > viewH + orb.r) orb.y = -orb.r;

                const R = orb.r * DPR * (1 + Math.sin(time * 0.002 + orb.phase) * 0.15);
                const px = orb.x * DPR, py = (orb.y + secTop) * DPR;
                const col = mix(pal.p, pal.t, orb.colorIdx);
                const g = ctx.createRadialGradient(px, py, 0, px, py, R);
                g.addColorStop(0, rgba(col, 0.25));
                g.addColorStop(0.4, rgba(col, 0.12));
                g.addColorStop(0.7, rgba(col, 0.04));
                g.addColorStop(1, rgba(col, 0));
                ctx.beginPath(); ctx.arc(px, py, R, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
            }

            // === AURORA WAVE RIBBONS ===
            for (let w = 0; w < 4; w++) {
                ctx.beginPath();
                const baseY = (viewH * (0.2 + w * 0.15) + secTop) * DPR;
                const amp = (50 + w * 25) * DPR;
                for (let x = 0; x <= W; x += 3) {
                    const nx = x / W;
                    const wave = Math.sin(nx * 8 + time * 0.008 + w * 2) * amp
                        + Math.cos(nx * 5 + time * 0.005) * amp * 0.4
                        + fbm(nx * 3 + time * 0.0003, w * 0.5, 3) * amp * 0.5;
                    x === 0 ? ctx.moveTo(x, baseY + wave) : ctx.lineTo(x, baseY + wave);
                }
                ctx.lineTo(W, baseY + amp * 4); ctx.lineTo(0, baseY + amp * 4); ctx.closePath();
                const col = mix(pal.p, pal.s, w / 4);
                const grad = ctx.createLinearGradient(0, baseY - amp, 0, baseY + amp * 3);
                grad.addColorStop(0, rgba(col, 0.15 - w * 0.025));
                grad.addColorStop(0.5, rgba(col, 0.06));
                grad.addColorStop(1, rgba(col, 0));
                ctx.fillStyle = grad; ctx.fill();
            }

            // === FLOWING PARTICLES + CONSTELLATION ===
            const conns = [];
            for (const p of this.particles) {
                const angle = fbm(p.x * 0.003 + time * 0.0004, p.y * 0.003, 4) * Math.PI * 4;
                p.vx += Math.cos(angle) * p.speed * 0.3;
                p.vy += Math.sin(angle) * p.speed * 0.3;
                if (mouse.active) {
                    const dx = mx - p.x, dy = my - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 300) {
                        const force = (1 - dist / 300) * 4;
                        const sw = Math.atan2(dy, dx) + Math.PI * 0.5;
                        p.vx += Math.cos(sw) * force + dx * 0.003;
                        p.vy += Math.sin(sw) * force + dy * 0.003;
                    }
                }
                p.vx *= 0.93; p.vy *= 0.93;
                p.x += p.vx; p.y += p.vy; p.pulse += 0.04;
                if (p.x < -30) p.x = viewW + 30; if (p.x > viewW + 30) p.x = -30;
                if (p.y < -30) p.y = viewH + 30; if (p.y > viewH + 30) p.y = -30;

                const px = p.x * DPR, py = (p.y + secTop) * DPR;
                const sz = p.size * DPR * (1 + Math.sin(p.pulse) * 0.4);
                const alpha = 0.6 + Math.sin(p.pulse) * 0.3;
                const col = mix(pal.p, pal.t, p.hue);

                // Glow halo
                const glR = sz * 8;
                const gl = ctx.createRadialGradient(px, py, 0, px, py, glR);
                gl.addColorStop(0, rgba(col, alpha * 0.25));
                gl.addColorStop(1, rgba(col, 0));
                ctx.beginPath(); ctx.arc(px, py, glR, 0, Math.PI * 2); ctx.fillStyle = gl; ctx.fill();
                // Core
                ctx.beginPath(); ctx.arc(px, py, sz, 0, Math.PI * 2);
                ctx.fillStyle = rgba(col, alpha); ctx.fill();
                conns.push({ x: px, y: py, col, alpha });
            }
            // Connections
            const maxD = 130 * DPR;
            for (let i = 0; i < conns.length; i++) {
                for (let j = i + 1; j < conns.length; j++) {
                    const dx = conns[i].x - conns[j].x, dy = conns[i].y - conns[j].y;
                    if (Math.abs(dx) > maxD || Math.abs(dy) > maxD) continue;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < maxD) {
                        ctx.beginPath(); ctx.moveTo(conns[i].x, conns[i].y); ctx.lineTo(conns[j].x, conns[j].y);
                        ctx.strokeStyle = rgba(conns[i].col, (1 - d / maxD) * 0.2);
                        ctx.lineWidth = DPR; ctx.stroke();
                    }
                }
            }
        }
    };

    /* ===============================================================
       ███  ABOUT — Matrix Rain + Neural Network + Hex Grid
       =============================================================== */
    const about = {
        columns: [], nodes: [],
        init() {
            this.columns = [];
            const chars = 'アイウエオカキクケコサシスセソタチツテト01234ABCDEF{}[]<>';
            const colW = 22;
            for (let i = 0; i < Math.ceil(viewW / colW); i++) {
                this.columns.push({
                    x: i * colW, y: Math.random() * -600,
                    speed: Math.random() * 2.5 + 1.5,
                    length: Math.floor(Math.random() * 18) + 10,
                    opacity: Math.random() * 0.15 + 0.08,
                    chars,
                });
            }
            this.nodes = [];
            for (let i = 0; i < 60; i++) {
                this.nodes.push({
                    x: Math.random() * viewW, y: Math.random() * viewH,
                    tx: Math.random() * viewW, ty: Math.random() * viewH,
                    size: Math.random() * 5 + 2.5, pulse: Math.random() * Math.PI * 2,
                    timer: Math.random() * 200,
                });
            }
        },
        draw(secTop, secH, mx, my) {
            const pal = palettes.about;

            // === LARGE BG GRADIENT BLOBS ===
            const blobPositions = [
                { x: viewW * 0.2, y: viewH * 0.3, r: 300 },
                { x: viewW * 0.8, y: viewH * 0.6, r: 250 },
                { x: viewW * 0.5, y: viewH * 0.1, r: 200 },
            ];
            for (const blob of blobPositions) {
                const bx = blob.x * DPR, by = (blob.y + secTop) * DPR, br = blob.r * DPR;
                const drift = Math.sin(time * 0.001 + blob.x * 0.01) * 30 * DPR;
                const g = ctx.createRadialGradient(bx + drift, by, 0, bx + drift, by, br);
                g.addColorStop(0, rgba(pal.p, 0.12)); g.addColorStop(0.5, rgba(pal.s, 0.05)); g.addColorStop(1, rgba(pal.p, 0));
                ctx.beginPath(); ctx.arc(bx + drift, by, br, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
            }

            // === DIGITAL RAIN ===
            ctx.save();
            ctx.font = `${14 * DPR}px 'JetBrains Mono', monospace`;
            for (const col of this.columns) {
                col.y += col.speed;
                if (col.y * 16 > viewH + 500) { col.y = Math.random() * -400; col.speed = Math.random() * 2.5 + 1.5; }

                const colCX = col.x + 11;
                const dx = mx - colCX, dist = Math.abs(dx);
                const repel = dist < 120 ? (1 - dist / 120) * 40 : 0;
                const offX = dx > 0 ? -repel : repel;

                for (let j = 0; j < col.length; j++) {
                    const charY = col.y * 16 - j * 16;
                    if (charY < -30 || charY > viewH + 30) continue;
                    const px = (col.x + offX) * DPR, py = (charY + secTop) * DPR;
                    const isHead = j === 0;
                    const alpha = isHead ? 0.7 : col.opacity * (1 - j / col.length) * 1.8;
                    const c = isHead ? [220, 255, 220] : mix(pal.p, pal.s, j / col.length);
                    ctx.fillStyle = rgba(c, Math.min(alpha, 0.6));
                    ctx.fillText(col.chars[Math.floor(Math.random() * col.chars.length)], px, py);
                    if (isHead) {
                        const gl = ctx.createRadialGradient(px, py, 0, px, py, 25 * DPR);
                        gl.addColorStop(0, rgba(pal.p, 0.3)); gl.addColorStop(1, rgba(pal.p, 0));
                        ctx.beginPath(); ctx.arc(px, py - 5 * DPR, 25 * DPR, 0, Math.PI * 2); ctx.fillStyle = gl; ctx.fill();
                    }
                }
            }
            ctx.restore();

            // === NEURAL NETWORK ===
            for (const n of this.nodes) {
                n.timer--; if (n.timer <= 0) { n.tx = Math.random() * viewW; n.ty = Math.random() * viewH; n.timer = Math.random() * 250 + 80; }
                n.x += (n.tx - n.x) * 0.008; n.y += (n.ty - n.y) * 0.008; n.pulse += 0.05;
                if (mouse.active) { const dx = mx - n.x, dy = my - n.y, d = Math.hypot(dx, dy); if (d < 200) { n.x -= dx * 0.02; n.y -= dy * 0.02; } }

                const px = n.x * DPR, py = (n.y + secTop) * DPR;
                const sz = n.size * DPR * (1 + Math.sin(n.pulse) * 0.4);
                const a = 0.5 + Math.sin(n.pulse) * 0.2;

                // Connections
                for (const n2 of this.nodes) {
                    if (n2 === n) continue;
                    const d = Math.hypot(n.x - n2.x, n.y - n2.y);
                    if (d < 200) {
                        const cx = n2.x * DPR, cy = (n2.y + secTop) * DPR;
                        const la = (1 - d / 200) * 0.15;
                        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(cx, cy);
                        ctx.strokeStyle = rgba(pal.p, la); ctx.lineWidth = DPR * 0.8; ctx.stroke();
                        // Energy pulse dot
                        const pp = (Math.sin(time * 0.02 + n.pulse) + 1) / 2;
                        const epx = lerp(px, cx, pp), epy = lerp(py, cy, pp);
                        const eg = ctx.createRadialGradient(epx, epy, 0, epx, epy, 8 * DPR);
                        eg.addColorStop(0, rgba(pal.s, 0.6)); eg.addColorStop(1, rgba(pal.s, 0));
                        ctx.beginPath(); ctx.arc(epx, epy, 8 * DPR, 0, Math.PI * 2); ctx.fillStyle = eg; ctx.fill();
                    }
                }
                // Node glow
                const ng = ctx.createRadialGradient(px, py, 0, px, py, sz * 6);
                ng.addColorStop(0, rgba(pal.p, a * 0.4)); ng.addColorStop(1, rgba(pal.p, 0));
                ctx.beginPath(); ctx.arc(px, py, sz * 6, 0, Math.PI * 2); ctx.fillStyle = ng; ctx.fill();
                // Core
                ctx.beginPath(); ctx.arc(px, py, sz, 0, Math.PI * 2); ctx.fillStyle = rgba(pal.p, a); ctx.fill();
                // White center
                ctx.beginPath(); ctx.arc(px, py, sz * 0.4, 0, Math.PI * 2); ctx.fillStyle = rgba([255,255,255], a * 0.6); ctx.fill();
            }
        }
    };

    /* ===============================================================
       ███  PROJECTS — Terrain Wireframe + Floating Geometry
       =============================================================== */
    const projects = {
        gridCols: 0, gridRows: 0, pts: [], shapes: [],
        init() {
            const sp = 50; this.gridCols = Math.ceil(viewW / sp) + 2; this.gridRows = 20;
            this.pts = [];
            for (let r = 0; r < this.gridRows; r++) for (let c = 0; c < this.gridCols; c++) {
                this.pts.push({ x: c * sp - sp, baseY: viewH * 0.1 + r * sp * 0.7, z: 0 });
            }
            this.shapes = [];
            for (let i = 0; i < 40; i++) {
                this.shapes.push({
                    x: Math.random() * viewW, y: Math.random() * viewH,
                    size: Math.random() * 8 + 3, angle: Math.random() * Math.PI * 2,
                    rotSpeed: (Math.random() - 0.5) * 0.03,
                    speed: Math.random() * 0.6 + 0.2,
                    dir: Math.random() * Math.PI * 2,
                    shape: Math.floor(Math.random() * 4),
                    pulse: Math.random() * Math.PI * 2,
                    z: Math.random(),
                });
            }
        },
        draw(secTop, secH, mx, my) {
            const pal = palettes.projects;
            const sp = 50;

            // === BG GRADIENT FIELDS ===
            const gx = (mouse.active ? mx : viewW / 2) * DPR;
            const gy = (mouse.active ? my : viewH / 2 + secTop) * DPR;
            for (let i = 0; i < 3; i++) {
                const ox = Math.sin(time * 0.001 + i * 2) * 200 * DPR;
                const oy = Math.cos(time * 0.0008 + i * 3) * 150 * DPR;
                const r = (200 + i * 80) * DPR;
                const col = mix(pal.p, pal.t, i / 3);
                const g = ctx.createRadialGradient(gx + ox, gy + oy, 0, gx + ox, gy + oy, r);
                g.addColorStop(0, rgba(col, 0.15)); g.addColorStop(0.5, rgba(col, 0.05)); g.addColorStop(1, rgba(col, 0));
                ctx.beginPath(); ctx.arc(gx + ox, gy + oy, r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
            }

            // === WIRE TERRAIN ===
            for (let r = 0; r < this.gridRows; r++) for (let c = 0; c < this.gridCols; c++) {
                const pt = this.pts[r * this.gridCols + c];
                pt.z = fbm(c * 0.1 + time * 0.001, r * 0.1, 4) * 60;
                const dx = mx - pt.x, dy = my - pt.baseY, d = Math.sqrt(dx * dx + dy * dy);
                if (d < 250 && mouse.active) pt.z += (1 - d / 250) * 80;
            }
            for (let r = 0; r < this.gridRows - 1; r++) for (let c = 0; c < this.gridCols - 1; c++) {
                const i = r * this.gridCols + c;
                const p1 = this.pts[i], p2 = this.pts[i + 1], p3 = this.pts[i + this.gridCols];
                const x1 = p1.x * DPR, y1 = (p1.baseY - p1.z + secTop) * DPR;
                const x2 = p2.x * DPR, y2 = (p2.baseY - p2.z + secTop) * DPR;
                const x3 = p3.x * DPR, y3 = (p3.baseY - p3.z + secTop) * DPR;
                const elev = (p1.z + p2.z + p3.z) / 3;
                const alpha = 0.06 + Math.abs(elev) * 0.005;
                const col = mix(pal.p, pal.s, Math.min(Math.abs(elev) / 50, 1));

                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
                ctx.strokeStyle = rgba(col, alpha); ctx.lineWidth = DPR * 0.7; ctx.stroke();
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x3, y3);
                ctx.strokeStyle = rgba(col, alpha); ctx.stroke();
                if (elev > 15) {
                    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.closePath();
                    ctx.fillStyle = rgba(col, alpha * 0.5); ctx.fill();
                }
            }

            // === FLOATING SHAPES ===
            for (const s of this.shapes) {
                s.angle += s.rotSpeed; s.pulse += 0.04;
                s.x += Math.cos(s.dir) * s.speed; s.y += Math.sin(s.dir) * s.speed * 0.6;
                if (s.x < -60) s.x = viewW + 60; if (s.x > viewW + 60) s.x = -60;
                if (s.y < -60) s.y = viewH + 60; if (s.y > viewH + 60) s.y = -60;

                const px = s.x * DPR, py = (s.y + secTop) * DPR;
                const sz = s.size * DPR * (1 + Math.sin(s.pulse) * 0.3);
                const a = 0.35 + Math.sin(s.pulse) * 0.15;
                const col = mix(pal.p, pal.t, s.z);

                // Glow
                const gl = ctx.createRadialGradient(px, py, 0, px, py, sz * 5);
                gl.addColorStop(0, rgba(col, a * 0.3)); gl.addColorStop(1, rgba(col, 0));
                ctx.beginPath(); ctx.arc(px, py, sz * 5, 0, Math.PI * 2); ctx.fillStyle = gl; ctx.fill();

                ctx.save(); ctx.translate(px, py); ctx.rotate(s.angle);
                ctx.strokeStyle = rgba(col, a); ctx.fillStyle = rgba(col, a * 0.4); ctx.lineWidth = DPR;
                if (s.shape === 0) { ctx.beginPath(); ctx.arc(0, 0, sz, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
                else if (s.shape === 1) { ctx.strokeRect(-sz, -sz, sz * 2, sz * 2); ctx.fillRect(-sz, -sz, sz * 2, sz * 2); }
                else if (s.shape === 2) { // triangle
                    ctx.beginPath(); ctx.moveTo(0, -sz); ctx.lineTo(sz, sz); ctx.lineTo(-sz, sz); ctx.closePath(); ctx.fill(); ctx.stroke();
                } else { // diamond
                    ctx.beginPath(); ctx.moveTo(0, -sz); ctx.lineTo(sz, 0); ctx.lineTo(0, sz); ctx.lineTo(-sz, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
                }
                ctx.restore();
            }
        }
    };

    /* ===============================================================
       ███  SKILLS — Circuit Board + Pulsing Energy Lines + Chips
       =============================================================== */
    const skills = {
        circuits: [], pulses: [], chips: [],
        init() {
            this.circuits = []; this.pulses = [];
            for (let i = 0; i < 50; i++) {
                const segs = []; let x = Math.random() * viewW, y = Math.random() * viewH;
                for (let s = 0; s < Math.floor(Math.random() * 7) + 4; s++) {
                    const dir = Math.floor(Math.random() * 2);
                    const len = (Math.random() * 140 + 50) * (Math.random() > 0.5 ? 1 : -1);
                    const nx = dir === 0 ? x + len : x, ny = dir === 0 ? y : y + len;
                    segs.push({ x1: x, y1: y, x2: nx, y2: ny }); x = nx; y = ny;
                }
                this.circuits.push({ segs, opacity: Math.random() * 0.12 + 0.06 });
            }
            for (let i = 0; i < 30; i++) {
                this.pulses.push({
                    ci: Math.floor(Math.random() * this.circuits.length), si: 0, prog: 0,
                    speed: Math.random() * 0.025 + 0.008, size: Math.random() * 4 + 2,
                });
            }
            this.chips = [];
            for (let i = 0; i < 12; i++) {
                this.chips.push({
                    x: Math.random() * viewW, y: Math.random() * viewH,
                    w: Math.random() * 50 + 30, h: Math.random() * 30 + 18,
                    rot: Math.floor(Math.random() * 4) * Math.PI / 2, pulse: Math.random() * Math.PI * 2,
                });
            }
        },
        draw(secTop, secH, mx, my) {
            const pal = palettes.skills;

            // === BG GLOW BLOBS ===
            const mx2 = (mouse.active ? mx : viewW * 0.5) * DPR;
            const my2 = ((mouse.active ? my : viewH * 0.5) + secTop) * DPR;
            const bgR = 350 * DPR;
            const bg = ctx.createRadialGradient(mx2, my2, 0, mx2, my2, bgR);
            bg.addColorStop(0, rgba(pal.p, 0.1)); bg.addColorStop(0.5, rgba(pal.s, 0.03)); bg.addColorStop(1, rgba(pal.p, 0));
            ctx.beginPath(); ctx.arc(mx2, my2, bgR, 0, Math.PI * 2); ctx.fillStyle = bg; ctx.fill();

            // === CIRCUIT TRACES ===
            for (const c of this.circuits) {
                for (const seg of c.segs) {
                    const x1 = seg.x1 * DPR, y1 = (seg.y1 + secTop) * DPR;
                    const x2 = seg.x2 * DPR, y2 = (seg.y2 + secTop) * DPR;
                    const midX = (seg.x1 + seg.x2) / 2, midY = (seg.y1 + seg.y2) / 2;
                    const d = Math.hypot(mx - midX, my - midY);
                    const prox = Math.max(0, 1 - d / 300);
                    const alpha = c.opacity + prox * 0.25;
                    const col = mix(pal.p, pal.s, prox);
                    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
                    ctx.strokeStyle = rgba(col, alpha); ctx.lineWidth = (1 + prox * 2) * DPR; ctx.stroke();
                    if (prox > 0.2) {
                        ctx.beginPath(); ctx.arc(x1, y1, (2.5 + prox * 4) * DPR, 0, Math.PI * 2);
                        ctx.fillStyle = rgba(col, alpha); ctx.fill();
                        ctx.beginPath(); ctx.arc(x2, y2, (2.5 + prox * 4) * DPR, 0, Math.PI * 2);
                        ctx.fillStyle = rgba(col, alpha); ctx.fill();
                    }
                }
            }

            // === ENERGY PULSES ===
            for (const p of this.pulses) {
                const c = this.circuits[p.ci]; if (!c) continue;
                const seg = c.segs[p.si]; if (!seg) { p.si = 0; p.prog = 0; continue; }
                p.prog += p.speed;
                if (p.prog >= 1) { p.prog = 0; p.si++; if (p.si >= c.segs.length) { p.si = 0; p.ci = Math.floor(Math.random() * this.circuits.length); } continue; }
                const px = lerp(seg.x1, seg.x2, p.prog) * DPR;
                const py = (lerp(seg.y1, seg.y2, p.prog) + secTop) * DPR;
                const gl = ctx.createRadialGradient(px, py, 0, px, py, p.size * 8 * DPR);
                gl.addColorStop(0, rgba(pal.t, 0.7)); gl.addColorStop(0.2, rgba(pal.p, 0.25)); gl.addColorStop(1, rgba(pal.p, 0));
                ctx.beginPath(); ctx.arc(px, py, p.size * 8 * DPR, 0, Math.PI * 2); ctx.fillStyle = gl; ctx.fill();
                ctx.beginPath(); ctx.arc(px, py, p.size * DPR, 0, Math.PI * 2); ctx.fillStyle = rgba([255,255,255], 0.9); ctx.fill();
            }

            // === IC CHIPS ===
            for (const chip of this.chips) {
                chip.pulse += 0.025;
                const px = chip.x * DPR, py = (chip.y + secTop) * DPR;
                const w = chip.w * DPR, h = chip.h * DPR;
                const d = Math.hypot(mx - chip.x, my - chip.y);
                const prox = Math.max(0, 1 - d / 250);
                const a = 0.08 + prox * 0.15 + Math.sin(chip.pulse) * 0.03;
                ctx.save(); ctx.translate(px, py); ctx.rotate(chip.rot);
                ctx.fillStyle = rgba(pal.p, a); ctx.fillRect(-w / 2, -h / 2, w, h);
                ctx.strokeStyle = rgba(pal.p, a * 2.5); ctx.lineWidth = DPR * 1.2; ctx.strokeRect(-w / 2, -h / 2, w, h);
                const pins = 5, pinL = 10 * DPR;
                for (let p = 0; p < pins; p++) {
                    const ppx = lerp(-w / 2 + 8 * DPR, w / 2 - 8 * DPR, p / (pins - 1));
                    ctx.beginPath(); ctx.moveTo(ppx, -h / 2); ctx.lineTo(ppx, -h / 2 - pinL);
                    ctx.moveTo(ppx, h / 2); ctx.lineTo(ppx, h / 2 + pinL);
                    ctx.strokeStyle = rgba(pal.s, a * 2); ctx.lineWidth = DPR; ctx.stroke();
                }
                ctx.restore();
            }
        }
    };

    /* ===============================================================
       ███  EXPERIENCE — Nebula Starfield + Comets + Warp
       =============================================================== */
    const experience = {
        stars: [], comets: [], clouds: [],
        init() {
            this.stars = [];
            for (let i = 0; i < 500; i++) {
                this.stars.push({
                    x: Math.random() * viewW, y: Math.random() * viewH,
                    z: Math.random() * 3 + 0.5, size: Math.random() * 2 + 0.4,
                    twinkle: Math.random() * Math.PI * 2,
                });
            }
            this.comets = [];
            for (let i = 0; i < 5; i++) this.comets.push(this.newComet());
            this.clouds = [];
            for (let i = 0; i < 8; i++) {
                this.clouds.push({
                    x: Math.random() * viewW, y: Math.random() * viewH,
                    r: Math.random() * 250 + 120, mix: Math.random(),
                    drift: Math.random() * 0.3 + 0.1, phase: Math.random() * Math.PI * 2,
                });
            }
        },
        newComet() {
            return { x: viewW + Math.random() * 200, y: Math.random() * viewH * 0.6,
                speed: Math.random() * 5 + 3, angle: Math.PI + (Math.random() - 0.5) * 0.4,
                len: Math.random() * 100 + 50, life: Math.random() * 250 + 100, maxLife: 350, size: Math.random() * 2.5 + 1 };
        },
        draw(secTop, secH, mx, my) {
            const pal = palettes.experience;

            // === NEBULA CLOUDS ===
            for (const c of this.clouds) {
                c.x += Math.sin(time * 0.001 + c.phase) * c.drift;
                c.y += Math.cos(time * 0.0007 + c.phase) * c.drift * 0.5;
                const px = c.x * DPR, py = (c.y + secTop) * DPR;
                const r = c.r * DPR * (1 + Math.sin(time * 0.001 + c.phase) * 0.12);
                const col = mix(pal.p, pal.t, c.mix);
                const g = ctx.createRadialGradient(px, py, 0, px, py, r);
                g.addColorStop(0, rgba(col, 0.14)); g.addColorStop(0.4, rgba(col, 0.06)); g.addColorStop(1, rgba(col, 0));
                ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
            }

            // === STARFIELD ===
            const warp = mouse.active ? Math.min(mouse.speed * 0.03, 1.5) : 0;
            const cx = viewW / 2, cy = viewH / 2;
            for (const star of this.stars) {
                star.twinkle += 0.04;
                if (warp > 0.1) {
                    const dx = star.x - cx, dy = star.y - cy;
                    const a = Math.atan2(dy, dx);
                    star.x += Math.cos(a) * star.z * warp * 2.5;
                    star.y += Math.sin(a) * star.z * warp * 2.5;
                } else {
                    star.x += Math.sin(time * 0.001 + star.twinkle) * 0.3;
                    star.y += 0.15;
                }
                if (star.x < -15) star.x = viewW + 15; if (star.x > viewW + 15) star.x = -15;
                if (star.y > viewH + 15) { star.y = -15; star.x = Math.random() * viewW; }

                const px = star.x * DPR, py = (star.y + secTop) * DPR;
                const alpha = (0.4 + Math.sin(star.twinkle) * 0.3) * star.z / 3;
                const sz = star.size * DPR * star.z / 2;
                const col = mix(pal.p, pal.s, star.z / 3);

                // Big glow for bright stars
                if (star.z > 1.5) {
                    const sg = ctx.createRadialGradient(px, py, 0, px, py, sz * 6);
                    sg.addColorStop(0, rgba(col, alpha * 0.5)); sg.addColorStop(1, rgba(col, 0));
                    ctx.beginPath(); ctx.arc(px, py, sz * 6, 0, Math.PI * 2); ctx.fillStyle = sg; ctx.fill();
                }
                ctx.beginPath(); ctx.arc(px, py, sz, 0, Math.PI * 2); ctx.fillStyle = rgba([255,255,255], alpha * 0.9); ctx.fill();
                // Cross glint for brightest
                if (star.z > 2.2) {
                    const gl = sz * 4;
                    ctx.beginPath(); ctx.moveTo(px - gl, py); ctx.lineTo(px + gl, py);
                    ctx.moveTo(px, py - gl); ctx.lineTo(px, py + gl);
                    ctx.strokeStyle = rgba([255,255,255], alpha * 0.4); ctx.lineWidth = DPR * 0.6; ctx.stroke();
                }
            }

            // === COMETS ===
            for (let i = 0; i < this.comets.length; i++) {
                const c = this.comets[i];
                c.x += Math.cos(c.angle) * c.speed; c.y += Math.sin(c.angle) * c.speed; c.life--;
                if (c.life <= 0 || c.x < -300) { this.comets[i] = this.newComet(); continue; }
                const px = c.x * DPR, py = (c.y + secTop) * DPR;
                const lr = c.life / c.maxLife;
                const tailX = px - Math.cos(c.angle) * c.len * DPR;
                const tailY = py - Math.sin(c.angle) * c.len * DPR;
                const tg = ctx.createLinearGradient(px, py, tailX, tailY);
                tg.addColorStop(0, rgba(pal.p, lr * 0.8)); tg.addColorStop(1, rgba(pal.p, 0));
                ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(tailX, tailY);
                ctx.strokeStyle = tg; ctx.lineWidth = c.size * DPR * 1.5; ctx.stroke();
                const hg = ctx.createRadialGradient(px, py, 0, px, py, 12 * DPR);
                hg.addColorStop(0, rgba([255,255,255], lr * 0.9)); hg.addColorStop(0.5, rgba(pal.p, lr * 0.3)); hg.addColorStop(1, rgba(pal.p, 0));
                ctx.beginPath(); ctx.arc(px, py, 12 * DPR, 0, Math.PI * 2); ctx.fillStyle = hg; ctx.fill();
            }
        }
    };

    /* ===============================================================
       ███  CONTACT — Gravitational Orbit System
       =============================================================== */
    const contact = {
        orbiters: [], rings: [],
        init() {
            this.orbiters = [];
            for (let i = 0; i < 250; i++) {
                this.orbiters.push({
                    cx: viewW / 2, cy: viewH / 2,
                    angle: Math.random() * Math.PI * 2,
                    radius: Math.random() * 350 + 50,
                    baseR: Math.random() * 350 + 50,
                    speed: (Math.random() * 0.012 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
                    size: Math.random() * 2.5 + 0.5,
                    pulse: Math.random() * Math.PI * 2,
                    colorMix: Math.random(),
                });
            }
            this.rings = [80, 150, 230, 310, 400];
        },
        draw(secTop, secH, mx, my) {
            const pal = palettes.contact;
            const gcx = mouse.active ? mx : viewW / 2;
            const gcy = mouse.active ? my : viewH / 2;

            // === GRAVITY CORE GLOW ===
            const cx2 = gcx * DPR, cy2 = (gcy + secTop) * DPR;
            for (let i = 2; i >= 0; i--) {
                const r = (80 + i * 60) * DPR;
                const col = mix(pal.p, pal.t, i / 3);
                const g = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, r);
                g.addColorStop(0, rgba(col, 0.18 - i * 0.04)); g.addColorStop(0.5, rgba(col, 0.06)); g.addColorStop(1, rgba(col, 0));
                ctx.beginPath(); ctx.arc(cx2, cy2, r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
            }
            // Core pulse
            const coreS = (25 + Math.sin(time * 0.04) * 8) * DPR;
            const cg = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, coreS);
            cg.addColorStop(0, rgba([255,255,255], 0.2)); cg.addColorStop(1, rgba(pal.p, 0));
            ctx.beginPath(); ctx.arc(cx2, cy2, coreS, 0, Math.PI * 2); ctx.fillStyle = cg; ctx.fill();

            // === ORBIT RINGS ===
            for (let ri = 0; ri < this.rings.length; ri++) {
                const r = this.rings[ri] * DPR;
                const rot = time * 0.001 * (ri % 2 === 0 ? 1 : -1);
                ctx.save(); ctx.translate(cx2, cy2); ctx.rotate(rot);
                ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
                ctx.strokeStyle = rgba(pal.p, 0.06); ctx.lineWidth = DPR * 1.2;
                ctx.setLineDash([10 * DPR, 15 * DPR]); ctx.stroke(); ctx.setLineDash([]);
                ctx.restore();
            }

            // === ORBITING PARTICLES ===
            for (const o of this.orbiters) {
                o.cx += (gcx - o.cx) * 0.025; o.cy += (gcy - o.cy) * 0.025;
                o.radius = o.baseR + (mouse.active ? mouse.speed * 0.8 : 0);
                o.angle += o.speed; o.pulse += 0.04;
                const ox = o.cx + Math.cos(o.angle) * o.radius;
                const oy = o.cy + Math.sin(o.angle) * o.radius * 0.55;
                const px = ox * DPR, py = (oy + secTop) * DPR;
                const sz = o.size * DPR * (1 + Math.sin(o.pulse) * 0.4);
                const alpha = 0.45 + Math.sin(o.pulse) * 0.2;
                const col = mix(pal.p, pal.t, o.colorMix);

                // Trail
                const pa = o.angle - o.speed * 10;
                const tox = o.cx + Math.cos(pa) * o.radius;
                const toy = o.cy + Math.sin(pa) * o.radius * 0.55;
                const tpx = tox * DPR, tpy = (toy + secTop) * DPR;
                const tg = ctx.createLinearGradient(px, py, tpx, tpy);
                tg.addColorStop(0, rgba(col, alpha * 0.4)); tg.addColorStop(1, rgba(col, 0));
                ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(tpx, tpy);
                ctx.strokeStyle = tg; ctx.lineWidth = sz * 1.2; ctx.stroke();

                // Glow
                const gl = ctx.createRadialGradient(px, py, 0, px, py, sz * 4);
                gl.addColorStop(0, rgba(col, alpha * 0.5)); gl.addColorStop(1, rgba(col, 0));
                ctx.beginPath(); ctx.arc(px, py, sz * 4, 0, Math.PI * 2); ctx.fillStyle = gl; ctx.fill();
                // Core
                ctx.beginPath(); ctx.arc(px, py, sz, 0, Math.PI * 2); ctx.fillStyle = rgba(col, alpha); ctx.fill();
            }
        }
    };

    /* ========================
       CLICK RIPPLES
       ======================== */
    const ripples = [];
    function addRipple(x, y) { ripples.push({ x: x * DPR, y: y * DPR, r: 0, maxR: 400 * DPR, life: 90, maxLife: 90 }); }
    function drawRipples() {
        for (let i = ripples.length - 1; i >= 0; i--) {
            const r = ripples[i]; r.life--; r.r += (r.maxR - r.r) * 0.04;
            if (r.life <= 0) { ripples.splice(i, 1); continue; }
            const lr = r.life / r.maxLife;
            const sec = getCurrentSection(r.y / DPR);
            const pal = palettes[sec.id] || palettes.hero;
            for (let ring = 0; ring < 3; ring++) {
                const rr = r.r * (1 - ring * 0.12);
                ctx.beginPath(); ctx.arc(r.x, r.y, rr, 0, Math.PI * 2);
                ctx.strokeStyle = rgba(pal.p, lr * 0.18 * (1 - ring * 0.3));
                ctx.lineWidth = (3 - ring) * DPR * lr; ctx.stroke();
            }
            if (lr > 0.7) {
                const fa = (lr - 0.7) * 3.3 * 0.2;
                const fg = ctx.createRadialGradient(r.x, r.y, 0, r.x, r.y, r.r * 0.5);
                fg.addColorStop(0, rgba(pal.p, fa)); fg.addColorStop(1, rgba(pal.p, 0));
                ctx.beginPath(); ctx.arc(r.x, r.y, r.r * 0.5, 0, Math.PI * 2); ctx.fillStyle = fg; ctx.fill();
            }
        }
    }

    /* ========================
       MOUSE AURA
       ======================== */
    function drawMouseAura() {
        if (!mouse.active) return;
        const sec = getCurrentSection(mouse.y + scrollY);
        const pal = palettes[sec.id] || palettes.hero;
        const x = mouse.x * DPR, y = (mouse.y + scrollY) * DPR;
        const r = (180 + mouse.speed * 3) * DPR;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, rgba(pal.p, 0.1)); g.addColorStop(0.4, rgba(pal.s, 0.03)); g.addColorStop(1, rgba(pal.t, 0));
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
    }

    /* ========================
       INIT + RENDER
       ======================== */
    function initAll() { hero.init(); about.init(); projects.init(); skills.init(); experience.init(); contact.init(); }

    function render() {
        time++;
        ctx.clearRect(0, 0, W, H);
        // Fill BG
        ctx.fillStyle = '#fafafa';
        ctx.fillRect(0, 0, W, H);

        mouse.speed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);
        mouse.vx *= 0.9; mouse.vy *= 0.9;

        const mxP = mouse.x, myP = mouse.y + scrollY;

        for (const sec of sections) {
            if (sec.bottom < scrollY - 300 || sec.top > scrollY + viewH + 300) continue;
            const localMY = myP - sec.top;
            const inSec = myP >= sec.top && myP < sec.bottom;
            const emx = mxP, emy = inSec ? localMY : (myP < sec.top ? -300 : sec.height + 300);

            switch (sec.id) {
                case 'hero': hero.draw(sec.top, emx, emy); break;
                case 'about': about.draw(sec.top, sec.height, emx, emy); break;
                case 'projects': projects.draw(sec.top, sec.height, emx, emy); break;
                case 'skills': skills.draw(sec.top, sec.height, emx, emy); break;
                case 'experience': experience.draw(sec.top, sec.height, emx, emy); break;
                case 'contact': contact.draw(sec.top, sec.height, emx, emy); break;
            }
        }
        drawMouseAura();
        drawRipples();
        requestAnimationFrame(render);
    }

    /* ========================
       EVENTS
       ======================== */
    window.addEventListener('mousemove', e => {
        mouse.vx = e.clientX - mouse.x; mouse.vy = e.clientY - mouse.y;
        mouse.px = mouse.x; mouse.py = mouse.y;
        mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
    });
    window.addEventListener('mouseleave', () => { mouse.active = false; });
    window.addEventListener('click', e => { addRipple(e.clientX, e.clientY + scrollY); });
    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });
    let rT; window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(resize, 150); });
    setInterval(() => {
        const nH = document.documentElement.scrollHeight * DPR;
        if (Math.abs(nH - H) > 50) { H = canvas.height = nH; canvas.style.height = document.documentElement.scrollHeight + 'px'; mapSections(); }
    }, 1500);

    resize();
    render();
})();
