export function vistorParkingCalc(
  checkinDate: string,
  checkoutDate: string | null,
  vehicleType: string
): { hours: number; price: number } {
  const checkin = new Date(checkinDate)
  const checkout = checkoutDate ? new Date(checkoutDate) : new Date()
  const diffInMs = checkout.getTime() - checkin.getTime()
  const diffInHours = Math.ceil(diffInMs / (1000 * 60 * 60))
  const tariffs: Record<string, number> = {
    car: 2000,
    motorcycle: 1000,
    bicycle: 500,
  }
  const pricePerHour = tariffs[vehicleType] || 0
  const price = diffInHours > 2 ? pricePerHour * (diffInHours - 2) : 0 // Assuming first 2 hours are free

  return {
    hours: diffInHours,
    price: price,
  }
}
