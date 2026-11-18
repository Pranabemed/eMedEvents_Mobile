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
            if (state.isConnected === true) {
                resolve(true);
            } else if (state.isConnected === null) {
                // Initial state may be null while native module initializes. Wait briefly.
                setTimeout(() => {
                    NetInfo.fetch().then(nextState => {
                        if (nextState.isConnected !== false) {
                            resolve(true);
                        } else {
                            reject(false);
                        }
                    }).catch(() => resolve(true));
                }, 200);
            } else {
                reject(state.isConnected);
            }
        }).catch(() => resolve(true));
    });
}


