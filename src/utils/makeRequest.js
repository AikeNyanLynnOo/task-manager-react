import axios from "axios";

export const makeRequest = async (config) => {
  try {
    const response = await axios(config);

    // console.log("API response>>", response);
    return {
      status: response.status,
      statusText: response.statusText,
      success: response.status >= 200 && response.status < 300 ? true : false,
      data: response.data || null,
    };
  } catch (error) {
    console.log("API response errro>>", error);
    const { status, statusText, data } = error?.response;

    return {
      status,
      statusText,
      success: false,
      data: data || null,
    };
  }
};
