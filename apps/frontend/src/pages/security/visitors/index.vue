<template>
  <div class="py-4">
    <TitlePage
      title="Control de visitantes"
      description="Control de acceso de visitantes"
    >
      <DuiButton @click="createModal = true" color="primary">
        <i class="mdi mdi-plus"></i> Ingreso de visitante
      </DuiButton>
    </TitlePage>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { DuiButton } from '@dronico/droni-kit';
import TitlePage from '@/components/Ui/TitlePage.vue';

const createModal = ref(false)
</script>