<template>
    <div class="relative flex flex-col justify-center items-center h-screen">
        <div class="absolute top-0 w-full p-4">
          <Transition name="fade-slide" mode="out-in">
            <NavBar v-if="!isIntro"/>
          </Transition>
        </div>
        <NuxtPage />
        <NuxtSnackbar />
    </div>
</template>

<script setup lang="ts">

import { useRoute } from 'vue-router';
import { computed, onMounted } from 'vue';
import NavBar from '~/components/NavBar.vue';
//Check the current URL path
const isIntro = computed(() => {
    const route = useRoute().path;
    return route === '/';
});

function setCookie(c_name:string,value:string,exdays:number){
  //Create visited cookie
  document.cookie = `${c_name}=${value}; expires=${new Date(Date.now() + exdays * 24 * 60 * 60 * 1000).toUTCString()}`;
}

function getCookie(c_name:string){
  //Get the value of the visited cookie
  if (document.cookie.length > 0) {
    let c_start = document.cookie.indexOf(c_name + "=");
    if (c_start !== -1) {
      c_start = c_start + c_name.length + 1;
      let c_end = document.cookie.indexOf(";", c_start);
      if (c_end === -1) {
        c_end = document.cookie.length;
      }
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return "";
}

function checkSession(){
  if (useRoute().path == "/"){
    var c = getCookie("visited");
    if (c === "yes") {
      window.location.href = "/metronomeView";
    } 
    setCookie("visited", "yes", 7);
  }
}

onMounted(() => {
  checkSession();
});

</script>

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