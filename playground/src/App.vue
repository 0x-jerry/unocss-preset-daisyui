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
  <div class="flex flex-col gap-2 px-4 pt-4">
    <div class="mb-4 flex items-center gap-2">
      <span class="font-bold text-2xl flex-1">
        UnoCSS DaisyUI Preset Playground
      </span>
      <div class="flex items-center gap-2">
        <span>Theme: </span>
        <select class="select w-160px" v-model="theme" placeholder="Please select theme">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="halloween">Halloween</option>
        </select>
      </div>
    </div>

    <div class="buttons flex gap-1">
      <button class="btn btn-soft">Default</button>
      <button class="btn btn-soft btn-primary">Primary</button>
      <button class="btn btn-soft btn-secondary">Secondary</button>
      <button class="btn btn-soft btn-accent">Accent</button>
      <button class="btn btn-soft btn-info">Info</button>
      <button class="btn btn-soft btn-success">Success</button>
      <button class="btn btn-soft btn-warning">Warning</button>
      <button class="btn btn-soft btn-error">Error</button>
    </div>

    <div class="flex gap-1">
      <div class="hover:text-primary">Hover me</div>
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
  </div>
</template>

<style scoped></style>
