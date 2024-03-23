<template>
  <div class="scrollable">
    <slot />
  </div>
</template>
<style lang="scss" scoped>
.scrollable {
  height: 100vh;
  overflow-y: auto;
}
</style>
