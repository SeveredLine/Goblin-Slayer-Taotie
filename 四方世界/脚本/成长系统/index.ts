(async function () {
  'use strict';
  if (typeof (window as any).waitGlobalInitialized === 'function') {
    await (window as any).waitGlobalInitialized('Mvu');
  }

  const EVT = (window as any).Mvu?.events || {};
  const EVENT_STARTED = EVT.VARIABLE_UPDATE_STARTED || 'mag_variable_update_started';
  const EVENT_ENDED = EVT.VARIABLE_UPDATE_ENDED || 'mag_variable_update_ended';

  const eventOnFn = typeof (window as any).eventOn === 'function' ? (window as any).eventOn : () => {};

  let prevMoneySnapshot: any = null;
  eventOnFn(EVENT_STARTED, function (variables: any) {
    const money = variables?.stat_data?.主角?.金钱;
    if (money) {
      try {
        prevMoneySnapshot = JSON.parse(JSON.stringify(money));
      } catch (e) {
        prevMoneySnapshot = null;
      }
    }
  });

  function pushMessage(variables: any, key: string, msg: string) {
    if (!variables) return;
    if (!variables.display_data) variables.display_data = {};
    variables.display_data[key] = (variables.display_data[key] ? variables.display_data[key] + '\n' : '') + msg;
  }

  function num(v: any) {
    const n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  }

  function findItem(owner: any, name: string) {
    if (!owner || !name) return null;
    const bag = owner.背包;
    const catKeys = ['武器', '防具', '饰品', '消耗品', '材料'];
    if (bag && typeof bag === 'object') {
      for (const c of catKeys) {
        const bucket = bag[c];
        if (bucket && typeof bucket === 'object' && Object.prototype.hasOwnProperty.call(bucket, name))
          return bucket[name];
      }
    }
    return null;
  }

  function migrateFatigue(stat: any) {
    const p = stat?.主角;
    if (p && p.疲劳度) {
      p.体力值 = p.体力值 || {};
      if (p.体力值.当前值 == null && p.疲劳度.当前值 != null) p.体力值.当前值 = p.疲劳度.当前值;
      if (p.体力值.最大值 == null && p.疲劳度.最大值 != null) p.体力值.最大值 = p.疲劳度.最大值;
      delete p.疲劳度;
    }
    if (stat.关系列表 && typeof stat.关系列表 === 'object') {
      for (const name in stat.关系列表) {
        const npc = stat.关系列表[name];
        if (npc && npc.疲劳度) {
          npc.体力值 = npc.体力值 || {};
          if (npc.体力值.当前值 == null && npc.疲劳度.当前值 != null) npc.体力值.当前值 = npc.疲劳度.当前值;
          if (npc.体力值.最大值 == null && npc.疲劳度.最大值 != null) npc.体力值.最大值 = npc.疲劳度.最大值;
          delete npc.疲劳度;
        }
      }
    }
  }

  const JOB_LEVEL_XP_TABLE: Record<number, number> = {
    1: 1000, 2: 1500, 3: 2500, 4: 4000, 5: 6000,
    6: 9000, 7: 13000, 8: 20000, 9: 30000, 10: 50000,
  };
  const EXP_MULT = 1.5;
  function sharedExperienceGrowth(stat: any, msgOut: string[]) {
    const p = stat?.主角;
    if (!p || !p.职业经验 || typeof p.职业 !== 'object' || p.经验等级 == null || p.职业点数 == null) return;
    while (num(p.职业经验.当前值) >= num(p.职业经验.升级所需)) {
      const req = num(p.职业经验.升级所需);
      if (req <= 0) break;
      p.职业经验.当前值 = num(p.职业经验.当前值) - req;
      p.经验等级 = parseInt(p.经验等级, 10) + 1;
      p.职业点数 = parseInt(p.职业点数, 10) + 1;
      p.职业经验.升级所需 = JOB_LEVEL_XP_TABLE[p.经验等级] || Math.round(req * EXP_MULT);
      msgOut.push(`经验等级提升至 ${p.经验等级} 级！获得 1 职业点数！`);
    }
  }

  function attributeBreakthrough(stat: any, msgOut: string[]) {
    const p = stat?.主角;
    if (!p || !p.历练进度 || !p.能力) return;
    for (const a in p.历练进度) {
      const progress = num(p.历练进度[a]);
      const threshold = 100;

      if (progress < threshold) continue;
      const k = Math.floor(progress / threshold);
      if (k <= 0) continue;

      p.历练进度[a] = progress - k * threshold;

      if (p.能力[a] != null) {
        p.能力[a] = num(p.能力[a]) + k;
        if (a === '力量') {
          p.生命值 = p.生命值 || { 当前值: 0, 最大值: 0 };
          p.生命值.当前值 = num(p.生命值.当前值) + 5 * k;
        }
        if (a === '感知') {
          p.生命值 = p.生命值 || { 当前值: 0, 最大值: 0 };
          p.生命值.当前值 = num(p.生命值.当前值) + 2 * k;
        }
        if (a === '魔力') {
          p.魔力值 = p.魔力值 || { 当前值: 0, 最大值: 0 };
          p.魔力值.当前值 = num(p.魔力值.当前值) + 1 * k;
        }
        if (a === '信仰力') {
          p.信仰力值 = p.信仰力值 || { 当前值: 0, 最大值: 0 };
          p.信仰力值.当前值 = num(p.信仰力值.当前值) + 1 * k;
        }
        msgOut.push(`【${a}】属性突破！提升至 ${p.能力[a]}！(×${k})`);
      }
    }
  }

  const SKILL_LEVELS = ['初级', '中级', '高级', '大师'];
  const SKILL_MULT = 1.5;
  function skillLevelUp(stat: any, msgOut: string[]) {
    const p = stat?.主角;
    if (!p || !p.技能列表) return;
    for (const name in p.技能列表) {
      const sk = p.技能列表[name];
      if (!sk || !sk.经验 || typeof sk.等级 !== 'string' || SKILL_LEVELS.indexOf(sk.等级) < 0) continue;
      while (num(sk.经验.当前值) >= num(sk.经验.升级所需)) {
        const req = num(sk.经验.升级所需);
        if (req <= 0) break;
        const idx = SKILL_LEVELS.indexOf(sk.等级);
        if (idx >= SKILL_LEVELS.length - 1) break;
        const nxt = SKILL_LEVELS[idx + 1];
        sk.经验.当前值 = num(sk.经验.当前值) - req;
        sk.等级 = nxt;
        sk.经验.升级所需 = Math.round(req * SKILL_MULT);
        msgOut.push(`技能【${name}】提升至【${nxt}】！`);
      }
    }
  }

  function capValues(stat: any) {
    const p = stat?.主角;
    if (!p) return;
    for (const res of ['生命值', '魔力值', '信仰力值', '体力值', '护甲值']) {
      const r = p[res];
      if (r && r.当前值 != null && r.最大值 != null) {
        const cur = num(r.当前值);
        const max = num(r.最大值);
        if (isFinite(max) && cur > max) r.当前值 = max;
      }
    }
  }

  function cleanupEquip(ch: any) {
    if (!ch || !ch.装备栏) return;
    const slots = [
      ['装备栏', '武器'], ['装备栏', '副手'], ['装备栏', '饰品'],
      ['装备栏', '防具', '头部'], ['装备栏', '防具', '身体'],
      ['装备栏', '防具', '手部'], ['装备栏', '防具', '腿部'], ['装备栏', '防具', '内衬'],
    ];

    for (const path of slots) {
      let node = ch;
      let parent: any = null;
      let lastKey: any = null;
      for (const key of path) {
        if (!node || typeof node !== 'object') {
          node = null;
          break;
        }
        parent = node;
        lastKey = key;
        node = node[key];
      }
      if (!parent || !lastKey) continue;

      const slotVal = node;
      if (typeof slotVal === 'string') {
        if (!findItem(ch, slotVal)) {
          parent[lastKey] = null;
        }
      }
    }
  }

  function twoHandRule(ch: any) {
    if (!ch || !ch.装备栏) return;
    const weaponSlot = ch.装备栏.武器;
    const weaponName = typeof weaponSlot === 'string' ? weaponSlot : null;
    const weapon = weaponName
      ? findItem(ch, weaponName)
      : typeof weaponSlot === 'object' && weaponSlot !== null
        ? weaponSlot
        : null;
    if (weapon && String(weapon.hands || '').trim() === '双手') {
      ch.装备栏.副手 = null;
    }
  }

  function totalAbilities(ch: any) {
    if (!ch || !ch.能力) return;
    const A = ['力量', '敏捷', '感知', '知识', '魅力', '魔力', '信仰力'];
    const equip = ch.装备栏 || {};
    const states = ch.当前状态 || {};

    function itemBonus(slot: any, a: string) {
      if (!slot) return 0;
      if (typeof slot === 'object' && slot !== null) {
        return slot.attributes_bonus ? num(slot.attributes_bonus[a]) : 0;
      }
      const item = findItem(ch, slot);
      return item?.attributes_bonus ? num(item.attributes_bonus[a]) : 0;
    }

    for (const a of A) {
      let t = num(ch.能力[a] ?? 0);
      t += itemBonus(equip.武器, a);
      t += itemBonus(equip.副手, a);
      t += itemBonus(equip.饰品, a);
      if (equip.防具) {
        for (const s of ['头部', '身体', '手部', '腿部', '内衬']) t += itemBonus(equip.防具[s], a);
      }
      for (const sName in states) {
        const st = states[sName];
        if (st?.attributes_bonus?.[a]) t += num(st.attributes_bonus[a]);
      }
      ch.能力[a] = Math.max(1, t);
    }
  }

  function resourceMax(ch: any) {
    if (!ch || !ch.能力) return;
    const hpMax = 10 + num(ch.能力.力量) * 5 + num(ch.能力.感知) * 2;
    ch.生命值 = ch.生命值 || { 当前值: 0, 最大值: 0 };
    if (ch.生命值.最大值 !== hpMax) {
      ch.生命值.最大值 = hpMax;
      if (num(ch.生命值.当前值) > hpMax) ch.生命值.当前值 = hpMax;
    }

    const mpMax = num(ch.能力.魔力);
    ch.魔力值 = ch.魔力值 || { 当前值: 0, 最大值: 0 };
    if (ch.魔力值.最大值 !== mpMax) {
      ch.魔力值.最大值 = mpMax;
      if (num(ch.魔力值.当前值) > mpMax) ch.魔力值.当前值 = mpMax;
    }

    const fpMax = num(ch.能力.信仰力);
    ch.信仰力值 = ch.信仰力值 || { 当前值: 0, 最大值: 0 };
    if (ch.信仰力值.最大值 !== fpMax) {
      ch.信仰力值.最大值 = fpMax;
      if (num(ch.信仰力值.当前值) > fpMax) ch.信仰力值.当前值 = fpMax;
    }

    const spMax = 5 + num(ch.能力.敏捷) + num(ch.能力.力量);
    ch.体力值 = ch.体力值 || { 当前值: 0, 最大值: 0 };
    if (ch.体力值.最大值 !== spMax) {
      ch.体力值.最大值 = spMax;
      if (num(ch.体力值.当前值) > spMax) ch.体力值.当前值 = spMax;
    }

    let armor = 0;
    const equip = ch.装备栏 || {};
    function armorOf(slot: any) {
      if (!slot) return 0;
      if (typeof slot === 'object' && slot !== null) {
        return num(slot?.armor_value);
      }
      const item = findItem(ch, slot);
      return num(item?.armor_value);
    }
    armor += armorOf(equip.武器);
    armor += armorOf(equip.副手);
    if (equip.防具) for (const s of ['头部', '身体', '手部', '腿部', '内衬']) armor += armorOf(equip.防具[s]);
    ch.护甲值 = ch.护甲值 || { 当前值: 0, 最大值: 0 };
    if (ch.护甲值.最大值 !== armor) {
      ch.护甲值.最大值 = armor;
      if (num(ch.护甲值.当前值) > armor) ch.护甲值.当前值 = armor;
    }
  }

  const FATIGUE = { slightly: 0.75, tired: 0.5, over: 0.2 };
  function fatigueStates(ch: any) {
    if (!ch || !ch.体力值 || ch.体力值.最大值 == null || ch.体力值.当前值 == null) return;
    const ratio = num(ch.体力值.当前值) / Math.max(1, num(ch.体力值.最大值));
    let target = null;
    if (ratio <= FATIGUE.over) target = '过度疲劳';
    else if (ratio <= FATIGUE.tired) target = '疲劳';
    else if (ratio <= FATIGUE.slightly) target = '有点累';
    ch.当前状态 = ch.当前状态 || {};
    const have = {
      slight: !!ch.当前状态['有点累'],
      tired: !!ch.当前状态['疲劳'],
      over: !!ch.当前状态['过度疲劳'],
    };
    if (target !== '有点累' && have.slight) delete ch.当前状态['有点累'];
    if (target !== '疲劳' && have.tired) delete ch.当前状态['疲劳'];
    if (target !== '过度疲劳' && have.over) delete ch.当前状态['过度疲劳'];
    if (target && !ch.当前状态[target]) {
      const desc: Record<string, string> = {
        有点累: '体力下降，注意节奏。对检定略有影响。',
        疲劳: '明显疲惫，动作迟缓。对检定有中等减益。',
        过度疲劳: '极度疲乏，注意休息！对检定有显著减益，易入睡。',
      };
      const rollMod: Record<string, number> = { 有点累: -1, 疲劳: -2, 过度疲劳: -4 };
      ch.当前状态[target] = {
        type: '临时',
        level: '1',
        description: desc[target],
        attributes_bonus: {},
        special_effects: { roll_modifier: rollMod[target] },
      };
    }
  }

  const COPPER_PER_SILVER = 100;
  const SILVER_PER_GOLD = 100;
  function purchaseConversion(stat: any, variables: any) {
    const money = stat?.主角?.背包?.金钱;
    if (!money) return;

    let g = num(money.金币), s = num(money.银币), c = num(money.铜币);
    if (g < 0) {
      const deficit = -g;
      const needS = deficit * SILVER_PER_GOLD;
      const usableS = Math.max(0, s);
      const shortageS = Math.max(0, needS - usableS);
      const needCforS = shortageS * COPPER_PER_SILVER;
      if (c >= needCforS) {
        if (needCforS > 0) {
          money.铜币 = c - needCforS;
          money.银币 = s + shortageS;
          c = money.铜币;
          s = money.银币;
        }
        money.银币 = s - needS;
        money.金币 = g + deficit;
        pushMessage(variables, '交易提示', `购买成功：用 ${needS} 银币（不足部分用 ${needCforS} 铜币换得）抵扣 ${deficit} 金币`);
      } else {
        pushMessage(variables, '交易提示', `购买失败：金币不足，且银/铜不足以按需换算（缺少 ${deficit} 金）。已取消金币扣费`);
        if (prevMoneySnapshot) money.金币 = prevMoneySnapshot.金币;
        else money.金币 = g + deficit;
      }
    }

    g = num(money.金币); s = num(money.银币); c = num(money.铜币);
    if (s < 0) {
      const deficitS = -s;
      const needG = Math.ceil(deficitS / SILVER_PER_GOLD);
      if (needG > 0 && money.金币 >= needG) {
        money.金币 = money.金币 - needG;
        money.银币 = s + needG * SILVER_PER_GOLD;
        pushMessage(variables, '交易提示', `购买成功：用 ${needG} 金币换得 ${needG * SILVER_PER_GOLD} 银币抵扣 ${deficitS} 银币`);
      } else {
        const needC = deficitS * COPPER_PER_SILVER;
        if (money.铜币 >= needC) {
          money.铜币 = c - needC;
          money.银币 = s + deficitS;
          pushMessage(variables, '交易提示', `购买成功：消耗 ${needC} 铜币抵扣 ${deficitS} 银币（自动换算）`);
        } else {
          pushMessage(variables, '交易提示', `购买失败：银币不足，且金币/铜币不足以按需换算（缺少 ${deficitS} 银）。已取消银币扣费`);
          if (prevMoneySnapshot) money.银币 = prevMoneySnapshot.银币;
          else money.银币 = s + deficitS;
        }
      }
    }

    c = num(money.铜币); s = num(money.银币);
    if (c < 0) {
      const deficitC = -c;
      const needSforC = Math.ceil(deficitC / COPPER_PER_SILVER);
      if (needSforC > 0 && money.银币 >= needSforC) {
        money.银币 = money.银币 - needSforC;
        money.铜币 = c + needSforC * COPPER_PER_SILVER;
        pushMessage(variables, '交易提示', `购买成功：用 ${needSforC} 银币换得 ${needSforC * COPPER_PER_SILVER} 铜币抵扣 ${deficitC} 铜币`);
      } else {
        pushMessage(variables, '交易提示', `购买失败：铜币不足，且银币不足以按需换算（缺少 ${deficitC} 铜）。已取消铜币扣费`);
        if (prevMoneySnapshot) money.铜币 = prevMoneySnapshot.铜币;
        else money.铜币 = c + deficitC;
      }
    }
  }

  function normalizeCoordinates(stat: any) {
    const pcoord = stat?.主角?.坐标;
    if (pcoord) {
      // 保持
    }
    const wps = stat?.地图位标;
    if (wps && typeof wps === 'object') {
      for (const name in wps) {
        const wp = wps[name];
        if (!wp || typeof wp !== 'object') continue;
        if (wp.临时 === true) wps[name] = null;
      }
    }
  }

  function cleanupDeadEnemies(stat: any) {
    const root = stat?.敌人列表;
    if (!root || typeof root !== 'object') return;
    for (const name in root) {
      const hp = num(root[name]?.生命值?.当前值);
      if (isFinite(hp) && hp <= 0) root[name] = null;
    }
  }

  function deferredCleanup(stat: any) {
    const wps = stat?.地图位标;
    if (wps && typeof wps === 'object') {
      for (const name in wps) if (wps[name] === null) delete wps[name];
    }
    const enemies = stat?.敌人列表;
    if (enemies && typeof enemies === 'object') {
      for (const name in enemies) if (enemies[name] === null) delete enemies[name];
    }
  }

  function onVariableUpdateEnded(variables: any) {
    if (!variables || !variables.stat_data) return;
    const stat = variables.stat_data;
    const growMsgs: string[] = [];
    try {
      deferredCleanup(stat);
      migrateFatigue(stat);
      sharedExperienceGrowth(stat, growMsgs);
      attributeBreakthrough(stat, growMsgs);
      skillLevelUp(stat, growMsgs);
      capValues(stat);
      if (stat.主角) {
        cleanupEquip(stat.主角);
        twoHandRule(stat.主角);
        totalAbilities(stat.主角);
        resourceMax(stat.主角);
        fatigueStates(stat.主角);
      }
      if (stat.关系列表 && typeof stat.关系列表 === 'object') {
        for (const name in stat.关系列表) {
          const npc = stat.关系列表[name];
          if (npc && npc.在场 === true) {
            cleanupEquip(npc);
            twoHandRule(npc);
            totalAbilities(npc);
            resourceMax(npc);
            fatigueStates(npc);
            capValues({ 主角: npc }); 
          }
        }
      }
      purchaseConversion(stat, variables);
      normalizeCoordinates(stat);
      cleanupDeadEnemies(stat);
      if (growMsgs.length > 0) pushMessage(variables, '成长提示', growMsgs.join(' | '));
    } catch (e) {
      console.error('[Integrated Engine v2.3] 运行异常:', e);
    }
  }

  eventOnFn(EVENT_ENDED, onVariableUpdateEnded);
})();
export { };

