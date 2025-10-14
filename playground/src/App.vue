<script setup>
import { onMounted, ref, watch } from "vue";

const theme = ref("light");

watch(theme, updateTheme);

onMounted(updateTheme);

function updateTheme() {
  document.documentElement.setAttribute("data-theme", theme.value);
}
</script>

<template>
  <div class="p-4 font-bold text-2xl bg-light-5 mb-8 flex items-center gap-2">
    UnoCSS DaisyUI Preset Playground
    <select class="select" v-model="theme" placeholder="Please select theme">
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="halloween">Halloween</option>
    </select>
  </div>
  <div class="flex flex-col">
    <div class="chat chat-start">
      <div class="chat-bubble chat-bubble-primary">
        What kind of nonsense is this
      </div>
    </div>
    <div class="chat chat-start">
      <div class="chat-bubble chat-bubble-secondary">
        Put me on the Council and not make me a Master!??
      </div>
    </div>
    <div class="chat chat-start">
      <div class="chat-bubble chat-bubble-accent">
        That's never been done in the history of the Jedi.
      </div>
    </div>
    <div class="chat chat-start">
      <div class="chat-bubble chat-bubble-neutral">It's insulting!</div>
    </div>
    <div class="chat chat-end">
      <div class="chat-bubble chat-bubble-info">Calm down, Anakin.</div>
    </div>
    <div class="chat chat-end">
      <div class="chat-bubble chat-bubble-success">
        You have been given a great honor.
      </div>
    </div>
    <div class="chat chat-end">
      <div class="chat-bubble chat-bubble-warning">
        To be on the Council at your age.
      </div>
    </div>
    <div class="chat chat-end">
      <div class="chat-bubble chat-bubble-error">
        It's never happened before.
      </div>
    </div>
  </div>
</template>

<style scoped></style>
