// Интерфейс для требуемых гео данных
export interface GeoData {
  lat: number,
  lng: number,
  country: string|null|undefined,
  city: string|null|undefined
}
