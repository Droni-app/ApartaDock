export interface RoleMeta {
  label: string
  greeting: string
  icon: string
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral'
}

export const ROLE_META: Record<string, RoleMeta> = {
  user: {
    label: 'Residente',
    greeting: 'Aquí puedes ver el resumen de tu unidad.',
    icon: 'mdi-home-account',
    color: 'primary',
  },
  board: {
    label: 'Consejo de administración',
    greeting: 'Aquí puedes ver el resumen de la gestión del consejo.',
    icon: 'mdi-account-tie-outline',
    color: 'secondary',
  },
  admin: {
    label: 'Administrador',
    greeting: 'Aquí puedes ver el resumen general del conjunto.',
    icon: 'mdi-shield-account-outline',
    color: 'danger',
  },
  security: {
    label: 'Vigilancia',
    greeting: 'Aquí puedes ver el resumen de portería y control de acceso.',
    icon: 'mdi-shield-lock-outline',
    color: 'warning',
  },
}

export function getRoleMeta(role: string): RoleMeta {
  return (
    ROLE_META[role] ?? {
      label: role,
      greeting: 'Bienvenido de nuevo.',
      icon: 'mdi-account-outline',
      color: 'neutral',
    }
  )
}
