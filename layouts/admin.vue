<template>
  <div class="flex flex-col h-screen bg-gray-50">


    <!-- Main Content Area with Sidebar and Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar Overlay for mobile -->
      <div v-if="isSidebarOpen" class="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" @click="closeSidebar"></div>

      <!-- Sidebar -->
      <div :class="[
          'bg-amber-800 text-white flex flex-col justify-between z-30',
          'fixed lg:relative h-full transition-all duration-300 ease-in-out',
          isSidebarOpen ? 'left-0' : '-left-64 lg:left-0',
          'w-64'
        ]">
        <!-- Menu Items -->
        <div>
          <div class="p-4">
            <h2 class="text-xl font-semibold">Dashboard</h2>
          </div>
          <nav class="mt-6">
            <ul>
              <li v-for="item in menuItems" :key="item.path" :class="[
                  'px-4 py-3 hover:bg-amber-700 cursor-pointer',
                  isActive(item.path) ? 'bg-amber-700 border-l-4 border-amber-400' : ''
                ]" @click="handleMenuItemClick">
                <NuxtLink :to="item.path" class="flex items-center">
                  <i :class="['pi', item.icon, 'mr-3']"></i>
                  {{ item.title }}
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Bottom Logout Button -->
        <div class="p-4 border-t border-amber-700">
          <button @click="logout" class="w-full text-left flex items-center px-2 py-2 hover:bg-amber-700 rounded">
            <i class="pi pi-sign-out mr-2"></i>
            Logout
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 overflow-y-auto">
        <!-- Top Navbar -->
        <div class="bg-gray-50 text-amber-500 shadow-md">
          <div class="container mx-auto flex justify-between items-center py-3 px-6">
            <!-- Left side with hamburger menu and brand -->
            <div class="flex items-center">
              <!-- Hamburger menu button for mobile -->
              <Button variant="text" severity="warn" @click="toggleSidebar" class="text-white focus:outline-none mr-4 lg:hidden">
                <i class="pi" :class="isSidebarOpen ? 'pi-times' : 'pi-bars'"></i>
              </Button>

              <span class="text-xl font-bold">Tuimizane Business </span>
            </div>

            <!-- User Account Info -->
            <div class="flex items-center">
              <div class="relative user-dropdown">
                <button @click="toggleUserMenu" class="flex items-center space-x-3 focus:outline-none">
                  <div class="hidden sm:flex flex-col items-end">
                    <span class="font-medium">{{ user.firstName }}</span>
                    <span class="text-xs text-gray-600">{{ user.username }}</span>
                  </div>
                  <div class="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center">
                    <i v-if="!user.avatar" class="pi pi-user"></i>
                    <img v-else :src="user.avatar" alt="Avatar" class="w-10 h-10 rounded-full object-cover" />
                  </div>
                  <i class="pi pi-chevron-down text-amber-200"></i>
                </button>

                <!-- Dropdown Menu -->
                <div v-if="isUserMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-100">Profile</a>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-100">Settings</a>
                  <div class="border-t border-gray-200"></div>
                  <button @click="logout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-amber-100">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="container mx-auto px-6 py-8">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const router = useRouter();
const route = useRoute();
const store = useAuthStore();

// User information - in a real app, this would come from your auth store
const user = ref({});
const users = computed(() => {
  return store.user;
})
onMounted(() => {
  user.value = users.value;
})

// User dropdown menu state
const isUserMenuOpen = ref(false);
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

// Sidebar state
const isSidebarOpen = ref(false);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
const closeSidebar = () => {
  isSidebarOpen.value = false;
};

// Close sidebar on menu item click (mobile only)
const handleMenuItemClick = () => {
  if (window.innerWidth < 1024) { // 1024px is the lg breakpoint in Tailwind
    closeSidebar();
  }
};

// Close sidebar when window is resized to desktop view
const handleResize = () => {
  if (window.innerWidth >= 1024) {
    isUserMenuOpen.value = false;
    if (isSidebarOpen.value) {
      isSidebarOpen.value = false;
    }
  }
};

// Close dropdown when clicking outside
const handleOutsideClick = (event) => {
  if (isUserMenuOpen.value && !event.target.closest('.user-dropdown')) {
    isUserMenuOpen.value = false;
  }
};

// Lifecycle hooks for event listeners
onMounted(() => {
  window.addEventListener('resize', handleResize);
  document.addEventListener('click', handleOutsideClick);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('click', handleOutsideClick);
});

// Menu items array with PrimeIcons
const menuItems = [
  {
    title: 'Dashboard',
    path: '/dashboard/home',
    icon: 'pi-users'
  },
  {
    title: 'Agents',
    path: '/dashboard/agents',
    icon: 'pi-users'
  },
  {
    title: 'Seasons',
    path: '/dashboard/seasons',
    icon: 'pi-calendar'
  },
  {
    title: 'Members',
    path: '/dashboard/members',
    icon: 'pi-users'
  },
  {
    title: 'Contributions',
    path: '/dashboard/contributions',
    icon: 'pi-wallet'
  },
  {
    title: 'Reports',
    path: '/dashboard/reports',
    icon: 'pi-chart-bar'
  }
];

// Function to check if a route is active
const isActive = (path) => {
  return route.path === path || route.path.startsWith(`${path}/`);
};

const logout = () => {
  isUserMenuOpen.value = false;
  closeSidebar();
  store.logout();
  router.push('/auth');
};
</script>