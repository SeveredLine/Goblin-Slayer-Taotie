<template>
  <div ref="container" class="flex flex-col gap-6 text-[#d0c0a0]">
    <!-- 上半部分：雷达图 (左) + 纸娃娃 (右) -->
    <!-- 这里用了 CSS Grid 模拟你的参考图布局 -->
    <div class="flex h-80 gap-2">
      <!-- 1. 雷达图区域 -->
      <div
        class="hero-stats-panel relative flex w-1/2 flex-col items-center justify-center rounded border border-[#4a3e35] bg-[#00000033]"
      >
        <h3 class="absolute top-2 left-3 text-xs font-bold tracking-widest text-[#8b7355]">ATTRIBUTES</h3>

        <!-- 自定义 SVG 雷达图 -->
        <svg viewBox="0 0 200 200" class="h-full w-full p-4 drop-shadow-[0_0_10px_rgba(197,157,95,0.3)]">
          <!-- 背景网格 (5边形) -->
          <polygon points="100,20 176,76 147,164 53,164 24,76" fill="none" stroke="#333" stroke-width="1" />
          <polygon points="100,40 157,82 135,148 65,148 43,82" fill="none" stroke="#333" stroke-width="1" />
          <polygon points="100,60 138,88 123,132 77,132 62,88" fill="none" stroke="#333" stroke-width="1" />

          <!-- 动态数据多边形 -->
          <polygon
            ref="radarPoly"
            :points="radarPoints"
            fill="rgba(197, 157, 95, 0.2)"
            stroke="#c59d5f"
            stroke-width="2"
            class="origin-center transform transition-none"
          />

          <!-- 顶点圆点 -->
          <circle v-for="(p, i) in radarCoords" :key="i" :cx="p.x" :cy="p.y" r="3" fill="#fff" class="radar-dot" />

          <!-- 标签 -->
          <text x="100" y="15" text-anchor="middle" fill="#aaa" font-size="10">STR</text>
          <text x="185" y="75" text-anchor="middle" fill="#aaa" font-size="10">AGI</text>
          <text x="155" y="180" text-anchor="middle" fill="#aaa" font-size="10">PER</text>
          <text x="45" y="180" text-anchor="middle" fill="#aaa" font-size="10">INT</text>
          <text x="15" y="75" text-anchor="middle" fill="#aaa" font-size="10">CHR</text>
        </svg>
      </div>

      <!-- 2. 纸娃娃装备栏 -->
      <div
        class="hero-stats-panel relative flex w-1/2 flex-col items-center rounded border border-[#4a3e35] bg-[#2a221e] bg-[url('https://www.transparenttextures.com/patterns/leather.png')]"
      >
        <div
          class="hero-name mt-2 mb-4 w-3/4 border-b border-[#c59d5f]/30 text-center font-serif text-lg text-[#c59d5f]"
        >
          {{ hero.姓名 || 'Unknown' }}
        </div>

        <!-- 人体轮廓 (可以用图片替换) -->
        <div class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
          <i class="fa-solid fa-person text-[180px] text-black"></i>
        </div>

        <!-- 装备槽位 (Grid 布局) -->
        <div class="relative z-10 grid w-full grid-cols-2 gap-x-12 gap-y-2 px-4">
          <EquipSlot class="equip-slot" icon="fa-helmet-safety" :item="hero.装备?.防具?.头部" />
          <!-- 头 -->
          <EquipSlot class="equip-slot" icon="fa-gem" :item="hero.装备?.饰品?.项链" />
          <!-- 颈 -->

          <EquipSlot class="equip-slot" icon="fa-shirt" :item="hero.装备?.防具?.身体" />
          <!-- 胸 -->
          <EquipSlot class="equip-slot" icon="fa-mitten" :item="hero.装备?.防具?.手部" />
          <!-- 手 -->

          <EquipSlot class="equip-slot" icon="fa-khanda" :item="hero.装备?.武器?.主手" />
          <!-- 主手 -->
          <EquipSlot class="equip-slot" icon="fa-shield-halved" :item="hero.装备?.武器?.副手" />
          <!-- 副手 -->

          <EquipSlot class="equip-slot" icon="fa-socks" :item="hero.装备?.防具?.腿部" />
          <!-- 腿 -->
          <EquipSlot class="equip-slot" icon="fa-boot" :item="hero.装备?.防具?.脚部" />
          <!-- 脚 -->
        </div>
      </div>
    </div>

    <!-- 下半部分：玻璃血条 (Vials) -->
    <div class="flex justify-between gap-4 px-2">
      <!-- HP Vial -->
      <div
        class="vial-panel group relative flex flex-1 items-center gap-3 overflow-hidden rounded-lg border border-[#4a3e35] bg-[#0c0a0a] p-3"
      >
        <div class="relative h-24 w-4 overflow-hidden rounded-full border border-[#555] bg-[#222]">
          <div
            ref="hpBar"
            class="absolute bottom-0 w-full bg-linear-to-t from-red-900 to-red-600"
            :style="{ height: '0%' }"
          ></div>
          <!-- 玻璃高光 -->
          <div class="absolute top-0 left-0 h-full w-1/2 bg-white/10"></div>
        </div>
        <div class="z-10 flex flex-col">
          <span class="text-lg font-bold text-red-500 drop-shadow-md">{{ currentHP }} / {{ maxHP }}</span>
          <span class="text-xs tracking-wider text-gray-500">HEALTH</span>
        </div>
        <!-- 底部发光装饰 -->
        <div
          class="absolute bottom-0 left-0 h-1/2 w-full bg-red-900/10 blur-xl transition-colors group-hover:bg-red-900/20"
        ></div>
      </div>

      <!-- MP Vial -->
      <div
        class="vial-panel group relative flex flex-1 flex-row-reverse items-center gap-3 overflow-hidden rounded-lg border border-[#4a3e35] bg-[#0c0a0a] p-3"
      >
        <div class="relative h-24 w-4 overflow-hidden rounded-full border border-[#555] bg-[#222]">
          <div
            ref="mpBar"
            class="absolute bottom-0 w-full bg-linear-to-t from-blue-900 to-blue-500"
            :style="{ height: '0%' }"
          ></div>
          <div class="absolute top-0 left-0 h-full w-1/2 bg-white/10"></div>
        </div>
        <div class="z-10 flex flex-col items-end">
          <span class="text-lg font-bold text-blue-400 drop-shadow-md">{{ currentMP }} / {{ maxMP }}</span>
          <span class="text-xs tracking-wider text-gray-500">MANA</span>
        </div>
        <div
          class="absolute right-0 bottom-0 h-1/2 w-full bg-blue-900/10 blur-xl transition-colors group-hover:bg-blue-900/20"
        ></div>
      </div>
    </div>

    <!-- Buffs / Skills 缩略 -->
    <div class="buffs-panel border-t border-[#4a3e35] pt-4">
      <h4 class="mb-2 text-xs font-bold tracking-wider text-[#c59d5f] uppercase">Active Effects</h4>
      <div class="custom-scrollbar flex gap-2 overflow-x-auto pb-2">
        <div
          v-for="n in 5"
          :key="n"
          class="buff-icon flex h-8 w-8 cursor-help items-center justify-center rounded border border-[#444] bg-[#222] hover:border-[#c59d5f]"
        >
          <i class="fa-solid fa-bolt text-xs text-gray-400"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { computed, onMounted, ref } from 'vue';
import { useHeroStore } from '../../stores/useHeroStore';
import EquipSlot from './EquipSlot.vue'; // 下面会写这个小组件

const store = useHeroStore();
const hero = computed(() => store.heroData || {});

// 属性计算 (Zod 结构: hero.能力.力量)
const attrs = computed(() => hero.value.能力 || {});

// 雷达图计算逻辑 (5维: 力, 敏, 感, 知, 魅)
// 注意：你需要根据实际属性名调整映射
const radarValues = computed(() => [
  attrs.value.力量 || 0,
  attrs.value.敏捷 || 0,
  attrs.value.感知 || 0,
  attrs.value.知识 || 0,
  attrs.value.魅力 || 0,
]);

const radarCoords = computed(() => {
  const total = 5;
  const radius = 70; // 半径
  const center = 100; // SVG 中心
  const maxVal = 10; // 假设最大属性为 10

  return radarValues.value.map((val, i) => {
    const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
    const norm = Math.min(val, maxVal) / maxVal;
    return {
      x: center + Math.cos(angle) * radius * norm,
      y: center + Math.sin(angle) * radius * norm,
    };
  });
});

const radarPoints = computed(() => {
  return radarCoords.value.map(p => `${p.x},${p.y}`).join(' ');
});

// HP/MP 计算
const currentHP = computed(() => hero.value.生命值?.当前值 || 0);
const maxHP = computed(() => hero.value.生命值?.最大值 || 1);
const hpPercent = computed(() => (maxHP.value > 0 ? (currentHP.value / maxHP.value) * 100 : 0));

const currentMP = computed(() => hero.value.魔力值?.当前值 || 0);
const maxMP = computed(() => hero.value.魔力值?.最大值 || 1);
const mpPercent = computed(() => (maxMP.value > 0 ? (currentMP.value / maxMP.value) * 100 : 0));

// GSAP Refs
const container = ref<HTMLElement | null>(null);
const radarPoly = ref<SVGPolygonElement | null>(null);
const hpBar = ref<HTMLElement | null>(null);
const mpBar = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!container.value) return;

  const tl = gsap.timeline();

  // Panels slide in
  const panels = container.value.querySelectorAll('.hero-stats-panel');
  tl.fromTo(panels, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' });

  // Radar animation
  if (radarPoly.value) {
    tl.fromTo(
      radarPoly.value,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.5)' },
      '<0.2',
    );
  }

  const radarDots = container.value.querySelectorAll('.radar-dot');
  tl.fromTo(
    radarDots,
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, stagger: 0.05, duration: 0.3, ease: 'back.out(2)' },
    '<0.4',
  );

  // Equip slots pop in
  const slots = container.value.querySelectorAll('.equip-slot');
  tl.fromTo(
    slots,
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, stagger: 0.05, duration: 0.4, ease: 'power2.out' },
    '<0.2',
  );

  // Vials reveal
  const vials = container.value.querySelectorAll('.vial-panel');
  tl.fromTo(vials, { opacity: 0, x: -20 }, { opacity: 1, x: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' });

  // HP/MP bars fill
  if (hpBar.value) {
    tl.to(hpBar.value, { height: hpPercent.value + '%', duration: 1, ease: 'power3.out' }, '<0.2');
  }
  if (mpBar.value) {
    tl.to(mpBar.value, { height: mpPercent.value + '%', duration: 1, ease: 'power3.out' }, '<0.1');
  }

  // Buff icons fade in
  const buffsPanel = container.value.querySelector('.buffs-panel');
  const buffIcons = container.value.querySelectorAll('.buff-icon');
  if (buffsPanel) {
    tl.fromTo(buffsPanel, { opacity: 0 }, { opacity: 1, duration: 0.3 }, '<');
  }
  if (buffIcons.length) {
    tl.fromTo(
      buffIcons,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, stagger: 0.05, duration: 0.4, ease: 'back.out(1.2)' },
      '<',
    );
  }
});
</script>
