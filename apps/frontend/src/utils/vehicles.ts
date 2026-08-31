export const vehicleTypeOptions = [
  { value: 'car', label: 'Carro', icon: 'mdi-car-outline' },
  { value: 'motorcycle', label: 'Moto', icon: 'mdi-motorbike' },
  { value: 'bicycle', label: 'Bicicleta', icon: 'mdi-bike' },
  { value: 'truck', label: 'Camion', icon: 'mdi-truck-outline' },
  { value: 'other', label: 'Otro', icon: 'mdi-help-circle-outline' },
]

export function vehicleTypeLabel(type: string) {
  return vehicleTypeOptions.find((option) => option.value === type)?.label ?? type
}

export function vehicleTypeIcon(type: string) {
  return vehicleTypeOptions.find((option) => option.value === type)?.icon ?? 'mdi-car-outline'
}
