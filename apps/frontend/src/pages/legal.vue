<template>
  <div class="mt-4">
    <UiTitlePage
      title="Política de privacidad"
      description="Consulta nuestra política de privacidad y cómo manejamos tus datos."
    >
      <DuiButton @click="viewPolicy" color="primary">
        <i class="mdi mdi-eye"></i> Ver política
      </DuiButton>
    </UiTitlePage>
  </div>
</template>
<script setup lang="ts">
import { DuiButton } from "@dronico/droni-kit";
import UiTitlePage from "../components/Ui/TitlePage.vue";

function viewPolicy() {
  // Logic to view privacy policy
}
</script>
