<template>
  <div>
    <div class="p-4 bg-white rounded-lg shadow">
      <DataTable v-model:filters="filters" stripedRows :value="contributions" paginator :rows="10"
        :rowsPerPageOptions="[10, 20, 30, 50]" tableStyle="min-width: 50rem" :loading="loading">
        <template #header>
          <div class="flex justify-end space-x-6">
            <InputGroup class="w-60">
             <Select size="small" v-model="selectedSeasonId" @update:model-value="onFilterBySeason(selectedSeasonId )" :options="seasons" option-label="startDate" option-value="id"
                    placeholder="Filter By Season">
                    <template #option="slotProps">
                      <div class="flex items-center">

                        <div class="text-sm">{{ slotProps.option.startDate }} to {{ slotProps.option.endDate }}</div>
                      </div>
                    </template>
                  </Select>
                  <InputGroupAddon v-if="selectedSeasonId != null">
        <Button icon="pi pi-times" @click="resetFilter()" severity="secondary" />
    </InputGroupAddon>
                  </InputGroup>
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="searchTerm" placeholder="Keyword Search" />
            </IconField>
          </div>
        </template>
        <template #empty> No contributions found. </template>
        <template #loading> Loading contributions data. Please wait. </template>
        <Column class="text-sm" v-for="col of columns" :key="col.field" :field="col.field" :header="col.header">

              <template #body="slotProps">
                <!-- Customize based on field -->
                <span v-if="col.field === 'amount'">
                  {{ slotProps.data.amount }} {{ slotProps.data.currency }}
                </span>

                <span v-else-if="col.field === 'status'">
                  <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
                </span>
                
                <span v-else-if="col.field == 'type'">
                  <div>{{ getTypeMember(slotProps.data.type) }}</div>
                </span>

                <span v-else-if="col.field === 'createdAt' || col.field === 'statusTime'">
                  {{ formatDate(slotProps.data[col.field]) }}
                </span>

                <span v-else>
                  {{ slotProps.data[col.field] }}
                </span>
              </template>
        </Column>

        <!-- Actions Column -->
        <Column header="Actions">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button icon="pi pi-eye" class="p-button-rounded p-button-success" size="small" variant="text"
                @click="onViewMember(slotProps.data)" />
             
              <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" size="small" variant="text"
                @click="confirmDelete(slotProps.data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Delete Confirmation -->
    <ConfirmDialog />
    <!-- View Member info -->

     
  </div>
</template>

<script lang="ts" setup>
const memberStore = useMembersStore();
const mainStore = useMainStore()
const contributionStore = useContributionsStore()
const seasonStore = useSeasonsStore();


definePageMeta({
  layout: "admin",
  middleware: 'auth'
});
const loading = computed(() =>{
  return contributionStore.loading;
})

const filters = ref()
const selectedSeasonId = ref(null);



const seasons = computed(() => {
  return seasonStore.seasons || [];
});
const columns = [
  { field: 'memberNames', header: 'Names' },
   { field: 'seasonStartDate', header: 'Season Start Date' },
  { field: 'seasonEndDate', header: 'Season End Date' },
  { field: 'amount', header: 'Amount' },
  { field: 'days', header: 'Days' },
  { field: 'currency', header: 'Currency' },
  { field: 'createdBy', header: 'Created By' },
  { field: 'status', header: 'Status' },
  { field: 'createdAt', header: 'Created At' },
];
 

const confirm = useConfirm();

const searchTerm = ref("");

const contributions = computed(() => {
  const term = searchTerm.value.toLowerCase();
   return contributionStore.contributions.filter((m:any) =>
    m.memberNames?.toLowerCase().includes(term) ||
    m.currency?.toLowerCase().includes(term)
  );
});
const  contribution = computed(() => {
  return contributionStore.selectedContribution;
})
onMounted(() => {
  contributionStore.getAllContributions()
  seasonStore.getSeasons()
});


const onViewMember = (item: any) => {
   
}
const onFilterBySeason = (item: any) => {
   if (item != null) {
     contributionStore.getContributionsBySeason(item)
  }
 }


 
const confirmDelete = (member: any) => {
  confirm.require({
    message: `Are you sure you want to delete member from ${member.names}?`,
    header: 'Delete Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await memberStore.deleteMember(member.id)
    },
    reject: () => {
      // Optional: show cancellation toast or log
    }
  });
}
const  resetFilter = () => {
   contributionStore.getAllContributions()
   selectedSeasonId.value = null
}
 

 const formatDate = (value: any) => {
  return new Date(value).toLocaleString();
};

const getStatusSeverity = (status: any) => {
  switch (status) {
    case 'APPROVED':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'REJECTED':
      return 'danger';
    default:
      return 'info';
  }
};

const getTypeMember = (status: any) => {
  switch (status) {
    case '1':
      return 'Vision One';
    case '0':
      return 'Vision Two';
    default:
      return 'info';
  }
};
</script>
