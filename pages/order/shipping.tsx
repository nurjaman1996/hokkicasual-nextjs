import Head from "next/head";
import Image from "next/image";
import * as fa from "react-icons/fa";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import React, { Component, useRef, useState } from "react";
import { compareAsc, format } from 'date-fns';
import Link from "next/link";
import { count } from "console";
import DataTable, { ExpanderComponentProps } from 'react-data-table-component';
import useSWR from 'swr';
import styles from '../../styles/Table.module.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Icons from "react-icons/fa";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Shipping() {
    // format(new Date(2014, 1, 11), 'yyyy-MM-dd')

    const [Query, setQuery] = useState("all");

    function querySet(e: any) {
        if (e.target.value === "") {
            setQuery("all");
        } else {
            setQuery(e.target.value);
        }

    }

    const { data, error, isLoading, mutate } = useSWR(`https://api.hokkiscasual.com/orders/0/10/SEDANG DIKIRIM/${Query}`, fetcher);

    const [date, setDate] = useState(format(new Date(), 'dd/MM/yyyy'));
    const [start, setStart] = useState(30);
    const [hasMore, setHasMore] = useState(true);

    const list_order: any = [];

    if (!isLoading && !error) {
        data.orders.map((order: any, index: number) => {
            return (
                list_order.push(
                    <div key={order.id} className="shadow hover:shadow-md w-full h-auto bg-white rounded-lg text-sm">
                        <div className="flex flex-wrap w-full h-auto border-b py-2.5 pt-3 px-7 items-center">
                            {/* <div className="grow">Cust. <b>{order.customer}</b> | {order.sales_channel}</div> */}
                            <div className="grow text-start text-xs flex flex-col">
                                {/* <span>Invoice <b>#{order.id_invoice}</b></span> */}
                                <span><b>{order.sales_channel}</b></span>
                                <span>{format(new Date(order.created_at), 'dd MMMM, Y HH:mm')} | Pesanan #<b className="text-blue-500">{order.id_pesanan}</b></span>
                            </div>


                        </div>

                        <div className="grid grid-cols-5 px-7 py-5">
                            <div className="flex flex-col gap-5 col-span-2">
                                {(function (rows: any, i, len) {
                                    while (++i <= len) {
                                        rows.push(
                                            <div key={i} className="flex h-[65px] justify-start items-start gap-5">
                                                <Image
                                                    className="rounded border h-[100%] w-auto"
                                                    // src="/produk.jpg"
                                                    src={`https://hokkiscasual.com/apiupload/${order.details_order[i - 1].img}`}
                                                    alt="product-1"
                                                    height="500"
                                                    width="500"
                                                    priority
                                                />
                                                <div className="flex flex-col grow h-[100%] justify-center">
                                                    <div className="flex flex-wrap gap-1">
                                                        <span className="font-medium line-clamp-1">{order.details_order[i - 1].produk}</span>
                                                    </div>
                                                    <div>
                                                        <button className="text-xs text-blue-500 font-bold">Tukar Size</button>
                                                        <span> | </span>
                                                        <button className="text-xs text-red-500 font-bold">Refund</button>
                                                    </div>
                                                    <div className="text-xs text-black">Variasi <span className="text-black font-medium">{order.details_order[i - 1].size}</span> | {order.details_order[i - 1].source}</div>
                                                    <span className="text-xs text-black">x{order.details_order[i - 1].qty}</span>
                                                </div>

                                            </div>
                                        )
                                    }
                                    return rows;
                                })([], 0, order.details_order.length)}
                            </div>

                            <div className="justify-center flex self-center">
                                <div className="text-start flex flex-col">
                                    <span className="font-bold">Rp{order.total_amount}</span>
                                    <span>{order.payment.length < 1 ? "Belum ada Pembayaran" : ""}</span>
                                </div>
                            </div>

                            <div className="text-center text-xs self-center">
                                <span className="font-bold">{order.status_pesanan}</span>
                            </div>

                            <div className="justify-center text-xs flex flex-wrap gap-2 self-center">
                                <div className="mt-1 flex flex-1 items-center justify-center border rounded-lg">
                                    <select
                                        className="appearance-none h-auto cursor-pointer w-[70%] bg-white py-2 pl-5 focus:outline-none text-sm" placeholder="Pilih Store">
                                        <option value="">Update Pesanan</option>
                                        <option value="">Selesai</option>
                                        <option value="">Cancel</option>
                                    </select>
                                    <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4"></i>
                                </div>

                                {/* <div>
                                    <button
                                        onClick={() => {
                                            showdeleteModal(order.id_pesanan, index)
                                        }}
                                        className="flex flex-wrap gap-1 items-center text-white bg-green-500 border px-3 py-1.5 rounded-md"
                                    >
                                        <Icons.FaCheckCircle />
                                        <span className="font-medium">Selesai</span>
                                    </button>
                                </div>

                                <div>
                                    <button
                                        onClick={() => {
                                            showdeleteModal(order.id_pesanan, index)
                                        }}
                                        className="flex flex-wrap gap-1 items-center text-white bg-red-500 border px-3 py-1.5 rounded-md"
                                    >
                                        <Icons.FaTimesCircle />
                                        <span className="font-medium">Cancel</span>
                                    </button>
                                </div> */}

                            </div>
                        </div>

                        <div className="flex flex-wrap w-full h-auto border-t py-4 px-7 items-center ">
                            {/* <div className="text-xs flex flex-wrap gap-2">
                                <div>
                                    <button
                                        onClick={() => {
                                            showdeleteModal(order.id_pesanan, index)
                                        }}
                                        className="flex flex-wrap gap-1 items-center text-white bg-blue-500 border px-3 py-1.5 rounded-md"
                                    >
                                        <Icons.FaUndo />
                                        <span className="font-medium">Retur</span>
                                    </button>
                                </div>

                                <div>
                                    <button
                                        onClick={() => {
                                            showdeleteModal(order.id_pesanan, index)
                                        }}
                                        className="flex flex-wrap gap-1 items-center text-white bg-red-500 border px-3 py-1.5 rounded-md"
                                    >
                                        <Icons.FaTimesCircle />
                                        <span className="font-medium">Refund</span>
                                    </button>
                                </div>

                                <div>
                                    <button
                                        onClick={() => {
                                            showdeleteModal(order.id_pesanan, index)
                                        }}
                                        className="flex flex-wrap gap-1 items-center text-white bg-green-500 border px-3 py-1.5 rounded-md"
                                    >
                                        <Icons.FaCheckCircle />
                                        <span className="font-medium">Selesai</span>
                                    </button>
                                </div>
                            </div> */}
                        </div>

                    </div>
                )
            )
        })
    }


    const [updateorder, setupdateorder] = React.useState(false);
    const [id_pesanan, setid_pesanan] = React.useState(null);

    function showdeleteModal(id_pesanan: any, index: number) {
        setid_pesanan(id_pesanan)
        setupdateorder(true)
    }

    async function updateOrder() {
        await axios.post(`https://api.hokkiscasual.com/selesai/${id_pesanan}`)
            .then(function (response) {
                // console.log(response.data);
                mutate();
            });

        toast.success("Data berhasil dihapus", {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
            autoClose: 2000,
        });

        setupdateorder(false)
    }

    return (
        <div className="p-5">
            <div className="font-bold text-3xl border-b border-[#2125291A] h-14 mb-5">Orders</div>

            <div className="flex flex-wrap items-center content-center">
                <div className="shadow rounded-lg w-auto flex flex-row text-center content-center">
                    {/* <button type="button" className="rounded-l-lg bg-gray-200 hover:bg-gray-300 h-[50px] text-gray-700 font-medium px-4 flex flex-wrap gap-2 content-center">
                        <span>Order ID</span>
                        <div className="my-auto">
                            <fa.FaChevronDown size={10} className="text-gray-700" />
                        </div>
                    </button> */}

                    <input onChange={(e) => querySet(e)} className="h-[50px] border-0 w-[280px] py-2 pl-5 pr-3 text-gray-700 focus:outline-none rounded-l-lg" type="text" placeholder="Pencarian..." />

                    <button type="button" className="rounded-r-lg bg-white hover:bg-gray-200 h-[50px] text-gray-700 font-medium px-5">
                        <div className="my-auto">
                            <fa.FaSearch size={17} className="text-gray-700" />
                        </div>
                    </button>
                </div>

                <div className="shadow rounded-lg ml-auto w-[290px] flex flex-row items-center justify-end bg-white">
                    <Flatpickr
                        className="text-gray-500 h-[50px] text-start py-2 px-4 w-full rounded-lg focus:outline-none"
                        // value={date}
                        placeholder="Select Date Range"
                        options={{
                            mode: "range",
                            dateFormat: "d/m/Y",
                            enableTime: false,
                            // disable: [
                            //   function (date) {
                            //     return !(date.getDate() % 8);
                            //   }
                            // ]
                            onClose: function (selectedDates, dateStr, instance) {
                                setDate(dateStr);
                            },
                        }}
                    />

                    <i className="fi fi-rr-calendar w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4  mr-4"></i>
                </div>

                <Link href='/order/add_order'>
                    <button type="button" className="ml-3 shadow rounded-lg bg-blue-600 hover:bg-blue-800 h-[50px] text-white px-4 flex flex-wrap gap-2 content-center">
                        Tambah Order
                        <div className="my-auto">
                            <fa.FaPlus size={13} className="text-white" />
                        </div>
                    </button>
                </Link>
            </div>

            <div className="font-medium text-black text-sm py-3 pl-1">
                <span>{list_order.length} order ditampilkan</span>
            </div>

            {/* <table className="table table-fixed bg-transparent h-px mb-4 text-sm w-full">
                <thead className="bg-white text-gray-500">
                    <tr className="rounded-lg">
                        <th className="pl-2 py-3 rounded-l-lg w-[5%] text-start">
                            <span className="ml-3">No.</span>
                        </th>
                        <th className="py-3 text-start rounded-l-lg">
                            <span className="ml-5">Produk</span>
                        </th>
                        <th className="py-3 ">
                            Total Pembayaran
                        </th>
                        <th className="py-3 ">
                            Status
                        </th>
                        <th className="py-3 rounded-r-lg">
                            <span className="mr-7">Aksi</span>
                        </th>
                    </tr>
                </thead>
            </table> */}

            <div className="grid grid-cols-1 gap-4 w-full h-auto pb-10">
                {list_order}
            </div>

            {updateorder ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl ">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[500px]">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <span className="text-sm font-semibold">
                                        Warning
                                    </span>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                    <span className="text-sm font-semibold">
                                        Selesaikan Pesanan {id_pesanan}?
                                    </span>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                                        type="button"
                                        onClick={() => {
                                            setupdateorder(false);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                        type="button"
                                        onClick={() => updateOrder()}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}

        </div>
    );
}
