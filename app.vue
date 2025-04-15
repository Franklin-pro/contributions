<template>
  <div v-if="isLoading">
    <NuxtLayout name="preloader" />
  </div>
  <div v-else>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toast />
  </div>
</template>

<script setup>
const isLoading = ref(true);
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 2000);
});
</script>
<style>

</style>

