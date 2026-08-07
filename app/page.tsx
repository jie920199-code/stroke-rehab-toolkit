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
    name: "Brunnstrom运动恢复分期",
    abbr: "BR",
    area: "运动功能",
    time: "5–10分钟",
    note: "分别记录上肢、手和下肢的运动恢复阶段",
  },
  {
    name: "脑卒中感觉功能评估",
    abbr: "SENS",
    area: "感觉功能",
    time: "10–15分钟",
    note: "分层筛查浅感觉、深感觉与皮质感觉异常",
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
    name: "功能性步行分级",
    abbr: "FAC",
    area: "步行",
    time: "3–5分钟",
    note: "按步行所需的人身帮助程度记录0–5级",
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
type BiRecord={date:string;total:number;note:string};
type TisRecord={date:string;staticScore:number;dynamicScore:number;coordinationScore:number;note:string};
type FmaRecord={date:string;ue:number;le:number;sensation:number;balance:number;rom:number;pain:number;note:string};
type SensRecord={date:string;side:string;results:string[];note:string};
type BbsRecord={date:string;total:number;scores:number[]};
type BrRecord={date:string;upper:number;hand:number;lower:number;note:string};
type FacRecord={date:string;level:number;device:string;note:string};
const facLevels=[
 {level:0,title:"不能功能性步行",text:"不能步行，或需要两人及以上帮助。"},
 {level:1,title:"需持续较多帮助",text:"需要一人持续用手支持身体重量并帮助维持平衡或协调。"},
 {level:2,title:"需持续或间歇轻触帮助",text:"需要一人以轻触方式帮助平衡或协调，但不承担身体重量。"},
 {level:3,title:"需监护或口头提示",text:"无需身体接触，但需要一人近距离监护、待命或给予口头提示。"},
 {level:4,title:"平整地面独立",text:"可在平整地面独立步行，但楼梯、坡道或不平地面仍需帮助。"},
 {level:5,title:"各种地面独立",text:"可在平整及不平地面、坡道和楼梯上独立步行。"},
];
const brStages=[
 {stage:1,title:"弛缓期",text:"无随意运动，肌张力低下或弛缓。"},
 {stage:2,title:"协同运动开始出现",text:"痉挛开始出现，可见微弱随意运动或基本协同运动成分。"},
 {stage:3,title:"协同运动占优势",text:"可随意完成屈肌或伸肌协同运动，痉挛通常较明显。"},
 {stage:4,title:"脱离协同运动",text:"痉挛开始减弱，可完成部分脱离基本协同模式的组合运动。"},
 {stage:5,title:"分离运动进一步改善",text:"可完成更复杂、较独立于基本协同模式的运动，痉挛继续减弱。"},
 {stage:6,title:"接近正常协调",text:"可进行较独立的关节运动，协调和速度接近正常，痉挛很轻或消失。"},
];
const sensItems=[
 {group:"浅感觉",name:"轻触觉",help:"闭眼，随机触碰并与健侧对应部位比较"},{group:"浅感觉",name:"针刺觉／锐钝辨别",help:"使用一次性安全工具，避免破损皮肤"},{group:"浅感觉",name:"温度觉",help:"仅在有指征且能安全控制温度时检查"},{group:"深感觉",name:"关节位置觉",help:"握持指（趾）侧面，小幅上下移动"},{group:"深感觉",name:"运动觉",help:"识别关节被动运动的方向"},{group:"皮质感觉",name:"触觉定位",help:"指出被触碰的准确身体部位"},{group:"皮质感觉",name:"双侧同时刺激",help:"比较单侧与双侧刺激，观察感觉消退"},{group:"皮质感觉",name:"实体觉",help:"闭眼辨认熟悉、安全的日常物品"},{group:"皮质感觉",name:"图形觉",help:"在手掌书写简单数字或图形并辨认"},
];
const biItems=[
 {name:"进食",options:[[0,"不能独立进食"],[5,"需要切食、涂抹或监督"],[10,"独立进食"]]},
 {name:"洗澡",options:[[0,"需要帮助"],[5,"独立完成"]]},
 {name:"个人卫生",options:[[0,"需要帮助"],[5,"独立洗脸、梳头、刷牙和剃须"]]},
 {name:"穿衣",options:[[0,"依赖"],[5,"需要帮助，但能完成约一半"],[10,"独立完成，包括扣件"]]},
 {name:"大便控制",options:[[0,"失禁或需要灌肠"],[5,"偶有失禁"],[10,"能控制"]]},
 {name:"小便控制",options:[[0,"失禁或不能管理导尿"],[5,"偶有失禁"],[10,"能控制或独立管理导尿"]]},
 {name:"如厕",options:[[0,"依赖"],[5,"需要部分帮助"],[10,"独立完成进出、整理衣物及清洁"]]},
 {name:"床椅转移",options:[[0,"不能完成，坐位平衡差"],[5,"需要较多帮助，可坐起"],[10,"需要少量帮助或监督"],[15,"独立完成"]]},
 {name:"平地移动",options:[[0,"不能移动"],[5,"可独立使用轮椅约50米"],[10,"需一人帮助或监督步行约50米"],[15,"独立步行约50米，可用辅助器具"]]},
 {name:"上下楼梯",options:[[0,"不能完成"],[5,"需要帮助或监督"],[10,"独立完成"]]},
];
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
  const [bbsRecords,setBbsRecords]=useState<BbsRecord[]>([]);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [masSide, setMasSide] = useState("左侧");
  const [masMuscle, setMasMuscle] = useState("肘屈肌");
  const [masGrade, setMasGrade] = useState("0");
  const [masNote, setMasNote] = useState("");
  const [masRecords, setMasRecords] = useState<MasRecord[]>([]);
  const [biScores,setBiScores]=useState<number[]>(Array(10).fill(0)); const [biNote,setBiNote]=useState(""); const [biRecords,setBiRecords]=useState<BiRecord[]>([]);
  const [tisStatic,setTisStatic]=useState(0); const [tisDynamic,setTisDynamic]=useState(0); const [tisCoord,setTisCoord]=useState(0); const [tisNote,setTisNote]=useState(""); const [tisRecords,setTisRecords]=useState<TisRecord[]>([]);
  const [fmaScores,setFmaScores]=useState([0,0,0,0,0,0]); const [fmaNote,setFmaNote]=useState(""); const [fmaRecords,setFmaRecords]=useState<FmaRecord[]>([]);
  const [sensSide,setSensSide]=useState("左侧"); const [sensResults,setSensResults]=useState<string[]>(Array(sensItems.length).fill("未测")); const [sensNote,setSensNote]=useState(""); const [sensRecords,setSensRecords]=useState<SensRecord[]>([]);
  const [brUpper,setBrUpper]=useState(1); const [brHand,setBrHand]=useState(1); const [brLower,setBrLower]=useState(1); const [brNote,setBrNote]=useState(""); const [brRecords,setBrRecords]=useState<BrRecord[]>([]);
  const [facLevel,setFacLevel]=useState(0); const [facDevice,setFacDevice]=useState("无"); const [facNote,setFacNote]=useState(""); const [facRecords,setFacRecords]=useState<FacRecord[]>([]);
  const [pathFac,setPathFac]=useState(3); const [pathBbs,setPathBbs]=useState(38); const [pathSpeed,setPathSpeed]=useState(0.42); const [pathGoal,setPathGoal]=useState("小区步行"); const [pathRedFlag,setPathRedFlag]=useState(false);
  const [caseAnswers,setCaseAnswers]=useState<number[]>([-1,-1,-1]);
  const [upperStage,setUpperStage]=useState(3); const [handStage,setHandStage]=useState(2); const [upperFma,setUpperFma]=useState(24); const [upperPain,setUpperPain]=useState(3); const [upperTask,setUpperTask]=useState("辅助稳定物品");
  const [shoulderAnswers,setShoulderAnswers]=useState<number[]>([-1,-1,-1]);
  const [neglectSide,setNeglectSide]=useState("左侧"); const [neglectLevel,setNeglectLevel]=useState("中度"); const [neglectTis,setNeglectTis]=useState(12); const [transferHelp,setTransferHelp]=useState("一人少量帮助");
  const [neglectAnswers,setNeglectAnswers]=useState<number[]>([-1,-1,-1]);
  const [toneGrade,setToneGrade]=useState("2"); const [toneProm,setToneProm]=useState("被动活动范围基本完整"); const [tonePain,setTonePain]=useState(2); const [toneGoal,setToneGoal]=useState("改善步行足部着地");
  const [toneAnswers,setToneAnswers]=useState<number[]>([-1,-1,-1]);
  const [homeBi,setHomeBi]=useState(65); const [homeTransfer,setHomeTransfer]=useState("少量帮助／监督"); const [homeCognition,setHomeCognition]=useState("需要提示"); const [homeSupport,setHomeSupport]=useState("白天部分时间有人");
  const [adlAnswers,setAdlAnswers]=useState<number[]>([-1,-1,-1]);
  useEffect(() => {
    try {
      setRecords(JSON.parse(localStorage.getItem("zuka-10mwt") || "[]"));
      setMasRecords(JSON.parse(localStorage.getItem("zuka-mas") || "[]"));
      setBiRecords(JSON.parse(localStorage.getItem("zuka-bi") || "[]"));
      setTisRecords(JSON.parse(localStorage.getItem("zuka-tis") || "[]"));
      setFmaRecords(JSON.parse(localStorage.getItem("zuka-fma") || "[]"));
      setSensRecords(JSON.parse(localStorage.getItem("zuka-sens") || "[]"));
      setBbsRecords(JSON.parse(localStorage.getItem("zuka-bbs") || "[]"));
      setBrRecords(JSON.parse(localStorage.getItem("zuka-br") || "[]"));
      setFacRecords(JSON.parse(localStorage.getItem("zuka-fac") || "[]"));
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
  function saveBbs(){const next=[{date:new Date().toLocaleString("zh-CN"),total:bbsTotal,scores:bbsScores},...bbsRecords].slice(0,8);setBbsRecords(next);localStorage.setItem("zuka-bbs",JSON.stringify(next));}
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
  const biTotal=biScores.reduce((a,b)=>a+b,0);
  const biLevel=biTotal===100?"基本日常生活活动独立":biTotal>=91?"轻度依赖":biTotal>=61?"中度依赖":biTotal>=21?"重度依赖":"完全依赖";
  function saveBi(){const next=[{date:new Date().toLocaleString("zh-CN"),total:biTotal,note:biNote.trim()},...biRecords].slice(0,8);setBiRecords(next);localStorage.setItem("zuka-bi",JSON.stringify(next));}
  const tisTotal=tisStatic+tisDynamic+tisCoord;
  function saveTis(){const next=[{date:new Date().toLocaleString("zh-CN"),staticScore:tisStatic,dynamicScore:tisDynamic,coordinationScore:tisCoord,note:tisNote.trim()},...tisRecords].slice(0,8);setTisRecords(next);localStorage.setItem("zuka-tis",JSON.stringify(next));}
  const fmaMotor=fmaScores[0]+fmaScores[1],fmaTotal=fmaScores.reduce((a,b)=>a+b,0);
  function saveFma(){const next=[{date:new Date().toLocaleString("zh-CN"),ue:fmaScores[0],le:fmaScores[1],sensation:fmaScores[2],balance:fmaScores[3],rom:fmaScores[4],pain:fmaScores[5],note:fmaNote.trim()},...fmaRecords].slice(0,8);setFmaRecords(next);localStorage.setItem("zuka-fma",JSON.stringify(next));}
  const sensTested=sensResults.filter((x)=>x!=="未测").length,sensAbnormal=sensResults.filter((x)=>x!=="未测"&&x!=="正常").length;
  function saveSens(){const next=[{date:new Date().toLocaleString("zh-CN"),side:sensSide,results:sensResults,note:sensNote.trim()},...sensRecords].slice(0,8);setSensRecords(next);localStorage.setItem("zuka-sens",JSON.stringify(next));}
  function saveBr(){const next=[{date:new Date().toLocaleString("zh-CN"),upper:brUpper,hand:brHand,lower:brLower,note:brNote.trim()},...brRecords].slice(0,8);setBrRecords(next);localStorage.setItem("zuka-br",JSON.stringify(next));}
  function saveFac(){const next=[{date:new Date().toLocaleString("zh-CN"),level:facLevel,device:facDevice,note:facNote.trim()},...facRecords].slice(0,8);setFacRecords(next);localStorage.setItem("zuka-fac",JSON.stringify(next));}
  const totalRecords=records.length+bbsRecords.length+masRecords.length+biRecords.length+tisRecords.length+fmaRecords.length+sensRecords.length+brRecords.length+facRecords.length;
  function exportRecords(){const payload={exportedAt:new Date().toISOString(),app:"卒康",version:1,records:{walk10m:records,fac:facRecords,bbs:bbsRecords,mas:masRecords,barthel:biRecords,tis:tisRecords,fma:fmaRecords,sensory:sensRecords,brunnstrom:brRecords}};const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`卒康评估记录-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);}
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
        <button className="profile" onClick={()=>setTool("DASH")}>
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
      <section className="pathSection">
        <div><span className="kicker">CLINICAL PATHWAY 01</span><h2>步行康复路径</h2><p>把安全筛查、FAC、BBS和10米步行速度串成一条可解释的决策路径。</p></div>
        <div className="pathPreview"><span>输入当前表现</span><b>识别优先问题</b><em>生成目标与复评建议</em></div>
        <button onClick={()=>setTool("PATH-WALK")}>进入步行路径 <b>→</b></button>
      </section>
      <section className="pathSection pathAlt">
        <div><span className="kicker">CLINICAL PATHWAY 02</span><h2>上肢与手功能路径</h2><p>结合Brunnstrom分期、FMA-UE、疼痛和目标任务，识别肩部保护、近端控制或手功能训练重点。</p></div>
        <div className="pathPreview"><span>先排查肩痛</span><b>匹配运动阶段</b><em>回到真实任务</em></div>
        <button onClick={()=>setTool("PATH-UPPER")}>进入上肢路径 <b>→</b></button>
      </section>
      <section className="pathSection pathNeglect">
        <div><span className="kicker">CLINICAL PATHWAY 03</span><h2>偏侧忽略与安全转移路径</h2><p>把空间觉察、感觉、坐位控制、转移协助和环境布置整合到真实活动中。</p></div>
        <div className="pathPreview"><span>区分忽略与视野问题</span><b>训练扫描与锚定</b><em>嵌入转移任务</em></div>
        <button onClick={()=>setTool("PATH-NEGLECT")}>进入忽略路径 <b>→</b></button>
      </section>
      <section className="pathSection pathTone">
        <div><span className="kicker">CLINICAL PATHWAY 04</span><h2>痉挛与关节活动受限路径</h2><p>区分速度依赖性阻力、固定挛缩、疼痛和功能影响，再确定目标与转介时机。</p></div>
        <div className="pathPreview"><span>不只看MAS</span><b>先明确功能问题</b><em>制定多专业计划</em></div>
        <button onClick={()=>setTool("PATH-TONE")}>进入痉挛路径 <b>→</b></button>
      </section>
      <section className="pathSection pathAdl">
        <div><span className="kicker">CLINICAL PATHWAY 05</span><h2>日常生活活动与居家准备</h2><p>从Barthel总分回到如厕、转移、洗澡等具体活动，并检查照护、环境和随访是否到位。</p></div>
        <div className="pathPreview"><span>拆解具体活动</span><b>模拟家庭环境</b><em>形成交接清单</em></div>
        <button onClick={()=>setTool("PATH-ADL")}>进入居家路径 <b>→</b></button>
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
            "感觉功能",
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
            ["肌张力", "踝跖屈影响足部着地", "脑梗死后3个月"],
            ["日常生活", "夜间如厕与居家安全", "脑梗死后5周"],
          ].map((c, i) => (
            <article className="case ready" key={c[1]} onClick={()=>setTool(["CASE-WALK","CASE-SHOULDER","CASE-NEGLECT","CASE-TONE","CASE-ADL"][i])} role="button" tabIndex={0}>
              <span className="num">0{i + 1}</span>
              <div>
                <em>{c[0]}</em>
                <h3>{c[1]}</h3>
                <p>{c[2]}</p>
                <button>开始病例训练 →</button>
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
            {tool === "PATH-ADL" ? (
              <>
                <div className="tooltitle"><span className="kicker">CLINICAL PATHWAY 05</span><h2>日常生活活动与居家准备路径</h2><p>Barthel指数用于描述基本ADL表现，不能单独证明患者可以安全独居或完成工具性活动。</p></div>
                <div className="pathInputs"><label>Barthel指数<input type="number" min="0" max="100" step="5" value={homeBi} onChange={(e)=>setHomeBi(Math.max(0,Math.min(100,Number(e.target.value)||0)))} /></label><label>床椅／如厕转移<select value={homeTransfer} onChange={(e)=>setHomeTransfer(e.target.value)}><option>独立且安全</option><option>少量帮助／监督</option><option>较多帮助</option><option>不能完成</option></select></label><label>认知与安全判断<select value={homeCognition} onChange={(e)=>setHomeCognition(e.target.value)}><option>能独立执行</option><option>需要提示</option><option>持续监督</option><option>无法可靠配合</option></select></label><label>家庭支持<select value={homeSupport} onChange={(e)=>setHomeSupport(e.target.value)}><option>全天有胜任照护者</option><option>白天部分时间有人</option><option>仅偶尔探访</option><option>独居且暂无支持</option></select></label></div>
                <div className="pathPlan"><div className="pathPriority"><span>当前优先方向</span><h3>{homeTransfer.includes("不能")||homeTransfer.includes("较多")?"先解决高频转移和照护可行性":homeCognition.includes("持续")||homeCognition.includes("无法")?"认知安全、监督需求与照护者训练":homeSupport.includes("独居")||homeSupport.includes("偶尔")?"补齐家庭支持、环境改造和应急方案":"在真实家庭任务中验证独立性"}</h3><p>BI {homeBi}/100；转移“{homeTransfer}”，认知“{homeCognition}”，家庭支持“{homeSupport}”。总分必须结合具体条目与家庭情境解释。</p></div><div className="pathColumns"><article><span>优先训练</span><ul><li>如厕、穿衣、洗澡和床椅转移的完整任务链</li><li>在接近家庭高度、空间和器具条件下练习</li><li>训练患者发起求助、携带呼叫设备和能量管理</li></ul></article><article><span>居家准备</span><ul><li>核对入口、床、厕所、浴室、照明和地面风险</li><li>试用并确认辅助器具尺寸与使用能力</li><li>照护者完成实际操作训练并说明自身承受能力</li></ul></article><article><span>交接与复评</span><ul><li>记录每项活动的协助量、提示和器具</li><li>提供药物、随访、应急联系人及康复计划</li><li>回家后尽早复核真实环境中的安全与目标</li></ul></article></div></div>
                <div className="interpret"><h3>出院边界</h3><p>本路径不作“可以出院”或“可以独居”的自动判定。最终计划需要患者、家属及多专业团队共同确认，并与当地医疗和社会支持条件相匹配。</p></div>
              </>
            ) : tool === "CASE-ADL" ? (
              <>
                <div className="tooltitle"><span className="kicker">CASE-BASED LEARNING 05</span><h2>病例：夜间如厕与居家安全</h2><p>脑梗死后5周，BI 70/100。白天使用四脚杖可在监督下如厕；夜间起身急，曾近跌倒。与高龄配偶同住，卫生间门口有门槛。</p></div>
                <div className="caseFacts"><span>转移需口头提示</span><span>夜尿2–3次</span><span>配偶不能提供抬抱</span><span>卧室到厕所8米</span></div>
                <div className="quiz">{[
                  {q:"1. BI 70分能否说明可以安全回家？",opts:["可以，总分已超过60","不能；还需分析夜间如厕、认知、环境和可用照护","只需再测一次BI"],correct:1,why:"BI总分不能覆盖时段差异、环境障碍和照护者能力。"},
                  {q:"2. 出院前最有价值的训练是什么？",opts:["只在宽敞治疗室练直线步行","模拟夜间起床—照明—转移—门槛—如厕完整任务，并训练安全求助","让配偶学习抬抱患者"],correct:1,why:"训练应贴近真实高风险任务，同时避免把不可承受的抬抱责任交给高龄照护者。"},
                  {q:"3. 哪项计划更完整？",opts:["回家后自行适应","环境处理、合适器具、照护者训练、夜间方案和早期随访复核","只发一张家庭训练单"],correct:1,why:"安全转衔需要环境、人员、器具、应急和后续服务共同落实。"},
                ].map((q,qi)=><section className="quizitem" key={q.q}><h3>{q.q}</h3>{q.opts.map((o,oi)=><button className={adlAnswers[qi]===oi?(oi===q.correct?"correct":"wrong"):""} onClick={()=>setAdlAnswers(a=>a.map((v,i)=>i===qi?oi:v))} key={o}>{o}</button>)}{adlAnswers[qi]>=0?<p className={adlAnswers[qi]===q.correct?"ok":"retry"}>{adlAnswers[qi]===q.correct?"判断合理。":"再想一步。"} {q.why}</p>:null}</section>)}</div>
                <div className="caseResult"><strong>{adlAnswers.filter(a=>a===1).length}/3</strong><div><b>{adlAnswers.every(a=>a>=0)?"本轮已完成":"完成三个居家决策"}</b><p>从总分回到真实任务、真实照护能力和真实家庭环境。</p></div><button className="outline" onClick={()=>setAdlAnswers([-1,-1,-1])}>重新训练</button></div>
              </>
            ) : tool === "PATH-TONE" ? (
              <>
                <div className="tooltitle"><span className="kicker">CLINICAL PATHWAY 04</span><h2>痉挛与关节活动受限路径</h2><p>MAS只反映被动活动阻力等级；处理前需明确活动范围、疼痛、诱因和功能目标。</p></div>
                <div className="pathInputs"><label>MAS等级<select value={toneGrade} onChange={(e)=>setToneGrade(e.target.value)}>{masGrades.map(x=><option value={x.grade} key={x.grade}>MAS {x.grade}</option>)}</select></label><label>慢速被动活动范围<select value={toneProm} onChange={(e)=>setToneProm(e.target.value)}><option>被动活动范围基本完整</option><option>部分受限但可缓慢达到更多范围</option><option>固定明显受限／疑似挛缩</option></select></label><label>疼痛 NRS 0–10<input type="number" min="0" max="10" value={tonePain} onChange={(e)=>setTonePain(Math.max(0,Math.min(10,Number(e.target.value)||0)))} /></label><label>主要功能目标<select value={toneGoal} onChange={(e)=>setToneGoal(e.target.value)}><option>改善步行足部着地</option><option>改善手卫生与穿衣</option><option>减少疼痛与夜间痉挛</option><option>便于摆位、照护或佩戴矫形器</option><option>改善主动任务表现</option></select></label></div>
                <div className="pathPlan"><div className="pathPriority"><span>当前判断重点</span><h3>{toneProm.includes("固定")?"优先评估软组织挛缩与结构性限制":tonePain>=5?"先识别疼痛来源与痉挛诱因":Number(toneGrade.replace("+",".5"))>=3?"明显被动阻力，需要专科综合评估":"把肌张力变化放回具体功能任务解释"}</h3><p>{toneGoal}。记录速度、体位、关节范围和诱发因素，避免把MAS变化等同于功能改善。</p></div><div className="pathColumns"><article><span>先检查</span><ul><li>慢速与快速被动活动的差异</li><li>疼痛、皮肤、感染、便秘和不良摆位等诱因</li><li>主动控制、力量及痉挛是否在任务中有帮助或妨碍</li></ul></article><article><span>管理方向</span><ul><li>围绕明确目标进行主动任务练习和摆位教育</li><li>保持舒适活动范围，避免强力或疼痛性牵伸</li><li>复杂或局灶性问题转介痉挛专科团队评估药物、注射及配套康复</li><li>矫形、夹板或持续牵伸不作为无差别常规方案</li></ul></article><article><span>复评计划</span><ul><li>同体位、同速度复测MAS和活动范围</li><li>疼痛、皮肤、睡眠和照护难度</li><li>目标任务是否改善，而非只看肌张力</li><li>记录不良反应和患者偏好</li></ul></article></div></div>
                <div className="interpret"><h3>使用边界</h3><p>肉毒毒素和口服抗痉挛药物需要具备资质的临床团队评估与处方；局灶性肌张力下降并不保证步行或主动手功能同步改善。</p></div>
              </>
            ) : tool === "CASE-TONE" ? (
              <>
                <div className="tooltitle"><span className="kicker">CASE-BASED LEARNING 04</span><h2>病例：踝跖屈肌张力影响足部着地</h2><p>脑梗死后3个月，FAC 3级，踝跖屈肌MAS 2。慢速踝背屈接近中立位，快走时前足先着地，紧张时更明显。</p></div>
                <div className="caseFacts"><span>无明显踝痛</span><span>被动范围接近完整</span><span>使用四脚杖</span><span>目标是减少绊倒</span></div>
                <div className="quiz">{[
                  {q:"1. 还需要优先补充什么信息？",opts:["只重复一次MAS","观察不同速度下步态、主动背屈、膝控制及诱发因素","直接判断为固定挛缩"],correct:1,why:"被动范围接近完整，需进一步区分痉挛、主动控制不足和整条下肢运动策略。"},
                  {q:"2. 哪个目标最合理？",opts:["两周内MAS必须降到0","在规定步行任务中增加足跟或更安全的足部着地并减少绊碰","每天被动牵伸越久越好"],correct:1,why:"治疗目标应指向患者关心的安全功能，而不是孤立追求MAS等级。"},
                  {q:"3. 若考虑局灶性药物或注射，正确做法是？",opts:["治疗师自行决定剂量","转介有经验的痉挛团队，设定目标并配套康复与复评","注射后无需再训练"],correct:1,why:"复杂痉挛管理需要专业团队，并以目标达成和功能变化持续复评。"},
                ].map((q,qi)=><section className="quizitem" key={q.q}><h3>{q.q}</h3>{q.opts.map((o,oi)=><button className={toneAnswers[qi]===oi?(oi===q.correct?"correct":"wrong"):""} onClick={()=>setToneAnswers(a=>a.map((v,i)=>i===qi?oi:v))} key={o}>{o}</button>)}{toneAnswers[qi]>=0?<p className={toneAnswers[qi]===q.correct?"ok":"retry"}>{toneAnswers[qi]===q.correct?"判断合理。":"再想一步。"} {q.why}</p>:null}</section>)}</div>
                <div className="caseResult"><strong>{toneAnswers.filter(a=>a===1).length}/3</strong><div><b>{toneAnswers.every(a=>a>=0)?"本轮已完成":"完成三个痉挛管理决策"}</b><p>从功能目标出发，区分神经性阻力与固定限制，再选择团队方案。</p></div><button className="outline" onClick={()=>setToneAnswers([-1,-1,-1])}>重新训练</button></div>
              </>
            ) : tool === "PATH-NEGLECT" ? (
              <>
                <div className="tooltitle"><span className="kicker">CLINICAL PATHWAY 03</span><h2>偏侧忽略与安全转移路径</h2><p>先确认医学稳定性，并区分空间忽略、视野缺损、感觉障碍和理解问题。</p></div>
                <div className="pathInputs"><label>主要忽略侧<select value={neglectSide} onChange={(e)=>setNeglectSide(e.target.value)}><option>左侧</option><option>右侧</option><option>双侧／不明确</option></select></label><label>功能任务中的表现<select value={neglectLevel} onChange={(e)=>setNeglectLevel(e.target.value)}><option>轻度</option><option>中度</option><option>重度</option></select></label><label>TIS总分<input type="number" min="0" max="23" value={neglectTis} onChange={(e)=>setNeglectTis(Math.max(0,Math.min(23,Number(e.target.value)||0)))} /></label><label>当前转移协助<select value={transferHelp} onChange={(e)=>setTransferHelp(e.target.value)}><option>监督／口头提示</option><option>一人少量帮助</option><option>一人较多帮助</option><option>两人帮助或机械辅助</option></select></label></div>
                <div className="pathPlan"><div className="pathPriority"><span>当前优先方向</span><h3>{neglectLevel==="重度"?"建立患侧觉察并降低转移碰撞与跌倒风险":neglectTis<14?"在坐位躯干控制中加入患侧扫描和对称负重":"把患侧扫描策略迁移到转移与日常任务"}</h3><p>主要记录{neglectSide}忽略，当前转移需要“{transferHelp}”。应观察患者在自然任务中的遗漏，而不只依赖纸笔筛查。</p></div><div className="pathColumns"><article><span>安全布置</span><ul><li>轮椅、床和患肢位置清晰可见并得到支持</li><li>转移前固定刹车、移开脚踏并检查地面</li><li>重要呼叫设备先放在能可靠发现的一侧，再逐步训练患侧搜索</li></ul></article><article><span>训练重点</span><ul><li>使用视觉锚定、头眼转向和系统扫描</li><li>在梳洗、穿衣、桌面搜索和转移中反复练习</li><li>提供短而一致的提示，并逐步减少提示</li><li>同步处理感觉、坐位平衡和动作计划问题</li></ul></article><article><span>复评计划</span><ul><li>记录遗漏、碰撞和患侧肢体保护次数</li><li>TIS、转移协助等级及实际任务表现</li><li>比较结构化筛查与自然环境中的差异</li><li>观察策略能否迁移到新环境</li></ul></article></div></div>
                <div className="interpret"><h3>解释边界</h3><p>偏侧忽略不等同于偏盲。若怀疑视野缺损、眼球运动异常或症状突然变化，应转介相应专业评估或按急性卒中流程处理。</p></div>
              </>
            ) : tool === "CASE-NEGLECT" ? (
              <>
                <div className="tooltitle"><span className="kicker">CASE-BASED LEARNING 03</span><h2>病例：忽略导致的转移困难</h2><p>右侧大脑半球梗死后3周，左侧偏瘫。患者坐起后常遗漏左手，床椅转移时身体偏向右侧，并撞到左侧脚踏。</p></div>
                <div className="caseFacts"><span>生命体征稳定</span><span>TIS 12/23</span><span>左侧轻触减退</span><span>可理解简短指令</span></div>
                <div className="quiz">{[
                  {q:"1. 转移前最重要的准备是什么？",opts:["直接从健侧快速拉起","确认刹车、脚踏、双足和左上肢位置，并让患者主动扫描左侧","把所有物品永久放在右侧"],correct:1,why:"先消除环境危险，并在任务开始前建立患侧身体和空间觉察。"},
                  {q:"2. 哪种训练更可能迁移到日常转移？",opts:["只做纸笔划消训练","把视觉锚定、头眼转向和左侧搜索嵌入坐起、穿鞋及床椅转移","反复提醒“注意左边”但不改变任务"],correct:1,why:"结构化扫描练习应与真实活动结合，并逐步减少提示。"},
                  {q:"3. 如何判断真正改善？",opts:["纸笔测试分数提高即可","同时减少自然任务中的遗漏、碰撞和协助量，并能在新环境使用策略","患者能说出自己有忽略"],correct:1,why:"功能改善需要在真实任务和不同环境中验证，而不仅是知道策略或完成单一测试。"},
                ].map((q,qi)=><section className="quizitem" key={q.q}><h3>{q.q}</h3>{q.opts.map((o,oi)=><button className={neglectAnswers[qi]===oi?(oi===q.correct?"correct":"wrong"):""} onClick={()=>setNeglectAnswers(a=>a.map((v,i)=>i===qi?oi:v))} key={o}>{o}</button>)}{neglectAnswers[qi]>=0?<p className={neglectAnswers[qi]===q.correct?"ok":"retry"}>{neglectAnswers[qi]===q.correct?"判断合理。":"再想一步。"} {q.why}</p>:null}</section>)}</div>
                <div className="caseResult"><strong>{neglectAnswers.filter(a=>a===1).length}/3</strong><div><b>{neglectAnswers.every(a=>a>=0)?"本轮已完成":"完成三个转移安全决策"}</b><p>把扫描策略嵌入真实任务，并用遗漏、碰撞和协助量验证迁移。</p></div><button className="outline" onClick={()=>setNeglectAnswers([-1,-1,-1])}>重新训练</button></div>
              </>
            ) : tool === "PATH-UPPER" ? (
              <>
                <div className="tooltitle"><span className="kicker">CLINICAL PATHWAY 02</span><h2>脑卒中上肢与手功能路径</h2><p>以安全、运动阶段和患者真实任务为主线，不以单一分数决定训练方式。</p></div>
                <div className="pathInputs"><label>Brunnstrom上肢<select value={upperStage} onChange={(e)=>setUpperStage(Number(e.target.value))}>{brStages.map(x=><option value={x.stage} key={x.stage}>{x.stage}期 · {x.title}</option>)}</select></label><label>Brunnstrom手<select value={handStage} onChange={(e)=>setHandStage(Number(e.target.value))}>{brStages.map(x=><option value={x.stage} key={x.stage}>{x.stage}期 · {x.title}</option>)}</select></label><label>FMA-UE<input type="number" min="0" max="66" value={upperFma} onChange={(e)=>setUpperFma(Math.max(0,Math.min(66,Number(e.target.value)||0)))} /></label><label>肩痛 NRS 0–10<input type="number" min="0" max="10" value={upperPain} onChange={(e)=>setUpperPain(Math.max(0,Math.min(10,Number(e.target.value)||0)))} /></label><label>目标任务<select value={upperTask} onChange={(e)=>setUpperTask(e.target.value)}><option>摆位与患肢保护</option><option>辅助稳定物品</option><option>主动抓握与释放</option><option>双手完成日常活动</option><option>精细操作与工作任务</option></select></label></div>
                {upperPain>=7?<div className="pathStop"><strong>先完成肩痛原因评估</strong><p>明显疼痛时先检查创伤、关节活动、软组织、半脱位、痉挛及复杂区域疼痛综合征等可能原因，避免强拉患肢或无保护的过头活动。</p></div>:<div className="pathPlan"><div className="pathPriority"><span>当前优先方向</span><h3>{upperStage<=2?"肩部保护、维持活动度与诱发主动收缩":upperStage===3?"减轻协同模式限制并建立近端控制":handStage<=3?"近端稳定基础上的抓握与释放准备":"任务特异性的手功能与患手真实使用"}</h3><p>{upperPain>0?`当前肩痛 ${upperPain}/10：训练前后记录疼痛变化，并调整体位、支持和活动范围。`:"当前未报告肩痛，仍需持续预防牵拉和不良摆位。"}</p></div><div className="pathColumns"><article><span>目标示例</span><p>2周内在安全体位下，患侧上肢参与“{upperTask}”任务，完成可重复观察的动作，并减少代偿或协助。</p></article><article><span>干预重点</span><ul><li>高重复、目标导向的主动任务练习</li><li>肩胛与躯干对线，避免牵拉患肢</li><li>{handStage<=3?"结合可完成的伸手、承重及抓放前活动":"逐步增加抓放、双手和精细任务难度"}</li><li>有指征时由专业人员评估电刺激、镜像训练或辅助技术</li></ul></article><article><span>复评计划</span><ul><li>FMA-UE与Brunnstrom分区变化</li><li>疼痛、关节活动度和肌张力</li><li>目标任务的完成质量、次数与协助量</li><li>患者在日常生活中实际使用患手的频率</li></ul></article></div></div>}
                <div className="interpret"><h3>使用边界</h3><p>肩痛必须先识别原因，再决定处理方式。该路径不建议被动牵拉患肢，也不根据Brunnstrom阶段机械套用固定技术。</p></div>
              </>
            ) : tool === "CASE-SHOULDER" ? (
              <>
                <div className="tooltitle"><span className="kicker">CASE-BASED LEARNING 02</span><h2>病例：偏瘫肩痛与上肢保护</h2><p>脑出血后2周，右上肢Brunnstrom II期，手I期；肩痛NRS 6/10，坐位时可见轻度半脱位，护理转移时曾牵拉患臂。</p></div>
                <div className="caseFacts"><span>无新发神经症状</span><span>被动外旋疼痛</span><span>手部明显水肿</span><span>主动肩部控制很少</span></div>
                <div className="quiz">{[
                  {q:"1. 首要处理是什么？",opts:["立即进行大幅度过头滑轮训练","评估疼痛原因并纠正摆位、转移和患肢支持","反复牵拉肩关节以复位"],correct:1,why:"卒中后肩痛应先查明原因，并减少牵拉和不良摆位造成的再次损伤。"},
                  {q:"2. 哪项护理教育最关键？",opts:["转移时抓住患侧上臂更省力","在患肢无控制时避免牵拉，由躯干和骨盆引导转移并妥善支持上肢","全天使用吊带且不再活动肩部"],correct:1,why:"应避免拉拽患肢；支持方式需结合任务和专业评估，不能用全天固定替代主动康复。"},
                  {q:"3. 近期复评应包括什么？",opts:["只记录Brunnstrom分期","疼痛、关节活动、半脱位/水肿、主动收缩及目标任务参与","只拍肩关节照片"],correct:1,why:"疼痛病例需要同时跟踪结构与软组织风险、运动恢复和功能参与。"},
                ].map((q,qi)=><section className="quizitem" key={q.q}><h3>{q.q}</h3>{q.opts.map((o,oi)=><button className={shoulderAnswers[qi]===oi?(oi===q.correct?"correct":"wrong"):""} onClick={()=>setShoulderAnswers(a=>a.map((v,i)=>i===qi?oi:v))} key={o}>{o}</button>)}{shoulderAnswers[qi]>=0?<p className={shoulderAnswers[qi]===q.correct?"ok":"retry"}>{shoulderAnswers[qi]===q.correct?"判断合理。":"再想一步。"} {q.why}</p>:null}</section>)}</div>
                <div className="caseResult"><strong>{shoulderAnswers.filter((a)=>a===1).length}/3</strong><div><b>{shoulderAnswers.every(a=>a>=0)?"本轮已完成":"完成三个安全决策"}</b><p>肩痛处理首先是识别原因和停止二次伤害，再安排阶段匹配的主动康复。</p></div><button className="outline" onClick={()=>setShoulderAnswers([-1,-1,-1])}>重新训练</button></div>
              </>
            ) : tool === "PATH-WALK" ? (
              <>
                <div className="tooltitle"><span className="kicker">CLINICAL PATHWAY 01</span><h2>脑卒中步行康复路径</h2><p>先筛查安全，再依据辅助程度、平衡和速度确定训练重点与复评指标。</p></div>
                <div className="pathSafety"><label><input type="checkbox" checked={pathRedFlag} onChange={(e)=>setPathRedFlag(e.target.checked)} /> 存在新发神经症状、胸痛、静息呼吸困难、晕厥或生命体征不稳定</label><p>{pathRedFlag?"暂停步行训练，按机构流程进行医学评估。":"未勾选急性红旗；仍需结合跌倒史、疼痛、认知和环境风险。"}</p></div>
                <div className="pathInputs"><label>FAC<select value={pathFac} onChange={(e)=>setPathFac(Number(e.target.value))}>{facLevels.map(x=><option value={x.level} key={x.level}>{x.level} · {x.title}</option>)}</select></label><label>BBS总分<input type="number" min="0" max="56" value={pathBbs} onChange={(e)=>setPathBbs(Math.max(0,Math.min(56,Number(e.target.value)||0)))} /></label><label>舒适步速（m/s）<input type="number" min="0" step="0.01" value={pathSpeed} onChange={(e)=>setPathSpeed(Math.max(0,Number(e.target.value)||0))} /></label><label>患者目标<select value={pathGoal} onChange={(e)=>setPathGoal(e.target.value)}><option>床旁与室内移动</option><option>家庭独立步行</option><option>小区步行</option><option>公共交通与社会参与</option></select></label></div>
                {pathRedFlag?<div className="pathStop"><strong>当前不进入训练处方</strong><p>先处理红旗并获得医学许可；系统不根据量表分数覆盖安全判断。</p></div>:<div className="pathPlan"><div className="pathPriority"><span>优先问题</span><h3>{pathFac<=2?"人身帮助需求与基本步行控制":pathFac===3?"由监护步行向独立步行过渡":pathSpeed<0.8?"独立步行的速度、耐力与环境适应":"复杂环境与社区参与能力"}</h3><p>{pathBbs<45?"BBS低于常用45分参考线，需把动态平衡与跌倒风险管理列为重点。":"BBS未低于常用45分参考线，仍应依据跌倒史和复杂任务表现判断风险。"}</p></div><div className="pathColumns"><article><span>近期目标示例</span><p>在治疗师设定的安全条件下，患者于2周内{pathFac<=2?"将所需身体帮助降低一级，并完成重复短距离步行":"以当前辅助器具完成规定距离，减少身体接触或监护需求"}，向“{pathGoal}”推进。</p></article><article><span>干预重点</span><ul><li>高重复、任务特异性的坐站、迈步与步行练习</li><li>{pathBbs<45?"动态平衡、转向、障碍物与保护策略":"速度变化、耐力和复杂环境任务"}</li><li>检查足下垂、膝控制及辅助器具／AFO适配</li><li>逐步增加距离、速度、方向和环境复杂度</li></ul></article><article><span>复评计划</span><ul><li>FAC：身体帮助是否下降</li><li>10MWT：在相同模式和器具下复测速度</li><li>BBS：观察动态平衡变化</li><li>记录跌倒、近跌倒、疲劳与目标完成度</li></ul></article></div></div>}
                <div className="interpret"><h3>使用边界</h3><p>该路径提供问题排序和记录提示，不自动生成个体化治疗处方。训练剂量应依据医学稳定性、疲劳、心肺反应、运动学习能力及患者偏好调整。</p></div>
              </>
            ) : tool === "CASE-WALK" ? (
              <>
                <div className="tooltitle"><span className="kicker">CASE-BASED LEARNING 01</span><h2>病例：从监护步行走向小区活动</h2><p>脑梗死后6周，左侧偏瘫；FAC 3级，BBS 38分，舒适步速0.42 m/s，使用四脚杖。患者希望独立去小区花园。</p></div>
                <div className="caseFacts"><span>生命体征稳定</span><span>理解两步指令</span><span>近1周无跌倒</span><span>转弯时需口头提示</span></div>
                <div className="quiz">{[
                  {q:"1. 当前最优先的步行问题是什么？",opts:["步行速度未达到0.8 m/s","仍需监护且动态平衡受限","必须先完全消除所有痉挛"],correct:1,why:"FAC 3说明尚需监护，BBS 38提示动态平衡和跌倒风险管理应优先；速度同样重要，但安全独立是当前关键。"},
                  {q:"2. 哪个近期目标更可测量？",opts:["尽快恢复正常步态","2周内使用四脚杖，在室内完成30米步行，仅需远距离监护，无身体接触","每天多走一些"],correct:1,why:"目标包含时间、环境、距离、器具和帮助水平，能够用FAC与实际任务复评。"},
                  {q:"3. 哪组复评最能回答“是否更接近小区步行”？",opts:["只复查肌张力","FAC、10MWT、BBS，加实际转弯与户外任务","只询问患者感觉"],correct:1,why:"需要同时观察帮助程度、速度、平衡及目标环境中的真实表现。"},
                ].map((q,qi)=><section className="quizitem" key={q.q}><h3>{q.q}</h3>{q.opts.map((o,oi)=><button className={caseAnswers[qi]===oi?(oi===q.correct?"correct":"wrong"):""} onClick={()=>setCaseAnswers(a=>a.map((v,i)=>i===qi?oi:v))} key={o}>{o}</button>)}{caseAnswers[qi]>=0?<p className={caseAnswers[qi]===q.correct?"ok":"retry"}>{caseAnswers[qi]===q.correct?"判断合理。":"再想一步。"} {q.why}</p>:null}</section>)}</div>
                <div className="caseResult"><strong>{caseAnswers.filter((a,i)=>a===1).length}/3</strong><div><b>{caseAnswers.every(a=>a>=0)?"本轮已完成":"完成三个临床决策"}</b><p>重点不是背答案，而是建立“安全—评估—优先问题—目标—复评”的推理链。</p></div><button className="outline" onClick={()=>setCaseAnswers([-1,-1,-1])}>重新训练</button></div>
              </>
            ) : tool === "10MWT" ? (
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
            ) : tool === "FAC" ? (
              <>
                <div className="tooltitle"><span className="kicker">FUNCTIONAL AMBULATION</span><h2>功能性步行分级 <small>FAC · 0–5级</small></h2><p>根据患者步行时需要的人身帮助程度进行分级。</p></div>
                <div className="facintro"><div><b>评定核心</b><span>关注人身帮助，而非单纯使用辅助器具</span></div><div><b>结果范围</b><span>0级不能功能性步行，5级各种地面独立</span></div><div><b>复评记录</b><span>同时注明辅助器具、矫形器和环境</span></div></div>
                <div className="facbody"><article className="faclevels">{facLevels.map((x)=><button className={facLevel===x.level?"on":""} onClick={()=>setFacLevel(x.level)} key={x.level}><strong>{x.level}</strong><span><b>{x.title}</b><small>{x.text}</small></span></button>)}<label className="facfield">辅助器具／矫形器<select value={facDevice} onChange={(e)=>setFacDevice(e.target.value)}><option>无</option><option>手杖</option><option>四脚杖</option><option>助行器</option><option>踝足矫形器</option><option>轮椅随行</option><option>其他</option></select></label><label className="binote">本次备注（可选）<textarea value={facNote} onChange={(e)=>setFacNote(e.target.value)} placeholder="例如：室内走廊、治疗师在患侧保护、需转弯提示" /></label><button className="primary" onClick={saveFac}>保存本次分级</button></article><aside className="facsummary"><span>当前等级</span><strong>{facLevel}</strong><em>/ 5</em><b>{facLevels[facLevel].title}</b><p>{facLevels[facLevel].text}</p></aside></div>
                <div className="interpret"><h3>临床使用提示</h3><p>FAC是0–5级顺序量表，主要反映步行所需的人身帮助。使用手杖或矫形器并不自动降低等级，关键是患者是否需要他人身体接触、监护或帮助。</p><p>FAC不能替代步行速度、耐力、跌倒风险和社区环境评估，建议结合10MWT、BBS及实际任务综合解释。</p></div>
                <div className="history"><h3>本机历史记录</h3>{facRecords.length?<div className="historylist">{facRecords.map((r,i)=><div key={i}><span>{r.date}</span><b>FAC {r.level} · {facLevels[r.level].title}</b><small>{r.device}{r.note?` · ${r.note}`:""}</small></div>)}</div>:<p>尚无保存记录。记录仅保存在当前浏览器中。</p>}</div>
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
                    <button className="primary" onClick={saveBbs}>保存本次评分</button>
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
                <div className="history"><h3>本机历史记录</h3>{bbsRecords.length?<><p className="trendnote">与最近一次相比：{bbsTotal-bbsRecords[0].total>0?"+":""}{bbsTotal-bbsRecords[0].total} 分</p><div className="historylist">{bbsRecords.map((r,i)=><div key={i}><span>{r.date}</span><b>{r.total}/56</b><small>{r.total<45?"低于常用45分参考线":"未低于常用45分参考线"}</small></div>)}</div></>:<p>尚无保存记录。保存后可查看连续变化。</p>}</div>
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
            ) : tool === "BI" ? (
              <>
                <div className="tooltitle"><span className="kicker">ACTIVITIES OF DAILY LIVING</span><h2>Barthel 指数 <small>BI · 0–100分版</small></h2><p>评估患者在10项基本日常生活活动中的实际独立程度。</p></div>
                <div className="biintro"><div><b>评分口径</b><span>10项，总分0–100分</span></div><div><b>评估重点</b><span>记录实际表现，而非“理论上能做”</span></div><div><b>辅助器具</b><span>能独立、安全使用时仍可计为独立</span></div></div>
                <div className="bibody"><div className="bilist">{biItems.map((item,i)=><label className="biitem" key={item.name}><span><i>{i+1}</i><b>{item.name}</b></span><select value={biScores[i]} onChange={(e)=>setBiScores((s)=>s.map((v,n)=>n===i?Number(e.target.value):v))} aria-label={`${item.name}评分`}>{item.options.map(([score,text])=><option value={score} key={score}>{score}分 · {text}</option>)}</select></label>)}</div><aside className="bisummary"><span>当前总分</span><strong>{biTotal}</strong><em>/ 100</em><b>{biLevel}</b><p>总分越高表示基本日常生活活动越独立，但100分不代表能够完成所有工具性日常活动或独立生活。</p><button className="outline" onClick={()=>setBiScores(Array(10).fill(0))}>清空评分</button></aside></div>
                <label className="binote">本次备注（可选）<textarea value={biNote} onChange={(e)=>setBiNote(e.target.value)} placeholder="例如：实际观察、辅助器具、照护者协助或环境限制" /></label><button className="primary" onClick={saveBi}>保存本次结果</button>
                <div className="interpret"><h3>结果解释</h3><div><span><b>0–20分</b>完全依赖</span><span><b>21–60分</b>重度依赖</span><span><b>61–90分</b>中度依赖</span><span><b>91–99分</b>轻度依赖</span><span><b>100分</b>基本ADL独立</span></div><p>分层名称是常用临床参考，不同机构可能采用不同解释。BI存在0–20分等其他版本，复评时必须使用同一版本，不能直接混合比较。</p></div>
                <div className="history"><h3>本机历史记录</h3>{biRecords.length?<div className="historylist">{biRecords.map((r,i)=><div key={i}><span>{r.date}</span><b>{r.total}/100</b><small>{r.note||"无备注"}</small></div>)}</div>:<p>尚无保存记录。记录仅保存在当前浏览器中。</p>}</div>
              </>
            ) : tool === "TIS" ? (
              <>
                <div className="tooltitle"><span className="kicker">TRUNK PERFORMANCE</span><h2>躯干损伤量表 <small>TIS · Verheyden 2004</small></h2><p>分别记录静态坐位平衡、动态坐位平衡和躯干协调，总分0–23分。</p></div>
                <div className="tisintro"><div><b>17个条目</b><span>每项最多尝试3次，记录最高表现</span></div><div><b>起始要求</b><span>允许坐起并能理解基本指令</span></div><div><b>重要规则</b><span>第1项为0分时，TIS总分记0分</span></div></div>
                <div className="tisbody"><article className="tisscales">
                  {[{name:"静态坐位平衡",help:"维持坐位、交叉双腿及保持躯干稳定",max:7,value:tisStatic,set:setTisStatic},{name:"动态坐位平衡",help:"躯干侧屈、缩短与延长两侧躯干",max:10,value:tisDynamic,set:setTisDynamic},{name:"协调",help:"上、下躯干旋转的对称性与速度",max:6,value:tisCoord,set:setTisCoord}].map((x)=><section className="tisscale" key={x.name}><div><b>{x.name}</b><span>{x.help}</span></div><output>{x.value}<small>/{x.max}</small></output><input type="range" min="0" max={x.max} step="1" value={x.value} onChange={(e)=>x.set(Number(e.target.value))} aria-label={`${x.name}得分`} /><div className="tisbuttons">{Array.from({length:x.max+1},(_,n)=><button className={x.value===n?"on":""} onClick={()=>x.set(n)} key={n}>{n}</button>)}</div></section>)}
                  <label className="binote">本次备注（可选）<textarea value={tisNote} onChange={(e)=>setTisNote(e.target.value)} placeholder="例如：代偿方式、不对称、疲劳或疼痛" /></label><button className="primary" onClick={saveTis}>保存本次结果</button>
                </article><aside className="tissummary"><span>当前总分</span><strong>{tisTotal}</strong><em>/ 23</em><div><p>静态坐位平衡<b>{tisStatic}/7</b></p><p>动态坐位平衡<b>{tisDynamic}/10</b></p><p>协调<b>{tisCoord}/6</b></p></div><small>得分越高表示躯干控制表现越好。</small></aside></div>
                <div className="interpret"><h3>临床使用提示</h3><p>这里采用Verheyden等人在2004年提出的0–23分TIS；另有同名量表和删除静态分域的TIS 2.0，记录时必须注明版本。</p><p>TIS没有适用于所有患者的统一“轻、中、重”分界值。建议观察三个分域的变化，并结合坐位功能、转移、站立平衡和步行能力解释。</p></div>
                <div className="history"><h3>本机历史记录</h3>{tisRecords.length?<div className="historylist">{tisRecords.map((r,i)=><div key={i}><span>{r.date}</span><b>{r.staticScore+r.dynamicScore+r.coordinationScore}/23</b><small>静态 {r.staticScore}/7 · 动态 {r.dynamicScore}/10 · 协调 {r.coordinationScore}/6{r.note?` · ${r.note}`:""}</small></div>)}</div>:<p>尚无保存记录。记录仅保存在当前浏览器中。</p>}</div>
              </>
            ) : tool === "FMA" ? (
              <>
                <div className="tooltitle"><span className="kicker">SENSORIMOTOR IMPAIRMENT</span><h2>Fugl-Meyer 评定 <small>FMA</small></h2><p>汇总脑卒中后运动、感觉、平衡、关节活动度与疼痛分域，避免混淆运动分与完整总分。</p></div>
                <div className="fmaintro"><div><b>运动分</b><span>上肢66 + 下肢34 = 100分</span></div><div><b>完整评定</b><span>五大领域，总分0–226分</span></div><div><b>单项规则</b><span>通常按0、1、2三级评分</span></div></div>
                <div className="fmabody"><article className="fmadomains">{[{name:"上肢运动",max:66,help:"反射、协同运动、腕、手与协调速度"},{name:"下肢运动",max:34,help:"反射、协同运动、站位及协调速度"},{name:"感觉",max:24,help:"轻触觉与本体感觉"},{name:"平衡",max:14,help:"坐位与站立平衡"},{name:"关节活动度",max:44,help:"上、下肢被动关节活动范围"},{name:"关节疼痛",max:44,help:"被动活动过程中的疼痛"}].map((x,i)=><label className="fmadomain" key={x.name}><span><b>{x.name}</b><small>{x.help}</small></span><input type="number" min="0" max={x.max} step="1" value={fmaScores[i]} onChange={(e)=>{const value=Math.max(0,Math.min(x.max,Number(e.target.value)||0));setFmaScores((s)=>s.map((v,n)=>n===i?value:v))}} /><em>/ {x.max}</em></label>)}<label className="binote">本次备注（可选）<textarea value={fmaNote} onChange={(e)=>setFmaNote(e.target.value)} placeholder="例如：受累侧、病程阶段、未测项目或疼痛限制" /></label><button className="primary" onClick={saveFma}>保存本次结果</button></article><aside className="fmasummary"><span>运动功能</span><strong>{fmaMotor}</strong><em>/100</em><p>上肢 <b>{fmaScores[0]}/66</b></p><p>下肢 <b>{fmaScores[1]}/34</b></p><div><span>完整FMA总分</span><b>{fmaTotal}/226</b></div><small>只有完成全部分域时，才应报告0–226分完整总分。</small></aside></div>
                <div className="interpret"><h3>记录与解释</h3><p>报告结果时应写明具体版本和分域，例如“FMA-UE 38/66”或“FMA运动分 62/100”，不要只写“FMA 62分”。</p><p>本页面用于汇总已经依据正式评分表完成的分域得分，不替代标准化条目说明、演示与评定者培训；连续复评应保持受累侧、版本和测试条件一致。</p></div>
                <div className="history"><h3>本机历史记录</h3>{fmaRecords.length?<div className="historylist">{fmaRecords.map((r,i)=><div key={i}><span>{r.date}</span><b>运动 {r.ue+r.le}/100</b><small>UE {r.ue}/66 · LE {r.le}/34 · 完整 {r.ue+r.le+r.sensation+r.balance+r.rom+r.pain}/226{r.note?` · ${r.note}`:""}</small></div>)}</div>:<p>尚无保存记录。记录仅保存在当前浏览器中。</p>}</div>
              </>
            ) : tool === "BR" ? (
              <>
                <div className="tooltitle"><span className="kicker">MOTOR RECOVERY STAGING</span><h2>Brunnstrom 运动恢复分期 <small>经典六阶段</small></h2><p>分别记录上肢、手和下肢的主要运动恢复表现。</p></div>
                <div className="brintro"><div><b>分区记录</b><span>上肢、手、下肢分别判断</span></div><div><b>结果性质</b><span>1–6期为顺序等级，不是等距分数</span></div><div><b>复评原则</b><span>保持体位、指令和观察条件一致</span></div></div>
                <div className="brbody"><article className="brdomains">{[{name:"上肢",value:brUpper,set:setBrUpper},{name:"手",value:brHand,set:setBrHand},{name:"下肢",value:brLower,set:setBrLower}].map((d)=><section className="brdomain" key={d.name}><header><div><b>{d.name}</b><span>当前第 {d.value} 期 · {brStages[d.value-1].title}</span></div><strong>{d.value}</strong></header><div className="brstages">{brStages.map((s)=><button className={d.value===s.stage?"on":""} onClick={()=>d.set(s.stage)} key={s.stage} aria-label={`${d.name}第${s.stage}期`}>{s.stage}</button>)}</div><p>{brStages[d.value-1].text}</p></section>)}<label className="binote">临床备注（可选）<textarea value={brNote} onChange={(e)=>setBrNote(e.target.value)} placeholder="例如：患侧、诱发条件、痉挛、代偿、疼痛或任务表现" /></label><button className="primary" onClick={saveBr}>保存本次分期</button></article><aside className="brsummary"><span>本次分期</span><p>上肢 <b>第 {brUpper} 期</b></p><p>手 <b>第 {brHand} 期</b></p><p>下肢 <b>第 {brLower} 期</b></p><small>三个区域恢复速度可能不同，不计算平均期或总分。</small></aside></div>
                <div className="interpret"><h3>临床解释边界</h3><p>经典Brunnstrom分期描述从弛缓、协同运动占优势到分离运动和协调改善的六个阶段，但个体恢复不一定严格线性，也不一定经历每一阶段。</p><p>疼痛、关节挛缩、肌力、共济失调、忽略及认知沟通问题都可能影响观察。建议同时记录FMA分域和真实功能任务，不以分期单独决定治疗方案。</p></div>
                <div className="history"><h3>本机历史记录</h3>{brRecords.length?<div className="historylist">{brRecords.map((r,i)=><div key={i}><span>{r.date}</span><b>上肢 {r.upper}期 · 手 {r.hand}期 · 下肢 {r.lower}期</b><small>{r.note||"无备注"}</small></div>)}</div>:<p>尚无保存记录。记录仅保存在当前浏览器中。</p>}</div>
              </>
            ) : tool === "SENS" ? (
              <>
                <div className="tooltitle"><span className="kicker">POST-STROKE SENSORY SCREEN</span><h2>脑卒中感觉功能评估 <small>结构化床旁筛查</small></h2><p>按浅感觉、深感觉和皮质感觉分层记录，并与对侧对应部位比较。</p></div>
                <div className="sensintro"><div><b>检查条件</b><span>患者清醒、能理解指令并闭眼配合</span></div><div><b>评估顺序</b><span>先示范，再随机刺激；由远端到近端</span></div><div><b>结果性质</b><span>临床筛查记录，不是标准化量表总分</span></div></div>
                <div className="senshead"><label>重点记录侧<select value={sensSide} onChange={(e)=>setSensSide(e.target.value)}><option>左侧</option><option>右侧</option><option>双侧</option></select></label><div><b>{sensTested}/{sensItems.length}</b><span>已检查</span></div><div className={sensAbnormal?"alert":""}><b>{sensAbnormal}</b><span>项异常</span></div></div>
                <div className="sensbody"><div className="senslist">{sensItems.map((item,i)=><label className="sensitem" key={item.name}><span><em>{item.group}</em><b>{item.name}</b><small>{item.help}</small></span><select value={sensResults[i]} onChange={(e)=>setSensResults((s)=>s.map((v,n)=>n===i?e.target.value:v))} aria-label={`${item.name}结果`}><option>未测</option><option>正常</option><option>减退</option><option>缺失</option><option>异常增强／痛觉过敏</option><option>无法判断</option></select></label>)}</div><aside className="senssummary"><span>本次筛查</span><strong>{sensAbnormal}</strong><em>项异常</em><p>{sensTested===0?"尚未开始记录":sensAbnormal===0?"已测项目暂未发现异常":"需结合异常分布与功能影响进一步评估"}</p><button className="outline" onClick={()=>setSensResults(Array(sensItems.length).fill("未测"))}>清空结果</button></aside></div>
                <label className="binote">异常分布与功能影响（建议填写）<textarea value={sensNote} onChange={(e)=>setSensNote(e.target.value)} placeholder="例如：左手尺侧轻触减退；闭眼抓握不稳；穿衣时忽略患侧袖口" /></label><button className="primary" onClick={saveSens} disabled={!sensTested}>保存本次筛查</button>
                <div className="interpret"><h3>安全与解释</h3><p>感觉减退者应同时记录皮肤保护风险，并进行烫伤、压伤、锐器及患肢摆放教育。检查针刺觉和温度觉时避免造成皮肤损伤或使用极端温度。</p><p>皮质感觉异常必须在初级感觉相对保留且患者能够理解任务时解释；失语、忽略、认知或视听问题可能影响结果。发现新发或迅速加重的感觉异常应按急性神经症状流程处理。</p></div>
                <div className="history"><h3>本机历史记录</h3>{sensRecords.length?<div className="historylist">{sensRecords.map((r,i)=>{const tested=r.results.filter((x)=>x!=="未测").length,abnormal=r.results.filter((x)=>x!=="未测"&&x!=="正常").length;return <div key={i}><span>{r.date}</span><b>{abnormal}项异常</b><small>{r.side} · 已测 {tested}/{sensItems.length}{r.note?` · ${r.note}`:""}</small></div>})}</div>:<p>尚无保存记录。记录仅保存在当前浏览器中。</p>}</div>
              </>
            ) : tool === "DASH" ? (
              <>
                <div className="tooltitle"><span className="kicker">THERAPIST WORKSPACE</span><h2>治疗师工作台</h2><p>集中查看当前浏览器中保存的评估记录，并导出备份。</p></div>
                <div className="dashhero"><div><span>本机累计记录</span><strong>{totalRecords}</strong><small>条</small></div><div><span>已有记录工具</span><strong>{[records,bbsRecords,masRecords,biRecords,tisRecords,fmaRecords,sensRecords,brRecords,facRecords].filter((x)=>x.length).length}</strong><small>/ 9</small></div><button className="primary" onClick={exportRecords} disabled={!totalRecords}>导出全部记录（JSON）</button></div>
                <div className="dashgrid">
                  <article><span>10MWT</span><h3>10米步行测试</h3><b>{records[0]?`${records[0].speed.toFixed(2)} m/s`:"暂无记录"}</b><small>{records[0]?.date||"—"}</small><button onClick={()=>setTool("10MWT")}>打开工具</button></article>
                  <article><span>FAC</span><h3>功能性步行分级</h3><b>{facRecords[0]?`FAC ${facRecords[0].level} · ${facLevels[facRecords[0].level].title}`:"暂无记录"}</b><small>{facRecords[0]?.date||"—"}</small><button onClick={()=>setTool("FAC")}>打开工具</button></article>
                  <article><span>BBS</span><h3>Berg 平衡量表</h3><b>{bbsRecords[0]?`${bbsRecords[0].total}/56`:"暂无记录"}</b><small>{bbsRecords[0]?.date||"—"}</small><button onClick={()=>setTool("BBS")}>打开工具</button></article>
                  <article><span>MAS</span><h3>改良 Ashworth 量表</h3><b>{masRecords[0]?`MAS ${masRecords[0].grade} · ${masRecords[0].side}${masRecords[0].muscle}`:"暂无记录"}</b><small>{masRecords[0]?.date||"—"}</small><button onClick={()=>setTool("MAS")}>打开工具</button></article>
                  <article><span>BI</span><h3>Barthel 指数</h3><b>{biRecords[0]?`${biRecords[0].total}/100`:"暂无记录"}</b><small>{biRecords[0]?.date||"—"}</small><button onClick={()=>setTool("BI")}>打开工具</button></article>
                  <article><span>TIS</span><h3>躯干损伤量表</h3><b>{tisRecords[0]?`${tisRecords[0].staticScore+tisRecords[0].dynamicScore+tisRecords[0].coordinationScore}/23`:"暂无记录"}</b><small>{tisRecords[0]?.date||"—"}</small><button onClick={()=>setTool("TIS")}>打开工具</button></article>
                  <article><span>FMA</span><h3>Fugl-Meyer 评定</h3><b>{fmaRecords[0]?`运动 ${fmaRecords[0].ue+fmaRecords[0].le}/100`:"暂无记录"}</b><small>{fmaRecords[0]?.date||"—"}</small><button onClick={()=>setTool("FMA")}>打开工具</button></article>
                  <article><span>BR</span><h3>Brunnstrom 分期</h3><b>{brRecords[0]?`上肢 ${brRecords[0].upper} · 手 ${brRecords[0].hand} · 下肢 ${brRecords[0].lower}`:"暂无记录"}</b><small>{brRecords[0]?.date||"—"}</small><button onClick={()=>setTool("BR")}>打开工具</button></article>
                  <article><span>SENS</span><h3>感觉功能筛查</h3><b>{sensRecords[0]?`${sensRecords[0].results.filter((x)=>x!=="未测"&&x!=="正常").length}项异常`:"暂无记录"}</b><small>{sensRecords[0]?.date||"—"}</small><button onClick={()=>setTool("SENS")}>打开工具</button></article>
                </div>
                <div className="privacy"><b>数据说明</b><p>所有记录仅保存在当前浏览器，不会自动上传。清除浏览器数据或更换设备可能导致记录丢失，请定期导出备份。导出文件可能包含临床备注，请按所在机构的隐私规范妥善保存。</p></div>
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
