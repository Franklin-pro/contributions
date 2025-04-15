<template>
     <div class="flex items-center justify-center h-screen bg-gray-100">
      <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <div class="flex flex-col items-center justify-center">   
          <img src="/images/tuimizane_logo.png" class="my-4 h-48" />
        <h2 class="text-xl font-light mb-6 text-center"> Please sign in to your account.</h2> </div>
     

        <form @submit.prevent="loginAccount(state.username, state.password)" class="space-y-4">
          <FloatLabel variant="in">
            <InputText v-model="state.username" inputId="in_label" class="w-full" variant="filled" />
            <label for="in_label">Email</label>
          </FloatLabel>
          <FloatLabel variant="in" class="w-full">
            <IconField>
              <InputText v-model="state.password" id="password" class="w-full" :type="show ? 'text' : 'password'" />
              <InputIcon class="cursor-pointer" :class="show ? 'pi pi-eye-slash' : 'pi pi-eye'" @click="show = !show" />
            </IconField>
            <label for="in_label">Password</label>
          </FloatLabel>

          <Button type="submit" :disabled="!isEmailValid && isLoading" :loading="loadingItem == 1" class="w-full" block>
            {{ loadingItem == 1 ? 'Loading...' : 'Login' }}
          </Button>
        </form>

      </div>
    </div>
 </template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores'
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
definePageMeta({
  layout: "auth",
  middleware:'authenticated'
});
const authStore = useAuthStore()
const router = useRouter()


const schema = object({
  email: string().email("Invalid email").required("Username/Email required"),
  password: string()
    .min(6, "Must be at least 6 characters")
    .required("Password required"),
});
type Schema = InferType<typeof schema>;
const show = ref(false);
const state = reactive({
  username: "admin@tuimizanebusiness.com",
  password: "password123",
});

const showAlertError = ref(false);
const loadingItem = ref(0) //1: internal,2: google, 3: github
const isLoading = ref(false);
const isEmailValid = ref(false);

function validateEmail(events: any) {
  isEmailValid.value = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(events)
  console.log(isEmailValid.value)
  console.log(events)
}



const loginAccount = async (username: any, password: any) => {
  isLoading.value = true;
  loadingItem.value = 1
  // setTimeout(() => ((isLoading.value = false), (loadingItem.value = 0)), 7000);
  if (state.password == null) {
    showAlertError.value = true;
  } else {
    await authStore.login({ username: username, password: password });
  }
  loadingItem.value = 0
  // isLoading.value = false;
};

const loading = computed(() => {
  return authStore.loading;
})
</script>

