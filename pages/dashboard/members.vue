<template>
  <div>
    <div class="p-4 bg-white rounded-lg shadow">
      <DataTable v-model:filters="filters" stripedRows :value="members" paginator :rows="10"
        :rowsPerPageOptions="[10, 20, 30, 50]" tableStyle="min-width: 50rem" :loading="loading">
        <template #header>
          <div class="flex justify-end space-x-4">
            <Select v-model="selectedTypeId" :options="types" optionLabel="name" optionValue="id"
              placeholder="Filter by Type" />
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="searchTerm" placeholder="Keyword Search" />
            </IconField>
          </div>
        </template>
        <template #empty> No customers found. </template>
        <template #loading> Loading customers data. Please wait. </template>
        <Column class="text-sm" v-for="col of columns" :key="col.field" :field="col.field" :header="col.header">
        </Column>

        <!-- Actions Column -->
        <Column header="Actions">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button icon="pi pi-eye" class="p-button-rounded p-button-success" size="small" variant="text"
                @click="onViewMember(slotProps.data)" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-warn" size="small" variant="text"
                @click="confirmDelete(slotProps.data)" />
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

    <div class="card flex justify-center">
      <Drawer position="right" v-model:visible="visible" header="Member Deatils"
        class="!w-full md:!w-[500px] lg:!w-[60rem]" @update:visible="handleDialogClose">
        <div class="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
          <!-- Card Header with Background Gradient -->
          <div class="relative bg-gradient-to-r from-blue-500  via-blue-400  to-blue-500 h-24">
            <!-- Status Badge -->
            <div class="absolute top-4 right-4">
              <span :class="`px-5 py-2 rounded-full text-xs font-semibold text-white ${getStatusColor}`">
                {{ getStatusLabel }}
              </span>
            </div>

            <!-- Organization Name Watermark -->
            <div class="absolute bottom-2 right-4 text-white/90 text-sm font-light">
              {{ member.organization_name }}
            </div>
          </div>

          <!-- Main Content -->
          <div class="relative px-6 pb-6">
            <!-- Profile Photo Circle -->
            <div
              class="absolute -top-28 left-6 h-24 w-24 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden shadow-md">
              <img v-if="member.photo && member.photo !== ''" :src="member.photo" alt="Profile Photo"
                class="h-full w-full object-cover" />
              <div v-else class="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            <!-- Member Information -->
            <div class="mt-14">
              <h2 class="text-2xl font-bold text-gray-800">{{ member.names }}</h2>

              <!-- Member Type Badge -->
              <div class="flex items-center mt-1">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {{ getMemberType }}
                </span>
                <span class="ml-2 text-sm text-gray-500">ID: {{ member.idNumber }}</span>
              </div>

              <!-- Contact & Details -->
              <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="flex items-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-400" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {{ formatPhone(member.phone) }}
                </div>

                <div class="flex items-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-400" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ member.address }}
                </div>
              </div>

              <!-- Balance Section -->
              <div class="mt-5 flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div>
                  <div class="text-sm text-gray-500">Member Balance</div>
                  <div class="text-xl font-bold text-gray-800">{{ member.amount }} {{ member.currency }}</div>
                </div>

                <Button size="small">
                  Manage Account
                </Button>
              </div>

              <!-- Collapsible Section Toggle -->
              <button @click="toggleDetails"
                class="mt-4 flex items-center text-sm text-indigo-600 hover:text-indigo-800">
                <span>{{ showDetails ? 'Hide Details' : 'Show More Details' }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 transition-transform duration-200"
                  :class="{ 'transform rotate-180': showDetails }" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Collapsible Additional Details -->
              <div v-if="showDetails" class="mt-3 border-t pt-3 text-sm text-gray-600 space-y-2">
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <span class="font-medium text-gray-500">Member ID:</span>
                    <p class="truncate">{{ member.id }}</p>
                  </div>
                  <div>
                    <span class="font-medium text-gray-500">Organization ID:</span>
                    <p class="truncate">{{ member.organization_id }}</p>
                  </div>
                </div>

                <div>
                  <span class="font-medium text-gray-500">Card Status:</span>
                  <p>{{ member.card === "NULL" ? "Not Issued" : member.card }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="py-3 border mt-3 rounded-lg">
          <DataTable :value="memberContributions" tableStyle="min-width: 50rem">
            <template #header>
              <div class="flex justify-end">
                <!-- Season ID Filter -->
                <div class="mr-4">
                  <Select size="small" v-model="selectedSeasonId"
                    @update:model-value="onFilterBySeason(member, selectedSeasonId )" :options="seasons"
                    option-label="startDate" option-value="id" placeholder="Filter By Season">

                    <template #option="slotProps">
                      <div class="flex items-center">

                        <div class="text-xs">{{ slotProps.option.startDate }} to {{ slotProps.option.endDate }}</div>
                      </div>
                    </template>
                  </Select>
                </div>

                <IconField>
                  <InputIcon>
                    <i class="pi pi-search" />
                  </InputIcon>
                  <InputText size="small" v-model="searchTerm" placeholder="Keyword Search" />
                </IconField>
              </div>
            </template>
            <template #empty> No customers found. </template>
            <template #loading> Loading customers data. Please wait. </template>
            <Column class="text-xs" v-for="col of contributionColumns" :key="col.field" :field="col.field"
              :header="col.header">

              <template #body="slotProps">
                <!-- Customize based on field -->
                <span v-if="col.field === 'amount'">
                  {{ slotProps.data.amount }} {{ slotProps.data.currency }}
                </span>

                <span v-else-if="col.field === 'status'">
                  <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
                </span>
                
                <span v-else-if="col.field === 'type'">
                  <div>{{ getTypeMember(slotProps.data[col.field]) }}</div>
                </span>

                <span v-else-if="col.field === 'createdAt' || col.field === 'statusTime'">
                  {{ formatDate(slotProps.data[col.field]) }}
                </span>

                <span v-else>
                  {{ slotProps.data[col.field] }}
                </span>
              </template>
            </Column>
          </DataTable>
        </div>
      </Drawer>
    </div>
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
  return memberStore.loading;
})

const visible = computed(() => {
  return mainStore.memberDrawer;
})
const filters = ref()
const selectedSeasonId = ref(null);

const formatDate = (value: string) => {
  return new Date(value).toLocaleString();
};

const getStatusSeverity = (status: any) => {
  switch (status) {
    case '1':
      return 'success';
    case '0':
      return 'warning';
    case '2':
      return 'danger';
    default:
      return 'info';
  }
};

const getTypeMember = (type: any) => {
  switch (type) {
    case '1':
      return 'Vision One';
    case '0':
      return 'Vision Two';
    default:
      return 'info';
  }
};


const seasons = computed(() => {
  return seasonStore.seasons || [];
});
const columns = [
  { field: 'names', header: 'Names' },
   { field: 'organization_name', header: 'Organization' },
  { field: 'phone', header: 'Phone' },
  { field: 'idNumber', header: 'ID Number' },
  { field: 'pin', header: 'PIN' },
  { field: 'photo', header: 'Photo' },
  { field: 'address', header: 'Address' },
  { field: 'card', header: 'Card' },
  { field: 'type', header: 'Type' },
  { field: 'amount', header: 'Amount' },
  { field: 'currency', header: 'Currency' },
  { field: 'status', header: 'Status' },
];
const contributionColumns = [
  { field: 'seasonStartDate', header: 'Season Start Date' },
  { field: 'seasonEndDate', header: 'Season End Date' },
  { field: 'amount', header: 'Amount' },
  { field: 'days', header: 'Days' },
  { field: 'currency', header: 'Currency' },
  { field: 'status', header: 'Status' },
  { field: 'createdAt', header: 'Created At' },
];

const confirm = useConfirm();
const types = ref([
  { id: '0', name: 'Vision One' },
  { id: '1', name: 'VisionTwo' },
 ]);
const searchTerm = ref("");
const selectedTypeId = ref(null); // this holds the selected type ID
const members = computed(() => {
  const term = searchTerm.value.toLowerCase();

  return memberStore.members.filter((m: any) => {
    const matchesSearch =
      m.names?.toLowerCase().includes(term) ||
      m.phone?.toLowerCase().includes(term);

    const matchesType = selectedTypeId.value
      ? m.type === selectedTypeId.value
      : true; // if no type selected, allow all

    return matchesSearch && matchesType;
  });
});
const  member = computed(() => {
  return memberStore.selectedMember;
})
onMounted(() => {
  memberStore.getAllMembers()
});
function handleDialogClose(visible: any) {
  if (!visible) {
    mainStore.setMemberDrawer(false);
  }
}
const onEdit = (season: any) => {
  memberStore.setSelectedMember(season);
  // navigateTo(`/dashboard/seasons/edit?id=${season.id}`);
}
const onViewMember = (item: any) => {
  memberStore.setSelectedMember(item);
  if(member.value != null ){
    contributionStore.getContributionsByMember(item.id)
    seasonStore.getSeasons()

  }
  mainStore.setMemberDrawer(true)
}
const onFilterBySeason = (item: any, seasonId: any) => {
   if (item != null) {
     contributionStore.getContributionsByMember(item.id, seasonId)
  }
 }


const memberContributions = computed(() =>{
  return contributionStore.contributions || [];
})
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

const showDetails = ref(false);

// Status helpers
const getStatusLabel = computed(() => {
  switch (member.value.status) {
    case "1": return "Active";
    case "2": return "Suspended";
    case "0": return "Pending";
    default: return "Unknown";
  }
});

const getStatusColor = computed(() => {
  switch (member.value.status) {
    case "1": return "bg-green-500";
    case "2": return "bg-yellow-500";
    case "0": return "bg-orange-500";
    default: return "bg-gray-500";
  }
});

// Member type helper
const getMemberType = computed(() => {
  switch (member.value.type) {
    case "0": return "Vision ONE";
    case "1": return "Vision TWO ";
     default: return "Regular Member";
  }
});

// Format phone number for better readability
const formatPhone = (phone: any) => {
  if (!phone) return "";

  // Example formatting: 243-973-855-911
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 12) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  }

  return phone;
};

const toggleDetails = () => {
  showDetails.value = !showDetails.value;
};
</script>
