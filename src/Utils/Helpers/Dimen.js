/**
 * Utility for scaling dimensions based on device pixel ratio and screen width.
 * Useful for ensuring consistent sizing across different device sizes.
 * 
 * @module Dimen
 */
import { PixelRatio, Dimensions } from "react-native";

const scale = (Dimensions.get("window").width / 320);

/**
 * Normalizes a given size based on the device's screen width relative to a 320px baseline.
 * 
 * @function normalize
 * @param {number} size - The original size to scale.
 * @returns {number} The scaled size, rounded to the nearest pixel.
 */
export default normalize = (size) => {

    const newSize = size * scale

    return Math.round(PixelRatio.roundToNearestPixel(newSize))

}