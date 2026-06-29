/**
 * Provides access to window dimensions and standard font scale.
 * 
 * @constant {Object} Sizes
 * @property {number} width - The width of the device window.
 * @property {number} height - The height of the device window.
 * @property {number} fontScale - The font scaling factor of the device.
 */
import { Dimensions } from 'react-native';

const { width, height, fontScale } = Dimensions.get('window');

export const Sizes = { width, height, fontScale };
/**
 * Defines the color palette used across the application.
 * 
 * @constant {Object} Colorpath
 * @property {string} ButtonColr - Primary button color (#2C4DB9).
 * @property {string} white - Standard white (#FFFFFF).
 * @property {string} locText - Location text color (#bfbfbd).
 * @property {string} Pagebg - Page background color (#eaf5ff).
 * @property {string} yellow - Standard yellow (#F4BC00).
 * @property {string} black - Standard black (#000000).
 * @property {string} placeholder - Placeholder text color (#7D7D7D).
 * @property {string} textField - Text field background (#F8F8F8).
 * @property {string} brown - Brown accent (#292307).
 * @property {string} grey - Grey color for borders or text (#ACACAC).
 * @property {string} switch - Switch active color (#49bab5).
 * @property {string} switchPath - Switch track color (#e4f7f7).
 * @property {string} blackStatus - Dark status text (#031e1d).
 * @property {string} shadow - Shadow color (#e6ebe7).
 * @property {string} homeStatus - Home status background (#e1f9e3).
 * @property {string} exitPlace - Exit placeholder color (#DDDDDD).
 * @property {string} green - Standard green (#009E38).
 * @property {string} SkyBG - Sky blue background (#CBECFF).
 * 
 * @example
 * import Colorpath from '../Themes/Colorpath';
 * 
 * const styles = StyleSheet.create({
 *   container: {
 *     backgroundColor: Colorpath.Pagebg,
 *   },
 *   text: {
 *     color: Colorpath.black,
 *   }
 * });
 */
const Colorpath = {
    ButtonColr: "#2C4DB9",
    white: '#FFFFFF',
    locText: '#bfbfbd',
    Pagebg:"#eaf5ff",
    yellow: '#F4BC00',
    black: '#000000',
    placeholder: '#7D7D7D',
    textField: '#F8F8F8',
    brown: '#292307',
    grey: '#ACACAC',
    switch: '#49bab5',
    switchPath: '#e4f7f7',
    blackStatus: '#031e1d',
    shadow: '#e6ebe7',
    homeStatus: '#e1f9e3',
    exitPlace:"#DDDDDD",
    green:"#009E38",
    SkyBG:"#CBECFF"
}
export default Colorpath;