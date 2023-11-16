import { create } from "zustand";

import { axiosUser } from "@/helper/axios";

const initialState = {
  isLoading: false,
  payload: {},
};

const useCheckIpnVnpay = create((set) => ({
  ...initialState,

  fetch: async (data) => {
    try {
      const queryArray = Object.keys(data).map((key) => `${key}=${encodeURIComponent(data[key])}`);

      const url = `http://localhost:9000/vnPay/check_ipn?${queryArray.join("&")}`;

      const response = await axiosUser.get(url, data);

      set({ payload: response.data });
    } catch (error) {
      set({ payload: error.response.data });
    }
  },
}));

export default useCheckIpnVnpay;
