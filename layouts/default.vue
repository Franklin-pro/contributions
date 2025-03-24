<template>
  <div class="min-h-screen flex items-center">
    <div class="bg-gray-200 lg:block max-md:hidden md:hidden max-sm:hidden relative w-[20%] h-screen">
      <div class="bg-white text-black p-4 flex gap-4 items-center">
        <div>
          <UAvatar src="https://github.com/benjamincanac.png" />
        </div>
        <h1 class="font-semibold header uppercase text-2xl text-green-500 text-center">
          Contribation
        </h1>
      </div>
      <div v-for="item in sidebarItems" :key="item.title">
        <div>
          <nuxt-link
            :to="item.to"
            class="flex items-center hover:bg-gray-300 text-gray-600 font-semibold gap-3 p-5"
            active-class="bg-gray-300 text-green-600 font-bold"
          >
            <UIcon :name="item.icon" class="text-2xl" />
            <span>{{ item.title }}</span>
          </nuxt-link>
        </div>
      </div>
      <div class="absolute bottom-0 w-full p-5 flex items-center gap-3 font-bold bg-red-500 text-white">
        <UIcon name="i-heroicons-arrow-left-on-rectangle" class="text-2xl" />
        <NuxtLink to="/">Logout</NuxtLink>
      </div>
    </div>
    <div class="bg-gray-300 text-gray-600 w-[80%] sm:w-full md:w-full max-md:w-full h-screen">
      <div class="bg-gray-200 p-4 flex items-center justify-between">
        <div class="hidden menuIcon">
        <UIcon name="i-heroicons-bars-3" @click="isMenu = true" class="text-2xl p-4 cursor-pointer" />
      </div>
        <h1 class="font-semibold text-2xl text-gray-500">Dashboard</h1>
        <div>
          <UAvatar src="https://github.com/benjamincanac.png" />
        </div>
      </div>
      <div class="p-5">
        <slot />
      </div>
    </div>
    <USlideover v-model="isMenu" title="Menu">
      <div class="p-4">
        <div v-for="item in sidebarItems" :key="item.title">
          <nuxt-link
            :to="item.to"
            class="flex items-center hover:bg-gray-300 text-gray-600 font-semibold gap-3 p-5"
            active-class="bg-gray-300 text-green-600 font-bold"
            @click="isMenu = false"
          >
            <UIcon :name="item.icon" class="text-2xl" />
            <span>{{ item.title }}</span>
          </nuxt-link>
        </div>
        <div class="mt-4">
          <button
            class="flex items-center gap-3 p-5 w-full text-left font-bold bg-red-500 text-white"
            @click="logout"
          >
            <UIcon name="i-heroicons-arrow-left-on-rectangle" class="text-2xl" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </USlideover>
  </div>
</template>

<script lang="ts" setup>
const sidebarItems = ref([
{
    title: "Members",
    icon: "i-heroicons-users",
    to: "/",
  },
  {
    title: "Contributions",
    icon: "i-heroicons-document",
    to: "/contributions",
  },
  {
    title: "Season",
    icon: "i-heroicons-calendar",
    to: "/seasons",
  },
]);

const isMenu = ref(false);

const logout = () => {
  // Implement logout logic here
  navigateTo('/');
};
</script>

<style>
/* Optional: add custom styles for active link */
.nuxt-link-exact-active {
  background-color: #3182ce;
  color: red;
}

@media screen and (max-width: 1223px) {
  .header{
font-size: 14px;
  }
  .menuIcon{
    display: hidden;
  }
}
@media screen and (max-width: 1023px) {
  .header{
font-size: 14px;
  }
  .menuIcon{
    display: block;
  }
}
</style>
