<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap');

.font-orbitron {
  font-family: 'Orbitron', sans-serif;
}

.title-gradient {
  background: linear-gradient(90deg, var(--error) 0%, var(--secondary) 9%, var(--secondary) 42%, var(--primary) 47%, var(--accent) 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title-gradient::selection {
  background-color: rgba(59, 130, 246, 0.2);
  color: var(--base-content);
}

@supports(color: oklch(0% 0 0)) {
  .title-gradient {
    background: linear-gradient(90deg, oklch(var(--s)) 4%, color-mix(in oklch, oklch(var(--s)), oklch(var(--er))) 22%, oklch(var(--p)) 45%, color-mix(in oklch, oklch(var(--p)), oklch(var(--a))) 67%, oklch(var(--a)) 100.2%);
    background-clip: text;
  }
}

</style>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: relative;
}
</style>