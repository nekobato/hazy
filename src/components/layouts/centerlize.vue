<template>
  <div class="centerlize">
    <slot />
  </div>
</template>
<style lang="scss" scoped>
.centerlize {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
