"use client";

import { useMemo, useState } from "react";

const assessments = [
  { name: "Fugl-Meyer运动功能评定", abbr: "FMA", area: "运动功能", time: "20–30 分钟", note: "上下肢运动、感觉与平衡的系统评估", color: "mint" },
  { name: "Berg平衡量表", abbr: "BBS", area: "平衡", time: "15–20 分钟", note: "评估静态及动态平衡能力与跌倒风险", color: "blue" },
  { name: "10米步行测试", abbr: "10MWT", area: "步行", time: "5 分钟", note: "量化舒适或最快步行速度，便于连续复评", color: "orange" },
  { name: "改良Ashworth量表", abbr: "MAS", area: "肌张力", time: "5–10 分钟", note: "记录被动活动时的阻力与肌张力变化", color: "purple" },
  { name: "Barthel指数", abbr: "BI", area: "日常生活", time: "5–10 分钟", note: "评估进食、转移、行走等日常生活能力", color: "rose" },
  { name: "躯干损伤量表", abbr: "TIS", area: "躯干控制", time: "10 分钟", note: "观察静态、动态坐位平衡和协调能力", color: "teal" },
];

const cases = [
  { n: "01", title: "站立期膝过伸", meta: "脑梗死后 4 周 · Brunnstrom III期", tag: "步态" },
  { n: "02", title: "偏瘫肩痛与半脱位", meta: "脑出血后 2 周 · 上肢迟缓期", tag: "上肢" },
  { n: "03", title: "忽略导致的转移困难", meta: "右侧大脑半球梗死后 3 周", tag: "认知" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("全部");
  const [seconds, setSeconds] = useState("12.5");
  const [showCalc, setShowCalc] = useState(false);
  const speed = Number(seconds) > 0 ? (10 / Number(seconds)).toFixed(2) : "—";
  const filtered = useMemo(() => assessments.filter((a) =>
    (area === "全部" || a.area === area) && `${a.name}${a.abbr}${a.area}${a.note}`.toLowerCase().includes(query.toLowerCase())
  ), [query, area]);

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="卒康首页"><span>卒</span><b>卒康</b><em>STROKE REHAB LAB</em></a>
        <nav aria-label="主导航"><a className="active" href="#tools">评估工具</a><a href="#path">康复路径</a><a href="#cases">病例训练</a></nav>
        <button className="profile" aria-label="个人中心">治疗师工作台 <i>ZH</i></button>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow"><span /> 脑卒中康复临床工具箱</div>
        <h1>从评估，到更有依据的<br/><strong>临床决策。</strong></h1>
        <p>为康复治疗师整理可信、清晰、可以立即使用的评估工具与临床路径。</p>
        <div className="searchbox">
          <span aria-hidden="true">⌕</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索量表、功能问题或临床表现…" aria-label="搜索工具" />
          <kbd>搜索</kbd>
        </div>
        <div className="quick"><small>快捷入口</small><button onClick={() => {setArea("步行"); document.querySelector("#tools")?.scrollIntoView({behavior:"smooth"})}}>偏瘫步态</button><button onClick={() => setArea("运动功能")}>上肢功能</button><button onClick={() => setArea("平衡")}>平衡障碍</button><button onClick={() => setArea("肌张力")}>痉挛</button></div>
      </section>

      <section className="workflow" id="path" aria-label="临床工作流">
        <div><small>01</small><b>安全筛查</b><span>识别风险与禁忌</span></div><i>→</i>
        <div className="selected"><small>02</small><b>功能评估</b><span>选择适用工具</span></div><i>→</i>
        <div><small>03</small><b>问题分析</b><span>形成优先问题清单</span></div><i>→</i>
        <div><small>04</small><b>目标与干预</b><span>制定可测量计划</span></div><i>→</i>
        <div><small>05</small><b>复评</b><span>判断真实改变</span></div>
      </section>

      <section className="content" id="tools">
        <div className="sectionhead"><div><span className="kicker">ASSESSMENT LIBRARY</span><h2>常用评估工具</h2><p>按照患者当前问题，选择合适的测量工具。</p></div><button className="outline" onClick={() => setShowCalc(!showCalc)}>{showCalc ? "关闭计算器" : "打开步速计算器"} ↗</button></div>

        {showCalc && <div className="calculator"><div><span>10MWT 快速计算</span><b>10米步行速度</b><p>输入完成测试距离所需的秒数。</p></div><label>用时（秒）<input inputMode="decimal" value={seconds} onChange={(e) => setSeconds(e.target.value)} /></label><div className="result"><strong>{speed}</strong><span>m/s</span><small>{Number(speed) < .4 ? "室内步行水平" : Number(speed) < .8 ? "有限社区步行水平" : "社区步行水平"}</small></div></div>}

        <div className="filters" role="group" aria-label="按领域筛选">{["全部","运动功能","平衡","步行","肌张力","日常生活","躯干控制"].map(x => <button key={x} className={area===x?"on":""} onClick={() => setArea(x)}>{x}</button>)}</div>
        <div className="cards">
          {filtered.map((a) => <article className="card" key={a.abbr}><div className={`badge ${a.color}`}>{a.abbr}</div><div className="cardbody"><span>{a.area} · {a.time}</span><h3>{a.name}</h3><p>{a.note}</p><button onClick={() => alert(`${a.name}\n\n原型演示：下一版将在这里呈现适用人群、操作步骤、计分、结果解释及复评建议。`)}>查看工具 <b>→</b></button></div></article>)}
          {filtered.length === 0 && <div className="empty">没有找到匹配的工具，试试“步行”或“平衡”。</div>}
        </div>
      </section>

      <section className="caseSection" id="cases">
        <div className="sectionhead"><div><span className="kicker light">CASE-BASED LEARNING</span><h2>用病例训练临床推理</h2><p>不是背答案，而是练习如何评估、排序问题与制定计划。</p></div><span className="caseCount">本周新增 <b>3</b> 个病例</span></div>
        <div className="casegrid">{cases.map((c, i) => <article className="case" key={c.n}><span className="num">{c.n}</span><div><em>{c.tag}</em><h3>{c.title}</h3><p>{c.meta}</p></div><button aria-label={`开始病例：${c.title}`} onClick={() => alert("病例训练原型将在下一步展开为：病史 → 评估选择 → 问题排序 → 目标 → 干预 → 专家思路。")}>{i===0?"开始病例":"预览"} →</button></article>)}</div>
      </section>

      <footer><div className="brand invert"><span>卒</span><b>卒康</b></div><p>临床辅助学习工具 · 内容不能替代独立临床判断</p><small>首版产品原型 · 2026</small></footer>
    </main>
  );
}
