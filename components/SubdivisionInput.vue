<template>
  <div ref="staffContainer" class="staff-container"></div>
</template>

<script setup lang="ts">
import { Formatter, Renderer, Stave, StaveNote, Beam } from 'vexflow';
import { ref, onMounted } from 'vue';

const staffContainer = ref<HTMLDivElement>();

onMounted(() => {
  renderStaff();
});

function renderStaff() {
  const div = staffContainer.value;
  if (!div) return;
  const renderer = new Renderer(div, Renderer.Backends.SVG);
  renderer.resize(50, 65);
  const context = renderer.getContext();
  context.setFillStyle('white');
  context.setStrokeStyle('white'); // Set the base color to white

  const stave = new Stave(0, 0, 50);
  stave.setContext(context);

  const notes = [
    new StaveNote({
      keys: ['b/4'], // B4
      duration: 'q', // eighth note
    })
  ];

  const beams = Beam.generateBeams(notes, {
    flat_beams: true,
    show_stemlets: true,
    maintain_stem_directions: true,
    beam_middle_only: true,
    beam_rests: true
  });
  Formatter.FormatAndDraw(context, stave, notes);
  beams.forEach(beam => beam.setContext(context).draw());
}
</script>

<style scoped>
.staff-container {
  width: 100px;
}
</style> 