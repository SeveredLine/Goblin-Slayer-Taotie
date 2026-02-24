<template>
  <div
    class="fixed inset-0 z-99999 flex items-center justify-center overflow-hidden bg-black font-serif text-white selection:bg-transparent"
  >
    <div class="pointer-events-none absolute inset-0 z-0 opacity-60">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,50,50,0.2)_0%,#000_80%)]"></div>
      <div
        ref="bgStars"
        class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40 mix-blend-screen"
      ></div>
    </div>

    <div
      ref="flashOverlay"
      class="pointer-events-none absolute inset-0 z-100 bg-white opacity-0 mix-blend-overlay"
    ></div>

    <div
      ref="noiseOverlay"
      class="pointer-events-none absolute inset-0 z-50 hidden bg-[url('https://assets.codepen.io/13471/noise.png')] opacity-10 mix-blend-overlay"
    ></div>

    <div class="relative z-10 flex h-full w-full items-center justify-center perspective-[2000px]">
      <div
        ref="stage"
        class="relative flex h-full w-full max-w-screen-2xl transform-gpu items-center justify-center px-4 text-center"
      >
        <div
          v-for="(scene, index) in creditsSequence"
          :key="index"
          :ref="el => (sceneRefs[index] = el as HTMLElement)"
          class="scene-wrapper absolute flex w-full flex-col items-center justify-center opacity-0 will-change-transform"
          :data-style="scene.style"
        >
          <div
            class="role-text mb-6 font-mono text-xs font-bold tracking-[0.2em] text-[#888] uppercase md:mb-12 md:text-sm md:tracking-[0.5em] lg:text-lg lg:tracking-[1em]"
          >
            {{ scene.role }}
          </div>

          <div
            class="names-wrapper flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-4 px-2 md:gap-x-12 md:gap-y-6 md:px-10"
          >
            <div
              v-for="(name, nIndex) in scene.names"
              :key="nIndex"
              class="name-text text-center leading-tight font-black tracking-widest wrap-break-word uppercase"
              :style="{
                '-webkit-text-stroke': scene.style === 'slam' ? '0px' : '1px ' + scene.color,
                color: scene.style === 'slam' ? '#ffffff' : 'transparent',
                textShadow: scene.style === 'slam' ? '0 0 30px rgba(255,255,255,0.8)' : 'none',
                fontSize:
                  scene.style === 'slam' || scene.style === 'hero'
                    ? 'clamp(2rem, 6vw, 7rem)'
                    : 'clamp(1.2rem, 3.5vw, 4.5rem)',
              }"
            >
              {{ name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <button
      class="group absolute right-6 bottom-6 z-200 cursor-pointer overflow-hidden rounded-sm border border-white/10 bg-black/80 px-6 py-2 font-mono text-[10px] tracking-[0.25em] text-white/40 transition-all duration-500 hover:border-white/80 hover:bg-white hover:text-black md:right-10 md:bottom-10 md:px-8 md:py-3 md:text-xs"
      @click="skip"
    >
      <span class="relative z-10 block">SKIP</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { CustomWiggle } from 'gsap/CustomWiggle';
import { RoughEase } from 'gsap/EasePack';
import { Physics2DPlugin } from 'gsap/Physics2DPlugin';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { SplitText } from 'gsap/SplitText';
import { TextPlugin } from 'gsap/TextPlugin';
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

gsap.registerPlugin(CustomEase, CustomWiggle, RoughEase, ScrambleTextPlugin, SplitText, Physics2DPlugin, TextPlugin);

const emit = defineEmits<{ (e: 'complete'): void }>();

const sceneRefs = ref<HTMLElement[]>([]);
const stage = ref<HTMLElement | null>(null);
const bgStars = ref<HTMLElement | null>(null);
const flashOverlay = ref<HTMLElement | null>(null);

let ctx: gsap.Context;

const creditsSequence = [
  { role: 'ORIGINAL AUTHOR', names: ['Elainades'], color: '#ffffff', style: 'hero' },
  {
    role: 'CORE ARCHITECTS & LOGIC',
    names: ['Keil', '11', 'KKKKKK_0735', 'Sulfurzero', 'USS Essex CV-9'],
    color: '#00F0FF',
    style: 'cyber',
  },
  { role: 'VISUALS & AESTHETICS', names: ['龙使者德丽莎', '热水壶', 'エル'], color: '#FF0055', style: 'glitch' },
  {
    role: 'WORLD BUILDERS & SCENARIO',
    names: ['Italian Pasta', '露琪诺', 'K1nn', 'S15萌新', 'Gemini114514'],
    color: '#50C878',
    style: 'kinetic',
  },
  {
    role: 'CHARACTERS & STORIES',
    names: ['Glen0822', '烁寒', '露琪亚', '哈气咪', 'Shiyue137', 'Tttk2929'],
    color: '#E0B0FF',
    style: 'float',
  },
  {
    role: 'SPECIAL THANKS',
    names: ['快乐柠檬茶', 'Hsuika·赤猫肆号', '黑森森', '梦星宝子', 'AA', 'Boss', 'Shin'],
    color: '#FFA500',
    style: 'particles',
  },
  { role: 'VALHALLA', names: ['qwerty', 'LunaGlaze'], color: '#A9A9A9', style: 'float' },
  // style: slam 将触发特殊渐变逻辑
  { role: 'PRESENTED BY', names: ['THE FOUR DICE WORLD', 'ZOD EDITION'], color: '#ffffff', style: 'slam' },
];

const initAnimation = async () => {
  await nextTick();

  ctx = gsap.context(() => {
    // 背景旋转
    gsap.to(bgStars.value, {
      rotation: 360,
      duration: 200,
      ease: 'none',
      repeat: -1,
    });

    const masterTl = gsap.timeline({
      onComplete: finish,
      defaults: { ease: 'power3.inOut' },
    });

    masterTl.set(stage.value, { scale: 1.1, autoAlpha: 1 });
    // 开场闪光
    masterTl
      .to(flashOverlay.value, { opacity: 1, duration: 0.05, ease: 'power4.in' })
      .to(flashOverlay.value, { opacity: 0, duration: 1.5, ease: 'power2.out' }, '+=0');

    sceneRefs.value.forEach((scene, i) => {
      const config = creditsSequence[i];
      const role = scene.querySelector('.role-text');
      const nameElements = scene.querySelectorAll('.name-text');

      const tl = gsap.timeline();

      let splitRole: SplitText | null = null;
      let splitNames: SplitText | null = null;

      // Slam 模式下我们不拆分文字，保持整体以应用渐变
      if (config.style !== 'slam') {
        splitRole = new SplitText(role, { type: 'chars,words' });
        splitNames = new SplitText(nameElements, { type: 'chars,words' });
      }

      tl.set(scene, { autoAlpha: 1, z: 0 });

      // --- 动画逻辑分支 ---

      if (config.style === 'hero') {
        tl.from(splitNames!.chars, {
          duration: 2,
          opacity: 0,
          scale: 0,
          y: 80,
          rotationX: 180,
          transformOrigin: '0% 50% -50',
          ease: 'back.out(1.7)',
          stagger: 0.05,
        }).to(
          role,
          {
            duration: 1.5,
            scrambleText: { text: config.role, chars: 'XOvx#', revealDelay: 0.5, tweenLength: false },
          },
          '<',
        );
      } else if (config.style === 'cyber') {
        tl.set(nameElements, { color: config.color, textShadow: `0 0 20px ${config.color}` });

        // 增加颜色变幻效果
        gsap.to(nameElements, {
          color: '#A020F0', // 变紫
          textShadow: '0 0 25px #A020F0',
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: 0.2,
        });

        tl.from(splitNames!.chars, {
          duration: 0.6,
          opacity: 0,
          x: 100,
          autoAlpha: 0,
          stagger: { amount: 0.5, from: 'random' },
          ease: 'steps(12)',
        }).from(role, { duration: 0.5, opacity: 0, letterSpacing: '2em' }, '<');
      } else if (config.style === 'glitch') {
        CustomWiggle.create('glitchWiggle', { wiggles: 20, type: 'uniform' });
        tl.set(nameElements, { color: 'white' });

        // 增加随机颜色Glitch
        tl.to(
          nameElements,
          {
            color: () => (Math.random() > 0.5 ? config.color : '#FFFFFF'),
            duration: 0.1,
            repeat: 10,
            yoyo: true,
          },
          0,
        );

        tl.from(splitNames!.chars, {
          duration: 0.2,
          opacity: 0,
          scale: 2,
          filter: 'blur(10px)',
          stagger: { amount: 0.3, from: 'center' },
        }).to(
          splitNames!.chars,
          {
            duration: 0.8,
            x: 5,
            y: -5,
            color: config.color,
            ease: 'glitchWiggle',
            stagger: { amount: 0.5, from: 'random' },
          },
          '<+0.1',
        );
      } else if (config.style === 'kinetic') {
        tl.from(splitNames!.chars, {
          duration: 1.2,
          y: 200,
          rotationZ: 90,
          opacity: 0,
          ease: 'expo.out',
          stagger: 0.03,
        });
      } else if (config.style === 'particles') {
        tl.from(splitNames!.chars, {
          duration: 2.5,
          physics2D: {
            velocity: 600,
            angle: 'random(-180, 0)',
            gravity: 500,
          },
          opacity: 0,
          scale: 0,
          stagger: 0.02,
        });
      } else if (config.style === 'slam') {
        tl.set(nameElements, { opacity: 0 });
        tl.fromTo(role, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5 });

        if (nameElements[0]) {
          // 第一行：纯白强光砸下
          tl.fromTo(
            nameElements[0],
            { scale: 5, z: 500, opacity: 0, textShadow: '0 0 100px #ffffff' },
            {
              scale: 1,
              z: 0,
              opacity: 1,
              textShadow: '0 0 30px rgba(255,255,255,0.8)',
              duration: 0.3,
              ease: 'power4.in',
            },
          );
          tl.add(() => {
            gsap.fromTo(flashOverlay.value, { opacity: 0.3, mixBlendMode: 'overlay' }, { opacity: 0, duration: 0.5 });
            gsap.fromTo(stage.value, { y: 10 }, { y: 0, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
          });
        }

        tl.addLabel('slam2', '+=0.3');

        if (nameElements[1]) {
          // 第二行：将 ZOD EDITION 拆分为单个字母
          const splitZod = new SplitText(nameElements[1], { type: 'chars' });

          // 定义一组高饱和度的赛博霓虹纯色
          const neonColors = [
            '#FF0055',
            '#00F0FF',
            '#50C878',
            '#E0B0FF',
            '#FFA500',
            '#FF3366',
            '#FFFF00',
            '#9933FF',
            '#FF0000',
            '#00FF00',
          ];

          // 给每个字母单独上色和发光阴影
          gsap.set(splitZod.chars, {
            color: i => neonColors[i % neonColors.length],
            textShadow: i => `0 0 20px ${neonColors[i % neonColors.length]}`,
          });

          // 整体包裹框砸下（不影响内部子元素的颜色）
          tl.fromTo(
            nameElements[1],
            { scale: 8, z: 800, opacity: 0 },
            { scale: 1, z: 0, opacity: 1, duration: 0.35, ease: 'power4.in' },
            'slam2',
          );

          tl.add(() => {
            gsap.fromTo(
              flashOverlay.value,
              { opacity: 1, mixBlendMode: 'normal', backgroundColor: 'white' },
              {
                opacity: 0,
                duration: 2.5,
                ease: 'power2.out',
                onComplete: () => {
                  if (flashOverlay.value) flashOverlay.value.style.mixBlendMode = 'overlay';
                },
              },
            );
            gsap.fromTo(
              stage.value,
              { x: -15, y: 15, scale: 1.05 },
              { x: 0, y: 0, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.3)' },
            );
          }, 'slam2+=0.3');
        }

        tl.to(nameElements, { letterSpacing: '0.1em', duration: 4, ease: 'power1.out' }, 'slam2');
      } else {
        // Default Float style
        tl.from(splitNames!.chars, {
          opacity: 0,
          filter: 'blur(15px)',
          scale: 1.5,
          duration: 1.5,
          stagger: 0.05,
          ease: 'sine.out',
        });
      }

      // --- 退出逻辑 ---
      const hold = config.style === 'slam' ? 4 : 2;

      if (config.style !== 'slam') {
        tl.to(
          [splitNames!.chars, splitRole!.chars],
          {
            duration: 0.8,
            opacity: 0,
            z: -500,
            filter: 'blur(20px)',
            stagger: { amount: 0.2, from: 'end' },
            ease: 'power2.in',
          },
          `+=${hold}`,
        );
        tl.set(scene, { autoAlpha: 0 });
        masterTl.add(tl, i === 0 ? 0 : '-=0.6');
      } else {
        // Slam 场景的退出
        tl.to(scene, { duration: 2, scale: 0.95, opacity: 0, ease: 'power2.inOut' }, `+=${hold}`);
        masterTl.add(tl, '-=0.4');
      }
    });
  });
};

const finish = () => {
  gsap.to(stage.value, { opacity: 0, duration: 1, onComplete: () => emit('complete') });
};

const skip = () => {
  ctx?.revert();
  emit('complete');
};

onMounted(initAnimation);
onBeforeUnmount(() => ctx?.revert());
</script>

<style scoped>
.scene-wrapper {
  transform-style: preserve-3d;
}
.role-text,
.name-text {
  backface-visibility: hidden;
  will-change: transform, opacity;
}
.names-wrapper {
  max-width: 95vw;
}
</style>
