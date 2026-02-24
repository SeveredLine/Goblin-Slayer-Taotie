<template>
  <div
    class="fixed inset-0 z-99999 flex items-center justify-center overflow-hidden bg-[#030303] font-serif text-white select-none"
  >
    <!-- 背景层：动态模糊与宇宙尘埃 -->
    <div class="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen">
      <div
        class="absolute inset-0 animate-pulse bg-[radial-gradient(ellipse_at_center,rgba(60,40,90,0.4)_0%,transparent_60%)] opacity-60 duration-10000"
      ></div>
      <div
        class="absolute inset-0 animate-[spin_120s_linear_infinite] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"
      ></div>
      <div
        class="absolute inset-0 animate-[spin_180s_linear_infinite_reverse] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-15"
      ></div>
    </div>

    <!-- 暗角遮罩 (Vignette) 聚焦中心视觉 -->
    <div
      class="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_20%,#000_100%)]"
    ></div>

    <!-- 内容容器：增加镜头级控制层 -->
    <div class="relative z-20 flex h-full w-full items-center justify-center overflow-hidden perspective-[1500px]">
      <div
        ref="stage"
        class="relative flex h-full w-full max-w-7xl transform-gpu items-center justify-center px-10 text-center"
      >
        <!-- 渲染所有名单，通过 GSAP 控制显隐 -->
        <div
          v-for="(scene, sIndex) in creditsSequence"
          :key="'scene-' + sIndex"
          class="scene-container pointer-events-none absolute inset-0 flex flex-col items-center justify-center opacity-0"
        >
          <!-- 动态标题 (职能) - 电影级长间距 -->
          <div
            class="role-text mb-8 transform-gpu font-serif text-xs font-bold tracking-[0.8em] text-[#a89f91] uppercase drop-shadow-2xl md:mb-14 md:text-xl"
          >
            {{ scene.role }}
          </div>

          <!-- 动态名单列表 -->
          <div
            class="names-container flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-24 md:gap-y-12"
          >
            <div
              v-for="(name, nIndex) in scene.names"
              :key="'name-' + sIndex + '-' + nIndex"
              class="name-group inline-flex transform-gpu"
              :data-style="scene.style"
            >
              <!-- 拆分字符级渲染，实现史诗感字距和打字特效 -->
              <span
                v-for="(char, cIndex) in name.split('')"
                :key="cIndex"
                class="name-char inline-block transform-gpu text-4xl font-black transition-colors sm:text-5xl md:text-6xl lg:text-[5.5rem]"
                :style="{
                  color: scene.color,
                  textShadow: `0 0 15px ${scene.color}66, 0 0 30px ${scene.color}33`,
                  marginRight: char === ' ' ? '0.4em' : '0',
                }"
              >
                {{ char === ' ' ? '' : char }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 跳过提示 - 高级磨砂玻璃质感按钮 -->
    <button
      class="group absolute right-8 bottom-8 z-30 cursor-pointer overflow-hidden rounded border border-white/20 bg-black/40 px-6 py-2 text-[10px] tracking-[0.3em] text-white/50 uppercase backdrop-blur-md transition-all duration-700 hover:border-white/60 hover:bg-white/10 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
      @click="skip"
    >
      <span class="relative z-10 block transition-transform group-hover:scale-110">[ Skip Sequence ]</span>
      <div
        class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
      ></div>
    </button>

    <!-- 电影级进度条 - 细长发光线条 -->
    <div class="absolute bottom-0 left-0 z-30 h-0.5 w-full bg-white/5">
      <div
        ref="progressBar"
        class="relative h-full w-0 bg-linear-to-r from-transparent via-[#c59d5f] to-[#ffdeb3] shadow-[0_0_10px_#c59d5f]"
      >
        <!-- 进度条头部发光点 -->
        <div class="absolute top-1/2 right-0 h-1 w-3.75 -translate-y-1/2 bg-white blur-[2px]"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

const emit = defineEmits<{
  (e: 'complete'): void;
}>();

const stage = ref<HTMLElement | null>(null);
const progressBar = ref<HTMLElement | null>(null);
let masterTl: gsap.core.Timeline | null = null;

// 名单配置
const creditsSequence = [
  { role: 'ORIGINAL AUTHOR', names: ['Elainades'], color: '#FFD700', style: 'hero' },
  {
    role: 'CORE ARCHITECTS & LOGIC',
    names: ['Keil', '11', 'KKKKKK_0735', 'Sulfurzero', 'USS Essex CV-9'],
    color: '#00F0FF',
    style: 'grid',
  },
  { role: 'VISUALS & AESTHETICS', names: ['龙使者德丽莎', '热水壶', 'エル'], color: '#FF0055', style: 'glitch' },
  {
    role: 'WORLD BUILDERS & SCENARIO',
    names: ['Italian Pasta', '露琪诺', 'K1nn', 'S15萌新', 'Gemini114514'],
    color: '#50C878',
    style: 'cloud',
  },
  {
    role: 'CHARACTERS & STORIES',
    names: ['Glen0822', '烁寒', '露琪亚', '哈气咪', 'Shiyue137', 'Tttk2929'],
    color: '#E0B0FF',
    style: 'cloud',
  },
  {
    role: 'SPECIAL THANKS',
    names: ['快乐柠檬茶', 'Hsuika·赤猫肆号', '黑森森', '梦星宝子', 'AA', 'Boss', 'Shin'],
    color: '#FFA500',
    style: 'cloud',
  },
  { role: 'VALHALLA (LEGACY)', names: ['Qwerty', 'LunaGlaze'], color: '#808080', style: 'fade' },
  { role: 'PRESENTED BY', names: ['THE FOUR DICE WORLD', 'ZOD EDITION'], color: '#ffffff', style: 'final' },
];

// --- 动画编排 ---
const playSequence = async () => {
  if (!stage.value) return;

  // Ensure Vue has fully rendered the elements before querying
  await nextTick();

  const scenes = stage.value.querySelectorAll('.scene-container');

  masterTl = gsap.timeline({
    onComplete: finish,
    onUpdate: function () {
      if (progressBar.value) {
        gsap.set(progressBar.value, { width: `${this.progress() * 100}%` });
      }
    },
  });

  scenes.forEach((sceneEl, index) => {
    const roleText = sceneEl.querySelector('.role-text');
    const nameGroups = sceneEl.querySelectorAll('.name-group');
    const nameChars = sceneEl.querySelectorAll('.name-char'); // 用于字符级高级动画

    // 为了实现交错复杂的独立动画，有些情况我们会同时使用字级别和组级别
    const styleType = nameGroups[0]?.getAttribute('data-style') || 'fade';

    // 我们在这个子时间轴构建完整的起承转合
    const sceneTl = gsap.timeline();

    // 初始化场景显现（解决重叠时无意间的相互阻挡）
    sceneTl.set(sceneEl, { opacity: 1, pointerEvents: 'auto' });

    // --- 【1】相机运动 (全局舞台联动) ---
    // 根据是哪一种场景，给整个舞台施加一个非常缓慢的 3D 漂移/推进，模拟斯坦尼康或者摇臂
    // 在子场景开始时将 stage 设置到起始位置，并在该场景的持续时间内运动
    if (index % 2 === 0) {
      sceneTl.fromTo(
        stage.value,
        { rotationY: -5, rotationX: 2, z: -100 },
        { rotationY: 5, rotationX: -2, z: 150, duration: 4.5, ease: 'sine.inOut' },
        0,
      );
    } else {
      sceneTl.fromTo(
        stage.value,
        { rotationY: 5, rotationX: -2, z: -150 },
        { rotationY: -5, rotationX: 2, z: 100, duration: 4.5, ease: 'sine.inOut' },
        0,
      );
    }

    // --- 【2】职能前置介绍 ---
    // 高级微电影质感：极大字距 + 严重模糊的迅速对焦
    sceneTl.fromTo(
      roleText,
      { opacity: 0, y: 40, filter: 'blur(15px)', letterSpacing: '0.2em', scale: 0.9 },
      { opacity: 1, y: 0, filter: 'blur(0px)', letterSpacing: '0.8em', scale: 1, duration: 1.5, ease: 'expo.out' },
      0.1,
    );

    // --- 【3】核心姓名动画：极致多样化 ---
    if (styleType === 'hero') {
      // Hero: 碎片聚合，极端的 Z 轴深度和强烈的动态模糊
      sceneTl.fromTo(
        nameChars,
        {
          opacity: 0,
          scale: 4,
          z: 800,
          filter: 'blur(30px)',
          rotationX: () => gsap.utils.random(-80, 80),
          rotationY: () => gsap.utils.random(-80, 80),
        },
        {
          opacity: 1,
          scale: 1,
          z: 0,
          filter: 'blur(0px)',
          rotationX: 0,
          rotationY: 0,
          duration: 1.8,
          stagger: { amount: 0.8, from: 'random' },
          ease: 'power4.out',
        },
        0.4,
      );
    } else if (styleType === 'grid') {
      // Grid: 赛博朋克风格打字机伴随翻转，单词级别强硬切入
      sceneTl.fromTo(
        nameGroups,
        { opacity: 0, y: 120, rotationX: -90, filter: 'contrast(2) brightness(0)' },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          filter: 'contrast(1) brightness(1)',
          duration: 1.2,
          stagger: 0.15,
          ease: 'back.out(2)',
        },
        0.4,
      );
      // 每个字符在被翻出时瞬间闪亮
      sceneTl.fromTo(
        nameChars,
        { color: '#ffffff', textShadow: '0 0 40px #fff' },
        { color: '', textShadow: '', duration: 0.5, stagger: 0.05, ease: 'power2.out' },
        0.5,
      );
    } else if (styleType === 'glitch') {
      // Glitch: 故障切入，剧烈的失真错位
      sceneTl.fromTo(
        nameGroups,
        { opacity: 0, scale: 1.05, filter: 'blur(20px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power2.inOut' },
        0.3,
      );
      sceneTl.fromTo(
        nameChars,
        { opacity: 0, x: () => gsap.utils.random(-50, 50), skewX: () => gsap.utils.random(-40, 40) },
        { opacity: 1, x: 0, skewX: 0, duration: 0.2, stagger: { amount: 0.4, from: 'random' } },
        0.4,
      );
      // 中途脉冲干扰
      sceneTl.to(
        nameChars,
        {
          duration: 0.1,
          skewX: () => gsap.utils.random(-15, 15),
          x: () => gsap.utils.random(-5, 5),
          filter: 'hue-rotate(90deg) brightness(2)',
          repeat: 3,
          yoyo: true,
          stagger: 0.02,
        },
        1.2,
      );
    } else if (styleType === 'cloud') {
      // Cloud: 墨水晕染，极其轻柔缥缈，缓慢上升显现
      sceneTl.fromTo(
        nameChars,
        { opacity: 0, y: 50, filter: 'blur(20px) contrast(0.5)', scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px) contrast(1)',
          scale: 1,
          duration: 2.5,
          stagger: { amount: 1.5, from: 'edges' },
          ease: 'sine.out',
        },
        0.3,
      );
    } else if (styleType === 'final') {
      // Final: 史诗揭示，宏大缓慢的全局光效
      sceneTl.fromTo(
        nameGroups,
        { opacity: 0, scale: 0.8, filter: 'blur(25px) brightness(3)', y: 20 },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px) brightness(1)',
          y: 0,
          duration: 3.5,
          stagger: 0.6,
          ease: 'power2.out',
        },
        0.4,
      );
      // 让字母之间产生呼吸感
      sceneTl.fromTo(
        nameChars,
        { letterSpacing: '0.5em' },
        { letterSpacing: 'normal', duration: 4, ease: 'power3.out' },
        0.4,
      );
    } else {
      // 默认 Fade: 像夜空中星辰点亮，带有随机旋转的浮动
      sceneTl.fromTo(
        nameChars,
        { opacity: 0, filter: 'blur(10px)', rotationZ: () => gsap.utils.random(-15, 15), scale: 0.8 },
        {
          opacity: 1,
          filter: 'blur(0px)',
          rotationZ: 0,
          scale: 1,
          duration: 1.8,
          stagger: { amount: 1.2, from: 'random' },
          ease: 'power2.out',
        },
        0.4,
      );
    }

    // --- 【4】悬停观赏 (Hold) ---
    // 根据风格设置不同的观赏停留期
    const holdDuration = styleType === 'final' ? 4.5 : 2.5;
    sceneTl.to({}, { duration: holdDuration });

    // --- 【5】优雅离场 (Dissolve Exit) ---
    const exitDuration = 1.0;

    // 标题散去
    sceneTl.to(roleText, {
      opacity: 0,
      y: -30,
      filter: 'blur(15px)',
      letterSpacing: '0.4em',
      duration: exitDuration,
      ease: 'power2.in',
    });

    // 根据是否具有逐字特效，选择目标进行离场
    const exitTargets = nameChars.length && styleType !== 'grid' && styleType !== 'final' ? nameChars : nameGroups;

    sceneTl.to(
      exitTargets,
      {
        opacity: 0,
        z: 400, // 向前冲出镜头
        filter: 'blur(20px)',
        scale: 1.2,
        duration: exitDuration + 0.2,
        stagger: { amount: 0.3, from: 'center' },
        ease: 'power2.in',
      },
      `<`,
    );

    // 收尾，清理事件穿透
    sceneTl.set(sceneEl, { opacity: 0, pointerEvents: 'none' });

    // --- 【6】注入主轴，重叠衔接 ---
    // 第一个场景马上播放，后续所有场景都会在*前一个场景离场开始时*提前 0.8 秒切入
    // 这将实现类似电影中的镜头无缝交织
    const overlapObj = index === 0 ? '+=0' : '-=0.8';
    masterTl!.add(sceneTl, overlapObj);
  });
};

const finish = () => {
  if (masterTl) masterTl.kill();
  gsap.to(stage.value, { scale: 1.5, opacity: 0, duration: 1, onComplete: () => emit('complete') });
};

const skip = () => {
  if (masterTl) masterTl.kill();
  emit('complete');
};

onMounted(() => {
  // Add slight delay to ensure DOM is ready and fonts loaded
  setTimeout(() => {
    playSequence();
  }, 100);
});

onBeforeUnmount(() => {
  if (masterTl) masterTl.kill();
});
</script>

<style scoped>
.scene-container {
  /* Ensuring scenes perfectly overlap in the center */
  transform-style: preserve-3d;
}
</style>
