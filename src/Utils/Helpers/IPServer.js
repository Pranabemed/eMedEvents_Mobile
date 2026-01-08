let PUBLIC_IP = null;

export const initPublicIP = async () => {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    PUBLIC_IP = data.ip;
    console.log('Public IP initialized:', PUBLIC_IP);
  } catch (e) {
    console.log('IP init failed:', e);
    PUBLIC_IP = null;
  }
};

export const getPublicIP = () => PUBLIC_IP;
