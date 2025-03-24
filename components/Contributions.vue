<template>
  <div>
    <UModal v-model="openModal" title="Modal with title">
      <div class="p-4">
        <h1 class="font-semibold text-2xl text-green-500">Create Contributor</h1>
        <UForm :state="state" class="space-y-4" @submit="onSubmit">
          <UFormField label="Email" name="email" class="w-full p-2">
            <UInput v-model="state.email" placeholder="Enter Email-Address" size="lg"/>
          </UFormField>

          <UFormField label="Password" name="password">
            <UInput v-model="state.password" type="password" placeholder="Enter Password" size="lg"/>
          </UFormField>

          <UButton type="submit" size="lg"> Create Contributor </UButton>
        </UForm>
      </div>
    </UModal>

    <div class="flex items-center flex-wrap justify-between pb-4">
      <h1 class="font-semibold text-2xl text-green-500">All Contributions</h1>
      <div class=" flex flex-col-reverse md:flex-row items-center justify-end gap-3 rounded-lg">
        <UInput
          v-model="search"
          placeholder="Search..."
          size="lg"
          class="w-full"
        />
        <UButton
          label="Create Contribution"
          icon="i-heroicons-plus-20-solid"
          color="primary"
          variant="solid"
          size="lg"
          @click="openModal = true"
        />
      </div>
    </div>
    <UTable
      :columns="columns"
      :rows="filteredData"
      v-model:row-selection="rowSelection"
      selectable
      class="bg-gray-800 rounded-lg"
    >
      <template #actions="{ row }">
        <UButton size="xs" color="gray" variant="link" @click="editRow(row)">
          <UIIcon name="i-heroicons-pencil-square-20-solid" class="mr-1" />
          Edit
        </UButton>
        <UButton size="xs" color="red" variant="link" @click="deleteRow(row)">
          <UIIcon name="i-heroicons-trash-20-solid" class="mr-1" />
          Delete
        </UButton>
      </template>
    </UTable>
    <div class="flex items-center justify-end gap-3 mt-5">
      <UButton
        label="DownLoad Report"
        icon="i-heroicons-document-arrow-down-20-solid"
        color="primary"
        variant="solid"
        size="lg"
        @click="downloadReport"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "default",
  title: "Contributions",
});

interface Column {
  key: string;
  label: string;
}

interface Row {
  id: string;
  date: string;
  status: string;
  email: string;
  amount: number;
}

const columns = ref<Column[]>([
  { key: "id", label: "ID" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
  { key: "email", label: "Email" },
  { key: "amount", label: "Amount" },
  { key: "actions", label: "Actions" }, // Added the actions column
]);

const data = ref<Row[]>([
  {
    id: "4600",
    date: "2024-03-11T15:30:00",
    status: "paid",
    email: "james.anderson@example.com",
    amount: 594,
  },
  {
    id: "4599",
    date: "2024-03-11T10:10:00",
    status: "failed",
    email: "mia.white@example.com",
    amount: 276,
  },
  {
    id: "4598",
    date: "2024-03-11T08:50:00",
    status: "refunded",
    email: "william.brown@example.com",
    amount: 315,
  },
  {
    id: "4597",
    date: "2024-03-10T19:45:00",
    status: "paid",
    email: "emma.davis@example.com",
    amount: 529,
  },
  {
    id: "4596",
    date: "2024-03-10T15:55:00",
    status: "paid",
    email: "ethan.harris@example.com",
    amount: 639,
  },
  {
    id: "4595",
    date: "2024-03-10T15:55:00",
    status: "paid",
    email: "ethan.harris@example.com",
    amount: 639,
  },
  {
    id: "4594",
    date: "2024-03-10T15:55:00",
    status: "paid",
    email: "ethan.harris@example.com",
    amount: 639,
  },
]);
const openModal = ref(false);

interface FormState {
    email?: string ;
    password?: string ;
  }
  const state = reactive<FormState>({
    email: '',
    password: '',
  });

const onSubmit = async () => {
    if (!state.email || !state.password) {
        alert('Please fill all the fields');
      return;
    }
    try {
      const response = await $fetch('/api/create-season', {
        method: 'POST',
        body: state
      });
      console.log('Season created:', response);
      state.email = '';
      state.password = '';
      openModal.value = false;
    } catch (error) {
      console.error('Error creating season:', error);
      alert('Failed to create season. See console for details.');
    }
  };

const search = ref<string>("");
const rowSelection = ref<Row[]>([]);

const filteredData = computed(() =>
  data.value.filter((item: any) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(search.value.toLowerCase())
    )
  )
);

const downloadReport = () => {
  if (rowSelection.value.length === 0) {
    alert("Please select at least one row to download.");
    return;
  }

  const csvContent = generateCSVContent(rowSelection.value);
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "report.csv";
  a.click();
  window.URL.revokeObjectURL(url);
};

const generateCSVContent = (data: Row[]) => {
  const headers = columns.value.map((column: any) => column.label).join(",");
  const rows = data
    .map((item) =>
      Object.values(item)
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");
  return `${headers}\n${rows}`;
};

// Action Handlers
const editRow = (row: Row) => {
  console.log("Edit", row.id);
  // Implement your edit logic here
};

const deleteRow = (row: Row) => {
  console.log("Delete", row.id);
  // Implement your delete logic here. Consider using a confirmation dialog.
};
</script>

<style></style>
