import React, { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { setCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

import RePayment from "@/components/buttons/rePayment";

import { axiosServer } from "@/helper/axios/axiosServer";
import useFetchCheckout from "@/store/checkout";

function OrderDetails(props) {
  const { orderDetail } = props;

  const router = useRouter();

  const [isDisable, setIsDisable] = useState(true);

  const fetchCheckout = useFetchCheckout((state) => state.fetch);

  const urlVnpay = useFetchCheckout((state) => state.payload.url);

  useEffect(() => {
    if (urlVnpay) {
      router.push(urlVnpay);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlVnpay]);

  useEffect(() => {
    if (
      orderDetail?.status === "WAITING" &&
      orderDetail?.paymentType === "CREDIT_CARD" &&
      orderDetail?.buyType === "ONLINE"
    ) {
      setIsDisable(false);
    }
  }, [orderDetail?.buyType, orderDetail?.paymentType, orderDetail?.status]);

  const renderStatus = (status) => {
    switch (status.toString()) {
      case "WAITING":
        return "bg-yellow-200";
      case "COMPLETED":
        return "bg-green-200";
      case "REJECT":
        return "bg-red-200";
      case "CANCELED":
        return "bg-gred-200";
      case "DELIVERING":
        return "bg-blue-200";
      default:
        return "bg-gray-200";
    }
  };

  const onClick = useCallback((finalTotal) => {
    setCookie("orderId", orderDetail?._id);

    const data = {
      amount: finalTotal * 24000,
      bankCode: "NCB",
      language: "en",
      returnUrl: process.env.NEXT_PUBLIC_VNPAY_RETURN_URL,
    };

    fetchCheckout(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mt-[5rem]">
      <div className="min-w-[20rem] min-h-fit bg-text-1 shadow-md rounded-sm px-[2rem] py-[2rem] whitespace-nowrap">
        <div className="py-[0.5rem] mb-[1rem] flex items-center justify-start">
          <span className="pl-[0.5rem] min-w-[33.5rem] max-w-[33.5rem] font-inter text-[1rem] font-[700] leading-[1rem]">
            Product
          </span>
          <span className="min-w-[7rem] max-w-[7rem] font-inter text-[1rem] font-[700] leading-[1rem]">Quantity</span>
          <span className="min-w-[7.5rem] max-w-[7.5rem] font-inter text-[1rem] font-[700] leading-[1rem]">
            Discount
          </span>
          <span className="min-w-[10rem] max-w-[10rem] font-inter text-[1rem] font-[700] leading-[1rem]">Price</span>
          <span className="min-w-[8rem] max-w-[8rem] font-inter text-[1rem] font-[700] leading-[1rem]">
            Discounted Price
          </span>
        </div>
        {orderDetail?.orderDetails?.map((item) => {
          return (
            <div key={item.productId} className="py-[0.5rem] flex items-center justify-start">
              <Link title={item?.product?.name} className="flex items-center justify-start" href={`/${item.productId}`}>
                <Image
                  className="max-w-[4rem] max-h-[4rem] mr-[0.5rem]"
                  src={item?.product?.image?.location}
                  alt="..."
                  width={1000}
                  height={1000}
                />

                <span className="min-w-[29.5rem] max-w-[29.5rem] font-inter text-[1rem] font-[400] leading-[1rem]">
                  {item?.product?.name}
                </span>
              </Link>

              <span className="min-w-[7rem] max-w-[7rem] font-inter text-[1rem] font-[400] leading-[1rem]">
                {item?.quantity}
              </span>

              <span className="min-w-[7rem] max-w-[7rem] font-inter text-[1rem] font-[400] leading-[1rem]">
                {item?.discount}%
              </span>

              <span className="min-w-[10rem] max-w-[10rem] font-inter text-[1rem] font-[400] leading-[1rem]">
                ${parseFloat(item?.price).toFixed(2)}
              </span>

              <span className="min-w-[10rem] max-w-[10rem] font-inter text-[1rem] font-[400] leading-[1rem]">
                ${(parseFloat(item?.price) * (100 - parseInt(item?.discount, 10))) / 100}
              </span>
            </div>
          );
        })}
        <div className="flex flex-col items-start justify-center mt-[2rem]">
          <span className="font-inter text-[1rem] font-[500] leading-[2rem]">
            Status:{" "}
            <span className={classNames("px-[0.5rem] py-[0.2rem] rounded-md", renderStatus(orderDetail?.status))}>
              {orderDetail?.status}
            </span>
          </span>
          <span className="font-inter text-[1rem] font-[500] leading-[2rem]">
            Payment type: <span>{orderDetail?.paymentType}</span>
          </span>

          <span className="font-inter text-[1rem] font-[500] leading-[2rem]">
            Buy type: <span>{orderDetail?.buyType}</span>
          </span>
        </div>
        <div className="mt-[2rem]">
          <RePayment
            disabled={isDisable}
            text="Repayment"
            type="button"
            onClick={() => onClick(orderDetail?.totalPrice)}
          />
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;

OrderDetails.propTypes = {
  orderDetail: PropTypes.instanceOf(Object).isRequired,
};

export async function getServerSideProps(req) {
  try {
    const { params } = req;

    const response = await axiosServer.get(`/orders-admin/${params.id}`);

    return {
      props: {
        orderDetail: response.data.payload || {},
      },
    };
  } catch (error) {
    return {
      // notFound: true,
      props: {
        product: {},
        relatedItem: [],
      },
    };
  }
}