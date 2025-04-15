<template>
  <div>
    <div class="p-4 bg-white rounded-lg shadow">
      <DataTable :value="seasons" tableStyle="min-width: 50rem">
        <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header"></Column>
        
        <!-- Actions Column -->
        <Column header="Actions">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-info" @click="onEdit(slotProps.data)" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDelete(slotProps.data)" />
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
  { field: 'startDate', header: 'Start Date' },
  { field: 'endDate', header: 'End Date' },
  { field: 'status', header: 'Status' },
  { field: 'createdBy', header: 'Created By' }
];

const seasonStore = useSeasonsStore();
const confirm = useConfirm();

const seasons = computed(() => {
  return seasonStore.seasons || [];
});

onMounted(() => {
  seasonStore.getSeasons()
});

const onEdit = (season: any) => {
  seasonStore.setSelectedSeason(season);
  navigateTo(`/dashboard/seasons/edit?id=${season.id}`);
}

const confirmDelete = (season: any) => {
  confirm.require({
    message: `Are you sure you want to delete season from ${season.startDate} to ${season.endDate}?`,
    header: 'Delete Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await seasonStore.deleteSeason(season.id)
    },
    reject: () => {
      // Optional: show cancellation toast or log
    }
  });
}
</script>
