<script setup>
const props = defineProps({
  path: String
})
</script>
<template>
  <p class="fileName"><a :href="`https://github.com/tdd/dotjs-esproxies/blob/main/snippets/${path}`">{{path}}</a></p>
</template>

<style scoped>
.fileName {
  font-family: "Operator Mono SSm A", "Operator Mono SSm B", "JetBrains Mono",
      ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
      "Courier New", monospace !important;
  color: silver;
  font-size: 0.6rem;
  position: relative;
  top: -1rem;
}
.fileName::before { content: '🌎 » '; opacity: 0.6; }
</style>