<template>
  <div
    class="fixed inset-0 bg-white z-50 flex items-center justify-center opacity-0 transition-opacity duration-500 ease-in-out"
    :class="{ 'opacity-100': show }">    
    <span class="loader"></span>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';

const isLoading = ref(true);
const show = ref(false);
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false; // Signal that loading is complete
  }, 700); // Adjust the timeout duration as needed.
});

onMounted(() => {
  setTimeout(() => {
    show.value = true;
  }, 200); // Small delay for smooth transition
});
</script>

<style scoped>
.loader {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  background: linear-gradient(0deg, rgba(59, 33, 25, 0.2) 33%, #3d251d 100%);
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

.loader::after {
  content: '';
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #ffffff;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg)
  }

  100% {
    transform: rotate(360deg)
  }
}
</style>