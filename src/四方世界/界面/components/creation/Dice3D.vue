<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-999999! flex flex-col items-center justify-center bg-black/80 text-white backdrop-blur-sm"
  >
    <div class="mb-8 flex max-w-150 flex-wrap justify-center gap-8">
      <div v-for="(_, idx) in activeDice" :key="idx" :ref="el => (diceRefs[idx] = el)" class="dice-icon">
        <div class="dice-cube">
          <div class="dice-face face-1"><span class="pip"></span></div>
          <div class="dice-face face-2"><span class="pip"></span><span class="pip"></span></div>
          <div class="dice-face face-3">
            <span class="pip"></span><span class="pip"></span><span class="pip"></span>
          </div>
          <div class="dice-face face-4">
            <span class="pip"></span><span class="pip"></span><span class="pip"></span><span class="pip"></span>
          </div>
          <div class="dice-face face-5">
            <span class="pip"></span><span class="pip"></span><span class="pip"></span><span class="pip"></span
            ><span class="pip"></span>
          </div>
          <div class="dice-face face-6">
            <span class="pip"></span><span class="pip"></span><span class="pip"></span><span class="pip"></span
            ><span class="pip"></span><span class="pip"></span>
          </div>
        </div>
      </div>
    </div>

    <div class="h-12 text-center text-3xl font-bold text-yellow-400 drop-shadow-[0_0_12px_rgba(255,235,59,0.8)]">
      {{ displayText }}
    </div>

    <button
      class="absolute bottom-8 rounded border border-white/50 bg-black/50 px-6 py-2 transition-colors hover:bg-black/80 hover:text-white"
      @click="skip"
    >
      跳过动画
    </button>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { nextTick, ref } from 'vue';

const isVisible = ref(false);
const activeDice = ref<number[]>([]);
const displayText = ref('');
const diceRefs = ref<any[]>([]);
let skipFlag = false;
let currentTimeline: gsap.core.Timeline | null = null;

const getRotationForFace = (face: number) => {
  switch (face) {
    case 1:
      return { x: 0, y: 0 };
    case 6:
      return { x: 0, y: 180 };
    case 3:
      return { x: 0, y: -90 };
    case 4:
      return { x: 0, y: 90 };
    case 2:
      return { x: -90, y: 0 };
    case 5:
      return { x: 90, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
};

const roll = async (numDice: number, results: number[], loadingText: string): Promise<void> => {
  isVisible.value = true;
  skipFlag = false;
  activeDice.value = Array(numDice).fill(0);
  displayText.value = loadingText;

  await nextTick(); // 等待 DOM 渲染出骰子

  return new Promise(resolve => {
    currentTimeline = gsap.timeline({
      onComplete: () => resolve(),
    });

    diceRefs.value.forEach((dieEl, i) => {
      if (!dieEl) return;
      const cube = dieEl.querySelector('.dice-cube');
      const targetRot = getRotationForFace(results[i]);

      currentTimeline!
        .to(
          cube,
          {
            rotationX: `+=${gsap.utils.random(720, 1080)}`,
            rotationY: `+=${gsap.utils.random(720, 1080)}`,
            duration: 1.5,
            ease: 'power2.in',
          },
          0,
        )
        .to(cube, {
          rotationX: targetRot.x,
          rotationY: targetRot.y,
          duration: 0.5,
          ease: 'power4.out',
        });
    });
  });
};

const updateText = async (text: string) => {
  if (skipFlag) return;
  displayText.value = text;
  await new Promise(r => setTimeout(r, 1500));
};

const hide = () => {
  isVisible.value = false;
};
const skip = () => {
  skipFlag = true;
  if (currentTimeline) currentTimeline.progress(1);
};

defineExpose({ roll, updateText, hide, skip });
</script>

<style scoped>
/* 移植原版 3D 骰子 CSS */
.dice-icon {
  width: 5rem;
  height: 5rem;
  perspective: 800px;
}
.dice-cube {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transform: translateZ(-2.5rem);
}
.dice-face {
  position: absolute;
  width: 5rem;
  height: 5rem;
  background: rgba(255, 255, 255, 0.98);
  border: 1.5px solid #857e72;
  border-radius: 12%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.face-1 {
  transform: rotateY(0deg) translateZ(2.5rem);
}
.face-6 {
  transform: rotateY(180deg) translateZ(2.5rem);
  flex-direction: column;
  gap: 8px;
}
.face-3 {
  transform: rotateY(90deg) translateZ(2.5rem);
  flex-direction: column;
  gap: 4px;
}
.face-4 {
  transform: rotateY(-90deg) translateZ(2.5rem);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 10px;
}
.face-2 {
  transform: rotateX(90deg) translateZ(2.5rem);
  flex-direction: column;
  justify-content: space-around;
  padding: 10px;
}
.face-5 {
  transform: rotateX(-90deg) translateZ(2.5rem);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 10px;
  position: relative;
}
.pip {
  width: 14px;
  height: 14px;
  background: #3d352e;
  border-radius: 50%;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5);
}
</style>
