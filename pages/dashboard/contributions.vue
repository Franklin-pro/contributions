<template>
  <div>
    <div> </div>

    <div class="p-4 bg-white rounded-lg shadow">
        <DataTable :value="products" tableStyle="min-width: 50rem">
            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header"></Column>
        </DataTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "admin",
  middleware:'auth'
});


import { ref, onMounted } from 'vue';
 
 

const products = ref();
const columns = [
    { field: 'code', header: 'Code' },
    { field: 'name', header: 'Name' },
    { field: 'category', header: 'Category' },
    { field: 'quantity', header: 'Quantity' }
];

</script>

<style>

</style>