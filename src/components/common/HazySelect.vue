<script setup lang="ts">
import { PropType } from "vue";

defineProps({
  placeholder: {
    type: String,
  },
  options: {
    type: Array as PropType<{ label: string; value: string }[]>,
    required: true,
  },
});
</script>
<template>
  <select class="nn-select size-small" v-bind="$attrs">
    <option value="" disabled v-if="placeholder">{{ placeholder }}</option>
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>
