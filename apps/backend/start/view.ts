import edge from 'edge.js'
import env from '#start/env' // IMPORTANTE: Usamos el env tipado de Adonis

// Registramos las variables para que estén disponibles en todos los .edge
edge.global('appName', env.get('APP_NAME'))
edge.global('appUrl', env.get('APP_URL'))
