import axios from 'axios';

export const request = (config: any) => {
  return axios({
    ...config,
    url: process.env.REACT_APP_API_BASE_URL + config.url,
    headers: {
      Authorization: localStorage.getItem('token'),
      "api-customer-id": 13286
    }
  })
  .then((data) => {
    return Promise.resolve(data.data);
  })
  .catch((err) => {
    console.error(err);
  });
}

export const requestAdmin = async (config: any) => {
  // const response = await axios({
  //   ...config,
  //   url: process.env.REACT_APP_API_BASE_URL + config.url,
  //   headers: {
  //     Authorization: localStorage.getItem('adminToken'),
  //   }
  // });

  // return response.data
  return axios({
    ...config,
    url: process.env.REACT_APP_API_BASE_URL + config.url,
    headers: {
      Authorization: localStorage.getItem('adminToken'),
    }
  })
  .then((data) => {
    return Promise.resolve(data.data);
  })
  .catch((err) => {
    return Promise.reject(err.response.data)
  });
}

export const commonRequest = async (config: any) => {
  try {
    const response = await axios({
      ...config
    });
    return response;
  } catch (error: any) {
    throw new Error(error.mesage)
  }
}

export default request;
