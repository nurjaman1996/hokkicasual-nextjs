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

    const { data: warehouse_data, error: warehouse_error, isLoading: warehouse_isLoading, mutate: warehouse_mutate } = useSWR(`https://api.hokkiscasual.com/getwarehouse`, fetcher);
    const list_warehouse: any = [];
    if (!warehouse_isLoading && !warehouse_error) {
        warehouse_data.data_ware.map((area: any, index: number) => {
            list_warehouse.push(
                <option key={index} value={area.id_ware}>{area.warehouse}</option>
            )
        })
    }

    const [returModal, setreturModal] = React.useState(false);
    const [id_produkretur, setid_produkretur] = React.useState("");
    const [produkretur, setprodukretur] = React.useState("");
    const [sizeretur, setsizeretur] = React.useState("");
    const [qtyoldretur, setqtyoldretur] = React.useState(0);
    const [SourceRetur, setSourceRetur] = React.useState("");
    const [Id_pesanan, setId_pesanan] = React.useState("");
    const [old_ware, setold_ware] = React.useState("");

    const [pilih_warehouse, setpilih_warehouse] = React.useState("close");
    const [datasize, setdatasize] = React.useState([]);
    const [sizeSelected, setsizeSelected] = React.useState(null);
    const [stokReady, setstokReady] = React.useState(0);
    const [returmodal_qty, setreturmodal_qty] = React.useState(1);
    const [returmodal_submit, setreturmodal_submit] = React.useState(true);
    const [Returware, setReturware] = React.useState(true);

    const [returidpo, setreturidpo] = React.useState("");

    const list_size: any = [];

    {
        for (let index = 0; index < datasize.length; index++) {
            if (datasize[index].qty > 0) {
                list_size.push(
                    <div
                        onClick={() => {
                            setsizeSelected(datasize[index].size);
                            setstokReady(parseInt(datasize[index].qty));
                            setreturmodal_qty(1);
                            setreturmodal_submit(false);
                        }}
                        key={index}
                        className={`${sizeSelected === datasize[index].size ? "bg-blue-500 text-white" : "text-blue-500"} font-medium py-2 text-center rounded-lg border border-blue-500 cursor-pointer`}>
                        {datasize[index].size} = {datasize[index].qty}
                    </div>
                )
            } else {
                list_size.push(
                    <div
                        key={index}
                        className=" text-gray-500 font-medium py-2 text-center rounded-lg border border-gray-500">
                        {datasize[index].size} = {datasize[index].qty}
                    </div>
                )
            }
        }
    }

    async function getStock(e: any) {
        setpilih_warehouse("loading");
        setsizeSelected(null);
        setstokReady(0);
        setreturmodal_qty(1);
        setreturmodal_submit(true);

        setReturware(e.target.value);

        if (e.target.value === "") {
            setpilih_warehouse("close");
        } else {
            await axios.post(`https://api.hokkiscasual.com/getsizeretur`, {
                idware: e.target.value,
                idproduct: id_produkretur,
                size: sizeretur,
            }).then(function (response) {
                setpilih_warehouse("open");
                setdatasize(response.data);
            });
        }

    }

    function setQty(type: any) {
        if (type === "plus") {
            if (returmodal_qty < stokReady) {
                if (returmodal_qty >= qtyoldretur) {
                    toast.warning("Jumlah Melebihi Stok Pesanan!", {
                        position: toast.POSITION.TOP_RIGHT,
                        pauseOnHover: false,
                        autoClose: 2000,
                    });
                } else {
                    setreturmodal_qty(returmodal_qty + 1)
                }
            } else {
                toast.warning("Jumlah Melebihi Stok Yang Tersedia!", {
                    position: toast.POSITION.TOP_RIGHT,
                    pauseOnHover: false,
                    autoClose: 2000,
                });
            }
        } else if (type === "min") {
            if (returmodal_qty > 1) {
                setreturmodal_qty(returmodal_qty - 1)
            }
        }
    }

    async function openReturModal(produk: any, id_produk: any, size: any, qty: any, source: any, id_pesanan: any, idpo: any, id_ware: any) {
        setreturModal(true);
        setid_produkretur(id_produk);
        setprodukretur(produk);
        setsizeretur(size);
        setqtyoldretur(qty);
        setSourceRetur(source);
        setId_pesanan(id_pesanan);
        setold_ware(id_ware);

        setreturmodal_qty(1);
        setreturmodal_submit(true);
        setpilih_warehouse("close");
        setreturidpo(idpo);
    }

    async function sumbitRetur() {
        await axios.post(`https://api.hokkiscasual.com/retur`, {
            id_pesanan: Id_pesanan,
            id_produk: id_produkretur,
            produk: produkretur,
            size_old: sizeretur,
            qty_old: qtyoldretur,
            source: SourceRetur,
            size_new: sizeSelected,
            qty_new: returmodal_qty,
            old_id_ware: old_ware,
            new_id_ware: Returware,
            idpo: returidpo,
        }).then(function (response) {
            console.log(response.data);
            mutate();

            setreturModal(false);

            toast.success("Data berhasil Update", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 2000,
            });
        });
    }

    const [refundModal, setrefundModal] = useState(false);
    const [idRefundProduct, setidRefundProduct] = useState(null);

    async function openrefundModal(produk: any, id_produk: any, size: any, qty: any, source: any, id_pesanan: any, idpo: any, id_ware: any, id: any) {
        setrefundModal(true);
        setreturmodal_submit(false);

        setid_produkretur(id_produk);
        setaddproduk_produk(produk);
        setaddproduk_size(size);
        setrefund_oldqty(qty);
        setSourceRetur(source);
        setId_pesanan(id_pesanan);
        setidRefundProduct(id)
        setaddproduk_qty(1);
        setreturidpo(idpo);
    }

    async function sumbitrefund() {
        await axios.post(`https://api.hokkiscasual.com/refund`, {
            id_produk: id_produkretur,
            produk: addproduk_produk,
            size: addproduk_size,
            old_qty: refund_oldqty,
            source: SourceRetur,
            id_pesanan: Id_pesanan,
            id: idRefundProduct,
            qty_refund: addproduk_qty,
            idpo: returidpo,
        }).then(function (response) {
            console.log(response.data);
            mutate();
            count_mutate();
            setrefundModal(false);

            toast.success("Data berhasil Refund", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 2000,
            });
        });
    }


    const [addproduk_produk, setaddproduk_produk] = React.useState("");
    const [addproduk_size, setaddproduk_size] = React.useState("");
    const [addproduk_qty, setaddproduk_qty] = React.useState(1);
    const [refund_oldqty, setrefund_oldqty] = React.useState(1);
    const [addproduk_supplier, setaddproduk_supplier] = React.useState("");
    const [addproduk_hargabeli, setaddproduk_hargabeli] = React.useState("0");

    function setQtymanual(type: any) {
        if (type === "plus") {
            if (addproduk_qty >= refund_oldqty) {
                toast.warning("Jumlah Melebihi Stok Pesanan!", {
                    position: toast.POSITION.TOP_RIGHT,
                    pauseOnHover: false,
                    autoClose: 2000,
                });
            } else {
                setaddproduk_qty(addproduk_qty + 1)
            }
        } else if (type === "min") {
            if (addproduk_qty > 1) {
                setaddproduk_qty(addproduk_qty - 1)
            }
        }
    }

    const { data: supplier_data, error: supplier_error, isLoading: supplier_isLoading, mutate: supplier_mutate } = useSWR(`https://api.hokkiscasual.com/getsupplier`, fetcher);
    const list_supplier: any = [];
    if (!supplier_isLoading && !supplier_error) {
        supplier_data.data_supplier.map((area: any, index: number) => {
            list_supplier.push(
                <option key={index} value={area.id_sup}>{area.supplier}</option>
            )
        })
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

                                                    {(function (produk: any, id_produk: any, size: any, qty: any, source: any, id_pesanan: any, idpo: any, id_ware: any, id: any) {
                                                        if (tabactive != "CANCEL") {
                                                            return (
                                                                <div>
                                                                    <button
                                                                        onClick={() => {
                                                                            openReturModal(produk, id_produk, size, qty, source, id_pesanan, idpo, id_ware);
                                                                        }}
                                                                        className="text-xs text-blue-500 font-bold">Tukar Size</button>
                                                                    <span> | </span>
                                                                    <button
                                                                        onClick={() => openrefundModal(produk, id_produk, size, qty, source, id_pesanan, idpo, id_ware, id)}
                                                                        className="text-xs text-red-500 font-bold">Refund</button>
                                                                </div>
                                                            )
                                                        }
                                                    })(order.details_order[i - 1].produk, order.details_order[i - 1].id_produk, order.details_order[i - 1].size, order.details_order[i - 1].qty, order.details_order[i - 1].source, order.id_pesanan, order.details_order[i - 1].idpo, order.details_order[i - 1].id_ware, order.details_order[i - 1].id)}

                                                    <div className="text-xs text-black">{order.details_order[i - 1].id_produk} | {order.details_order[i - 1].source}</div>
                                                    <span className="text-xs text-black">Variasi <span className="text-black font-medium">{order.details_order[i - 1].size}</span> | {order.details_order[i - 1].qty} Pcs</span>
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

            {returModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl ">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[500px]">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <span className="text-sm font-semibold">
                                        Tukar Size - {produkretur + " | Size " + sizeretur + " | Qty " + qtyoldretur}
                                    </span>
                                </div>
                                {/*body*/}
                                <div className="relative text-sm p-6 flex-auto">
                                    <div className="text-sm">
                                        <label>Warehouse:</label>
                                        <div className="mt-1 flex flex-wrap items-center justify-end">
                                            <select onChange={(e) => getStock(e)} className="appearance-none h-auto cursor-pointer rounded-lg w-full bg-white py-2 px-5 focus:outline-none border text-sm" placeholder="Pilih Store">
                                                <option value="">Pilih Warehouse</option>
                                                {list_warehouse}
                                            </select>
                                            <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                                        </div>
                                    </div>

                                    <div className="text-sm mt-3">
                                        <label>Size:</label>
                                        {(function () {
                                            if (pilih_warehouse === "close") {
                                                return (
                                                    <div className="w-[100%] py-3 text-center border rounded-lg mt-2">
                                                        Mohon Pilih Warehouse
                                                    </div>
                                                )
                                            } else if (pilih_warehouse === "loading") {
                                                return (
                                                    <div className="w-[100%] py-3 text-center border rounded-lg mt-2 flex flex-auto items-center justify-center">
                                                        <svg aria-hidden="true" className="w-5 h-5 mr-2 text-gray-200 animate-spin dark:text-gray-400 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                        </svg>
                                                        Processing...
                                                    </div>
                                                )
                                            } else if (pilih_warehouse === "open") {
                                                if (list_size.length > 0) {
                                                    return (
                                                        <div className="mt-1 grid grid-cols-5 gap-2 text-xs content-start">
                                                            {list_size}
                                                        </div>
                                                    )
                                                } else {
                                                    return (
                                                        <div className="w-[100%] py-3 text-center border rounded-lg mt-2">
                                                            Stok Belum Tersedia
                                                        </div>
                                                    )
                                                }
                                            }


                                        })()}
                                    </div>

                                    <div className="text-sm mt-3">
                                        <div className="mb-2">Qty:</div>
                                        <div className="text-sm flex flex-wrap items-center">
                                            <button
                                                onClick={() => {
                                                    setQty("min");
                                                }}
                                                disabled={returmodal_submit}
                                                className={`${returmodal_submit === true ? "bg-gray-500" : "bg-blue-500"} text-white w-10 py-2 border rounded font-bold`}>-</button>
                                            <div className="font-bold py-2 w-10 text-center border rounded mx-2">{returmodal_qty}</div>
                                            <button
                                                onClick={() => {
                                                    setQty("plus");
                                                }}
                                                disabled={returmodal_submit}
                                                className={`${returmodal_submit === true ? "bg-gray-500" : "bg-blue-500"} text-white w-10 py-2 border rounded font-bold`}>+</button>
                                        </div>
                                    </div>

                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                                        type="button"
                                        onClick={() => {
                                            setreturModal(false);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className={`${returmodal_submit ? "bg-gray-500" : "bg-green-500"} text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1`}
                                        type="button"
                                        disabled={returmodal_submit}
                                        onClick={() => sumbitRetur()}
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

            {refundModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl ">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[500px]">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <span className="text-sm font-semibold">
                                        Refund Produk - {"Size " + addproduk_size + " | Qty " + addproduk_qty}
                                    </span>
                                </div>
                                {/*body*/}
                                <div className="relative text-sm p-6 flex items-center flex-auto gap-4">
                                    <div className="grow">
                                        <div className="mb-2">Produk:</div>
                                        <input
                                            value={addproduk_produk}
                                            className="h-auto rounded-lg w-full bg-white py-2 px-5 text-gray-700 focus:outline-none border"
                                            type="text"
                                            readOnly
                                            placeholder="Masukan Size" />
                                    </div>

                                    <div className="text-sm">
                                        <div className="mb-2">Qty:</div>
                                        <div className="text-sm flex flex-wrap items-center">
                                            <button
                                                onClick={() => {
                                                    setQtymanual("min");
                                                }}
                                                disabled={returmodal_submit}
                                                className={`${returmodal_submit === true ? "bg-gray-500" : "bg-blue-500"} text-white w-10 py-2 border rounded font-bold`}>-</button>
                                            <div className="font-bold py-2 w-10 text-center border rounded mx-2">{addproduk_qty}</div>
                                            <button
                                                onClick={() => {
                                                    setQtymanual("plus");
                                                }}
                                                disabled={returmodal_submit}
                                                className={`${returmodal_submit === true ? "bg-gray-500" : "bg-blue-500"} text-white w-10 py-2 border rounded font-bold`}>+</button>
                                        </div>
                                    </div>

                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                                        type="button"
                                        onClick={() => setrefundModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className={`${returmodal_submit ? "bg-gray-500" : "bg-green-500"} text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1`}
                                        type="button"
                                        disabled={returmodal_submit}
                                        onClick={() => sumbitrefund()}
                                    >
                                        Refund
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
