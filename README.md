# OfferLoop Website

> 把求职，真正做成闭环。让每一步都为下一步积累。

OfferLoop 官网的前端源码。网站面向互联网与 AI 岗求职者，介绍 OfferLoop 如何通过 **7 个 AI 求职 Skill**，把机会整理、材料打磨、招聘跟进、面试训练与真实复盘连接成一条持续积累的求职路径。

- 官网：[offerloop-website.vercel.app](https://offerloop-website.vercel.app)
- 稳定版项目：[riwonswain-ovo/OfferLoop](https://github.com/riwonswain-ovo/OfferLoop)
- 产品开发仓库：[riwonswain-ovo/OfferLoop-development](https://github.com/riwonswain-ovo/OfferLoop-development)

本仓库只包含官网前端与展示素材，不包含 OfferLoop Skill 的实现代码、用户资料或飞书工作区数据。

## OfferLoop 是什么

求职过程中找过的岗位、打磨过的简历、准备过的面试，不应该在一次任务结束后被遗忘。OfferLoop 让不同 Skill 使用同一份已确认资料，并把每一步的结果交给下一步继续使用。

完整路径包括：

`机会整理 → 经历深挖 → 简历定制 → 用户投递 → 招聘跟进 → 面试准备 → 模拟面试 → 用户参加真实面试 → 真面复盘 → 下一轮行动`

其中“用户投递”和“参加真实面试”由用户亲自完成；真实面试的结果会回到招聘进展，复盘结论会继续完善经历材料和下一轮面试准备。

## 7 个 AI 求职 Skill

| 中文名称 | Skill | 主要作用 | 完成后得到 |
| --- | --- | --- | --- |
| 机会整理 | `job-collection` | 汇总并筛选值得持续跟进的岗位 | 求职企业清单 |
| 经历深挖 | `experience-deepthink` | 通过一问一答还原真实项目与个人贡献 | 经历复原稿 |
| 简历定制 | `resume-tailor` | 围绕目标 JD 选择经历并突出重点 | 定制简历 |
| 招聘跟进 | `recruiting-reminder` | 整理招聘通知、面试轮次、时间与当前进展 | 求职进展与笔面试安排 |
| 面试准备 | `interview-prep` | 结合公司、岗位、JD 和轮次进行针对性准备 | 专属面试准备文档 |
| 模拟面试 | `mock-lab` | 按照真实面试节奏逐题训练并定位问题 | 模拟记录与改进建议 |
| 真面复盘 | `talk-review` | 从求职者和面试官两个视角拆解真实面试 | 双视角面试复盘 |

## 飞书在工作流中的作用

OfferLoop 可以连接用户自己的飞书工作区：

- 求职企业清单、求职进展和笔面试安排集中在飞书多维表格中；
- 经历、简历、面试准备和复盘材料沉淀在飞书知识库中；
- 用户可以随时查看、修改和管理自己的资料；
- 7 个 Skill 可以读取最新内容，从上一次结果继续工作。

## 官网包含什么

- OfferLoop 品牌 Hero 与文件整理视频；
- 7 个 Skill 的完整工作流与复盘回流关系；
- 飞书工作区与材料沉淀动画；
- 7 张 Skill 产品卡片；
- 安装指引、复制命令和 FAQ；
- 响应式布局、键盘交互与减少动态效果支持。

## 技术栈

- Next.js 16
- React 19
- TypeScript
- Vinext / Vite（本地预览与 Sites 构建）
- 原生 CSS 动画与 Canvas 点阵效果
- Vercel（生产部署）

网站没有账号、表单、数据库、分析统计或外部业务 API。页面的主要外部跳转指向 OfferLoop GitHub 仓库。

## 本地运行

环境要求：Node.js `22.13.0` 或更高版本。

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看本地页面。

执行生产构建：

```bash
npm run build
```

执行代码检查：

```bash
npm run lint
```

## Vercel 部署

仓库通过 [`vercel.json`](./vercel.json) 使用原生 Next.js 生产构建：

```bash
npx next build
```

Vercel 项目与 GitHub 仓库的 `main` 分支关联。推送到 `main` 后会自动创建新的生产部署。

## 目录结构

```text
app/
  layout.tsx       页面元信息与根布局
  page.tsx         官网内容、组件与交互
  globals.css      全站视觉、响应式布局与动效
public/            Logo、飞书图标、视频与页脚视觉素材
vercel.json        Vercel 生产构建配置
vite.config.ts     Vinext / Sites 本地构建配置
```

## 品牌与素材

OfferLoop 名称、Logo 与官网原创视觉素材属于项目品牌资产。飞书名称、商标及 App 图标属于其相应权利人，本网站仅用于说明 OfferLoop 的飞书集成能力。

公开访问本仓库不代表第三方品牌素材自动获得与项目源码相同的使用许可；复用或再发布相关素材前，请先确认对应授权范围。

## License

OfferLoop 核心项目采用 [MIT License](https://github.com/riwonswain-ovo/OfferLoop/blob/main/LICENSE)。官网源码与品牌素材的许可将以本仓库后续加入的 License 和素材说明文件为准。
