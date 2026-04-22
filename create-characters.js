const fs = require('fs-extra');
const path = require('path');

const links = {
  "duang": "https://hellmugen.lanzoui.com/iALE5ee4bcf",
  "Chizomeno": "https://uu.getuploader.com/BlackCurl/download/68",
  "Hawk eye Youmu": "https://uu.getuploader.com/gndwn/download/74",
  "Oni-Miko-Z": "https://1drv.ms/u/s!AkYM22Xc-hkcfDlqlnQYxA8mYJc?e=tyzV68",
  "Legend Accelerator": "https://mugenarchive.com/forums/downloads.php?do=file&id=46914-legend-accelerator-otika",
  "Wind Thunder Sword Youmu": "https://www.mediafire.com/file/1qzyfcc18dcthfs/Wind_Thunder_Sword_Youmu.zip/file",
  "Infinity-Zero": "https://uu.getuploader.com/oki001/download/24",
  "Iod": "https://uu.getuploader.com/shyglma666/download/7",
  "S-Sakuya": "https://uu.getuploader.com/oki001/download/34",
  "Crazy-Catastrophe": "https://uu.getuploader.com/oki001/download/19",
  "Volcrz-R": "https://uu.getuploader.com/ariarienlol_mugenbox/download/75",
  "Wicked_Law's_Witch": "https://uu.getuploader.com/oki001/download/48",
  "Winghigt-Akane-R16": "https://www.andersonkenya1.net/files/file/28834-winghigt-akane-r16/",
  "l_reimu": "http://drabs.blog40.fc2.com/blog-entry-82.html#more",
  "M-Reimu": "https://uu.getuploader.com/oki001/download/49",
  "EX_Akabane": "https://drive.google.com/file/d/1CvFQ9j8u6WRFTJzIDHRJK2HZs9BIpjVC/view?usp=sharing",
  "dsrugal": "https://mugenarchive.com/forums/downloads.php?do=file&id=92929-dsrugal-ydccdy",
  "Guanyin-Ancient": "https://www.andersonkenya1.net/files/file/37481-guanyin-ancients/",
  "Ice-Oro-Mizuchi": "https://drive.google.com/file/d/1Agzdvhy4McynWU_ESTkl2OtW9zLiGOhA/view?usp=sharing",
  "R'lyeh Text-Special": "https://uu.getuploader.com/mugen_target11/download/24",
  "-Killer-": "https://drive.google.com/file/d/16xZqpoA01UFNqRbqu1QemyWKOIqz9uAF/view?usp=drive_link",
  "Infinite Soulabyss": "https://onedrive.live.com/redir?cid=660a510396c5c9dc&resid=660A510396C5C9DC!107&ithint=folder&migratedtospo=true&redeem=aHR0cHM6Ly8xZHJ2Lm1zL2YvYy82NjBhNTEwMzk2YzVjOWRjL1F0ekp4WllEVVFvZ2dHWnJBQUFBQUFBQXR5R0lWTEUyVnZXVldn",
  "Ult-Igniz": "https://pan.baidu.com/s/1cGti6U?_client_version=#list/path=%2FMY%20Chars%2F%E7%A7%A9%E5%BA%8F%E4%B9%8B%E4%B8%BB%EF%BC%88T0%EF%BC%89",
  "WickedYagami": "https://pan.baidu.com/s/1eXrtQ3mPIo-2tBloVbuGWw?pwd=cccc#list/path=%2FC%E7%9A%84%E5%88%B6%E4%BD%9C%E7%89%A9%E5%B0%81%E5%8D%B0%E4%B9%8B%E5%9C%B0%2F%E8%B6%85%E5%87%A1&parentPath=%2F",
  "xsl": "https://drive.google.com/file/d/1PHDQmiw37R5r2IeCUOS1RFYcQh3yEbqC/view?usp=sharing",
  "Vinzelles-SPBOF": "https://mopemope.lanzouu.com/iBF8C3fhl47i",
  "LindWurm": "https://pan.baidu.com/s/1LT27m1-Nw58APC2FA8W4Kw#list/path=%2F%E6%AC%A2%E8%BF%8E%E6%9D%A5%E5%88%B0%E5%B9%BB%E6%83%B3%E5%BD%BC%E7%AB%AF%2F%E8%BD%A9%E8%BE%95%E7%A5%9E%E8%AF%9D%C2%B7%E5%88%9B%E4%B8%96%E7%9C%9F%E9%BE%99&parentPath=%2F",
  "nihil": "https://www.mediafire.com/file/kkybzwkhm7ilj73/nihil.rar/file",
  "_reimu111": "https://wwpr.lanzout.com/b0fpe398f",
  "Undefined Universe": "https://www.mediafire.com/file/kcbg5av862elwx8/Undefined_Universe_%25285.5a%2529.rar/file",
  "SuperPony": "https://www.andersonkenya1.net/files/file/37647-superpony/"
};

const characters = [
  { slug: "duang", title: "duang", author: "Hell氏+Yui氏", tier: "low", sublevel: "C", activation: "%n启动", techniques: ["强制胜利", "RoundTimer改"] },
  { slug: "Chizomeno", title: "Chizomeno", author: "BlackCurl,黑卷氏", tier: "low", sublevel: "C", activation: "%n启动", techniques: ["DTC型亲捏造:LIFE弄", "noko解除"] },
  { slug: "Hawk-eye-Youmu", title: "Hawk eye Youmu", author: "Gondwana氏", tier: "low", sublevel: "C", activation: "4CA启动", techniques: ["变量扩张型亲捏造:强制永续", "强制Damage"] },
  { slug: "Oni-Miko-Z", title: "Oni-Miko-Z", author: "Lunatic氏", tier: "low", sublevel: "B", activation: "512超越启动", techniques: ["直死"] },
  { slug: "Legend-Accelerator", title: "Legend Accelerator", author: "otika氏", tier: "low", sublevel: "B", activation: "512超越启动", techniques: ["DTC型亲捏造:冻结解除", "直死"] },
  { slug: "Wind-Thunder-Sword-Youmu", title: "Wind Thunder Sword Youmu", author: "Kousa氏", tier: "low", sublevel: "B", activation: "4CA启动", techniques: ["变量扩张型亲捏造:强制永续", "直死", "LIFE弄"] },
  { slug: "Infinity-Zero", title: "Infinity-Zero", author: "熄废人氏", tier: "low", sublevel: "A", activation: "%N启动", techniques: ["DTC型亲捏造:随阶段增长复合攻击"] },
  { slug: "Iod", title: "Iod", author: "シィグマ氏", tier: "low", sublevel: "A", activation: "4CA启动", techniques: ["DTC型亲捏造:冻结直死", "Life弄", "冻结解除", "苏生", "RoundTimer弄", "RoundState弄"] },
  { slug: "S-Sakuya", title: "S-Sakuya", author: "熄废人氏", tier: "mid", sublevel: "C", activation: "4CA启动", techniques: ["DTC型亲捏造:直死", "Noko解除", "无敌解除", "强制Damage", "强制落下", "强制变数弄"] },
  { slug: "Crazy-Catastrophe", title: "Crazy-Catastrophe", author: "熄废人氏", tier: "mid", sublevel: "C", activation: "4CA启动", techniques: ["DTC型亲捏造:直死", "强制Palno弄", "强制Damage", "强制落下", "强制投", "强制胜利"] },
  { slug: "Volcrz-R", title: "Volcrz-R", author: "笑氏", tier: "mid", sublevel: "C", activation: "%n启动", techniques: ["DTC型亲捏造:冻结解除", "直死", "强制投", "强制时停", "强制胜利"] },
  { slug: "Wicked_Laws_Witch", title: "Wicked_Law's_Witch", author: "熄废人氏", tier: "mid", sublevel: "B", activation: "4CA启动", techniques: ["变量扩张型亲捏造:全领域属性攻击", "全领域Player消去", "API调用源代码修改:CNS指回"] },
  { slug: "winghigt-Akane-R16", title: "winghigt-Akane-R16", author: "ydccdy氏", tier: "mid", sublevel: "B", activation: "512超越启动", techniques: ["直死", "CNS指空", "DTC型亲捏造:intro解除", "NOKO解除", "Timerfreeze解除"] },
  { slug: "l-reimu", title: "l_reimu", author: "drab氏", tier: "mid", sublevel: "A", activation: "%N启动", techniques: ["DTC型亲捏造:Player消去", "强制胜利"] },
  { slug: "M-Reimu", title: "M-Reimu ver3.11", author: "熄废人氏", tier: "mid", sublevel: "A", activation: "StateDef溢出+4CA启动", techniques: ["变量扩张型亲捏造:直死", "NOKO解除", "全领域属性攻击", "全领域Player消去", "API调用源代码修改:CNS指回"] },
  { slug: "EX_Akabane", title: "EX_Akabane", author: "moyashi氏", tier: "mid", sublevel: "A", activation: "4CA+%F启动", techniques: ["API调用多线程:直死", "NOKO解除", "Player消去", "CNS指回", "Player保护", "%F无效时报错"] },
  { slug: "dsrugal", title: "dsrugal", author: "ydccdy氏", tier: "high", sublevel: "C", activation: "StateDef溢出", techniques: ["Def指向改"] },
  { slug: "Guanyin-Ancient", title: "Guanyin-Ancient", author: "ydccdy氏", tier: "high", sublevel: "C", activation: "StateDef溢出", techniques: ["CNS指空", "全局变量Hook"] },
  { slug: "Ice-Oro-Mizuchi", title: "Ice-Oro-Mizuchi", author: "ydccdy氏", tier: "high", sublevel: "C", activation: "StateDef溢出", techniques: ["StateDef溢出修复", "DTC型亲捏造:Player消去", "强制胜利"] },
  { slug: "Rlyeh-Text-Special", title: "R'lyeh Text-Special", author: "Volcrz氏", tier: "high", sublevel: "B", activation: "StateDef溢出", techniques: ["StateDef溢出修复", "API调用源代码修改:%F阻止", "1024溢出(Textbug)阻止"] },
  { slug: "Killer", title: "-Killer-", author: "crazy氏", tier: "high", sublevel: "B", activation: "StateDef溢出", techniques: ["StateDef溢出修复", "CNS指空", "直死"] },
  { slug: "Infinite-Soulabyss", title: "Infinite Soulabyss", author: "Rin氏", tier: "high", sublevel: "A", activation: "StateDef+CMD+Flag溢出", techniques: ["API调用多线程:随阶段增长复合攻击", "全领域防御", "DEF保护", "CNS指回", "Player保护", "溢出无效时140循环卡死"] },
  { slug: "Ult-Igniz", title: "Ult-Igniz", author: "Nogal氏", tier: "high", sublevel: "A", activation: "StateDef+Flag溢出", techniques: ["Def指向改", "API调用线程休眠:线程杀手"] },
  { slug: "WickedYagami", title: "WickedYagami", author: "C氏", tier: "high", sublevel: "A", activation: "StateDef溢出", techniques: ["StateDef溢出修复", "API调用多线程:DEF保护", "CNS指回", "Player保护", "CNS填塞", "DTC阻止", "溢出无效时DEF指向错误报错"] },
  { slug: "xsl", title: "xsl", author: "ydccdy氏", tier: "approaching-low", sublevel: "", activation: "ZIP溢出", techniques: ["重装人物替换自身"] },
  { slug: "Sade-Margarita", title: "Sade Margarita", author: "ydccdy氏", tier: "approaching-low", sublevel: "", activation: "def溢出", techniques: ["未知"] },
  { slug: "Vinzelles-SPBOF", title: "Vinzelles-SPBOF", author: "AHZ氏", tier: "approaching-low", sublevel: "", activation: "SFF溢出", techniques: ["ST文件无效化"] },
  { slug: "LindWurm", title: "LindWurm", author: "沧溟璘梦氏", tier: "approaching-low", sublevel: "", activation: "ZIP溢出", techniques: ["Def指向改"] },
  { slug: "nihil", title: "nihil", author: "NOMI氏", tier: "approaching-low", sublevel: "", activation: "ZIP溢出", techniques: ["未知"] },
  { slug: "_reimu111", title: "_reimu111", author: "zhnm氏", tier: "approaching-low", sublevel: "", activation: "ZIP溢出", techniques: ["地址转移", "大量地址改源", "游戏内联Call调用", "多线程锁值"] },
  { slug: "SuperPony", title: "SuperPony", author: "YC0_Xa氏", tier: "approaching-mid", sublevel: "", activation: "Alleg40劫持", techniques: ["替换主程序文件"] },
  { slug: "Undefined-Universe", title: "Undefined Universe (4.3b)", author: "Minase&&N2L氏", tier: "approaching-mid", sublevel: "", activation: "Alleg40劫持", techniques: ["未知"] },
];

const tierInfo = {
  "low": { zh: "论外下位", en: "Out-of-Topic Low", ja: "論外下位", tier: "low" },
  "mid": { zh: "论外中位", en: "Out-of-Topic Mid", ja: "論外中位", tier: "mid" },
  "high": { zh: "论外上位", en: "Out-of-Topic High", ja: "論外上位", tier: "high" },
  "approaching-low": { zh: "接近超论外下位", en: "Near Super-Low", ja: "接近超論外下位", tier: "approaching-low" },
  "approaching-mid": { zh: "接近超论外中位", en: "Near Super-Mid", ja: "接近超論外中位", tier: "approaching-mid" }
};

const imgNameMap = {
  "-Killer-": "-Killer-.png",
  "Chizomeno": "Chizomeno.png",
  "Crazy-Catastrophe": "Crazy-Catastrophe.png",
  "dsrugal": "dsrugal.png",
  "duang": "duang.png",
  "EX_Akabane": "EX_Akabane.png",
  "Guanyin-Ancient": "Guanyin-Ancient.png",
  "Hawk eye Youmu": "Hawk eye Youmu.png",
  "Ice-Oro-Mizuchi": "Ice-Oro-Mizuchi.png",
  "Infinite Soulabyss": "Infinite Soulabyss.png",
  "Infinity-Zero": "Infinity-Zero.png",
  "Iod": "Iod.png",
  "LindWurm": "LindWurm.png",
  "M-Reimu": "M-Reimu.png",
  "nihil": "nihil.png",
  "Oni-Miko-Z": "Oni-Miko-Z.png",
  "R'lyeh Text-Special": "R'lyeh Text-Special.png",
  "S-Sakuya": "S-Sakuya.png",
  "SuperPony": "SuperPony.png",
  "Ult-Igniz": "Ult-Igniz.png",
  "Undefined Universe": "Undefined Universe.png",
  "Vinzelles-SPBOF": "Vinzelles-SPBOF.png",
  "Volcrz-R": "Volcrz-R.png",
  "WickedYagami": "WickedYagami.png",
  "Wicked_Law's_Witch": "Wicked_Law's_Witch.png",
  "Wind Thunder Sword Youmu": "Wind Thunder Sword Youmu.png",
  "winghigt-Akane-R16": "winghigt-Akane-R16.png",
  "xsl": "xsl.png",
  "_reimu111": "_reimu111.png",
  "Legend Accelerator": "Legend Accelerator.png"
};

// Clean up old characters
const charDir = 'content/characters';
if (fs.existsSync(charDir)) {
  fs.readdirSync(charDir).forEach(slug => {
    fs.removeSync(path.join(charDir, slug));
  });
}
fs.ensureDirSync(charDir);

// Create character JSONs
characters.forEach(char => {
  const tierData = tierInfo[char.tier];
  const ootqLevelZh = tierData.zh + (char.sublevel ? char.sublevel : '');
  const ootqLevelEn = tierData.en + (char.sublevel ? char.sublevel : '');
  const ootqLevelJa = tierData.ja + (char.sublevel ? char.sublevel : '');
  
  const imgName = imgNameMap[char.title];
  const image = imgName ? `../img/${imgName}` : null;
  const downloadUrl = links[char.title] || null;
  
  const tagsZh = ["审核", tierData.zh];
  if (char.sublevel) tagsZh.push(char.sublevel + "级");
  
  const tagsEn = ["Reference", tierData.en.split(' ').pop()];
  if (char.sublevel) tagsEn.push(char.sublevel + "-Class");
  
  const tagsJa = ["Reference", tierData.ja];
  if (char.sublevel) tagsJa.push(char.sublevel + "級");
  
  const meta = {
    title: { zh: char.title, en: char.title, ja: char.title },
    summary: { zh: `${ootqLevelZh}参照角色`, en: `${ootqLevelEn} Reference Character`, ja: `${ootqLevelJa}参照キャラクター` },
    ootqLevel: { zh: ootqLevelZh, en: ootqLevelEn, ja: ootqLevelJa },
    ootqTier: tierData.tier,
    origin: "MUGEN",
    author: char.author,
    activation: char.activation,
    techniques: char.techniques,
    tags: {
      zh: tagsZh,
      en: tagsEn,
      ja: tagsJa
    }
  };
  
  if (image) meta.image = image;
  if (downloadUrl) meta.downloadUrl = downloadUrl;
  
  const slugDir = path.join(charDir, char.slug);
  fs.ensureDirSync(slugDir);
  fs.writeFileSync(path.join(slugDir, 'meta.json'), JSON.stringify(meta, null, 2));
  console.log(`Created ${char.slug}`);
});

console.log(`\nTotal: ${characters.length} characters`);
