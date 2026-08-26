<template>
  <div class="mt-4">
    <UiTitlePage
      title="Vehiculos de visitantes"
      description="Controla el ingreso y salida de los vehiculos de visitantes."
    >
      <DuiButton @click="registerVehicle" color="primary">
        <i class="mdi mdi-plus"></i> Registrar ingreso
      </DuiButton>
    </UiTitlePage>
  </div>
</template>
<script setup lang="ts">
import { DuiButton } from "@dronico/droni-kit";
import UiTitlePage from "../../../components/Ui/TitlePage.vue";

function registerVehicle() {
  // Logic to register vehicle
}
</script>
