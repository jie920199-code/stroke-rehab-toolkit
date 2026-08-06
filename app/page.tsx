"use client";

import { useEffect, useMemo, useState } from "react";

const assessments = [
  {
    name: "Fugl-Meyer运动功能评定",
    abbr: "FMA",
    area: "运动功能",
    time: "20–30分钟",
    note: "上下肢运动、感觉与平衡的系统评估",
  },
  {
    name: "Berg平衡量表",
    abbr: "BBS",
    area: "平衡",
    time: "15–20分钟",
    note: "评估静态及动态平衡能力与跌倒风险",
  },
  {
    name: "10米步行测试",
    abbr: "10MWT",
    area: "步行",
    time: "5分钟",
    note: "量化舒适或最快步行速度，便于连续复评",
  },
  {
    name: "改良Ashworth量表",
    abbr: "MAS",
    area: "肌张力",
    time: "5–10分钟",
    note: "记录被动活动时的阻力与肌张力变化",
  },
  {
    name: "Barthel指数",
    abbr: "BI",
    area: "日常生活",
    time: "5–10分钟",
    note: "评估进食、转移、行走等日常生活能力",
  },
  {
    name: "躯干损伤量表",
    abbr: "TIS",
    area: "躯干控制",
    time: "10分钟",
    note: "观察静态、动态坐位平衡和协调能力",
  },
];
const bbsItems = [
  "坐位到站立",
  "无支持站立",
  "无靠背坐位",
  "站立到坐位",
  "床椅转移",
  "闭眼站立",
  "双脚并拢站立",
  "站立位向前伸手",
  "从地面拾物",
  "转身向后看",
  "原地转身360°",
  "交替踏台阶",
  "一脚在前站立",
  "单腿站立",
];
type RecordItem = {
  date: string;
  mode: string;
  device: string;
  t1: number;
  t2: number;
  speed: number;
};
type MasRecord = {
  date: string;
  side: string;
  muscle: string;
  grade: string;
  note: string;
};
const masGrades = [
  { grade: "0", text: "肌张力无增加" },
  { grade: "1", text: "轻度增加：活动末端出现卡顿后释放，或末端有轻微阻力" },
  {
    grade: "1+",
    text: "轻度增加：出现卡顿，随后在不足一半活动范围内有轻微阻力",
  },
  { grade: "2", text: "在大部分活动范围内阻力明显增加，但受累部位仍容易移动" },
  { grade: "3", text: "阻力显著增加，被动活动困难" },
  { grade: "4", text: "受累部位在屈曲或伸展位僵硬" },
];
const classify = (v: number) =>
  v < 0.4 ? "室内步行水平" : v < 0.8 ? "有限社区步行水平" : "社区步行水平";

export default function Home() {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("全部");
  const [tool, setTool] = useState<string | null>(null);
  const [mode, setMode] = useState("舒适速度");
  const [device, setDevice] = useState("无");
  const [t1, setT1] = useState("12.5");
  const [t2, setT2] = useState("12.0");
  const [bbsScores, setBbsScores] = useState<number[]>(Array(14).fill(0));
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [masSide, setMasSide] = useState("左侧");
  const [masMuscle, setMasMuscle] = useState("肘屈肌");
  const [masGrade, setMasGrade] = useState("0");
  const [masNote, setMasNote] = useState("");
  const [masRecords, setMasRecords] = useState<MasRecord[]>([]);
  useEffect(() => {
    try {
      setRecords(JSON.parse(localStorage.getItem("zuka-10mwt") || "[]"));
      setMasRecords(JSON.parse(localStorage.getItem("zuka-mas") || "[]"));
    } catch {}
  }, []);
  const filtered = useMemo(
    () =>
      assessments.filter(
        (a) =>
          (area === "全部" || a.area === area) &&
          `${a.name}${a.abbr}${a.area}${a.note}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [query, area],
  );
  const valid = [Number(t1), Number(t2)].filter((x) => x > 0);
  const avg = valid.length
    ? valid.reduce((a, b) => a + b, 0) / valid.length
    : 0;
  const speed = avg ? 10 / avg : 0;
  const bbsTotal = bbsScores.reduce((a, b) => a + b, 0);
  function save() {
    if (!speed) return;
    const next = [
      {
        date: new Date().toLocaleString("zh-CN"),
        mode,
        device,
        t1: Number(t1),
        t2: Number(t2),
        speed,
      },
      ...records,
    ].slice(0, 8);
    setRecords(next);
    localStorage.setItem("zuka-10mwt", JSON.stringify(next));
  }
  function saveMas() {
    const next = [
      {
        date: new Date().toLocaleString("zh-CN"),
        side: masSide,
        muscle: masMuscle,
        grade: masGrade,
        note: masNote.trim(),
      },
      ...masRecords,
    ].slice(0, 8);
    setMasRecords(next);
    localStorage.setItem("zuka-mas", JSON.stringify(next));
  }
  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top">
          <span>卒</span>
          <b>卒康</b>
          <em>STROKE REHAB LAB</em>
        </a>
        <nav>
          <a className="active" href="#tools">
            评估工具
          </a>
          <a href="#path">康复路径</a>
          <a href="#cases">病例训练</a>
        </nav>
        <button className="profile">
          治疗师工作台 <i>ZH</i>
        </button>
      </header>
      <section className="hero" id="top">
        <div className="eyebrow">
          <span />
          脑卒中康复临床工具箱
        </div>
        <h1>
          从评估，到更有依据的
          <br />
          <strong>临床决策。</strong>
        </h1>
        <p>为康复治疗师整理可信、清晰、可以立即使用的评估工具与临床路径。</p>
        <div className="searchbox">
          <span>⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索量表、功能问题或临床表现…"
          />
          <kbd>搜索</kbd>
        </div>
      </section>
      <section className="workflow" id="path">
        {[
          ["01", "安全筛查", "识别风险与禁忌"],
          ["02", "功能评估", "选择适用工具"],
          ["03", "问题分析", "形成优先问题清单"],
          ["04", "目标与干预", "制定可测量计划"],
          ["05", "复评", "判断真实改变"],
        ].map((x, i) => (
          <div className={i === 1 ? "selected" : ""} key={x[0]}>
            <small>{x[0]}</small>
            <b>{x[1]}</b>
            <span>{x[2]}</span>
          </div>
        ))}
      </section>
      <section className="content" id="tools">
        <div className="sectionhead">
          <div>
            <span className="kicker">ASSESSMENT LIBRARY</span>
            <h2>常用评估工具</h2>
            <p>按照患者当前问题，选择合适的测量工具。</p>
          </div>
        </div>
        <div className="filters">
          {[
            "全部",
            "运动功能",
            "平衡",
            "步行",
            "肌张力",
            "日常生活",
            "躯干控制",
          ].map((x) => (
            <button
              key={x}
              className={area === x ? "on" : ""}
              onClick={() => setArea(x)}
            >
              {x}
            </button>
          ))}
        </div>
        <div className="cards">
          {filtered.map((a, i) => (
            <article className="card" key={a.abbr}>
              <div
                className={`badge ${["mint", "blue", "orange", "purple", "rose", "teal"][i % 6]}`}
              >
                {a.abbr}
              </div>
              <div className="cardbody">
                <span>
                  {a.area} · {a.time}
                </span>
                <h3>{a.name}</h3>
                <p>{a.note}</p>
                <button onClick={() => setTool(a.abbr)}>
                  查看工具 <b>→</b>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="caseSection" id="cases">
        <div className="sectionhead">
          <div>
            <span className="kicker light">CASE-BASED LEARNING</span>
            <h2>用病例训练临床推理</h2>
            <p>不是背答案，而是练习如何评估、排序问题与制定计划。</p>
          </div>
        </div>
        <div className="casegrid">
          {[
            ["步态", "站立期膝过伸", "脑梗死后4周"],
            ["上肢", "偏瘫肩痛与半脱位", "脑出血后2周"],
            ["认知", "忽略导致的转移困难", "右侧大脑半球梗死后3周"],
          ].map((c, i) => (
            <article className="case" key={c[1]}>
              <span className="num">0{i + 1}</span>
              <div>
                <em>{c[0]}</em>
                <h3>{c[1]}</h3>
                <p>{c[2]}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <footer>
        <div className="brand invert">
          <span>卒</span>
          <b>卒康</b>
        </div>
        <p>临床辅助学习工具 · 不能替代独立临床判断</p>
        <small>产品原型 · 2026</small>
      </footer>
      {tool && (
        <div
          className="modalback"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setTool(null);
          }}
        >
          <section
            className="toolmodal"
            role="dialog"
            aria-modal="true"
            aria-label="评估工具详情"
          >
            <button className="close" onClick={() => setTool(null)}>
              ×
            </button>
            {tool === "10MWT" ? (
              <>
                <div className="tooltitle">
                  <span className="kicker">FUNCTIONAL ASSESSMENT</span>
                  <h2>
                    10米步行测试 <small>10MWT</small>
                  </h2>
                  <p>量化直线步行速度，用于基线评估和连续复评。</p>
                </div>
                <div className="toolgrid">
                  <article className="protocol">
                    <h3>标准操作</h3>
                    <ol>
                      <li>
                        准备14米直线路径：前后各2米加速/减速，中间10米计时。
                      </li>
                      <li>说明测试目标，可选择舒适速度或最快安全速度。</li>
                      <li>患者通过起始线时开始计时，通过终点线时停止。</li>
                      <li>完成2次，记录辅助器具与协助水平，取平均用时。</li>
                    </ol>
                    <div className="safety">
                      <b>安全提示</b>
                      <p>
                        全程做好跌倒防护；患者出现胸痛、明显呼吸困难、眩晕或步态突然恶化时立即停止。
                      </p>
                    </div>
                  </article>
                  <article className="formpanel">
                    <h3>本次测试</h3>
                    <div className="fieldrow">
                      <label>
                        测试模式
                        <select
                          value={mode}
                          onChange={(e) => setMode(e.target.value)}
                        >
                          <option>舒适速度</option>
                          <option>最快安全速度</option>
                        </select>
                      </label>
                      <label>
                        辅助器具
                        <select
                          value={device}
                          onChange={(e) => setDevice(e.target.value)}
                        >
                          <option>无</option>
                          <option>手杖</option>
                          <option>四脚杖</option>
                          <option>助行器</option>
                          <option>踝足矫形器</option>
                          <option>其他</option>
                        </select>
                      </label>
                    </div>
                    <div className="fieldrow">
                      <label>
                        第1次用时（秒）
                        <input
                          inputMode="decimal"
                          value={t1}
                          onChange={(e) => setT1(e.target.value)}
                        />
                      </label>
                      <label>
                        第2次用时（秒）
                        <input
                          inputMode="decimal"
                          value={t2}
                          onChange={(e) => setT2(e.target.value)}
                        />
                      </label>
                    </div>
                    <div className="bigresult">
                      <div>
                        <strong>{speed ? speed.toFixed(2) : "—"}</strong>
                        <span>m/s</span>
                      </div>
                      <b>{speed ? classify(speed) : "请输入有效时间"}</b>
                      <small>平均用时 {avg ? avg.toFixed(2) : "—"} 秒</small>
                    </div>
                    <button
                      className="primary"
                      onClick={save}
                      disabled={!speed}
                    >
                      保存本次结果
                    </button>
                  </article>
                </div>
                <div className="interpret">
                  <h3>结果解释</h3>
                  <div>
                    <span>
                      <b>&lt; 0.40 m/s</b>室内步行水平
                    </span>
                    <span>
                      <b>0.40–0.79 m/s</b>有限社区步行水平
                    </span>
                    <span>
                      <b>≥ 0.80 m/s</b>社区步行水平
                    </span>
                  </div>
                  <p>
                    分层仅作临床参考，应结合步行耐力、平衡、环境需求和辅助程度综合判断。
                  </p>
                </div>
                <div className="history">
                  <h3>本机历史记录</h3>
                  {records.length ? (
                    <div className="historylist">
                      {records.map((r, i) => (
                        <div key={i}>
                          <span>{r.date}</span>
                          <b>{r.speed.toFixed(2)} m/s</b>
                          <small>
                            {r.mode} · {r.device}
                          </small>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>尚无保存记录。记录仅保存在当前浏览器中。</p>
                  )}
                </div>
              </>
            ) : tool === "BBS" ? (
              <>
                <div className="tooltitle">
                  <span className="kicker">BALANCE ASSESSMENT</span>
                  <h2>
                    Berg平衡量表 <small>BBS</small>
                  </h2>
                  <p>14项功能性活动，每项0–4分，总分0–56分。</p>
                </div>
                <div className="bbsintro">
                  <div>
                    <b>预计用时</b>
                    <span>15–20分钟</span>
                  </div>
                  <div>
                    <b>所需器材</b>
                    <span>秒表、两把椅子、脚凳、尺子和鞋</span>
                  </div>
                  <div>
                    <b>重要规则</b>
                    <span>按实际表现评分；测试中不使用步行辅助器具</span>
                  </div>
                </div>
                <div className="bbsbody">
                  <div className="bbslist">
                    {bbsItems.map((item, i) => (
                      <label className="bbsitem" key={item}>
                        <span>
                          <i>{i + 1}</i>
                          {item}
                        </span>
                        <select
                          value={bbsScores[i]}
                          onChange={(e) =>
                            setBbsScores((s) =>
                              s.map((v, n) =>
                                n === i ? Number(e.target.value) : v,
                              ),
                            )
                          }
                          aria-label={`${item}评分`}
                        >
                          <option value="0">0 · 无法完成</option>
                          <option value="1">1 · 需要较多协助</option>
                          <option value="2">2 · 需要少量协助或未达标准</option>
                          <option value="3">3 · 可完成但存在限制</option>
                          <option value="4">4 · 独立按标准完成</option>
                        </select>
                      </label>
                    ))}
                  </div>
                  <aside className="bbssummary">
                    <span>当前总分</span>
                    <strong>{bbsTotal}</strong>
                    <em>/ 56</em>
                    <b>
                      {bbsTotal < 45
                        ? "可能存在较高跌倒风险"
                        : "未低于常用45分参考线"}
                    </b>
                    <p>
                      请依据标准手册中每个条目的具体时间、距离与协助标准选择0–4分。这里的简短标签不能替代条目级判分说明。
                    </p>
                    <button
                      className="outline"
                      onClick={() => setBbsScores(Array(14).fill(0))}
                    >
                      清空评分
                    </button>
                  </aside>
                </div>
                <div className="interpret">
                  <h3>临床解释</h3>
                  <p>
                    BBS为表现性平衡测量工具。56分表示功能性平衡；低于45分可能提示跌倒风险增加，但不同人群与研究采用的阈值不同，不应单独用于诊断或预测跌倒。
                  </p>
                  <p>
                    建议结合跌倒史、步态速度、转移能力、认知与环境需求综合判断，并在相似条件下连续复评。
                  </p>
                </div>
              </>
            ) : tool === "MAS" ? (
              <>
                <div className="tooltitle">
                  <span className="kicker">TONE &amp; PASSIVE RESISTANCE</span>
                  <h2>改良 Ashworth 量表 <small>MAS</small></h2>
                  <p>记录快速被动活动时感受到的阻力等级，并保留侧别、肌群与观察备注。</p>
                </div>
                <div className="maslayout">
                  <article className="protocol">
                    <h3>建议操作流程</h3>
                    <ol>
                      <li>先排除疼痛、关节活动受限、挛缩和近期手术等影响因素。</li>
                      <li>让患者放松，固定近端，在相同体位下完成全范围被动活动。</li>
                      <li>以较快且尽量一致的速度移动关节，观察卡顿位置及后续阻力。</li>
                      <li>左右侧分别记录；复评时尽量保持体位、速度、检查者和时段一致。</li>
                    </ol>
                    <div className="safety"><b>解释边界</b><p>MAS测到的是被动活动阻力，并非“纯粹的痉挛”。软组织僵硬、挛缩、疼痛、肌张力障碍及牵张反射都可能影响结果。</p></div>
                  </article>
                  <article className="formpanel">
                    <h3>本次记录</h3>
                    <div className="fieldrow">
                      <label>侧别<select value={masSide} onChange={(e)=>setMasSide(e.target.value)}><option>左侧</option><option>右侧</option></select></label>
                      <label>受测肌群<select value={masMuscle} onChange={(e)=>setMasMuscle(e.target.value)}>{["肘屈肌","腕屈肌","指屈肌","髋内收肌","膝屈肌","膝伸肌","踝跖屈肌","其他肌群"].map((x)=><option key={x}>{x}</option>)}</select></label>
                    </div>
                    <fieldset className="masgrades">
                      <legend>选择等级</legend>
                      {masGrades.map((x)=><label className={masGrade===x.grade?"selected":""} key={x.grade}><input type="radio" name="mas-grade" value={x.grade} checked={masGrade===x.grade} onChange={()=>setMasGrade(x.grade)}/><b>{x.grade}</b><span>{x.text}</span></label>)}
                    </fieldset>
                    <label className="masnote">观察备注（可选）<textarea value={masNote} onChange={(e)=>setMasNote(e.target.value)} placeholder="例如：卡顿位置、疼痛、活动范围或体位" /></label>
                    <div className="massummary"><span>{masSide} · {masMuscle}</span><strong>MAS {masGrade}</strong><p>{masGrades.find((x)=>x.grade===masGrade)?.text}</p></div>
                    <button className="primary" onClick={saveMas}>保存本次记录</button>
                  </article>
                </div>
                <div className="interpret"><h3>临床使用提示</h3><p>MAS是0、1、1+、2、3、4的顺序等级，不宜把相邻等级直接当作等距数值做加减。下肢肌群的评定者间一致性可能有限，连续复评更应强调操作标准化。</p><p>结果需结合被动关节活动度、疼痛、功能表现、阵挛及其他神经学检查综合判断，不能单独决定治疗方案。</p></div>
                <div className="history"><h3>本机历史记录</h3>{masRecords.length?<div className="historylist">{masRecords.map((r,i)=><div key={i}><span>{r.date}</span><b>MAS {r.grade}</b><small>{r.side} · {r.muscle}{r.note?` · ${r.note}`:""}</small></div>)}</div>:<p>尚无保存记录。记录仅保存在当前浏览器中。</p>}</div>
              </>
            ) : (
              <div className="coming">
                <span className="kicker">CONTENT IN PROGRESS</span>
                <h2>{assessments.find((a) => a.abbr === tool)?.name}</h2>
                <p>
                  量表条目、计分规则及授权信息正在整理。完成审核后开放使用。
                </p>
                <button onClick={() => setTool(null)}>返回工具库</button>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
