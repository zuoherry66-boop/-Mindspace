# 造梦空间 · Mindspace

一个面向情绪困扰时刻的沉浸式 Web Demo。它不诊断、不催促用户振作，而是通过可触摸、可发声、会形变的虚渺空间，帮助用户感知情绪、允许情绪存在，并找到一件仍然在乎的事。

## Demo 体验

体验按七个极简场景展开：

`抵达 → 情绪校准 → 用户确认 → 表达 → 心事具象化 → 意义坐标 → 微光收束`

- 用户拖动情绪核表达此刻的能量、身体感受和行动冲动，不需要先组织长段文字。
- 情绪候选以星群呈现，最终命名权始终属于用户。
- Canvas 粒子空间会随拖拽方向、力度、速度、情绪和声音改变重力、裂隙、聚散与色温。
- 用户可以狂乱滑动、按住空格或发出声音，也可以用键盘完成全部核心步骤。
- 麦克风只在浏览器本地分析音量，不录音、不转写、不上传。
- 麦克风是可选入口；用户可开启减少动态，或随时进入真人帮助页。
- 本次体验不设账号，也不会保存输入内容或情绪结果。

## 安全边界

本项目不是医疗产品，不能替代心理咨询、诊断或紧急服务。页面始终提供“退出 / 我需要真人帮助”入口；若文字包含明确的即时自伤或他伤信号，会停止沉浸流程并显示：

- 全国统一心理援助热线：`12356`
- 即时医疗急救：`120`
- 立即安全协助：`110`

危机分流使用独立、可测试的明确规则，不依赖情绪候选结果。上线或开展真实效果研究前，仍需由心理健康专业人员完成脚本、伦理和安全审查。

## 本地运行

需要 Node.js 22 或更新版本。

```bash
npm install
npm run dev
```

质量检查：

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

## 技术实现

- React 19 + TypeScript + Vite
- Canvas 2D 透视粒子场（无高成本 3D 依赖）
- Web Audio API 本地振幅分析
- Vitest + Testing Library
- GitHub Actions + GitHub Pages

## 研究方向

交互机制参考情绪命名、情绪接纳、ACT 心理灵活性与价值行动、自我慈悲等研究方向。它们为设计提供依据，但不构成疗效声明：

- [Affect labeling — Lieberman et al., 2007](https://pubmed.ncbi.nlm.nih.gov/17576282/)
- [Acceptance of negative emotions — Ford et al., 2018](https://pubmed.ncbi.nlm.nih.gov/28703602/)
- [ACT mechanisms — Macri & Rogge, 2024](https://pubmed.ncbi.nlm.nih.gov/38615492/)
- [WHO guidance on ethics and governance of AI for health](https://www.who.int/publications/i/item/9789240029200)

## 隐私

当前 Demo 无后端、无数据库、无分析脚本。刷新或关闭页面即清除本次会话状态。若未来增加账号、语音上传或内容保存，需要把相关数据按敏感个人信息重新设计授权、期限、删除和安全机制。
