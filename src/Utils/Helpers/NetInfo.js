/**
 * Network connectivity utility.
 * 
 * @module NetInfo
 */
import NetInfo from '@react-native-community/netinfo';

/**
 * Checks the current network connection status.
 * 
 * @function connectionrequest
 * @returns {Promise<boolean>} A promise that resolves if connected, or rejects if disconnected.
 */
export default function connectionrequest() {
    return new Promise(function (resolve, reject) {
        NetInfo.fetch().then(state => {
             //console.log("Is connected", state.isConnected);
            if (state.isConnected) {
                resolve(state.isConnected);
            } else {
                reject(state.isConnected)
            }
        });
    });
}


