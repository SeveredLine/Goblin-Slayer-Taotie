<template>
  <div class="crpg-container fixed inset-0 z-999990 flex items-center justify-center bg-[#0c0a14]/95 p-4 backdrop-blur-sm">
    <div class="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border-[6px] border-[#8b7355] bg-linear-to-br from-[#f7e9d7] to-[#e6d5c3] shadow-[0_0_50px_rgba(139,115,85,0.6)]">
      
      <!-- 装饰性边框 -->
      <div class="pointer-events-none absolute inset-0 m-1 rounded border-[3px] border-[#8b7355]/30"></div>

      <!-- 顶部导航 -->
      <div class="z-10 flex flex-none items-center justify-between border-b-2 border-[#8b7355]/30 bg-[#fdf6ec] p-6">
        <div>
          <h1 class="font-serif text-3xl font-bold tracking-[0.2em] text-[#5a3a2a] drop-shadow-sm">
            <i class="fa-solid fa-scroll mr-2"></i>冒险者契约登记
          </h1>
          <div class="mt-1 text-xs tracking-widest text-[#8b7355] uppercase">Adventurer Registration Contract</div>
        </div>
        <div class="flex gap-2">
           <!-- 步骤指示器 -->
           <div
v-for="(s, idx) in steps" :key="idx" 
               class="rounded px-4 py-1 text-sm font-bold transition-all duration-300"
               :class="currentStep === idx ? 'scale-105 bg-[#8b7355] text-[#f5f5dc] shadow-md' : 'bg-[#8b7355]/10 text-[#8b7355]'">
            {{ idx + 1 }}. {{ s }}
          </div>
        </div>
        <button class="px-2 text-2xl text-[#8b7355] transition-colors hover:text-red-700" @click="$emit('close')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- 内容滚动区 -->
      <div class="custom-scrollbar flex-1 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] p-8">
        
        <!-- STEP 1: 身份确认 -->
        <div v-if="currentStep === 0" class="animate-fade-in space-y-6">
          <div class="grid grid-cols-12 gap-6">
            <!-- 左侧表单 -->
            <div class="col-span-8 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="mb-1 block text-sm font-bold tracking-wide text-[#5a3a2a]">姓名</label>
                  <input
v-model="form.name" type="text" 
                         class="w-full rounded border border-[#d1c1ab] bg-white/60 p-2 text-[#3d3d3d] placeholder-[#a89072] transition-all outline-none focus:border-[#8b7355] focus:bg-white focus:ring-1 focus:ring-[#8b7355]" 
                         placeholder="留空默认为 {{user}}">
                </div>
                <div>
                  <label class="mb-1 block text-sm font-bold tracking-wide text-[#5a3a2a]">性别</label>
                  <input
v-model="form.gender" type="text" 
                         class="w-full rounded border border-[#d1c1ab] bg-white/60 p-2 text-[#3d3d3d] placeholder-[#a89072] transition-all outline-none focus:border-[#8b7355] focus:bg-white focus:ring-1 focus:ring-[#8b7355]" 
                         placeholder="男性/女性/...">
                </div>
                <div>
                  <label class="mb-1 block text-sm font-bold tracking-wide text-[#5a3a2a]">年龄</label>
                  <input
v-model="form.age" type="number" 
                         class="w-full rounded border border-[#d1c1ab] bg-white/60 p-2 text-[#3d3d3d] placeholder-[#a89072] transition-all outline-none focus:border-[#8b7355] focus:bg-white focus:ring-1 focus:ring-[#8b7355]" 
                         placeholder="例如: 18">
                </div>
                <div>
                  <label class="mb-1 block text-sm font-bold tracking-wide text-[#5a3a2a]">种族</label>
                  <select
v-model="form.race" 
                          class="w-full rounded border border-[#d1c1ab] bg-white/60 p-2 text-[#3d3d3d] placeholder-[#a89072] transition-all outline-none focus:border-[#8b7355] focus:bg-white focus:ring-1 focus:ring-[#8b7355]" 
                          @change="resetAttributes">
                    <option v-for="r in Object.keys(raceData)" :key="r" :value="r">{{ r }}</option>
                  </select>
                </div>
              </div>

              <!-- 游戏模式 -->
              <div class="rounded border border-[#8b7355]/20 bg-[#8b7355]/5 p-4">
                <label class="mb-2 block text-sm font-bold tracking-wide text-[#5a3a2a]">游戏模式</label>
                <div class="flex gap-4">
                  <label class="flex cursor-pointer items-center gap-2">
                    <input v-model="form.gameMode" type="radio" value="story" class="accent-[#8b7355]">
                    <span class="font-bold text-[#5a3a2a]">📖 剧情模式</span>
                  </label>
                  <label class="flex cursor-pointer items-center gap-2">
                    <input v-model="form.gameMode" type="radio" value="sandbox" class="accent-[#8b7355]">
                    <span class="font-bold text-[#5a3a2a]">🗡️ 沙盒模式</span>
                  </label>
                </div>
                <p class="mt-2 text-xs text-[#856f5a] italic">
                  {{ form.gameMode === 'story' ? '启用预设剧情条目，体验剧本故事。' : '禁用预设剧情，给予AI完全自由。' }}
                </p>
              </div>

              <!-- 经历投骰 -->
              <div>
                <label class="mb-1 block text-sm font-bold tracking-wide text-[#5a3a2a]">经历 (出身 / 来历 / 邂逅)</label>
                <button
class="w-full rounded border border-[#5a3a2a] bg-[#8b7355] py-2 font-bold text-[#f5f5dc] shadow-sm transition-all hover:bg-[#a0886c] active:translate-y-0.5" 
                        @click="handleRollBackground">
                  🎲 投掷命运之骰 (3 x 2d6)
                </button>
                
                <div v-if="form.background.originName" class="mt-4 border-l-4 border-[#8b7355] bg-white/40 p-4 shadow-sm">
                  <div class="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div class="text-xs text-[#8b7355] uppercase">Origin</div>
                      <div class="text-lg font-bold text-[#3d3d3d]">{{ form.background.originName }}</div>
                    </div>
                    <div>
                      <div class="text-xs text-[#8b7355] uppercase">Past</div>
                      <div class="text-lg font-bold text-[#3d3d3d]">{{ form.background.pastName }}</div>
                    </div>
                    <div>
                      <div class="text-xs text-[#8b7355] uppercase">Encounter</div>
                      <div class="text-lg font-bold text-[#3d3d3d]">{{ form.background.encounterName }}</div>
                    </div>
                  </div>
                  <!-- 职业选择 (如果出身允许) -->
                  <div v-if="availableClasses.length > 0" class="mt-4 border-t border-[#8b7355]/20 pt-3">
                    <label class="mb-1 block text-sm font-bold text-[#5a3a2a]">选择初始职业 (基于出身):</label>
                    <select
v-model="form.selectedClass" 
                            class="w-full rounded border border-[#d1c1ab] bg-white/60 p-2 text-[#3d3d3d] placeholder-[#a89072] transition-all outline-none focus:border-[#8b7355] focus:bg-white focus:ring-1 focus:ring-[#8b7355]">
                      <option value="">-- 请选择 --</option>
                      <option v-for="c in availableClasses" :key="c" :value="c">{{ c }}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧：设定补充 -->
            <div class="col-span-4 flex flex-col">
              <label class="mb-1 block text-sm font-bold tracking-wide text-[#5a3a2a]">身体特征与OC设定</label>
              <textarea
v-model="form.ocDetails" 
                class="w-full flex-1 resize-none rounded border border-[#d1c1ab] bg-[#fffaf0] p-2 text-[#3d3d3d] placeholder-[#a89072] transition-all outline-none focus:border-[#8b7355] focus:bg-white focus:ring-1 focus:ring-[#8b7355]" 
                placeholder="在此输入外貌描述、性格特征、背景故事补充..."></textarea>
            </div>
          </div>
        </div>

        <!-- STEP 2: 能力与技能 -->
        <div v-if="currentStep === 1" class="animate-fade-in">
          <div class="mb-4 flex items-end justify-between">
            <h3 class="text-xl font-bold text-[#5a3a2a]">属性分配</h3>
            <button
class="w-auto rounded border border-[#5a3a2a] bg-[#8b7355] px-8 py-2 font-bold text-[#f5f5dc] shadow-sm transition-all hover:bg-[#a0886c] active:translate-y-0.5" 
                    @click="handleRollAttributes">
              🎲 投掷属性 ({{ form.race }} 修正)
            </button>
          </div>

          <div class="mb-8 grid grid-cols-4 gap-4">
            <div
v-for="(val, key) in form.attributes" :key="key" 
                 class="group relative rounded border border-[#d1c1ab] bg-[#fffaf0] p-3 text-center transition-colors hover:border-[#8b7355]">
              <div class="mb-1 text-xs font-bold text-[#8b7355]">{{ key }}</div>
              <div class="font-serif text-3xl font-bold text-[#3d3d3d]">{{ val }}</div>
              
              <!-- 只有潜力以外的属性可以微调 (如有剩余点数) -->
              <div
v-if="key !== '潜力' && form.attributePool > 0" class="absolute -top-2 -right-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-green-600 text-xs text-white shadow hover:bg-green-500"
                   @click="form.attributes[key]++; form.attributePool--">
                +
              </div>
            </div>
          </div>

          <div v-if="form.attributePool > 0" class="mb-6 text-center font-bold text-green-700">
            ✨ 剩余可分配点数: {{ form.attributePool }}
          </div>

          <div class="rounded border border-[#8b7355]/20 bg-[#8b7355]/10 p-5">
            <h4 class="mb-2 font-bold text-[#5a3a2a]"><i class="fa-solid fa-lightbulb mr-2"></i>天赋与习得技能</h4>
            <div class="flex flex-wrap gap-2">
              <span
v-for="skill in uniqueSkills" :key="skill" 
                    class="rounded border border-[#c59d5f] bg-white px-3 py-1 text-sm font-medium text-[#5a3a2a] shadow-sm">
                {{ skill }}
              </span>
              <span v-if="uniqueSkills.length === 0" class="text-gray-500 italic">暂无技能...</span>
            </div>
          </div>
        </div>

        <!-- STEP 3: 装备购买 -->
        <div v-if="currentStep === 2" class="animate-fade-in flex h-full flex-col">
          <div class="mb-4 flex items-center justify-between rounded border border-[#8b7355]/30 bg-[#8b7355]/10 p-4">
            <span class="text-lg font-bold text-[#5a3a2a]">
              💰 剩余资金: <span class="ml-2 font-serif text-2xl text-[#c0392b]">{{ form.money }}</span> 银币
            </span>
            <div class="flex gap-2">
              <button
v-for="(set, name) in equipmentSets" :key="name" 
                      class="rounded bg-[#6d5b4b] px-3 py-1 text-xs text-[#f5f5dc] transition-colors hover:bg-[#5a4a3a]"
                      :disabled="form.money < set.price"
                      @click="buySet(name)">
                购买 {{ name }} ({{ set.price }})
              </button>
            </div>
          </div>

          <div class="grid flex-1 grid-cols-2 gap-6 overflow-hidden">
            <!-- 商店列表 -->
            <div class="flex flex-col rounded border border-[#d1c1ab] bg-white/30">
              <h4 class="border-b border-[#d1c1ab] bg-[#e6d5c3] p-3 font-bold text-[#5a3a2a]">可选装备</h4>
              <div class="custom-scrollbar flex-1 space-y-2 overflow-y-auto p-2">
                <div v-for="item in equipmentData" :key="item.id" class="flex items-center justify-between rounded border border-transparent bg-white/60 p-2 transition-colors hover:border-[#8b7355]/50">
                  <div>
                    <div class="font-bold text-[#3d3d3d]">{{ item.name }}</div>
                    <div class="text-xs text-[#856f5a]">{{ item.description }}</div>
                  </div>
                  <button
:disabled="form.money < item.price" 
                          class="ml-2 rounded bg-[#8b7355] px-3 py-1 text-sm text-white hover:bg-[#a0886c] disabled:opacity-50"
                          @click="buyItem(item)">
                    {{ item.price }} 银
                  </button>
                </div>
              </div>
            </div>

            <!-- 已购列表 -->
            <div class="flex flex-col rounded border border-[#d1c1ab] bg-white/30">
              <h4 class="border-b border-[#d1c1ab] bg-[#e6d5c3] p-3 font-bold text-[#5a3a2a]">行囊</h4>
              <div class="custom-scrollbar flex-1 space-y-2 overflow-y-auto p-2">
                <div v-for="(item, idx) in form.equipment" :key="idx" class="flex items-center justify-between rounded border border-gray-200 bg-white/60 p-2">
                  <div class="font-bold text-[#3d3d3d]">{{ item.name }}</div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-[#c0392b]">+{{ item.price }} 银</span>
                    <button class="px-2 text-red-600 hover:text-red-800" @click="sellItem(idx)">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
                <div v-if="form.equipment.length === 0" class="mt-10 text-center text-gray-400 italic">
                  背包空空如也...
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 4: 最终确认 -->
        <div v-if="currentStep === 3" class="animate-fade-in flex h-full flex-col">
          <h3 class="mb-4 text-xl font-bold text-[#5a3a2a]">契约预览</h3>
          <textarea
readonly class="custom-scrollbar w-full flex-1 resize-none rounded border-2 border-[#8b7355] bg-[#e9e4d9] p-4 font-mono text-sm text-[#2c2a2a] shadow-inner"
            :value="generateSummary()"></textarea>
          
          <div v-if="validationError" class="mt-4 rounded border border-red-300 bg-red-100 p-2 text-center font-bold text-red-600">
            ⚠ {{ validationError }}
          </div>
        </div>

      </div>

      <!-- 底部操作栏 -->
      <div class="z-10 flex flex-none items-center justify-between border-t border-[#8b7355]/30 bg-[#fdf6ec] p-6">
        <button
:disabled="currentStep === 0" class="rounded border border-[#8b7355] px-6 py-2 font-bold text-[#5a3a2a] transition-colors hover:bg-[#e6d5c3] disabled:opacity-50" 
                @click="prevStep">
          上一步
        </button>
        
        <button
v-if="currentStep < 3" class="transform rounded bg-[#8b7355] px-8 py-2 font-bold text-[#f5f5dc] shadow transition-all hover:-translate-y-0.5 hover:bg-[#7a654a]"
                @click="nextStep">
          下一步
        </button>
        
        <button
v-else :disabled="!!validationError" class="transform rounded bg-linear-to-r from-red-800 to-red-700 px-8 py-3 font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                @click="submit">
          ✒️ 签订契约 (开始游戏)
        </button>
      </div>

    </div>

    <!-- 挂载 3D 骰子 -->
    <Dice3D ref="diceRef" />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { ST_API } from '../../utils/st-bridge';
import Dice3D from './Dice3D.vue';

const emit = defineEmits(['close', 'created']);
const diceRef = ref<InstanceType<typeof Dice3D> | null>(null);

const currentStep = ref(0);
const steps = ['身份确认', '天赋资质', '物资整备', '最终契约'];

// --- 核心数据 (从原 HTML 移植) ---
const raceData: Record<string, any> = {
  '凡人': { attr_rolls: { '力量': '1d3+1', '敏捷': '1d3', '感知': '1d3', '知识': '1d3+1', '魅力': '1d3', '信仰力': '1d3+2', '魔力': '1d3' }, skills: ['过载行动', '武器:投掷武器', '长距离移动'] },
  '矿人': { attr_rolls: { '力量': '1d3+2', '敏捷': '1d3', '感知': '1d3+2', '知识': '1d3-1', '魅力': '1d3+1', '信仰力': '1d3+1', '魔力': '1d3-1' }, skills: ['治愈适性', '夜视', '锻造'] },
  '森人': { attr_rolls: { '力量': '1d3-1', '敏捷': '1d3+1', '感知': '1d3+1', '知识': '1d3+1', '魅力': '1d3', '信仰力': '1d3-1', '魔力': '1d3+1' }, skills: ['武器:弩弓', '夜视', '精灵宠儿'] },
  '蜥蜴人': { attr_rolls: { '力量': '1d3+2', '敏捷': '1d3+1', '感知': '1d3', '知识': '1d3', '魅力': '1d3+1', '信仰力': '1d3', '魔力': '1d3' }, skills: ['免疫强化', '夜视', '龙族血统'] },
  '圃人': { attr_rolls: { '力量': '1d3-1', '敏捷': '1d3+2', '感知': '1d3+1', '知识': '1d3', '魅力': '1d3-1', '信仰力': '1d3', '魔力': '1d3+2' }, skills: ['隐匿', '先发制人', '烹饪'] }
};

const backgroundData: any = {
  origin: {
    '凡人': { 
      2: { name: '冒险者', class: 'any', level: 1 }, 3: { name: '无赖', class: '武道家', level: 1, skills: ['演艺'] },
      4: { name: '猎人', class: '斥候', level: 1, skills: ['怪物知识'] }, 5: { name: '学者', class: '魔术师', level: 1, skills: ['文献调查'] },
      6: { name: '工匠', skills: ['工匠', '手工'] }, 7: { name: '农民', skills: ['生产业:农业', '强健'] },
      8: { name: '商人', skills: ['交涉'], money: '2d6*10' }, 9: { name: '士兵', class: '斥候', level: 1, skills: ['第六感'] },
      10: { name: '骑士', class: '战士', level: 1, skills: ['骑乘'] }, 11: { name: '神官', class: ['神官', '龙祭司', '精灵使'], level: 1, skills: ['祈祷'] },
      12: { name: '贵族', skills: ['统率'], money: '2d6*50' }
    }
  },
  past: { 2: {name:'奴隶', skills:['劳动']}, 3: {name:'牢狱', skills:['犯罪知识']}, 4: {name:'战场', skills:['沉着冷静']}, 5: {name:'神殿', skills:['神学']}, 6: {name:'孤儿', skills:['忍耐']}, 7: {name:'平顺', skills:['幸运']}, 8: {name:'贫困', skills:['生存术']}, 9: {name:'学校', skills:['博识']}, 10: {name:'深闺', skills:['无偏见']}, 11: {name:'奢华', skills:['鉴定']}, 12: {name:'宫廷', skills:['礼仪']} },
  encounter: { 2:'宿敌', 3:'上司', 4:'后辈', 5:'交易对象', 6:'下属', 7:'家人', 8:'挚友', 9:'前辈', 10:'未婚夫/妻', 11:'劲敌', 12:'师父' }
};

// 补全 backgroundData.origin 的引用，防止 key missing
backgroundData.origin['矿人'] = backgroundData.origin['凡人'];
backgroundData.origin['森人'] = backgroundData.origin['凡人'];
backgroundData.origin['蜥蜴人'] = backgroundData.origin['凡人'];
backgroundData.origin['圃人'] = backgroundData.origin['凡人'];

const equipmentData = [
  { id: 'short_sword', name: '短剑', price: 20, category: '武器', description: '轻便单手剑 (1d6)' },
  { id: 'long_sword', name: '长剑', price: 50, category: '武器', description: '标准直刃剑 (1d8)' },
  { id: 'short_bow', name: '短弓', price: 40, category: '武器', description: '小型弓 (1d6)' },
  { id: 'leather_armor', name: '皮甲', price: 30, category: '防具', armor_value: 3, description: '硬化皮革' },
  { id: 'chain_mail', name: '锁子甲', price: 85, category: '防具', armor_value: 5, description: '金属环编织' },
  { id: 'round_shield', name: '圆盾', price: 35, category: '盾牌', armor_value: 2, description: '小型盾牌' },
  { id: 'padded_armor', name: '棉甲', price: 30, category: '防具', armor_value: 2, description: '厚实布甲' },
  { id: 'cloth_armor', name: '布甲', price: 15, category: '防具', armor_value: 1, description: '简单衣物' },
  { id: 'heal_potion', name: '治愈药水', price: 10, category: '道具', description: '恢复 1d6 生命' },
  { id: 'arrows_10', name: '箭矢 (10)', price: 5, category: '道具' },
  { id: 'rations_7', name: '干粮 (7日)', price: 14, category: '道具' },
  { id: 'torch_6', name: '火把 (6)', price: 1, category: '道具' },
  { id: 'adventurer_kit', name: '冒险者套装', price: 10, category: '道具', description: '背包/睡袋/水袋' }
];

const equipmentSets: Record<string, any> = {
  '战士(防御)': { price: 95, items: ['short_sword', 'leather_armor', 'round_shield', 'heal_potion'] },
  '战士(进攻)': { price: 90, items: ['long_sword', 'leather_armor', 'heal_potion'] },
  '游侠': { price: 99, items: ['short_bow', 'padded_armor', 'arrows_10', 'arrows_10', 'adventurer_kit'] },
  '斥候': { price: 90, items: ['short_sword', 'cloth_armor', 'round_shield', 'heal_potion', 'adventurer_kit'] },
};

// --- 响应式状态 ---
const form = reactive({
  name: '',
  gender: '',
  age: '',
  race: '凡人',
  gameMode: 'story',
  ocDetails: '',
  money: 100,
  background: { originName: '', pastName: '', encounterName: '', originObj: null as any },
  selectedClass: '',
  attributes: { '力量': 0, '敏捷': 0, '感知': 0, '知识': 0, '魅力': 0, '信仰力': 0, '魔力': 0, '潜力': 0 },
  attributePool: 0,
  equipment: [] as any[], // 已购物品列表
});

// 计算属性
const availableClasses = computed(() => {
  const origin = form.background.originObj;
  if (!origin || !origin.class) return [];
  if (origin.class === 'any') return ['战士', '武道家', '游侠', '斥候', '魔术师', '神官', '龙祭司', '精灵使'];
  if (Array.isArray(origin.class)) return origin.class;
  return [origin.class];
});

const uniqueSkills = computed(() => {
  const skills: string[] = [];
  // 种族技能
  if (raceData[form.race]?.skills) skills.push(...raceData[form.race].skills);
  // 出身技能
  if (form.background.originObj?.skills) skills.push(...form.background.originObj.skills);
  // 来历技能
  // (暂略，需要把 past 对象也存下来，这里简化演示)
  return [...new Set(skills)];
});

const validationError = computed(() => {
  if (!form.age) return '请填写年龄';
  if (!form.background.originName) return '请投掷经历';
  if (availableClasses.value.length > 0 && !form.selectedClass) return '请选择初始职业';
  if (form.attributes['力量'] === 0) return '请投掷能力值';
  if (form.attributePool > 0) return `请分配完剩余的 ${form.attributePool} 点属性点`;
  return '';
});

// --- 逻辑方法 ---
const resetAttributes = () => {
  // 切换种族时重置属性
  Object.keys(form.attributes).forEach(k => form.attributes[k as keyof typeof form.attributes] = 0);
  form.attributePool = 0;
};

const roll1D6 = () => Math.floor(Math.random() * 6) + 1;
// const roll1D3 = () => { const r = roll1D6(); return Math.ceil(r / 2); };

// 投掷背景
const handleRollBackground = async () => {
  const rolls = Array.from({ length: 6 }, roll1D6);
  await diceRef.value?.roll(6, rolls, '命运之轮转动中...');

  const s1 = rolls[0] + rolls[1];
  const s2 = rolls[2] + rolls[3];
  const s3 = rolls[4] + rolls[5];

  const origin = backgroundData.origin[form.race]?.[s1] || backgroundData.origin['凡人'][s1];
  const past = backgroundData.past[s2];
  const encounter = backgroundData.encounter[s3];

  await diceRef.value?.updateText(`出身: ${origin.name}`);
  await diceRef.value?.updateText(`来历: ${past.name}`);
  await diceRef.value?.updateText(`邂逅: ${encounter}`);

  form.background.originName = origin.name;
  form.background.originObj = origin;
  form.background.pastName = past.name;
  form.background.encounterName = encounter;
  form.selectedClass = ''; // 重置职业

  // 处理出身金钱
  if (origin.money) {
    const diceStr = origin.money; // e.g. '2d6*10'
    const [d, m] = diceStr.split('*');
    const [num, sides] = d.split('d').map(Number);
    let total = 0;
    for(let i=0; i<num; i++) total += Math.floor(Math.random()*sides)+1;
    form.money = 100 + (total * (Number(m)||1));
  } else {
    form.money = 100;
  }

  diceRef.value?.hide();
};

// 投掷属性
const handleRollAttributes = async () => {
  const config = raceData[form.race].attr_rolls; // e.g. { 力量: '1d3+1', ... }
  const rolls = []; // 存储骰子结果用于动画
  let totalPoints = 0;
  
  // 模拟一次性投7个骰子 (每属性1个d6用于计算d3)
  for(let i=0; i<7; i++) rolls.push(roll1D6());
  
  await diceRef.value?.roll(7, rolls, '祈求诸神赐福...');
  
  let i = 0;
  for (const key in config) {
    if (key === '潜力') continue;
    const formula = config[key]; // '1d3+1'
    const mod = parseInt(formula.split('+')[1] || formula.split('-')[1] || '0');
    const isMinus = formula.includes('-');
    const d6 = rolls[i++];
    const d3 = Math.ceil(d6/2);
    const val = isMinus ? Math.max(1, d3 - mod) : d3 + mod;
    
    form.attributes[key as keyof typeof form.attributes] = 1; // 基础值设为1
    totalPoints += val; // 记录总点数池
  }

  // 潜力单独算 (1-3)
  const pot = Math.floor(Math.random() * 3) + 1;
  form.attributes['潜力'] = pot;

  // 设置属性池 (总点数 - 7个属性各占用的1点基础分)
  form.attributePool = totalPoints - 7;

  await diceRef.value?.updateText(`共获得 ${totalPoints} 点数！`);
  diceRef.value?.hide();
};

// 商店逻辑
const buyItem = (item: any) => {
  if (form.money >= item.price) {
    form.money -= item.price;
    form.equipment.push({...item}); // 浅拷贝
  }
};
const sellItem = (index: number) => {
  const item = form.equipment[index];
  form.money += item.price;
  form.equipment.splice(index, 1);
};
const buySet = (setName: string) => {
  const set = equipmentSets[setName];
  if (form.money >= set.price) {
    form.money -= set.price;
    set.items.forEach((id: string) => {
      const it = equipmentData.find(x => x.id === id);
      if(it) form.equipment.push({...it});
    });
  }
};

// 导航
const nextStep = () => { if(currentStep.value < 3) currentStep.value++; }
const prevStep = () => { if(currentStep.value > 0) currentStep.value--; }

// 生成摘要文本
const generateSummary = () => {
  const attrStr = Object.entries(form.attributes).map(([k,v]) => `${k}:${v}`).join(', ');
  const equipStr = form.equipment.map(i => i.name).join(', ') || '无';
  
  return `=== 冒险者契约 ===
姓名: ${form.name || '{{user}}'} (${form.race} ${form.gender} ${form.age}岁)
经历: ${form.background.originName} / ${form.background.pastName} / ${form.background.encounterName}
职业: ${form.selectedClass || '无'}
属性: ${attrStr}
技能: ${uniqueSkills.value.join(', ')}
资产: ${form.money} 银币
装备: ${equipStr}
OC设定: ${form.ocDetails || '无'}
模式: ${form.gameMode === 'story' ? '剧情模式' : '沙盒模式'}`;
};

// 提交！
const submit = async () => {
  if (validationError.value) return;
  
  const finalName = form.name.trim() || '{{user}}';
  const jobRecord = form.selectedClass ? `"${form.selectedClass}": { "当前等级": 1, "最大等级": 10, "当前经验": 0, "升级所需": 1000 }` : '';
  
  // 聚合背包
  const bagMap: Record<string, any> = { '武器':{}, '防具':{}, '饰品':{}, '消耗品':{}, '材料':{} };
  form.equipment.forEach(item => {
    const cat = item.category || '杂物';
    const target = bagMap[cat] || bagMap['材料'];
    if (!target[item.name]) {
      target[item.name] = { 
        name: item.name, 
        type: item.category, 
        description: item.description, 
        quantity: 0,
        armor_value: item.armor_value || 0
      };
    }
    target[item.name].quantity++;
  });

  // 构造 Slash 命令 (核心！)
  const slashCommand = `/send <START>\\nAdmin:\\n这是一个TRPG开局，请为 User 生成一段详尽的背景故事。\\n\\n# 故事核心要求\\n请严格根据以下【角色完整设定】，撰写一段从角色童年到现在的成长故事。故事需要清晰地阐述是什么关键事件或心路历程，最终让他/她确立了要成为一名冒险者的志向。请在故事中自然地融入角色的种族、出身背景、技能和性格特点；接着在设置变量时，请你补全未设置的变量，已有的变量不需要进行更改。\\n\\n# 角色完整设定\\n---\\n## 基础信息\\n- **姓名:** ${finalName}\\n- **性别:** ${form.gender}\\n- **年龄:** ${form.age}\\n- **种族:** ${form.race}\\n\\n## 经历\\n- **出身:** ${form.background.originName}\\n- **来历:** ${form.background.pastName}\\n- **邂逅:** ${form.background.encounterName}\\n\\n## 背景与技能\\n- **初始职业:** ${form.selectedClass}\\n- **初始技能:** ${uniqueSkills.value.join(', ')}\\n\\n## 补充设定 (OC)\\n- **额外补充:** ${form.ocDetails || '无'}\\n\\n## 能力值\\n- **力量:** ${form.attributes['力量']}\\n- **敏捷:** ${form.attributes['敏捷']}\\n- **感知:** ${form.attributes['感知']}\\n- **知识:** ${form.attributes['知识']}\\n- **魅力:** ${form.attributes['魅力']}\\n- **信仰力:** ${form.attributes['信仰力']}\\n- **魔力:** ${form.attributes['魔力']}\\n- **潜力:** ${form.attributes['潜力']}\\n\\n## 初始资产与装备\\n- **资金:** ${form.money} 银币\\n- **装备与物品:** ${form.equipment.map(i=>i.name).join(', ')}\\n\\n<UpdateVariable>
    // == 基础身份 ==
    _.set('主角.姓名', '${finalName}');
    _.set('主角.种族', '${form.race}');
    _.set('主角.经验等级', 1);
    _.set('主角.技能点', 0);

    // == 能力与历练 ==
    _.set('主角.能力', {
      力量: ${form.attributes['力量']},
      敏捷: ${form.attributes['敏捷']},
      感知: ${form.attributes['感知']},
      知识: ${form.attributes['知识']},
      魅力: ${form.attributes['魅力']},
      魔力: ${form.attributes['魔力']},
      信仰力: ${form.attributes['信仰力']},
    });
    
    // == 核心资源 (自动计算) ==
    _.set('主角.生命值.最大值', ${10 + form.attributes['力量'] * 5 + form.attributes['感知'] * 2});
    _.set('主角.生命值.当前值', ${10 + form.attributes['力量'] * 5 + form.attributes['感知'] * 2});
    _.set('主角.体力值.最大值', ${5 + form.attributes['力量'] + form.attributes['敏捷']});
    _.set('主角.体力值.当前值', ${5 + form.attributes['力量'] + form.attributes['敏捷']});
    _.set('主角.魔力值.最大值', ${form.attributes['魔力']});
    _.set('主角.魔力值.当前值', ${form.attributes['魔力']});
    _.set('主角.信仰力值.最大值', ${form.attributes['信仰力']});
    _.set('主角.信仰力值.当前值', ${form.attributes['信仰力']});
    _.set('主角.护甲值.最大值', 0);
    _.set('主角.护甲值.当前值', 0);

    // == 职业与技能 ==
    _.set('主角.职业', { ${jobRecord} });
    
    // == 装备与背包 ==
    _.set('主角.背包', ${JSON.stringify(bagMap)});
    _.set('主角.背包.金钱', { 金币:0, 银币:${form.money}, 铜币:0 });

  </UpdateVariable>\\n\\|\\n/trigger`;

  try {
    const api = ST_API as any;
    if (api.triggerSlash) {
      await api.triggerSlash(slashCommand);
      emit('created');
    } else {
      console.warn("API Unavailable, copying to clipboard");
      navigator.clipboard.writeText(slashCommand);
      alert("API连接失败，命令已复制到剪贴板，请手动粘贴发送！");
    }
  } catch(e) {
    console.error(e);
  }
};
</script>

<style scoped>
/* 简单的进入动画 */
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>