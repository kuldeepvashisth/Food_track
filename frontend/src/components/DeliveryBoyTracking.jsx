import { useEffect } from 'react'
import scooter from '../assets/scooter.png'
import home from '../assets/home.png'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const deliveryBoyIcon = new L.Icon({
  iconUrl: scooter,
  iconSize: [32, 32],
  iconAnchor: [16, 32]
})

const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [32, 32],
  iconAnchor: [16, 32]
})

function FitMapBounds({ firstLatitude, firstLongitude, secondLatitude, secondLongitude }) {
  const map = useMap()

  useEffect(() => {
    map.fitBounds(
      [[firstLatitude, firstLongitude], [secondLatitude, secondLongitude]],
      { padding: [32, 32], maxZoom: 13 }
    )
  }, [map, firstLatitude, firstLongitude, secondLatitude, secondLongitude])

  return null
}

function DeliveryBoyTracking({ data }) {
  const toCoordinate = value =>
    value == null || (typeof value === 'string' && value.trim() === '')
      ? NaN
      : Number(value)
  const deliveryBoyLatitude = toCoordinate(data?.deliveryBoyLocation?.latitude)
  const deliveryBoyLongitude = toCoordinate(data?.deliveryBoyLocation?.longitude)
  const customerLatitude = toCoordinate(data?.customerLocation?.latitude)
  const customerLongitude = toCoordinate(data?.customerLocation?.longitude)
  const hasDeliveryBoyLocation =
    Number.isFinite(deliveryBoyLatitude) &&
    Number.isFinite(deliveryBoyLongitude) &&
    Math.abs(deliveryBoyLatitude) <= 90 &&
    Math.abs(deliveryBoyLongitude) <= 180
  const hasCustomerLocation =
    Number.isFinite(customerLatitude) &&
    Number.isFinite(customerLongitude) &&
    Math.abs(customerLatitude) <= 90 &&
    Math.abs(customerLongitude) <= 180

  if (!hasCustomerLocation) {
    return (
      <p className='mt-4 rounded-lg bg-white p-4 text-sm text-slate-500'>
        Map unavailable: customer location is missing.
      </p>
    )
  }

  const mapCenter = hasDeliveryBoyLocation
    ? [deliveryBoyLatitude, deliveryBoyLongitude]
    : [customerLatitude, customerLongitude]
  const deliveryBoyPosition = [deliveryBoyLatitude, deliveryBoyLongitude]
  const customerPosition = [customerLatitude, customerLongitude]
  const path = hasDeliveryBoyLocation ? [deliveryBoyPosition, customerPosition] : null

  return (
    <div className='w-full h-[400px] mt-4'>
      <MapContainer
        center={mapCenter}
        zoom={13}
        className='w-full h-full'
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <FitMapBounds
          firstLatitude={hasDeliveryBoyLocation ? deliveryBoyLatitude : customerLatitude}
          firstLongitude={hasDeliveryBoyLocation ? deliveryBoyLongitude : customerLongitude}
          secondLatitude={customerLatitude}
          secondLongitude={customerLongitude}
        />
        {hasDeliveryBoyLocation &&
          <Marker position={[deliveryBoyLatitude, deliveryBoyLongitude]} icon={deliveryBoyIcon} >
       <Popup><p>Delivery Boy</p></Popup>
          </Marker>
        }
        <Marker position={[customerLatitude, customerLongitude]} icon={customerIcon}>
         <Popup> <p>Customer</p> </Popup>
        </Marker>
        {path && <Polyline positions={path} color='blue' />}
      </MapContainer>
      {!hasDeliveryBoyLocation &&
        <p className='mt-2 text-sm text-slate-500'>Delivery partner location is unavailable.</p>}
    </div>
  )
}

export default DeliveryBoyTracking