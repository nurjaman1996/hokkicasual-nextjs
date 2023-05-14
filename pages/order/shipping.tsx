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

    const [tabactive, settabactive] = React.useState("SEDANG DIKIRIM");
    const [status_pesanan, setstatus_pesanan] = React.useState("SEDANG DIKIRIM");

    // const [count_dikirim, setcount_dikirim] = React.useState(0);
    // const [count_selesai, setcount_selesai] = React.useState(0);
    // const [count_cancel, setcount_cancel] = React.useState(0);

    function tabActive(select: any) {
        settabactive(select);
        setstatus_pesanan(select);
    }

    const { data, error, isLoading, mutate } = useSWR(`https://api.hokkiscasual.com/orders/0/10/${status_pesanan}/${Query}`, fetcher);


    const { data: count_data, error: count_error, isLoading: count_isLoading, mutate: count_mutate } = useSWR(`https://api.hokkiscasual.com/get_count_pesanan`, fetcher);

    if (!count_isLoading && !count_error) {
        var count_dikirim = count_data.dikirim;
        var count_selesai = count_data.selesai;
        var count_cancel = count_data.cancel;
    }



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

                                                    {(function () {
                                                        if (tabactive != "CANCEL") {
                                                            return (
                                                                <div>
                                                                    <button className="text-xs text-blue-500 font-bold">Tukar Size</button>
                                                                    <span> | </span>
                                                                    <button className="text-xs text-red-500 font-bold">Refund</button>
                                                                </div>
                                                            )
                                                        }
                                                    })()}

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
                                    {(function () {
                                        if (tabactive != "CANCEL") {
                                            return (
                                                <span>{order.payment.length < 1 ? "Belum ada Pembayaran" : ""}</span>
                                            )
                                        }
                                    })()}
                                </div>
                            </div>

                            <div className="text-center text-xs self-center">
                                <span className="font-bold">{order.status_pesanan}</span>
                            </div>


                            {(function () {
                                if (tabactive === "SEDANG DIKIRIM") {
                                    return (
                                        <div className="justify-center text-xs flex flex-wrap gap-2 self-center">
                                            <div>
                                                <button
                                                    onClick={() => {
                                                        showSelesaimodal(order.id_pesanan, index)
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
                                                        showCancelmodal(order.id_pesanan, index)
                                                    }}
                                                    className="flex flex-wrap gap-1 items-center text-white bg-red-500 border px-3 py-1.5 rounded-md"
                                                >
                                                    <Icons.FaTimesCircle />
                                                    <span className="font-medium">Cancel</span>
                                                </button>
                                            </div>
                                        </div>
                                    )
                                } else if (tabactive === "SELESAI") {
                                    return (
                                        <div className="justify-center text-xs flex flex-wrap gap-2 self-center">
                                            <div>
                                                <button
                                                    onClick={() => {
                                                        showCancelmodal(order.id_pesanan, index)
                                                    }}
                                                    className="flex flex-wrap gap-1 items-center text-white bg-red-500 border px-3 py-1.5 rounded-md"
                                                >
                                                    <Icons.FaTimesCircle />
                                                    <span className="font-medium">Cancel</span>
                                                </button>
                                            </div>
                                        </div>
                                    )
                                }
                            })()}
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


    const [selesaiOrdermodal, setselesaiOrdermodal] = React.useState(false);
    const [cancelOrderModal, setcancelOrderModal] = React.useState(false);
    const [id_pesanan, setid_pesanan] = React.useState(null);

    function showSelesaimodal(id_pesanan: any, index: number) {
        setid_pesanan(id_pesanan)
        setselesaiOrdermodal(true)
    }

    function showCancelmodal(id_pesanan: any, index: number) {
        setid_pesanan(id_pesanan)
        setcancelOrderModal(true)
    }

    async function updatePesanan(status: any) {
        await axios.post(`https://api.hokkiscasual.com/updatepesanan/${id_pesanan}`, {
            status
        }).then(function (response) {
            // console.log(response.data);
            mutate();

            toast.success("Data berhasil Update", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 2000,
            });

            setselesaiOrdermodal(false)
            setcancelOrderModal(false)
        });


    }

    return (
        <div className="p-5">

            <ToastContainer className="mt-[50px]" />

            <div className="font-bold text-3xl border-b border-[#2125291A] h-14 mb-5">Orders</div>

            <div className="flex flex-wrap items-center content-center mb-3">
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

            <div className="my-4 mt-3 py-2 px-5 flex flex-warp items-center bg-white rounded-lg h-[50px]">
                <button onClick={() => tabActive("SEDANG DIKIRIM")}
                    className={`${tabactive === "SEDANG DIKIRIM" ? "border-blue-500 text-blue-500 border-b-4 font-bold" : "text-black"} text-sm px-3 h-[50px]`}>
                    Dikirim {count_dikirim}
                </button>

                <button onClick={() => tabActive("SELESAI")}
                    className={`${tabactive === "SELESAI" ? "border-blue-500 text-blue-500 border-b-4 font-bold" : "text-black"} text-sm px-3 h-[50px]`}>
                    Selesai {count_selesai}
                </button>

                <button onClick={() => tabActive("CANCEL")}
                    className={`${tabactive === "CANCEL" ? "border-blue-500 text-blue-500 border-b-4 font-bold" : "text-black"} text-sm px-3 h-[50px]`}>
                    Batal {count_cancel}
                </button>

                <div className="font-medium text-black text-sm grow text-end px-5">
                    {list_order.length} order ditampilkan
                </div>
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

            {selesaiOrdermodal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl ">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[500px]">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <span className="text-sm font-semibold">
                                        Update Pesanan {id_pesanan}
                                    </span>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                    <span className="text-sm font-semibold">
                                        Ingin Merubah Status Pesanan Jadi Selesai?
                                    </span>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                                        type="button"
                                        onClick={() => {
                                            setselesaiOrdermodal(false);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-green-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                        type="button"
                                        onClick={() => updatePesanan("SELESAI")}
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

            {cancelOrderModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl ">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[500px]">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <span className="text-sm font-semibold">
                                        Update Pesanan {id_pesanan}
                                    </span>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                    <span className="text-sm font-semibold">
                                        Ingin Merubah Status Pesanan Jadi Cancel?
                                    </span>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                                        type="button"
                                        onClick={() => {
                                            setcancelOrderModal(false);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                        type="button"
                                        onClick={() => updatePesanan("CANCEL")}
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
