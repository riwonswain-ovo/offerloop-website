'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const GITHUB_URL = 'https://github.com/riwonswain-ovo/OfferLoop';

const pathGroups = [
  {
    label: '机会与进展',
    items: [
      ['job-collection', '机会整理', '把分散的岗位汇总、筛选成值得持续跟进的求职清单', '求职企业清单'],
      ['recruiting-reminder', '招聘跟进', '识别笔试和面试通知，整理时间、轮次与当前进展', '求职进展与笔面试安排'],
    ],
  },
  {
    label: '事实与材料',
    items: [
      ['experience-deepthink', '经历深挖', '通过一问一答还原真实项目，把你做过的事整理成可用素材', '经历复原稿'],
      ['resume-tailor', '简历定制', '围绕目标 JD 选择经历、突出重点，生成可以继续修改的简历', '定制简历'],
    ],
  },
  {
    label: '面试与回流',
    items: [
      ['interview-prep', '面试准备', '结合公司、岗位、JD 和面试轮次，准备自我介绍、业务研究与重点问题', '专属面试准备文档'],
      ['mock-lab', '模拟面试', '按照真实面试节奏逐题训练，找到表达与回答中的问题', '模拟记录与改进建议'],
      ['talk-review', '真面复盘', '拆解真实面试记录，从求职者和面试官两个角度找到下一轮重点', '双视角面试复盘'],
    ],
  },
];

const skills = pathGroups.flatMap((group) =>
  group.items.map(([id, name, description, output], index) => ({
    id,
    name,
    description,
    output,
    group: group.label,
    variant: skillsVariant(group.label, index),
  })),
);

const flowNodes = [
  { id: 'job-collection', name: '机会整理', label: '汇总并筛选值得跟进的岗位', output: '求职企业清单', code: 'JC', tone: 'orange', x: 80, y: 160, core: true },
  { id: 'experience-deepthink', name: '经历深挖', label: '把真实项目整理成经历素材', output: '经历复原稿', code: 'ED', tone: 'violet', x: 560, y: 110 },
  { id: 'resume-tailor', name: '简历定制', label: '为目标 JD 选择经历与重点', output: '定制简历', code: 'RT', tone: 'cyan', x: 1040, y: 160 },
  { id: 'recruiting-reminder', name: '招聘跟进', label: '识别通知并整理招聘进展', output: '求职进展与笔面试安排', code: 'RR', tone: 'amber', x: 1040, y: 430, core: true },
  { id: 'interview-prep', name: '面试准备', label: '围绕公司、岗位和轮次准备', output: '专属面试准备文档', code: 'IP', tone: 'blue', x: 1040, y: 700 },
  { id: 'mock-lab', name: '模拟面试', label: '按照真实节奏逐题训练', output: '模拟记录与改进建议', code: 'ML', tone: 'green', x: 560, y: 700 },
  { id: 'talk-review', name: '真面复盘', label: '从真实面试找到下一轮重点', output: '双视角面试复盘', code: 'TR', tone: 'violet', x: 80, y: 700, core: true },
];

const flowActions = [
  { id: 'user-apply', label: '用户投递', x: 1128, y: 354 },
  { id: 'real-interview', label: '参加真实面试', x: 408, y: 754 },
];

const feishuMaterials = [
  { title: '求职企业清单', type: 'BASE', kind: 'sheet', tone: 'blue' },
  { title: '求职进展', type: 'BASE', kind: 'resume', tone: 'white' },
  { title: '笔面试中心', type: 'BASE', kind: 'sheet', tone: 'green' },
  { title: '定制简历', type: 'DOC', kind: 'doc', tone: 'cyan' },
  { title: '经历深挖', type: 'DOC', kind: 'doc', tone: 'yellow' },
  { title: '真实面试复盘', type: 'DOC', kind: 'doc', tone: 'violet' },
];

function skillsVariant(group: string, index: number) {
  const base = group === '机会与进展' ? 0 : group === '事实与材料' ? 2 : 4;
  return base + index;
}

const commands = [
  ['01', '下载稳定版', 'git clone https://github.com/riwonswain-ovo/OfferLoop.git'],
  ['02', '预览安装内容', 'cd OfferLoop && python3 scripts/setup_offerloop.py --agent codex --mode full --dry-run'],
  ['03', '开始安装', 'python3 scripts/setup_offerloop.py --agent codex --mode full'],
];

const faqs = [
  ['OfferLoop 能帮我完成哪些求职任务？', '它覆盖机会整理、经历深挖、简历定制、招聘跟进、面试准备、模拟训练和真实面试复盘。你可以直接从当前最需要的一步开始。'],
  ['七个 Skill 是怎样一起工作的？', '每个 Skill 专注一个任务，并把结果交给下一步。岗位会进入经历深挖和简历定制；面试通知会进入招聘跟进、面试准备和模拟训练；真实面试的复盘结果会回到下一轮材料与准备中。'],
  ['为什么要连接飞书？', '求职往往持续几个月。飞书让岗位、进展、面试安排和材料集中在一个地方，方便你随时查看和修改，也让不同 Skill 使用同一份最新资料。'],
  ['我的岗位、进展和材料会保存在哪里？', '岗位清单、求职进展和笔面试安排保存在你的飞书多维表格中；经历、简历、面试准备和复盘材料保存在你的飞书知识库中。'],
  ['安装后，我应该从哪里开始？', '连接自己的飞书工作区，然后直接告诉 OfferLoop 你现在想做什么，例如整理岗位、定制一份简历，或者准备下一场面试。'],
  ['OfferLoop 是免费和开源的吗？', '是。OfferLoop 使用 MIT License 开源，你可以在 GitHub 查看项目、安装说明和源代码。'],
];

function DotField({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let active = true;
    let frame = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time = 0) => {
      ctx.clearRect(0, 0, width, height);
      const gap = width < 600 ? 18 : 22;
      const phase = reduced ? 0.35 : time * 0.00045;
      for (let y = -gap; y < height + gap; y += gap) {
        for (let x = -gap; x < width + gap; x += gap) {
          const nx = x / Math.max(width, 1);
          const ny = y / Math.max(height, 1);
          const wave = Math.sin(nx * 10.5 + phase * 4) * 17 + Math.cos(ny * 8 - phase * 3) * 12;
          const depth = Math.max(0.12, 1 - Math.abs(ny - 0.52) * 1.5);
          const px = x + Math.sin(ny * 7 + phase) * 11;
          const py = y + wave * depth;
          const glow = Math.max(0, 1 - Math.hypot(nx - 0.55, ny - 0.52) * 1.7);
          ctx.beginPath();
          ctx.arc(px, py, 0.75 + glow * 0.85, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${130 + glow * 75}, ${136 + glow * 72}, ${170 + glow * 85}, ${0.12 + glow * 0.36})`;
          ctx.fill();
        }
      }
    };

    const tick = (time: number) => {
      if (active) draw(time);
      if (!reduced) frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active && reduced) draw();
    });

    resize();
    observer.observe(canvas);
    window.addEventListener('resize', resize);
    tick(0);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={`dot-field ${className}`} aria-hidden="true" />;
}

function SkillCardScene({
  variant,
  name,
  description,
  output,
  group,
  index,
}: {
  variant: number;
  name: string;
  description: string;
  output: string;
  group: string;
  index: number;
}) {
  const scene = variant % 3;
  const number = String(index + 1).padStart(2, '0');

  if (scene === 0) {
    return (
      <>
        <div className="prime-card-meta"><span>{group}</span><span>{number} / 07</span></div>
        <div className="prime-heart-stage" aria-hidden="true">
          <div className="prime-heart-aura" />
          <div className="prime-heart" />
        </div>
        <div className="prime-dark-copy">
          <h3>{name}</h3>
          <p>{description}</p>
        <div className="prime-output"><span>完成后你会得到</span><strong>{output}</strong></div>
        </div>
      </>
    );
  }

  if (scene === 1) {
    return (
      <>
        <div className="prime-card-meta prime-card-meta-dark"><span>{group}</span><span>{number} / 07</span></div>
        <div className="prime-editorial-copy">
          <h3>{name}</h3>
          <p><strong>{description}</strong></p>
        </div>
        <div className="prime-command-bar" aria-hidden="true">
          <span>机会</span><span className="is-active">{name}</span><span>材料</span><span>进展</span>
        </div>
        <div className="prime-light-output"><span>完成后你会得到</span><strong>{output}</strong></div>
      </>
    );
  }

  return (
    <>
      <div className="prime-card-meta"><span>{group}</span><span>{number} / 07</span></div>
      <div className="prime-performance-copy">
        <h3>{name}</h3>
        <p>{description}</p>
      </div>
      <div className="prime-performance-number" aria-hidden="true">{number}</div>
      <div className="prime-performance-output"><span>完成后你会得到</span><strong>{output}</strong></div>
      <div className="prime-grid-floor" aria-hidden="true" />
    </>
  );
}

function SkillFlowMap() {
  const [activeSkill, setActiveSkill] = useState('job-collection');
  const [zoom, setZoom] = useState(0.88);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const centerViewport = () => {
      viewport.scrollLeft = window.innerWidth < 600
        ? 0
        : Math.max(0, (viewport.scrollWidth - viewport.clientWidth) / 2);
    };
    const frame = requestAnimationFrame(centerViewport);
    window.addEventListener('resize', centerViewport);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', centerViewport);
    };
  }, [zoom]);

  const changeZoom = (delta: number) => {
    setZoom((value) => Math.min(1.04, Math.max(0.68, Number((value + delta).toFixed(2)))));
  };

  return (
    <div className="flow-stage" id="skill-flow-map" data-reveal>
      <DotField className="flow-dot-field" />
      <div className="flow-breadcrumb" aria-label="流程图位置">
        <span className="flow-brand-mark" aria-hidden="true" />
        <i aria-hidden="true">/</i>
        <strong>OfferLoop</strong>
        <span className="flow-chevrons" aria-hidden="true">⌃⌄</span>
        <i aria-hidden="true">/</i>
        <strong>Career System</strong>
        <span className="flow-chevrons" aria-hidden="true">⌃⌄</span>
      </div>

      <div className="flow-tools" aria-label="流程图缩放">
        <div>
          <button type="button" onClick={() => changeZoom(0.08)} aria-label="放大流程图">＋</button>
          <button type="button" onClick={() => changeZoom(-0.08)} aria-label="缩小流程图">−</button>
        </div>
        <button type="button" className="flow-reset" onClick={() => setZoom(0.88)} aria-label="重置流程图缩放">↺</button>
      </div>

      <div className="flow-viewport" ref={viewportRef}>
        <div className="flow-canvas" style={{ transform: `scale(${zoom})` }}>
          <svg className="flow-connectors" viewBox="0 0 1440 1140" aria-hidden="true">
            <defs>
              <linearGradient id="flow-line-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#555966" />
                <stop offset="55%" stopColor="#8b8f9e" />
                <stop offset="100%" stopColor="#4e6ea8" />
              </linearGradient>
              <marker id="flow-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" />
              </marker>
              <marker id="flow-arrow-feedback" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" />
              </marker>
            </defs>
            <path className="main-path" markerEnd="url(#flow-arrow)" d="M400 240 C470 240 490 190 560 190" />
            <path className="main-path" markerEnd="url(#flow-arrow)" d="M880 190 C950 190 970 240 1040 240" />
            <path className="main-path" markerEnd="url(#flow-arrow)" d="M1200 320 L1200 354" />
            <path className="main-path" markerEnd="url(#flow-arrow)" d="M1200 406 L1200 430" />
            <path className="main-path" markerEnd="url(#flow-arrow)" d="M1200 590 C1200 630 1200 660 1200 700" />
            <path className="main-path" markerEnd="url(#flow-arrow)" d="M1040 780 C980 780 940 780 880 780" />
            <path className="main-path" markerEnd="url(#flow-arrow)" d="M560 780 L552 780" />
            <path className="main-path" markerEnd="url(#flow-arrow)" d="M408 780 L400 780" />
            <path className="feedback-path" markerEnd="url(#flow-arrow-feedback)" d="M240 700 C190 520 430 350 680 270" />
            <path className="feedback-path feedback-prep" markerEnd="url(#flow-arrow-feedback)" d="M240 860 C390 1060 1080 1060 1200 860" />
            <path className="feedback-path feedback-progress" markerEnd="url(#flow-arrow-feedback)" d="M480 754 C660 560 850 510 1040 510" />
            <text className="flow-edge-label" x="480" y="170" textAnchor="middle">目标岗位</text>
            <text className="flow-edge-label" x="960" y="170" textAnchor="middle">真实经历</text>
            <text className="flow-edge-label" x="1230" y="655">收到面试</text>
            <text className="flow-edge-label" x="960" y="755" textAnchor="middle">针对性演练</text>
          </svg>

          <div className="flow-loop-copy" aria-hidden="true">
            <span>岗位 → 材料 → 面试 → 复盘</span>
            <strong>新的经验<br />回到下一轮行动</strong>
          </div>
          <span className="feedback-label">复盘补充经历素材</span>
          <span className="prep-feedback-label">下一轮面试重点</span>
          <span className="progress-feedback-label">面试结果更新进展</span>
          {flowActions.map((action) => (
            <span className="flow-action" key={action.id} style={{ left: action.x, top: action.y }}>
              <i aria-hidden="true" />{action.label}
            </span>
          ))}
          {flowNodes.map((node) => (
            <button
              className={`flow-node ${activeSkill === node.id ? 'is-active' : ''} ${node.core ? 'is-core' : ''}`}
              data-tone={node.tone}
              key={node.id}
              style={{ left: node.x, top: node.y }}
              type="button"
              aria-pressed={activeSkill === node.id}
              onClick={() => setActiveSkill(node.id)}
            >
              <span className="flow-node-head">
                <i aria-hidden="true">{node.code}</i>
                <span><strong>{node.name}</strong><small>{node.id}</small></span>
                <b aria-hidden="true">⋮</b>
              </span>
              <span className="flow-node-label">{node.label}</span>
              <span className="flow-node-footer"><em>完成后得到</em>{node.output}</span>
              <span className="flow-port flow-port-top" aria-hidden="true" />
              <span className="flow-port flow-port-bottom" aria-hidden="true" />
              {node.core && <span className="flow-corner" aria-hidden="true">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DocumentSorter() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => {
      const video = videoRef.current;
      if (!video) return;
      if (media.matches) {
        video.pause();
        video.currentTime = 0;
      } else {
        void video.play().catch(() => undefined);
      }
    };

    syncMotion();
    media.addEventListener('change', syncMotion);
    return () => media.removeEventListener('change', syncMotion);
  }, []);

  return (
    <div className="sorter-scene" role="img" aria-label="一台长出两只手的电脑，把一沓求职材料从左侧平稳移动到右侧归档">
      <div className="sorter-aura" aria-hidden="true" />
      <div className="sorter-reel" aria-hidden="true">
        <video ref={videoRef} className="sorter-video" autoPlay muted loop playsInline preload="auto" poster="/sorter-loop-v2-enhanced-poster.jpg?v=clean-crop">
          <source src="/sorter-loop-v2-enhanced-trimmed.mp4?v=clean-crop" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}

function FeishuWorkspace() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;

    const setProgress = (progress: number) => {
      const clamp = (value: number) => Math.min(1, Math.max(0, value));
      const pack = clamp((progress - 0.08) / 0.56);
      const folder = clamp((progress - 0.24) / 0.48);
      const finish = clamp((progress - 0.61) / 0.2);
      const introOut = clamp((progress - 0.25) / 0.2);
      section.style.setProperty('--export-p', progress.toFixed(4));
      section.style.setProperty('--pack-p', pack.toFixed(4));
      section.style.setProperty('--folder-p', folder.toFixed(4));
      section.style.setProperty('--finish-p', finish.toFixed(4));
      section.style.setProperty('--intro-out', introOut.toFixed(4));
    };

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      setProgress(Math.min(1, Math.max(0, -rect.top / distance)));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    if (reduced) {
      setProgress(1);
    } else {
      update();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="export-section feature-section" aria-labelledby="feishu-heading">
      <div className="export-sticky">
        <div className="export-intro">
          <span className="export-number">02</span>
          <h2 id="feishu-heading"><span>连接你的飞书。</span><span>让七个 Skill 共享同一份求职进度。</span></h2>
          <p>岗位、进展、面试安排和求职材料都会进入你自己的飞书工作区。资料集中在一个地方，由你随时查看和修改；七个 Skill 也能读取最新内容，接着上一步继续。</p>
          <a className="button" href="#install">连接我的飞书</a>
        </div>

        <div className="export-stage" role="img" aria-label="求职企业清单、求职进展、笔面试中心与简历、经历、面试材料汇入用户私有飞书空间，飞书 App 图标从文件夹中弹出">
          <div className="export-spotlight" aria-hidden="true" />
          {feishuMaterials.map((material, index) => (
            <article className={`export-sheet export-sheet-${index + 1}`} data-tone={material.tone} data-kind={material.kind} key={material.title} aria-hidden="true">
              <span>{material.type}</span>
              <h3>{material.title}</h3>
              <div>
                <i /><i /><i /><i /><i /><i />
              </div>
              <small>{index % 2 === 0 ? '随求职进展更新' : '自动归入知识库'}</small>
            </article>
          ))}

          <div className="export-orbit orbit-doc" aria-hidden="true"><span>DOC</span></div>
          <div className="export-orbit orbit-base" aria-hidden="true"><span>BASE</span></div>
          <div className="export-orbit orbit-calendar" aria-hidden="true"><span>CAL</span></div>

          <div className="export-folder" aria-hidden="true">
            <div className="export-folder-back" />
            <div className="export-folder-front">
              <i />
              <span className="folder-offerloop-mark" />
            </div>
            <div className="folder-feishu-icon">
              <Image src="/feishu-app-icon.png" width={512} height={512} alt="" />
            </div>
          </div>

          <div className="export-finish-copy">
            <h2><span>不用从头解释。</span><span>每一次使用，都让材料更完整。</span></h2>
            <p>你确认过的岗位、经历和进展会留在自己的飞书里。改过的简历、做过的准备和复盘过的面试也会继续沉淀，下一次行动可以直接从这里开始。</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [copied, setCopied] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12 },
    );
    document.querySelectorAll('[data-reveal]').forEach((element) => revealObserver.observe(element));
    return () => {
      window.removeEventListener('scroll', onScroll);
      revealObserver.disconnect();
    };
  }, []);

  const copyCommand = async (command: string, index: number) => {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = command;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    setCopied(index);
    window.setTimeout(() => setCopied(null), 1600);
  };

  const moveCarousel = (direction: number) => {
    const carousel = carouselRef.current;
    const firstCard = carousel?.querySelector<HTMLElement>('.skill-card');
    const distance = firstCard ? firstCard.getBoundingClientRect().width + 24 : 440;
    carousel?.scrollBy({ left: direction * distance, behavior: 'smooth' });
  };

  return (
    <main>
      <header className={`site-nav ${scrolled ? 'nav-scrolled' : ''}`} aria-label="主导航">
        <a className="wordmark" href="#top" aria-label="OfferLoop 首页">
          <Image className="nav-brand-logo" src="/offerloop-logo-transparent.png" width={1254} height={1254} priority alt="" />
          <span>OfferLoop</span>
        </a>
        <nav className="nav-links" aria-label="页面导航">
          <a href="#foundation">工作方式</a>
          <a href="#skills">7 个 Skill</a>
          <a href="#install">安装</a>
        </nav>
        <a className="button button-small" href={GITHUB_URL} target="_blank" rel="noreferrer">前往 GitHub</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-orbit" aria-hidden="true" />
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">7 个 AI 求职 Skill · 一套持续积累的求职系统</p>
            <h1>
              <span>把求职，真正做成闭环。</span>
              <span className="muted-line">让每一步都为下一步积累。</span>
            </h1>
            <p className="hero-description">找过的岗位、打磨过的简历、准备过的面试，都不该在结束后被遗忘。OfferLoop 把它们连接起来，让每一次行动都能接着上一次继续。</p>
            <div className="hero-actions">
              <a className="button" href="#install">开始安装 <span aria-hidden="true">↓</span></a>
              <a className="text-link" href="#foundation">看看如何工作 <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <DocumentSorter />
        </div>
        <div className="hero-rule" />
      </section>

      <section className="foundation feature-section" id="foundation">
        <div className="section-heading centered" data-reveal>
          <span className="section-number">01</span>
          <h2><span>七个 Skill，接力完成一次求职。</span><span className="muted-line">每一次复盘，再回到下一轮行动。</span></h2>
          <p>从发现岗位到准备面试，每个 Skill 只负责自己最擅长的一步。模拟和真实面试带来的新信息，会重新进入经历、材料与下一轮准备。</p>
        </div>
        <SkillFlowMap />
      </section>

      <FeishuWorkspace />

      <section className="skills-section feature-section" id="skills">
        <div className="skills-heading" data-reveal>
          <div><span className="section-label">7 AI 求职 SKILLS</span><h2><span>从岗位到复盘。</span><span className="muted-line">每一步，都有一个专门的 Skill。</span></h2></div>
          <div className="carousel-controls"><button type="button" aria-label="上一组 Skill" onClick={() => moveCarousel(-1)}>←</button><button type="button" aria-label="下一组 Skill" onClick={() => moveCarousel(1)}>→</button></div>
        </div>
        <div
          className="skills-carousel"
          ref={carouselRef}
          tabIndex={0}
          role="region"
          aria-roledescription="横向轮播"
          aria-label="7 个 OfferLoop Skill"
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault();
              moveCarousel(event.key === 'ArrowRight' ? 1 : -1);
            }
          }}
        >
          {skills.map((skill, index) => (
            <article className="skill-card" key={skill.id} data-variant={skill.variant} data-scene={skill.variant % 3}>
              <SkillCardScene {...skill} index={index} />
            </article>
          ))}
        </div>
      </section>

      <section className="install-section feature-section" id="install">
        <div className="section-heading centered" data-reveal>
          <span className="section-label">OPEN SOURCE · MIT LICENSE</span>
          <h2><span>你现在卡在哪一步？</span><span className="muted-line">装好 OfferLoop，直接从那里开始。</span></h2>
        </div>
        <div className="install-card" data-reveal>
          <div className="install-summary">
            <span className="install-badge">7 SKILLS · FEISHU</span><h3>从眼前的任务直接开始</h3><p>找岗位、整理经历、定制简历、跟进招聘、准备面试或复盘真面，直接告诉 OfferLoop 你现在要做什么。它会使用你已经确认过的资料完成当前任务，并把这次结果留给下一步。</p>
            <div className="install-facts">{['7 个 Skill', '飞书工作区', '资料由你掌握', 'Codex 优先', 'MIT 开源'].map((fact) => <span key={fact}>{fact}</span>)}</div>
            <a className="button install-button" href={GITHUB_URL} target="_blank" rel="noreferrer">在 GitHub 开始安装 <span aria-hidden="true">↗</span></a>
          </div>
          <div className="command-list">
            {commands.map(([number, label, command], index) => (
              <div className="command-row" key={number}><div className="command-meta"><span>{number}</span><strong>{label}</strong></div><code>{command}</code><button type="button" onClick={() => copyCommand(command, index)} aria-label={`复制：${label}`}>{copied === index ? '已复制' : '复制'}</button></div>
            ))}
            <p className="command-note">安装完成后，按照引导连接自己的飞书工作区。然后直接告诉 OfferLoop 你现在想做什么，例如整理岗位、定制一份简历，或者准备下一场面试。</p>
          </div>
        </div>
      </section>

      <section className="faq-section feature-section" id="faq">
        <div className="section-heading centered" data-reveal><h2>你可能想问。</h2></div>
        <div className="faq-list" data-reveal>
          {faqs.map(([question, answer], index) => (
            <details key={question} open={index === 0}><summary><span>{question}</span><i aria-hidden="true" /></summary><p>{answer}</p></details>
          ))}
        </div>
      </section>

      <footer className="site-footer" id="footer">
        <div className="footer-stage" aria-hidden="true">
          <div className="footer-slogan">MAKE IT LOOP</div>
          <div className="footer-ambient-glow" />
          <Image
            className="footer-equipment"
            src="/offerloop-footer-equipment.png"
            width={1662}
            height={946}
            sizes="100vw"
            alt=""
          />
        </div>
        <div className="footer-bottom">
          <a className="wordmark dark-wordmark" href="#top"><span className="wordmark-mark" aria-hidden="true" /><span>OfferLoop</span></a>
          <div className="footer-links"><a href={`${GITHUB_URL}/blob/main/LICENSE`} target="_blank" rel="noreferrer">MIT License</a><a href={`${GITHUB_URL}/blob/main/SECURITY.md`} target="_blank" rel="noreferrer">安全边界</a><a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub ↗</a></div>
          <a className="footer-github" href={GITHUB_URL} target="_blank" rel="noreferrer">OPEN SOURCE</a>
        </div>
      </footer>
    </main>
  );
}
