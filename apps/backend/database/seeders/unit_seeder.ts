import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Unit from '#models/unit'

export default class UnitSeeder extends BaseSeeder {
  async run() {
    const towers = 5
    const floorsPerTower = 20
    const apartmentsPerFloor = 8

    const typologies = [
      { floor: 1, aptos: [4, 7], typology: 1, buildArea: 46.5, privateArea: 40.5 },
      { floor: null, aptos: [3, 4, 7, 8], typology: 1, buildArea: 46.5, privateArea: 40.5 },
      { floor: 1, aptos: [2, 5, 6], typology: 2, buildArea: 46, privateArea: 40.5 },
      { floor: null, aptos: [1, 2, 5, 6], typology: 2, buildArea: 46, privateArea: 40.5 },
      { floor: 1, aptos: [1, 3, 8], typology: 3, buildArea: 41.5, privateArea: 36 },
    ]

    const units: Array<{
      name: string
      tower: number
      apto: number
      floor: number
      typology: number
      buildArea: string
      privateArea: string
      coefficient: string
      status: 'vacant'
    }> = []

    let totalPrivateArea = 0

    for (let tower = 1; tower <= towers; tower++) {
      for (let floor = 1; floor <= floorsPerTower; floor++) {
        for (let apto = 1; apto <= apartmentsPerFloor; apto++) {
          const exactFloorRule = typologies.find((rule) => rule.floor === floor && rule.aptos.includes(apto))
          const genericRule = typologies.find((rule) => rule.floor === null && rule.aptos.includes(apto))
          const selectedRule = exactFloorRule ?? genericRule

          if (!selectedRule) {
            throw new Error(`No hay tipologia configurada para piso ${floor}, apto ${apto}`)
          }

          totalPrivateArea += selectedRule.privateArea

          const floorLabel = String(floor).padStart(2, '0')
          const aptoLabel = String(apto).padStart(2, '0')

          units.push({
            name: `${tower}${floorLabel}${aptoLabel}`,
            tower: tower,
            apto: Number(`${floorLabel}${aptoLabel}`),
            floor,
            buildArea: selectedRule.buildArea.toFixed(2),
            privateArea: selectedRule.privateArea.toFixed(2),
            typology: selectedRule.typology,
            coefficient: '0.0000',
            status: 'vacant',
          })
        }
      }
    }

    for (const unit of units) {
      const privateArea = Number(unit.privateArea)
      unit.coefficient = ((privateArea / totalPrivateArea) * 100).toFixed(4)
    }

    await Unit.updateOrCreateMany('name', units)
  }
}
