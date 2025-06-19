<template>
  <span
      class="glossary-term"
      @mouseenter="showTooltip = true"
      @mouseleave="showTooltip = false"
      @focus="showTooltip = true"
      @blur="showTooltip = false"
      :aria-labelledby="tooltipId"
      tabindex="0"
  >
    <slot></slot>
    <transition name="fade">
      <div v-if="showTooltip" :id="tooltipId" class="glossary-tooltip" role="tooltip">
        {{ decodedDescription }}
      </div>
    </transition>
  </span>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  description: {
    type: String,
    required: true
  }
});

const showTooltip = ref(false);

const decodedDescription = computed(() => {
  try {
    return decodeURIComponent(props.description);
  } catch (e) {
    console.error('Error decoding glossary description:', e);
    return props.description;
  }
});

const tooltipId = computed(() => `glossary-tooltip-${Math.random().toString(36).substring(2, 9)}`);
</script>

<style scoped>
.glossary-term {
  position: relative;
  text-decoration: underline dotted;
  cursor: help;
  color: var(--vp-c-brand-1);
  padding-bottom: 1px;
  display: inline-block;
}

.glossary-tooltip {
  position: absolute;
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-brand-1);
  padding: 8px 12px;
  border-radius: 6px;
  z-index: 1000;
  white-space: nowrap;
  box-shadow: var(--vp-shadow-3);
  top: auto;
  bottom: calc(100% + 10px);
  left: 50%;
  line-height: 1.4;
  transform: translateX(-50%);
  font-size: 14px;
  text-align:center;

&::after {
   content: "";
   position: absolute;
   top: 100%;
   left: 50%;
   margin-left: -6px;
   border-width: 6px;
   border-style: solid;
   border-color: var(--vp-c-brand-1) transparent transparent transparent;
 }

&.fade-enter-active,
&.fade-leave-active {
   transition: opacity 0.2s ease, transform 0.2s ease;
 }
&.fade-enter-from,
&.fade-leave-to {
   opacity: 0;
   transform: translateX(-50%) translateY(5px);
 }
}

@media (max-width: 768px) {
  .glossary-tooltip {
    max-width: 90vw;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style> 