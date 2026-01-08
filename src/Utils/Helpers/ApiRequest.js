import axios from 'axios';
import constants from './constants';

export async function getApi(url, header) {
  console.log('GetApi: ', `${constants.BASE_URL}/${url}`);

  return await axios.get(`${constants.BASE_URL}/${url}`, {
    headers: {
      Accept: header.Accept,
      'Content-type': header.contenttype,
      // 'x-access-token': `${header.authorization}`, --- node js api 
      // Authorization: 'Bearer' + ' ' + header.authorization, 
      eMedAuthorization:  header.authorization,
    },
  });
}

export async function getApiWithParam(url, param, header) {
  console.log('getApiWithParam: ', `${constants.BASE_URL}/${url}`);

  return await axios({
    method: 'GET',
    baseURL: constants.BASE_URL,
    url: url,
    params: param,
    headers: {
      Accept: header.Accept,
      'Content-type': header.contenttype,
    },
  });
}
export async function postApi(url, payload, header) {
  console.log('PostApi: ========= email', `${constants.BASE_URL}/${url}`, payload,header);
  return await axios.post(`${constants.BASE_URL}/${url}`, payload, {
    headers: {
      Accept: header.Accept,
      'Content-Type': header.contenttype,
      // 'x-access-token': `${header.authorization}`,
      eMedAuthorization:  header.authorization,
      IPADDRESS:header.IPADDRESS
    },
  });
}
export async function deleteApi(url, payload, header) {
  const cleanUrl = `${constants.BASE_URL}/${url}`.replace(/\/\/+/g, '/').trim();
  console.log('Full URL:', cleanUrl,`${constants.BASE_URL}/${url}`); // Log the full URL for debugging

  try {
    return await axios.delete(cleanUrl, {
      headers: {
        Accept: header.Accept,
        'Content-Type': header.contenttype,
        eMedAuthorization: header.authorization,
      },
      data: payload, 
    });
  } catch (error) {
    console.error('Error with DELETE request:', error.response?.data || error.message);
    throw error; 
  }
}


