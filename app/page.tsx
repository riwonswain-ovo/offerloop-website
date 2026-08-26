'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const GITHUB_URL = 'https://github.com/riwonswain-ovo/OfferLoop';

const loops = [
  {
    id: 'opportunity',
    label: '招聘机会',
    kicker: 'OPPORTUNITY LOOP',
    title: '把零散信息，变成可维护的求职清单。',
    description: '从你确认的岗位边界出发，筛选、去重、保留边缘候选，再由你做最终决定。',
    steps: ['信息源', '偏好筛选', '用户确认', '企业清单', '求职进展'],
  },
  {
    id: 'progress',
    label: '求职进展',
    kicker: 'PROGRESS LOOP',
    title: '让每一个邀请和截止时间，都回到正确的位置。',
    description: '识别招聘邮件中的公司、岗位、环节、时间和链接，确认后才进入笔面试中心与个人日历。',
    steps: ['招聘通知', '笔面试安排', '阶段推进', '面试准备', '真实复盘'],
  },
  {
    id: 'growth',
    label: '能力成长',
    kicker: 'GROWTH LOOP',
    title: '不给你贴标签，而是把每一个缺口变成可复测的训练。',
    description: '模拟和真实面试只产生“待验证观察”，通过专项训练和再次模拟，让进步有证据。',
    steps: ['经历证据', '模拟 / 复盘', '能力观察', '专项训练', '再次验证'],
  },
];

const pathGroups = [
  {
    label: '机会管理',
    description: '从认识自己开始，建立清晰边界，再把外部机会变成可追踪的事实。',
    items: [
      ['career-profile', '建立岗位偏好、性格探索和个人表达习惯', '用户画像'],
      ['job-collection', '筛选、去重并同步有权访问的招聘信息源', '企业清单'],
      ['recruiting-reminder', '识别笔试与面试通知，确认后安排日历', '笔面试中心'],
    ],
  },
  {
    label: '材料与准备',
    description: '先还原真实经历，再组装岗位化材料，让每一句表达都能回到证据。',
    items: [
      ['experience-deepthink', '通过连续追问复原经历、决策、协作与结果', '细节复原稿'],
      ['resume-tailor', '基于目标岗位和用户亲自选择的经历生成简历', '一页 A4 简历'],
      ['interview-prep', '结合公司、岗位、JD 和轮次生成定向准备', '面试准备文档'],
    ],
  },
  {
    label: '训练与复盘',
    description: '在真实节奏中暴露问题，保留不确定性，再用专项训练完成下一轮验证。',
    items: [
      ['mock-lab', '一次一题的真实模拟，完整模拟后统一复盘', '问题与追问链'],
      ['talk-review', '忠实拆解真实面试 ASR，区分原话、不确定和推断', '双视角复盘'],
      ['competency-lab', '把未解决观察变成每日三题或专项训练', '能力地图与复测'],
    ],
  },
];

const skills = pathGroups.flatMap((group) =>
  group.items.map(([id, description, output], index) => ({
    id,
    description,
    output,
    group: group.label,
    variant: skillsVariant(group.label, index),
  })),
);

function skillsVariant(group: string, index: number) {
  const base = group === '机会管理' ? 0 : group === '材料与准备' ? 3 : 6;
  return base + index;
}

const commands = [
  ['01', '下载稳定版', 'git clone https://github.com/riwonswain-ovo/OfferLoop.git'],
  ['02', '先预演安装', 'cd OfferLoop && python3 scripts/setup_offerloop.py --agent codex --mode full --dry-run'],
  ['03', '安装 9 个 Skill', 'python3 scripts/setup_offerloop.py --agent codex --mode full'],
];

const faqs = [
  ['OfferLoop 和一次性求职 Prompt 有什么不同？', 'Prompt 完成一次对话任务；OfferLoop 由 9 个责任清晰的 Skill 组成，在经过你确认的事实、产物和能力观察之间建立长期联系。'],
  ['安装 Skill 会自动创建飞书资源吗？', '不会。下载和安装不会创建 Base、知识库、文档、日历或任务。只有当你明确选择接入飞书，Agent 完成只读检查并展示计划后，才会在你确认后写入。'],
  ['必须使用飞书知识库吗？', '不必须。完整模式可以先只安装本地 Skill，并从 Chat 开始使用。当你希望长期沉淀画像、简历、经历、训练和复盘时，再选择接入飞书。'],
  ['安装前需要准备什么？', '需要 Python 3.10 或更高版本、能访问公开 GitHub 仓库，以及一个支持标准 SKILL.md 目录的 Agent。安装 Skill 文件不需要 App Secret、邮箱密码、Cookie 或 token。'],
  ['除了 Codex，还支持哪些 Agent？', 'Codex 是官网默认示例。安装器同时支持 Claude Code、Hermes Agent 和 WorkBuddy，将命令中的 --agent codex 替换为对应参数即可。'],
  ['如何安全升级 OfferLoop？', '先保留现有目录并运行 full 模式 dry-run。确认检查结果后再显式使用 --upgrade。安装器会将旧副本保存到可恢复备份，不需要先删除旧 Skill 或重建已有 Base。'],
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

function SkillVisual({ variant, id }: { variant: number; id: string }) {
  return (
    <div className="skill-visual" data-variant={variant} aria-hidden="true">
      <div className="visual-halo" />
      <div className="visual-orbit orbit-one" />
      <div className="visual-orbit orbit-two" />
      <div className="visual-core">
        <span>{String(variant + 1).padStart(2, '0')}</span>
      </div>
      <div className="visual-chip">{id.split('-')[0]}</div>
    </div>
  );
}

export default function Home() {
  const [loopIndex, setLoopIndex] = useState(0);
  const [pathIndex, setPathIndex] = useState(0);
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
    carouselRef.current?.scrollBy({ left: direction * 460, behavior: 'smooth' });
  };

  return (
    <main>
      <header className={`site-nav ${scrolled ? 'nav-scrolled' : ''}`} aria-label="主导航">
        <a className="wordmark" href="#top" aria-label="OfferLoop 首页">
          <span className="wordmark-mark" aria-hidden="true" />
          <span>OfferLoop</span>
        </a>
        <nav className="nav-links" aria-label="页面导航">
          <a href="#about">认识 OfferLoop</a>
          <a href="#skills">9 个 Skill</a>
          <a href="#install">安装</a>
        </nav>
        <a className="button button-small" href={GITHUB_URL} target="_blank" rel="noreferrer">前往 GitHub</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-orbit" aria-hidden="true" />
        <div className="hero-inner">
          <div className="hero-logo-wrap">
            <Image className="hero-logo" src="/offerloop-logo.webp" width={746} height={746} priority alt="OfferLoop 蓝紫玻璃质感三维标志" />
          </div>
          <div className="hero-copy">
            <p className="eyebrow">9 SKILLS · 3 LOOPS · 1 CAREER SYSTEM</p>
            <h1>
              <span>把求职，变成闭环。</span>
              <span className="muted-line">让每一次行动持续积累。</span>
            </h1>
            <p className="hero-description">OfferLoop 是由 9 个 Agent Skill 组成的开源 AI 求职系统。它记住经过你确认的事实，并把机会、材料与面试反馈连成一条会生长的路径。</p>
            <div className="hero-actions">
              <a className="button" href={GITHUB_URL} target="_blank" rel="noreferrer">在 GitHub 安装 <span aria-hidden="true">↗</span></a>
              <a className="text-link" href="#skills">认识 9 个 Skill <span aria-hidden="true">↓</span></a>
            </div>
          </div>
        </div>
        <div className="hero-rule" />
      </section>

      <section className="intro" id="about" data-reveal>
        <p>不再让 Agent 只在一次对话里完成任务。 <strong>OfferLoop 让每一次投递、训练和面试，都成为下一次行动的上下文。</strong></p>
      </section>

      <section className="foundation feature-section" id="foundation">
        <DotField />
        <div className="section-heading centered" data-reveal>
          <span className="section-number">01</span>
          <h2><span>先建立画像</span><span className="muted-line">再开始行动</span></h2>
          <p>OfferLoop 先确认你的岗位边界和表达习惯，再让后续 Skill 读取同一份事实。</p>
        </div>
        <div className="system-map" data-reveal>
          <div className="map-node profile-node"><span>FIRST ENTRY</span><strong>career-profile</strong><small>画像与边界</small></div>
          <div className="map-rail" aria-hidden="true"><i /><i /><i /></div>
          <div className="map-node base-node"><span>FACT SOURCE</span><strong>三张业务 Base</strong><small>企业 · 进展 · 笔面试</small></div>
          <div className="map-node library-node"><span>PERSONAL MEMORY</span><strong>私有知识库</strong><small>简历 · 经历 · 训练 · 复盘</small></div>
        </div>
      </section>

      <section className="loops feature-section" id="loops">
        <DotField className="dot-field-tall" />
        <div className="section-heading giant" data-reveal>
          <span className="section-number">02</span>
          <h2>连接每一次行动</h2>
          <p className="muted-line">让信息、进展和能力持续回流</p>
        </div>
        <div className="loop-panel" data-reveal>
          <div className="tab-list" role="tablist" aria-label="OfferLoop 三条闭环">
            {loops.map((loop, index) => (
              <button key={loop.id} type="button" role="tab" aria-selected={loopIndex === index} onClick={() => setLoopIndex(index)}>{loop.label}</button>
            ))}
          </div>
          <div className="loop-content" role="tabpanel">
            <div>
              <span className="eyebrow">{loops[loopIndex].kicker}</span>
              <h3>{loops[loopIndex].title}</h3>
              <p>{loops[loopIndex].description}</p>
            </div>
            <div className="loop-steps">
              {loops[loopIndex].steps.map((step, index) => (
                <div className="loop-step" key={step}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong>{index < loops[loopIndex].steps.length - 1 && <i aria-hidden="true">→</i>}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="artifacts feature-section" id="artifacts">
        <div className="section-heading centered" data-reveal>
          <span className="section-number">03</span>
          <h2><span>不是生成一次</span><span className="muted-line">而是持续成长</span></h2>
          <p>每个 Skill 都会说明它读取了什么，产物保存到哪里，哪些事实仍在等待你确认。</p>
        </div>
        <div className="artifact-console" data-reveal>
          <div className="console-topbar"><span>OfferLoop / personal career system</span><span className="console-status">SYNCED LOCALLY</span></div>
          <div className="artifact-flow">
            {['用户画像', '经历证据', '定制简历', '面试准备', '模拟训练', '真实复盘'].map((item, index) => (
              <div className="artifact-item" key={item}>
                <span>{String(index + 2).padStart(2, '0')}</span><strong>{item}</strong><small>{index < 2 ? 'FACT' : index < 4 ? 'MATERIAL' : 'OBSERVATION'}</small>
              </div>
            ))}
          </div>
          <div className="console-footer"><span>事实可追溯</span><span>用户先确认</span><span>未完成会保留续做清单</span></div>
        </div>
      </section>

      <section className="path-section feature-section" id="path">
        <div className="section-heading wide" data-reveal>
          <span className="section-label">COMPLETE CAREER SYSTEM</span>
          <h2><span>九个 Skill</span><span className="muted-line">一条完整路径</span></h2>
        </div>
        <div className="path-shell" data-reveal>
          <div className="tab-list path-tabs" role="tablist" aria-label="Skill 路径分组">
            {pathGroups.map((group, index) => (
              <button type="button" key={group.label} role="tab" aria-selected={pathIndex === index} onClick={() => setPathIndex(index)}>{group.label}</button>
            ))}
          </div>
          <div className="path-content" role="tabpanel">
            <div className="path-intro"><span>{String(pathIndex + 1).padStart(2, '0')} / 03</span><p>{pathGroups[pathIndex].description}</p></div>
            <div className="path-cards">
              {pathGroups[pathIndex].items.map(([id, description, output], index) => (
                <article key={id}>
                  <span className="path-index">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{id}</h3><p>{description}</p><div><span>OUTPUT</span><strong>{output}</strong></div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="skills-section feature-section" id="skills">
        <div className="skills-heading" data-reveal>
          <div><span className="section-label">9 LONG-TERM SKILLS</span><h2><span>由真实流程打磨</span><span className="muted-line">随每次使用成长</span></h2></div>
          <div className="carousel-controls"><button type="button" aria-label="上一组 Skill" onClick={() => moveCarousel(-1)}>←</button><button type="button" aria-label="下一组 Skill" onClick={() => moveCarousel(1)}>→</button></div>
        </div>
        <div className="skills-carousel" ref={carouselRef} tabIndex={0} aria-label="9 个 OfferLoop Skill">
          {skills.map((skill, index) => (
            <article className="skill-card" key={skill.id} data-variant={skill.variant}>
              <SkillVisual variant={skill.variant} id={skill.id} />
              <div className="skill-card-copy"><span>{skill.group} · {String(index + 1).padStart(2, '0')}</span><h3>{skill.id}</h3><p>{skill.description}</p><div><span>YOU GET</span><strong>{skill.output}</strong></div></div>
            </article>
          ))}
        </div>
      </section>

      <section className="install-section feature-section" id="install">
        <div className="section-heading centered" data-reveal>
          <span className="section-label">OPEN SOURCE · MIT LICENSE</span>
          <h2><span>准备好了？</span><span className="muted-line">在 Codex 中安装 OfferLoop。</span></h2>
        </div>
        <div className="install-card" data-reveal>
          <div className="install-summary">
            <span className="install-badge">FULL MODE</span><h3>完整模式</h3><p>一次安装 9 个长期 Skill 与共享运行时。先在本地开始，需要时再选择接入飞书知识库。</p>
            <div className="install-facts">{['9 个 Skill', '共享运行时', 'Codex 优先', '飞书可选', 'MIT 开源'].map((fact) => <span key={fact}>{fact}</span>)}</div>
            <a className="button install-button" href={GITHUB_URL} target="_blank" rel="noreferrer">在 GitHub 查看完整安装说明 <span aria-hidden="true">↗</span></a>
          </div>
          <div className="command-list">
            {commands.map(([number, label, command], index) => (
              <div className="command-row" key={number}><div className="command-meta"><span>{number}</span><strong>{label}</strong></div><code>{command}</code><button type="button" onClick={() => copyCommand(command, index)} aria-label={`复制：${label}`}>{copied === index ? '已复制' : '复制'}</button></div>
            ))}
            <p className="command-note">安装后重新开启一次 Agent 会话。不要把 App Secret、邮箱密码、Cookie 或 token 粘贴到 Chat。</p>
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

      <footer className="site-footer">
        <div className="footer-stage" aria-hidden="true">
          <div className="footer-slogan">MAKE IT LOOP</div>
          <div className="machine machine-left"><i /><i /><i /></div>
          <div className="machine machine-center"><span><Image src="/offerloop-logo.webp" width={746} height={746} alt="" /></span><i /><i /><i /><i /></div>
          <div className="machine machine-right"><i /><i /><b /></div>
          <div className="light-bar" />
          <div className="cable cable-one" /><div className="cable cable-two" />
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
