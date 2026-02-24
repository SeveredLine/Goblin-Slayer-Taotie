import _ from 'lodash';
import { z } from 'zod';

// --- 常量配置 ---
// 1. 公会晋升等级配置
const RANK_CONFIG = [
  { rank: '白金', cv: Infinity },
  { rank: '金', cv: 3000 },
  { rank: '银', cv: 2450 },
  { rank: '青铜', cv: 1650 },
  { rank: '红玉', cv: 1050 },
  { rank: '翠玉', cv: 600 },
  { rank: '青玉', cv: 300 },
  { rank: '钢铁', cv: 200 },
  { rank: '黑曜石', cv: 100 },
  { rank: '白瓷', cv: 0 }
];

// 2. 技能等级进阶链与熟练度权重
const SKILL_LEVELS = ['初级', '中级', '高级', '精通', '大师'];
const SKILL_WEIGHTS = {
  '初级': 1.0,
  '中级': 0.8,
  '高级': 0.5,
  '精通': 0.25,
  '大师': 0.1
};

// 3. 历练进度增长配置
const PROGRESS_TIERS = [
  { min: 1, max: 1, bonus: 10 },
  { min: 2, max: 3, bonus: 25 },
  { min: 4, max: 5, bonus: 15 },
  { min: 6, max: 9, bonus: 10 },
  { min: 10, max: 15, bonus: 5 },
  { min: 16, max: Infinity, bonus: 1 }
];

// --- 辅助逻辑 ---
const updateResourceWithDelta = (resource: any, newMaxCalculated: number) => {
  const oldMax = resource.最大值 || 0;
  const newMax = Math.max(0, newMaxCalculated);
  const oldCurrent = resource.当前值;

  if (oldMax === 0 || oldCurrent === null) {
    resource.最大值 = newMax;
    resource.当前值 = newMax;
    return;
  }

  if (newMax !== oldMax) {
    const diff = newMax - oldMax;
    resource.最大值 = newMax;
    let newCurrent = (oldCurrent || 0) + diff;
    newCurrent = Math.max(0, Math.min(newMax, newCurrent));
    resource.当前值 = newCurrent;
  } else if (oldCurrent > newMax) {
        resource.当前值 = newMax;
    }
};

const normalizeRankName = (rank: string) => {
  if (!rank || typeof rank !== 'string') return '白瓷';
  const normalized = rank.replace(/级$/, '').replace(/等级$/, '');
  const rankMapping: Record<string, string> = {
    '黄金': '金', '黄金级': '金', '金级': '金', '黄金等级': '金', '金等级': '金',
    '白银': '银', '白银级': '银', '银级': '银', '白银等级': '银', '银等级': '银',
    '黑曜': '黑曜石', '黑曜级': '黑曜石', '黑曜石级': '黑曜石', '黑曜等级': '黑曜石', '黑曜石等级': '黑曜石',
    '白金级': '白金', '青铜级': '青铜', '红玉级': '红玉', '翠玉级': '翠玉', '青玉级': '青玉', '钢铁级': '钢铁', '白瓷级': '白瓷',
    '白金等级': '白金', '青铜等级': '青铜', '红玉等级': '红玉', '翠玉等级': '翠玉', '青玉等级': '青玉', '钢铁等级': '钢铁', '白瓷等级': '白瓷',
    '准金级': '准金级', '准金': '准金级'
  };
  if (rankMapping[normalized]) return rankMapping[normalized];
  const validRank = RANK_CONFIG.find(r => r.rank === normalized);
  if (validRank) return normalized;
  return '白瓷';
};

const normalizeRelationTier = (tier: string) => {
  if (!tier || typeof tier !== 'string') return '白瓷';
  const normalized = tier.replace(/级$/, '').replace(/等级$/, '');
  const tierMapping: Record<string, string> = {
    '白瓷': '白瓷', '黑曜石': '黑曜石', '青玉': '青玉', '翠玉': '翠玉',
    '红玉': '红玉', '青铜': '青铜', '白银': '白银', '黄金': '黄金',
    '白金': '白金', '准金级': '准金级', '准金': '准金级'
  };
  if (tierMapping[normalized]) return tierMapping[normalized];
  for (const [key, value] of Object.entries(tierMapping)) {
    if (normalized.includes(key) || key.includes(normalized)) return value;
  }
  return '白瓷';
};

const getProgressBonus = (attributeValue: number) => {
  for (const tier of PROGRESS_TIERS) {
    if (attributeValue >= tier.min && attributeValue <= tier.max) return tier.bonus;
  }
  return 1;
};

const handleAttributeGrowth = (data: any) => {
  const SEVEN_ATTRIBUTES = ['力量', '敏捷', '感知', '知识', '魅力', '魔力', '信仰力'];
  SEVEN_ATTRIBUTES.forEach(attr => {
    if (data.历练进度 && data.历练进度[attr] !== undefined) {
      if (data.历练进度[attr] >= 100) {
        const currentValue = data.能力[attr] || 0;
        data.能力[attr] = currentValue + 1;
        data.历练进度[attr] = 0;
      }
    }
  });
  return data;
};

const handleJobLevelUp = (data: any) => {
  let skillPoints = data.技能点 || 0;
  const jobs = data.职业 || {};
  let totalLevelUps = 0;

  _.forOwn(jobs, (job: any) => {
    if (job && typeof job === 'object' && job !== '待初始化') {
      if (!job.升级所需 || job.升级所需 === 0) job.升级所需 = 1000;
      const oldLevel = job.当前等级 || 1;
      const maxLevel = job.最大等级 || 10;
      let levelUps = 0;
      let remainingExp = job.当前经验 || 0;
      let currentRequirement = job.升级所需;

      while (remainingExp >= currentRequirement && (oldLevel + levelUps) < maxLevel) {
        levelUps++;
        remainingExp -= currentRequirement;
        currentRequirement += 1000;
      }
      if (levelUps > 0) {
        job.当前等级 = oldLevel + levelUps;
        job.当前经验 = Math.max(0, remainingExp);
        job.升级所需 = currentRequirement;
        skillPoints += levelUps;
        totalLevelUps += levelUps;
      }
    }
  });

  data.技能点 = skillPoints;
  if (totalLevelUps > 0) data.经验等级 = (data.经验等级 || 1) + totalLevelUps;
  return data;
};

const updateProgress = (data: any, usedAttributes: string[] = []) => {
  const attributesToUpdate = usedAttributes.length > 0 ? usedAttributes :
    ['力量', '敏捷', '感知', '知识', '魅力', '魔力', '信仰力'];
  if (!data.历练进度) data.历练进度 = {};
  attributesToUpdate.forEach(attr => {
    if (data.历练进度[attr] === undefined) data.历练进度[attr] = 0;
    const attributeValue = data.能力[attr] || 0;
    const bonusPercent = getProgressBonus(attributeValue);
    data.历练进度[attr] = Math.min(100, (data.历练进度[attr] || 0) + bonusPercent);
  });
  return data;
};

// --- 基础 Schema 定义 ---
const ItemSchema = z.object({
  name: z.string().prefault('未命名物品'),
  type: z.string().prefault('杂物'),
  tier: z.string().prefault('普通'),
  part: z.string().prefault(''),
  description: z.string().prefault(''),
  armor_value: z.coerce.number().prefault(0),
  attributes_bonus: z.record(z.string(), z.coerce.number()).prefault({}),
  hands: z.string().prefault('单手'),
  special_effects: z.record(z.string(), z.string()).prefault({}),
  quantity: z.coerce.number().prefault(1)
}).or(z.literal('待初始化')).prefault('待初始化');

const ResourceSchema = (defaultValue: number | null = null) => z.object({
  当前值: z.coerce.number().nullable().prefault(defaultValue),
  最大值: z.coerce.number().nullable().prefault(defaultValue)
}).prefault({});

const InventorySchema = z.object({
  武器: z.record(z.string(), ItemSchema).prefault({}),
  防具: z.record(z.string(), ItemSchema).prefault({}),
  饰品: z.record(z.string(), ItemSchema).prefault({}),
  消耗品: z.record(z.string(), ItemSchema).prefault({}),
  材料: z.record(z.string(), ItemSchema).prefault({}),
  杂物: z.record(z.string(), ItemSchema).prefault({}),
  金钱: z.object({
    金币: z.coerce.number().prefault(0),
    银币: z.coerce.number().prefault(0),
    铜币: z.coerce.number().prefault(0)
  }).prefault({})
}).prefault({});

const ProgressSchema = z.object({
  力量: z.coerce.number().transform(v => Math.max(0, Math.min(100, v))).prefault(0),
  敏捷: z.coerce.number().transform(v => Math.max(0, Math.min(100, v))).prefault(0),
  感知: z.coerce.number().transform(v => Math.max(0, Math.min(100, v))).prefault(0),
  知识: z.coerce.number().transform(v => Math.max(0, Math.min(100, v))).prefault(0),
  魅力: z.coerce.number().transform(v => Math.max(0, Math.min(100, v))).prefault(0),
  魔力: z.coerce.number().transform(v => Math.max(0, Math.min(100, v))).prefault(0),
  信仰力: z.coerce.number().transform(v => Math.max(0, Math.min(100, v))).prefault(0)
}).prefault({});

// --- 主 Schema 导出 ---
export const Schema = z.object({
  "世界": z.object({
    当前时间: z.string().prefault('战后十年/初醒之月/第一日'),
    世界动向: z.string().prefault('暂无重大动向'),
    城市趣闻: z.string().prefault('暂无趣闻'),
    冒险逸闻: z.string().prefault('暂无逸闻')
  }).prefault({}),

  "主角": z.object({
    姓名: z.string().prefault('{{user}}'),
    所在地: z.string().nullable().prefault(null),
    坐标: z.object({ x: z.coerce.number().prefault(0), y: z.coerce.number().prefault(0) }).prefault({}),
    职业: z.record(z.string(), z.object({
      当前等级: z.coerce.number().prefault(1),
      最大等级: z.coerce.number().prefault(10),
      当前经验: z.coerce.number().prefault(0),
      升级所需: z.coerce.number().prefault(1000)
    }).or(z.literal('待初始化'))).prefault({}),
    经验等级: z.coerce.number().prefault(1),
    技能点: z.coerce.number().prefault(0),
    种族: z.string().nullable().prefault('人类'),
    能力: z.object({
      力量: z.coerce.number().transform(v => Math.max(0, v)).prefault(5),
      敏捷: z.coerce.number().transform(v => Math.max(0, v)).prefault(5),
      感知: z.coerce.number().transform(v => Math.max(0, v)).prefault(5),
      知识: z.coerce.number().transform(v => Math.max(0, v)).prefault(5),
      魅力: z.coerce.number().transform(v => Math.max(0, v)).prefault(5),
      魔力: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
      信仰力: z.coerce.number().transform(v => Math.max(0, v)).prefault(0)
    }).prefault({}),
    生命值: ResourceSchema(),
    护甲值: ResourceSchema(0),
    魔力值: ResourceSchema(),
    信仰力值: ResourceSchema(),
    体力值: ResourceSchema(),
    历练进度: ProgressSchema,
    装备: z.object({
      武器: z.record(z.string(), ItemSchema).prefault({}),
      防具: z.record(z.string(), ItemSchema).prefault({}),
      饰品: z.record(z.string(), ItemSchema).transform((data: any) => {
          const rings = _.entries(data).filter(([_, v]: [string, any]) => (v?.type === '戒指'));
          if (rings.length > 2) {
            const keysToRemove = rings.slice(0, rings.length - 2).map(([k]) => k);
            return _.omit(data, keysToRemove);
          }
          return data;
      }).prefault({})
    }).prefault({}),
    技能列表: z.record(z.string(), z.object({
      type: z.string().prefault('主动'),
      tier: z.string().prefault('T1'),
      level: z.string().prefault('初级'),
      熟练度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      efficiency: z.coerce.number().prefault(1.0),
      description: z.string().prefault(''),
      effect: z.string().prefault(''),
      cost: z.string().prefault('')
    }).or(z.literal('待初始化'))).prefault({}),
    资产: z.record(z.string(), z.object({
      名称: z.string().prefault(''),
      位置: z.string().prefault(''),
      整体介绍: z.string().prefault(''),
      内部结构布局: z.string().prefault('')
    }).or(z.literal('待初始化'))).prefault({}),
    当前状态: z.record(z.string(), z.object({
      description: z.string().prefault(''),
      level: z.string().prefault('1'),
      attributes_bonus: z.record(z.string(), z.coerce.number()).prefault({}),
      type: z.string().prefault('临时')
    }).or(z.literal('待初始化'))).prefault({}),
    任务日志: z.object({
      进行中: z.record(z.string(), z.any()).prefault({}),
      已完成: z.record(z.string(), z.any()).prefault({})
    }).prefault({}),
    背包: InventorySchema,
    公会信息: z.object({
      所属公会: z.string().prefault('无'),
      公会阶级: z.string().transform(rank => normalizeRankName(rank)).prefault('白瓷'),
      当前贡献度: z.coerce.number().prefault(0)
    }).prefault({})
  }).transform((data: any) => {
    data = handleAttributeGrowth(data);
    data = handleJobLevelUp(data);
    data.公会信息.公会阶级 = normalizeRankName(data.公会信息.公会阶级);
    _.forOwn(data.技能列表, (skill: any) => {
      if (skill && typeof skill === 'object' && skill !== '待初始化') {
        if (skill.熟练度 >= 100) {
          const currentIndex = SKILL_LEVELS.indexOf(skill.level);
          if (currentIndex !== -1 && currentIndex < SKILL_LEVELS.length - 1) {
            skill.level = SKILL_LEVELS[currentIndex + 1];
            skill.熟练度 = 0;
          } else {
            skill.熟练度 = 100;
          }
        }
        skill.efficiency = SKILL_WEIGHTS[skill.level as keyof typeof SKILL_WEIGHTS] ?? 1.0;
      }
    });
    const s = data.能力;
    updateResourceWithDelta(data.生命值, 10 + (s.力量 || 0) * 5 + (s.感知 || 0) * 2);
    updateResourceWithDelta(data.体力值, 5 + (s.敏捷 || 0) + (s.力量 || 0));
    updateResourceWithDelta(data.魔力值, s.魔力 || 0);
    updateResourceWithDelta(data.信仰力值, s.信仰力 || 0);
    const allEquips = [..._.values(data.装备.武器), ..._.values(data.装备.防具), ..._.values(data.装备.饰品)];
    const calcMaxArmor = allEquips.reduce((sum, i: any) => sum + (i?.armor_value || 0), 0);
    data.护甲值.最大值 = calcMaxArmor;
    if (data.护甲值.当前值 === null) data.护甲值.当前值 = calcMaxArmor;

    return data;
  }).prefault({}),

  "关系列表": z.record(z.string(), z.object({
    姓名: z.string().prefault(''),
    职业: z.union([z.string(), z.record(z.string(), z.any())]).prefault('未知'),
    职业等级: z.coerce.number().prefault(1),
    种族: z.string().prefault(''),
    is_companion: z.boolean().prefault(false),
    在场: z.boolean().prefault(false),
    好感度: z.union([z.coerce.number(), z.record(z.string(), z.coerce.number())]).prefault(0),
    信任度: z.union([z.coerce.number(), z.record(z.string(), z.coerce.number())]).prefault(0),
    能力: z.object({
        力量: z.coerce.number().prefault(5),
        敏捷: z.coerce.number().prefault(5),
        感知: z.coerce.number().prefault(5),
        知识: z.coerce.number().prefault(5),
        魅力: z.coerce.number().prefault(5),
        魔力: z.coerce.number().prefault(0),
        信仰力: z.coerce.number().prefault(0)
    }).prefault({}),
    装备: z.object({
        武器: z.record(z.string(), ItemSchema).prefault({}),
        防具: z.record(z.string(), ItemSchema).prefault({}),
        饰品: z.record(z.string(), ItemSchema).prefault({})
    }).prefault({}),
    背包: InventorySchema,
    技能列表: z.record(z.string(), z.any()).prefault({}),
    生命值: ResourceSchema(),
    护甲值: ResourceSchema(0),
    魔力值: ResourceSchema(),
    信仰力值: ResourceSchema(),
    体力值: ResourceSchema(),
    公会信息: z.object({
      所属公会: z.string().prefault('无'),
      公会阶级: z.string().transform(rank => normalizeRankName(rank)).prefault('无阶级'),
      当前贡献度: z.coerce.number().prefault(0)
    }).prefault({}),
    身份背景: z.string().prefault(''),
    性格标签: z.record(z.string(), z.boolean()).prefault({}),
    外貌: z.string().prefault(''),
    称呼: z.string().prefault(''),
    "与主角关系": z.string().prefault(''),
    层级: z.string().transform(tier => normalizeRelationTier(tier)).prefault('白瓷'),
    历练进度: ProgressSchema,
    性档案: z.object({
      私处叙述: z.string().prefault(''),
      阴道结构叙述: z.string().prefault(''),
      体位及次数: z.record(z.string(), z.coerce.number()).prefault({}),
      技巧评价: z.string().prefault(''),
      与主角意愿: z.string().prefault(''),
      通用性癖好: z.string().prefault(''),
      受孕与内射意愿: z.string().prefault('')
    }).prefault({}),
    所处地点: z.string().prefault(''),
    重要记忆: z.record(z.string(), z.string()).prefault({})
  }).transform((data: any) => {
    if (data.能力) {
        const s = data.能力;
        updateResourceWithDelta(data.生命值, 10 + (s.力量 || 0) * 5 + (s.感知 || 0) * 2);
        updateResourceWithDelta(data.体力值, 5 + (s.敏捷 || 0) + (s.力量 || 0));
        updateResourceWithDelta(data.魔力值, s.魔力 || 0);
        updateResourceWithDelta(data.信仰力值, s.信仰力 || 0);
    }
    if (data.装备) {
        const allEquips = [..._.values(data.装备.武器), ..._.values(data.装备.防具), ..._.values(data.装备.饰品)];
        const maxArmor = allEquips.reduce((sum, i: any) => sum + (i?.armor_value || 0), 0);
        data.护甲值.最大值 = maxArmor;
        if (data.护甲值.当前值 === null) data.护甲值.当前值 = maxArmor;
    }
    if (data.公会信息 && data.公会信息.公会阶级) data.公会信息.公会阶级 = normalizeRankName(data.公会信息.公会阶级);
    return data;
  }).or(z.literal('待初始化'))).prefault({}),

  "敌人列表": z.record(z.string(), z.object({
    类型: z.string().prefault('人形'),
    生命值: ResourceSchema(),
    护甲值: ResourceSchema(0),
    能力: z.record(z.string(), z.coerce.number()).prefault({}),
    备注: z.string().prefault('')
  }).transform((data: any) => {
      if (data.生命值.当前值 === null && data.生命值.最大值 !== null) data.生命值.当前值 = data.生命值.最大值;
      return data;
  }).or(z.literal('待初始化'))).prefault({}),

  "地图位标": z.record(z.string(), z.object({
    名称: z.string().nullable().prefault(null),
    坐标: z.object({ x: z.coerce.number().prefault(0), y: z.coerce.number().prefault(0) }).prefault({}),
    类型: z.string().prefault('调查'),
    临时: z.boolean().prefault(false),
    概况: z.string().nullable().prefault(null)
  }).or(z.literal('待初始化'))).prefault({})
});

export const updateCharacterProgress = (characterData: any, usedAttributes: string[] = []) => {
  return updateProgress(characterData, usedAttributes);
};