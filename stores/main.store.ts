import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n' // Import vue-i18n

export const useMainStore = defineStore('myMainStore', () => {
  const { t } = useI18n() // Access t function from vue-i18n

  const centenaryDetails = ref({
    label: computed(() => t('christmas_at_greccio')),  // Using translation keys
    image: '/images/2023_christmas.jpg',
    path: '/about/franciscan_centenary_details',
    title: computed(() => t('christmas_at_greccio_title')),
    description: computed(() => t('christmas_at_greccio_description')),
    texts: computed(() => t('christmas_at_greccio_texts'))
  })
  const deleteModal = ref(false)
  const memberDrawer = ref(false)
  const setMemberDrawer = (data: boolean) => (memberDrawer.value = data)
  const setDeleteModal = (value: boolean) => {
    deleteModal.value = value
  }
  const isMobileMenuOpen = ref(false)
  const setCentenaryDetails = (data: any) => {
    centenaryDetails.value = data
  }
  const setIsMobileMenuOpen = (data: boolean) => (isMobileMenuOpen.value = data)
  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }

  return {
    centenaryDetails,
    setCentenaryDetails,
    deleteModal,
    setDeleteModal,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    toggleMobileMenu,
    setMemberDrawer,
    memberDrawer
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot))
}
