import { message } from "antd";
import { create } from "zustand";

import { axiosClient } from "@/helper/axios/axiosClient";
import { checkTime } from "@/helper/checkTimeFlashSale";

const initialState = {
  cart: [],
  isLoading: false,
  totalItem: 0,
  subtotal: 0,
  shipping: 0,
  coupon: "",
  total: 0,
};

const useCartStore = create((set, get) => ({
  ...initialState,
  getFee: async (address, product) => {
    set({ isLoading: true, isFeeShip: false });
    try {
      let width = 0;
      let height = 0;
      let length = 0;
      let weight = 0;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < product.length; i++) {
        width += product[i].productDetail.width * product[i].product.quantity;
        height += product[i].productDetail.height * product[i].product.quantity;
        weight += product[i].productDetail.weight * product[i].product.quantity;
        length += product[i].productDetail.length * product[i].product.quantity;
      }
      // console.log('◀◀◀  ▶▶▶',width,
      // height,
      // length,
      // weight);
      const dataShip = {
        from_district_id: 1526,
        from_ward_code: "40103",
        // service_id: 53320,
        service_type_id: 2,
        // "to_district_id":1526,
        // "to_ward_code":"40103",
        height,
        length,
        weight,
        width,
        to_district_id: parseInt(address.districtId, 10),
        to_ward_code: address.wardId.toString(),
        // height: 50,
        // length: 20,
        // weight: 200,
        // width: 20,
        insurance_value: 0,
        cod_failed_amount: 2000,
        coupon: null,
      };
      axiosClient.defaults.headers.common.token = "b100dde3-66b8-11ee-96dc-de6f804954c9";
      const res = await axiosClient.post(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        dataShip,
      );
      set({ isFeeShip: true, feeShip: res.data.data.total, isLoading: false });
    } catch (error) {
      set({ isError: true, isLoading: false });
    }
  },
  updateCart: async (data) => {
    set({ isLoading: true });
    try {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < data.length; i++) {
        // console.log('◀◀◀ data[i] ▶▶▶',data[i].product);
        // eslint-disable-next-line no-await-in-loop
        await axiosClient.put("/cart", data[i].product);
      }
      const result = await axiosClient.get("/cart");
      set({ cart: result.data.payload, isLoading: false });
      message.success("Update Success");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("◀◀◀ error ▶▶▶", error);
      set({ isLoading: false });
      message.error("Update Failed");
    }
  },
  getListCart: async () => {
    // set({ isLoading: true });
    try {
      const result = await axiosClient.get("/cart");
      const data = result?.data?.payload;
      set({ cart: data, totalItem: data?.length, isLoading: false });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("◀◀◀ error ▶▶▶", error);
      set({ isLoading: false });
    }
  },

  getListCartFlashSale: async () => {
    // set({ isLoading: true });
    try {
      const result = await axiosClient.get("/cart/get-cart-flashsale");
      const data = result?.data?.payload;
      set({ cart: data, totalItem: data?.length, isLoading: false });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("◀◀◀ error ▶▶▶", error);
      set({ isLoading: false });
    }
  },

  addToCart: async (product) => {
    set({
      isLoading: true,
    });

    const { cart } = get();

    if (cart.length > 0) {
      const [checkFlashsaleOnCart, checkFlashsaleThisProduct] = await Promise.all([
        axiosClient.get(`/flashsale/check-flashsale?productId=${cart[0].product.productId}`),
        axiosClient.get(`/flashSale/check-flashsale?productId=${product.productId}`),
      ]);

      if (checkFlashsaleOnCart.data.message === "found") {
        set({ isLoading: false });
        message.error("The shopping cart contains flash sale products, which cannot be added!!!");
        // openNotificationWithIcon("error", "The shopping cart contains flash sale products, which cannot be added!!!");

        return;
      }

      if (checkFlashsaleThisProduct.data.message === "found") {
        set({ isLoading: false });
        message.error("This is a flash sale product, please add to cart in the flash sale section");
        // openNotificationWithIcon(
        // "error",
        // "This is a flash sale product, please add to cart in the flash sale section",
        // );

        return;
      }
    } else {
      const checkFlashsaleThisProduct = await axiosClient.get(
        `/flashSale/check-flashsale?productId=${product.productId}`,
      );

      if (checkFlashsaleThisProduct.data.message === "found") {
        set({ isLoading: false });
        message.error("This is a flash sale product, please add to cart in the flash sale section");
        // openNotificationWithIcon(
        // "error",
        // "This is a flash sale product, please add to cart in the flash sale section",
        // );

        return;
      }
    }

    try {
      await axiosClient.post("cart", product);
      const newCart = await axiosClient.get("/cart");
      set({
        isLoading: false,
        cart: newCart.data?.payload,
        totalItem: newCart.data?.payload?.length,
      });
      message.success("Add cart success");
    } catch (error) {
      set({
        isLoading: false,
      });
      // eslint-disable-next-line no-console
      console.log("◀◀◀ error ▶▶▶", error);
      message.error("Add cart failed");
    }
  },

  addFlashsaleToCart: async (product) => {
    set({
      isLoading: true,
    });

    const { cart } = get();

    const [checkStockFlashsale, getTimeFlashsale] = await Promise.all([
      axiosClient.get(`/flashSale/check-flashsale?productId=${product.productId}`),
      axiosClient.get("/time-flashsale"),
    ]);

    if (getTimeFlashsale.data?.payload.expirationTime) {
      let endOfSale = getTimeFlashsale.data?.payload.expirationTime.slice(0, 10);

      endOfSale += " 23:59:59";

      const checkTimeF = checkTime(endOfSale);

      if (checkTimeF <= 0) {
        set({ isLoading: false });
        message.error("The flash sale period has ended");

        return;
      }

      if (!getTimeFlashsale.data?.payload.isOpenFlashsale) {
        set({ isLoading: false });
        message.error("Flash sale has not opened yet");

        return;
      }
    }

    if (checkStockFlashsale.data?.flashsaleStock <= 0) {
      set({ isLoading: false });
      message.error("The product has been sold out");
      return;
    }

    if (cart.length > 0) {
      set({ isLoading: false });
      message.error("The shopping cart contains flash sale products, which cannot be added!!!");
      return;
    }

    try {
      await axiosClient.post("cart", product);
      const newCart = await axiosClient.get("/cart");
      set({
        isLoading: false,
        cart: newCart.data.payload,
        totalItem: newCart.data.payload.length,
      });
      message.success("Add cart success");
    } catch (error) {
      set({
        isLoading: false,
      });
      // eslint-disable-next-line no-console
      console.log("◀◀◀ error ▶▶▶", error);
      message.error("Add cart failed");
    }
  },

  increase: (product) => {
    const { cart } = get();

    const shipping = 5;

    const updatedCart = cart.map((item) => {
      return item.id === product.id
        ? { ...item, product: { ...item.product, quantity: parseInt(item.product.quantity, 10) + 1 } }
        : item;
    });

    set((state) => ({
      cart: updatedCart,

      totalItem: parseInt(state.totalItem, 10) + 1,

      subtotal: (parseFloat(state.subtotal) + parseFloat(product.price)).toFixed(2),

      shipping: parseFloat(shipping).toFixed(2),

      coupon: "",

      total: (parseFloat(state.subtotal) + parseFloat(shipping) + parseFloat(product.price)).toFixed(2),
    }));
  },

  reduce: (product) => {
    const { cart } = get();

    let shipping = 5;

    let updatedCart = cart.map((item) => {
      return item.id === product.id ? { ...item, quantity: parseInt(item.quantity, 10) - 1 } : item;
    });

    updatedCart = updatedCart.filter((item) => {
      return item.quantity > 0;
    });

    if (updatedCart.length === 0) {
      shipping = 0;
    }

    set((state) => ({
      cart: updatedCart,

      totalItem: parseInt(state.totalItem, 10) - 1,

      subtotal: (parseFloat(state.subtotal) - parseFloat(product.price)).toFixed(2),

      shipping: parseFloat(shipping).toFixed(2),

      coupon: "",

      total: (parseFloat(state.subtotal) + parseFloat(shipping) - parseFloat(product.price)).toFixed(2),
    }));
  },

  removeFromCart: async (product) => {
    set({ isLoading: true });
    try {
      await axiosClient.delete(`/cart/${product.productId}`);
      const result = await axiosClient.get("/cart");
      const data = result.data.payload;
      set(() => ({
        cart: data,
        totalItem: data.length,
        isLoading: false,
      }));
      message.success("Delete Success");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("◀◀◀ error ▶▶▶", error);
      set({ isLoading: false });
      message.error("Delete Failed");
    }
  },

  applyCoupon: (coupon) => {
    const { cart } = get();

    const validCoupons = ["freeship", "10%"];

    if (validCoupons.includes(coupon)) {
      set(() => ({
        coupon,
      }));
    }

    if (coupon === "freeship" && cart.length > 0) {
      const shipping = 0;

      set((state) => ({
        shipping: parseFloat(shipping).toFixed(2),

        total: parseFloat(state.subtotal).toFixed(2),
      }));
    }

    if (coupon === "10%" && cart.length > 0) {
      const shipping = 5;

      set((state) => ({
        shipping: parseFloat(shipping).toFixed(2),

        total: (((100 - 10) * parseFloat(state.subtotal)) / 100 + parseFloat(shipping)).toFixed(2),
      }));
    }
  },

  resetCart: async () => {
    set({ isLoading: true });
    try {
      const result = await axiosClient.delete("cart");
      console.log(result)
      set({ isLoading: false, cart: result?.data?.payload, totalItem: result?.data?.payload?.length });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("◀◀◀ error ▶▶▶", error);
      set({ isLoading: false });
    }
  },
}));

export default useCartStore;
