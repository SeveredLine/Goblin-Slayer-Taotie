import _ from 'lodash';

// ST_API functions are accessed via (window as any) currently.
const $ = (window as any).$;

const BTN_NAME = '装备管理';
const CTX = { type: 'message', message_id: 'latest' } as const;

const getHero = (vars: any) => _.get(vars, 'stat_data.主角', _.get(vars, '主角', {})) || {};

const ensureBag = (bag: any) => {
  const base = bag && typeof bag === 'object' ? _.cloneDeep(bag) : {};
  const categories = ['武器', '防具', '饰品', '消耗品', '材料'];
  categories.forEach(cat => {
    if (!base[cat] || typeof base[cat] !== 'object') base[cat] = {};
  });
  if (!base.金钱) base.金钱 = { 金币: 0, 银币: 0, 铜币: 0 };
  return base;
};

const ensureEquip = (equip: any) => {
  const base = equip && typeof equip === 'object' ? _.cloneDeep(equip) : {};
  ['武器', '防具', '饰品'].forEach(cat => {
    if (!base[cat] || typeof base[cat] !== 'object') base[cat] = {};
  });
  return base;
};

const getEquipName = (item: any, key: string) => item?.name || item?.名称 || key || '';

const performUnequipAll = (equip: any, bag: any) => {
  let moved = 0;
  const moveCategory = (cat: string) => {
    const src = equip[cat] || {};
    Object.entries(src).forEach(([key, item]: [string, any]) => {
      if (!item || item === '待初始化') return;
      const name = getEquipName(item, key);
      if (!name) return;

      const targetCat = bag[cat] || (bag[cat] = {});
      const existing = targetCat[name];
      const quantity = (existing && Number(existing.quantity)) || 0;

      const copy = _.cloneDeep(item);
      copy.quantity = quantity + 1;

      targetCat[name] = copy;
      moved += 1;
    });
    equip[cat] = {};
  };

  ['武器', '防具', '饰品'].forEach(moveCategory);
  return moved;
};

const performEquip = (equip: any, bag: any, itemName: string) => {
  let foundItem: any = null;
  let foundCat: any = null;
  let foundKey: any = null;

  for (const cat of ['武器', '防具', '饰品']) {
    const catItems = bag[cat] || {};
    for (const [key, item] of Object.entries(catItems)) {
      if (getEquipName(item, key) === itemName && ((item as any).quantity || 1) > 0) {
        foundItem = item;
        foundCat = cat;
        foundKey = key;
        break;
      }
    }
    if (foundItem) break;
  }

  if (!foundItem) throw new Error(`背包中未找到装备: ${itemName}`);

  const part = foundItem.part || foundItem.部位;
  if (!part) throw new Error(`装备 ${itemName} 缺少部位信息`);

  const existingItem = equip[foundCat]?.[part];
  if (existingItem) {
    const oldName = getEquipName(existingItem, part);
    const oldTargetCat = bag[foundCat] || (bag[foundCat] = {});
    const oldExisting = oldTargetCat[oldName];
    const oldQuantity = (oldExisting && Number(oldExisting.quantity)) || 0;
    const oldCopy = _.cloneDeep(existingItem);
    oldCopy.quantity = oldQuantity + 1;
    oldTargetCat[oldName] = oldCopy;
  }

  const equipCat = equip[foundCat] || (equip[foundCat] = {});
  const newItem = _.cloneDeep(foundItem);
  delete newItem.quantity;
  equipCat[part] = newItem;

  if (foundItem.quantity > 1) {
    foundItem.quantity -= 1;
  } else {
    delete bag[foundCat][foundKey];
  }

  return { equipped: itemName, unequipped: existingItem ? getEquipName(existingItem, part) : null };
};

$(() => {
  (async () => {
    try {
      await (window as any).triggerSlash(`/buttons ${BTN_NAME}`);
    } catch (err) {
      console.error('[装备管理] 显示按钮失败', err);
    }
  })();

  (window as any).eventOn((window as any).getButtonEvent(BTN_NAME), () => {
    try {
      const vars = (window as any).getVariables(CTX);
      const hero = getHero(vars);
      const equip = ensureEquip(hero.装备);
      const bag = ensureBag(hero.背包);

      const action = window.prompt('选择操作：\n1. 一键脱衣\n2. 穿衣\n请输入数字：', '1');

      if (action === '1') {
        const moved = performUnequipAll(equip, bag);
        if (moved === 0) {
          (window as any).toastr.info('没有可脱下的装备');
          return;
        }
        (window as any).setVariable('stat_data.主角.装备', equip, CTX);
        (window as any).setVariable('stat_data.主角.背包', bag, CTX);
        (window as any).toastr.success(`已脱下 ${moved} 件装备，并移入背包`);
      } else if (action === '2') {
        const availableItems: string[] = [];
        ['武器', '防具', '饰品'].forEach(cat => {
          const catItems = bag[cat] || {};
          Object.entries(catItems).forEach(([key, item]: [string, any]) => {
            const name = getEquipName(item, key);
            const quantity = item.quantity || 1;
            if (name && quantity > 0) {
              availableItems.push(`${name} (${cat}, 数量: ${quantity})`);
            }
          });
        });

        if (availableItems.length === 0) {
          (window as any).toastr.info('背包中没有可装备的物品');
          return;
        }

        const itemInput = window.prompt(`选择要装备的物品：\n${availableItems.join('\n')}\n\n请输入装备名称：`, '');
        if (!itemInput) return;

        const result = performEquip(equip, bag, itemInput.trim());
        (window as any).setVariable('stat_data.主角.装备', equip, CTX);
        (window as any).setVariable('stat_data.主角.背包', bag, CTX);

        let message = `已装备 ${result.equipped}`;
        if (result.unequipped) message += `，替换了 ${result.unequipped}`;
        (window as any).toastr.success(message);
      } else {
        (window as any).toastr.warning('无效选择');
      }
    } catch (err: any) {
      console.error('[装备管理] 操作失败', err);
      (window as any).toastr.error('装备管理失败，请查看控制台：' + err.message);
    }
  });
});

export { };

