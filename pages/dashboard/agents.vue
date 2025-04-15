<template>
  <div>
    <div class="p-4 bg-white rounded-lg shadow">
      <DataTable :value="users" tableStyle="min-width: 50rem">
        <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header"></Column>

        <!-- Actions Column -->
        <Column header="Actions">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-info"   />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-danger"
                @click="confirmDelete(slotProps.data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Delete Confirmation -->
    <ConfirmDialog />
  </div>
</template>

<script lang="ts" setup>
// import { useConfirm } from 'primevue/useconfirm'


definePageMeta({
  layout: "admin",
  middleware: 'auth'
});

const columns = [
  { field: 'firstName', header: 'Names' },
   { field: 'email', header: 'Email' },
  { field: 'phone', header: 'Phone' },
  { field: 'lastName', header: 'Role' },
  { field: 'organization.name', header: 'Organization' }
];

const authStore = useAuthStore();
const confirm = useConfirm();

const users = computed(() => {
  return authStore.users || [];
});

onMounted(() => {
  authStore.getUsers()
});
 

const confirmDelete = (season: any) => {
  confirm.require({
    message: `Are you sure you want to delete agent`,
    header: 'Delete Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      // await authStore.deleteSeason(season.id)
    },
    reject: () => {
      // Optional: show cancellation toast or log
    }
  });
}
</script>
