<template>
    <div class="flex flex-col items-center justify-center shadow-md shadow-neutral dark:shadow-black border-blue-200 dark:border-blue-950 border-2 rounded-2xl p-4 m-2"
        :class="ModalCardSize">
        <slot name="buttonui"></slot>
        <dialog :id="modalId" class="modal">
            <div class="modal-box w-full -ml-4 -mr-4 flex flex-col items-center justify-center">
                <form method="dialog">
                    <button class="btn btn-sm text-lg btn-circle btn-ghost absolute right-2 top-2 stroke-none">x</button>
                </form>
                <slot name="modal"></slot>
            </div>
        </dialog>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Define props
const props = defineProps({
    size: {
        type: Number,
        default: 24
    },
    modalId: {
        type: String,
        required: true
    }
});

const ModalCardSize = computed(() => {
    return `w-${props.size} h-${props.size}`;
});

</script>