<template>
  <div class="flex items-center justify-center bg-green-500/30 min-h-screen">
    <!-- Background shapes -->
   <div class="max-md:hidden">
    <div class="w-[200px] md:w-[300px] lg:w-[400px] rounded-full rounded-tl-3xl absolute top-0 left-0 h-[200px] md:h-[300px] lg:h-[400px] bg-green-500/15"></div>
    <div class="w-[200px] md:w-[300px] lg:w-[400px] rounded-full rounded-bl-3xl absolute bottom-0 left-0 h-[200px] md:h-[300px] lg:h-[400px] bg-green-500/15"></div>
    <div class="w-[200px] md:w-[300px] lg:w-[400px] rounded-full rounded-tr-3xl absolute top-0 right-0 h-[200px] md:h-[300px] lg:h-[400px] bg-green-500/15"></div>
    <div class="w-[200px] md:w-[300px] lg:w-[400px] rounded-full rounded-br-3xl absolute bottom-0 right-0 h-[200px] md:h-[300px] lg:h-[400px] bg-green-500/15"></div>
    <div class="w-[200px] md:hidden md:w-[300px] lg:w-[400px] animate-bounce rounded-full absolute top-0 left-[10%] md:left-[20%] lg:left-[40%] h-[200px] md:h-[300px] lg:h-[400px] bg-green-500/15"></div>
    <div class="w-[200px] md:hidden md:w-[300px] lg:w-[400px] animate-bounce rounded-full absolute bottom-0 left-[10%] md:left-[20%] lg:left-[40%] h-[200px] md:h-[300px] lg:h-[400px] bg-green-500/15"></div>
   </div>

    <!-- Main Content Container -->
    <div
      class="relative flex flex-col md:flex-row items-center gap-5 mx-auto w-11/12 md:w-3/4 lg:w-1/2 dark:bg-gray-100 shadow-lg rounded-lg p-4"
    >
      <!-- Form Section -->
      <div class="w-full md:w-1/2">
        <div class="pt-5 absolute top-0">
          <h1 class="text-xl md:text-2xl font-black uppercase text-green-500">Welcome Again</h1>
        </div>
        <form @submit.prevent="onSubmit" class="mt-10">
          <div class="mb-5">
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-500"
              >Your email</label
            >
            <input
              type="email"
              id="email"
              v-model="formState.email"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
              placeholder="name@gmail.com"
            />
            <span v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</span>
          </div>
          <div class="mb-5">
            <label
              for="password"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-500"
              >Your password</label
            >
            <input
              type="password"
              id="password"
              v-model="formState.password"
              placeholder="*******"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
            />
            <span v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</span>
          </div>
          <button
            type="submit"
            class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Sign-In
          </button>
        </form>
      </div>

      <!-- Image Section -->
      <div class="w-full max-md:hidden md:w-1/2">
        <img
          class="w-full rounded-lg"
          src="../assets/images/login.png"
          alt="Login Image"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

definePageMeta({
  layout: "auth",
});

const formState = reactive({
  email: "",
  password: "",
});

const errors = reactive({
  email: "",
  password: "",
});

const validateForm = () => {
  errors.email = "";
  errors.password = "";

  if (!formState.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
    errors.email = "Invalid email format";
  } else if (formState.email.length > 50) {
    errors.email = "Email must be less than 50 characters";
  }

  if (!formState.password) {
    errors.password = "Password is required";
  } else if (formState.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  } else if (formState.password.length > 20) {
    errors.password = "Password must be less than 20 characters";
  }

  return !errors.email && !errors.password;
};
const toast = useToast();
const onSubmit = () => {
  if (validateForm()) {
    const response = useFetch("/api/login", {
      method: "POST",
      body: formState,
    });
    if (response.data.value) {
      alert("Login successful")
      useRouter().push("/dashboard");
    } else {
      alert("Login failed")
    }
    console.log("Form submitted!!", formState);
  }
};
</script>