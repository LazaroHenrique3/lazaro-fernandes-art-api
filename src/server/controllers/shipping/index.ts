import * as calculate from './CalculateShippingValue'
import * as trackOrder from './TrackOrder'

export const ShippingController = {
    ...calculate,
    ...trackOrder
}