import Head from "next/head";
import Image from "next/image";
import * as fa from "react-icons/fa";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import React, { Component, useRef, useState } from "react";
import { compareAsc, format } from "date-fns";
import Link from "next/link";
import TableHeaderRow from "@nextui-org/react/types/table/table-header-row";
import { Collapse } from "react-collapse";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from "react-hook-form";
import useSWR from 'swr';
import axios from 'axios';
const fetcher = (url: string) => fetch(url).then(res => res.json());

let Rupiah = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

export default function NotaBarang() {
    // const [dataProduct, setData] = useState(dataProduct_.product);
    const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

    const [Query, setQuery] = useState("all");
    const [Store, setStore] = useState("all");

    function querySet(e: any) {
        if (e.target.value === "") {
            setQuery("all");
        } else {
            setQuery(e.target.value);
        }

    }

    const { data, error, isLoading, mutate } = useSWR(`https://api.hokkiscasual.com/notabarang/${Query}/${Store}/${date}`, fetcher);

    const { data: report_data, error: report_error, isLoading: report_isLoading, mutate: report_mutate } = useSWR(`https://api.hokkiscasual.com/get_nota/${Store}/${date}`, fetcher);

    if (!report_isLoading && !report_error) {
        var nota_paid = Rupiah.format(report_data.nota_paid);
        var nota_pending = Rupiah.format(report_data.nota_pending);
        var qty_paid = report_data.qty_paid;
        var qty_pending = report_data.qty_pending;
    }


    const { data: brand_data, error: brand_error, isLoading: brand_isLoading, mutate: brand_mutate } = useSWR(`https://api.hokkiscasual.com/getbrand`, fetcher);

    const list_brand: any = [];

    if (!brand_isLoading && !brand_error) {
        brand_data.data_brand.map((area: any, index: number) => {
            list_brand.push(
                <option key={index} value={area.id_brand}>{area.brand}</option>
            )
        })
    }

    const { data: store_data, error: store_error, isLoading: store_isLoading } = useSWR(`https://api.hokkiscasual.com/getstore`, fetcher);
    let list_store: any = [];
    if (!store_isLoading && !store_error) {
        store_data.data_store.map((store: any, index: number) => {
            list_store.push(
                <option key={index} value={store.store}>{store.store}</option>
            )
        })
    } else {
        var data_store: any = [];
    }

    const { data: category_data, error: category_error, isLoading: category_isLoading, mutate: category_mutate } = useSWR(`https://api.hokkiscasual.com/getcategory`, fetcher);

    const list_category: any = [];

    if (!category_isLoading && !category_error) {
        category_data.data_cat.map((area: any, index: number) => {
            list_category.push(
                <option key={index} value={area.id_category}>{area.category}</option>
            )
        })
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

    const { data: warehouse_data, error: warehouse_error, isLoading: warehouse_isLoading, mutate: warehouse_mutate } = useSWR(`https://api.hokkiscasual.com/getwarehouse`, fetcher);

    const list_warehouse: any = [];

    if (!warehouse_isLoading && !warehouse_error) {
        warehouse_data.data_ware.map((area: any, index: number) => {
            list_warehouse.push(
                <option key={index} value={area.id_ware}>{area.warehouse}</option>
            )
        })
    }

    const [openSize, setopenSize] = useState(null);

    function toogleActive(index: any) {
        if (openSize === index) {
            setopenSize(null);
        } else {
            setopenSize(index);
        }
    }

    const { register, resetField, setValue, handleSubmit, watch, formState: { errors } } = useForm({
        // defaultValues: {

        // }
    });

    const [showModal, setShowModal] = React.useState(false);

    const onSubmit = async (data: any) => {
        await axios.post("https://api.hokkiscasual.com/savenota", {
            data: data
        }).then(function (response) {
            // console.log(response.data);
            mutate();
            report_mutate();
        });

        console.log(data);

        toast.success("Data telah disimpan", {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
            autoClose: 2000,
        });

        resetField('produk');
        resetField('harga_beli');
        resetField('harga_jual');
        resetField('warehouse');
        resetField('quality');
        resetField('supplier');
        resetField('kategori');
        resetField('size');
        resetField('stok');
        resetField('payment');
        resetField('deskripsi');
        resetField('brand');

        setShowModal(false);
    };


    const [delModal, setdelModal] = React.useState(false);
    const [produk_name, setproduk_name] = React.useState("");
    const [iddel, setiddel] = React.useState("");

    function openDelModal(id: any, produk: any) {
        setiddel(id);
        setproduk_name(produk);
        setdelModal(true);
    }

    async function deleteData() {
        await axios.post("https://api.hokkiscasual.com/deleteNota", {
            id: iddel
        }).then(function (response) {
            // console.log(response.data);
            mutate();
            report_mutate();
            setdelModal(false);

            toast.success("Data telah dihapus", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 2000,
            });
        });
    }

    const list_produk: any = [];

    if (!isLoading && !error) {
        data.data_notabarang.map((data_produk: any, index: any) => {
            return (
                list_produk.push(
                    <tbody key={index} className="group hover:shadow-lg rounded-lg">
                        <tr className="group-hover:drop-shadow-primary transition-filter rounded-lg">
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pl-5 rounded-l-lg">
                                    {index + 1}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-row gap-4 items-center h-full bg-white py-4 pl-4">
                                    {/* <Image
                                        className="max-w-[80px] max-h-[80px] rounded"
                                        src={data_produk.img}
                                        alt="product-1"
                                        height="500"
                                        width="500"
                                        priority
                                    /> */}
                                    <div className="flex flex-col justify-center">
                                        <div className="text-sm">{data_produk.produk}</div>
                                        <div className="text-[12px]">Harga Beli : Rp{data_produk.m_price}</div>
                                        <div className="text-[12px]">{data_produk.id_nota} | {data_produk.tanggal_upload}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4 ">
                                    {data_produk.size}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                                    {data_produk.qty}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                                    {function () {
                                        let text = data_produk.deskripsi;
                                        const myArray = text.split("-");
                                        return (
                                            <>
                                                {myArray[0]}
                                            </>
                                        )
                                    }()}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                                    {function () {
                                        let text = data_produk.deskripsi;
                                        const myArray = text.split("-");
                                        return (
                                            <>
                                                {myArray[1]}
                                            </>
                                        )
                                    }()}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                                    {data_produk.warehouse[0].warehouse}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                                    {data_produk.supplier[0].supplier}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                                    {data_produk.status_pesanan}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                                    {data_produk.payment}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-warp gap-4 justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4 rounded-r-lg">
                                    <button
                                        onClick={() => {
                                            showeditModal(data_produk.id, data_produk.produk, data_produk.m_price, data_produk.payment, data_produk.qty);
                                        }}
                                        className="text-blue-500">
                                        <i className="fi fi-rr-edit text-center text-lg"></i>
                                    </button>
                                    <button
                                        onClick={() => {
                                            openDelModal(data_produk.id, data_produk.produk);
                                        }}
                                        className="text-red-500">
                                        <i className="fi fi-rr-trash text-center text-lg"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>


                    </tbody>
                )
            )
        })
    }

    const [editModal, seteditModal] = React.useState(false);
    const [edit_produk, setedit_produk] = React.useState("");
    const [edit_hargabeli, setedit_hargabeli] = React.useState("");
    const [edit_payment, setedit_payment] = React.useState("");
    const [edit_qty, setedit_qty] = React.useState("");
    const [id, setid] = React.useState(null);

    function showeditModal(id: any, produk: any, hargabeli: any, payment: any, qty: any) {
        setid(id);
        setedit_produk(produk);
        setedit_hargabeli(hargabeli);
        setedit_payment(payment);
        setedit_qty(qty);

        seteditModal(true);
    }

    const onSubmitUpdate = async (data: any) => {
        await axios.post(`https://api.hokkiscasual.com/editnota`, {
            id: id,
            edit_produk: edit_produk,
            edit_hargabeli: edit_hargabeli,
            edit_payment: edit_payment,
            edit_qty: edit_qty,
        }).then(function (response) {
            // console.log(response.data);
            mutate();
            report_mutate();

            toast.success("Data telah diupdate", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 2000,
            });

            seteditModal(false);
        });
    };

    return (
        <div className="p-5">
            <div className="font-bold text-2xl border-b border-[#2125291A] h-10 mb-3">
                Daftar Nota Barang
            </div>

            <div className="grid grid-cols-4 gap-3 grow h-auto content-start mb-5">
                <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-auto bg-white px-5 py-5 group">

                    <div className="grid grid-rows-3 h-[90px] items-center">
                        <div className="flex content-center items-center justify-start">
                            <div className="grow">
                                <Image
                                    className="w-[36px] h-[36px] max-w-full max-h-full"
                                    src="/dibayar.png"
                                    alt="Picture of the author"
                                    width={100}
                                    height={100}
                                />
                            </div>

                            {/* <div>
                                <fa.FaChevronRight size={18} className="text-gray-400 group-hover:text-gray-800" />
                            </div> */}
                        </div>

                        <div className="font-medium pt-2 text-base text-green-600">
                            Nota Sudah Dibayar
                        </div>

                        <div className="font-bold text-xl text-green-600">
                            {nota_paid ? nota_paid : 0}
                        </div>
                    </div>

                </a>

                <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-auto bg-white px-5 py-5 group">

                    <div className="grid grid-rows-3 h-[90px] items-center">
                        <div className="flex content-center items-center justify-start">
                            <div className="grow">
                                <Image
                                    className="w-[36px] h-[36px] max-w-full max-h-full"
                                    src="/boxes.png"
                                    alt="Picture of the author"
                                    width={100}
                                    height={100}
                                />
                            </div>

                            {/* <div>
            <fa.FaChevronRight size={18} className="text-gray-400 group-hover:text-gray-800" />
        </div> */}
                        </div>

                        <div className="font-medium pt-2 text-base text-green-600">
                            Qty
                        </div>

                        <div className="font-bold text-xl text-green-600">
                            {qty_paid ? qty_paid : 0}
                        </div>
                    </div>

                </a>

                <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-auto bg-white px-5 py-5 group">

                    <div className="grid grid-rows-3 h-[90px] items-center">
                        <div className="flex content-center items-center justify-start">
                            <div className="grow">
                                <Image
                                    className="w-[36px] h-[36px] max-w-full max-h-full"
                                    src="/belum-dibayar.png"
                                    alt="Picture of the author"
                                    width={100}
                                    height={100}
                                />
                            </div>

                            {/* <div>
                                <fa.FaChevronRight size={18} className="text-gray-400 group-hover:text-gray-800" />
                            </div> */}
                        </div>

                        <div className="font-medium pt-2 text-base text-red-400">
                            Nota Belum Dibayar
                        </div>

                        <div className="font-bold text-xl text-red-400">
                            {nota_pending ? nota_pending : 0}
                        </div>
                    </div>

                </a>

                <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-auto bg-white px-5 py-5 group">

                    <div className="grid grid-rows-3 h-[90px] items-center">
                        <div className="flex content-center items-center justify-start">
                            <div className="grow">
                                <Image
                                    className="w-[36px] h-[36px] max-w-full max-h-full"
                                    src="/boxes.png"
                                    alt="Picture of the author"
                                    width={100}
                                    height={100}
                                />
                            </div>

                            {/* <div>
                                <fa.FaChevronRight size={18} className="text-gray-400 group-hover:text-gray-800" />
                            </div> */}
                        </div>

                        <div className="font-medium pt-2 text-base text-red-400">
                            Qty
                        </div>

                        <div className="font-bold text-xl text-red-400">
                            {qty_pending ? qty_pending : 0}
                        </div>
                    </div>

                </a>
            </div>

            <div className="flex flex-wrap items-center content-center mb-6 gap-3">
                <div className="shadow rounded-lg w-auto flex flex-row text-center content-center">
                    <input
                        onChange={(e) => {
                            querySet(e);
                        }}
                        className="h-[45px] text-sm border-0 w-[300px] pr-3 pl-5  text-gray-700 focus:outline-none rounded-l-lg" type="text" placeholder="Cari Nama Produk atau ID Pesanan..." />

                    <button type="button" className="rounded-r-lg bg-white h-[45px] text-gray-700 font-medium px-5">
                        <div className="my-auto">
                            <fa.FaSearch size={17} className="text-gray-700" />
                        </div>
                    </button>
                </div>

                {/* <div className="ml-auto flex flex-row items-center justify-end">
                    <button onClick={() => setShowModal(true)} type="button" className="ml-3 shadow rounded-lg bg-blue-600 hover:bg-blue-800 h-[45px] text-white px-4 flex flex-wrap gap-2 content-center">
                        Tambah Produk
                        <div className="my-auto">
                            <fa.FaPlus size={13} className="text-white" />
                        </div>
                    </button>
                </div> */}

                <div className="flex text-sm flex-row items-center w-[20%] justify-end">
                    <select
                        value={Store}
                        onChange={(e) => {
                            setStore(e.target.value);
                        }}
                        className={`appearance-none border h-[45px]  w-[100%] px-5  text-gray-700 focus:outline-none rounded-lg`}>
                        <option value="all">All Store</option>
                        {list_store}
                    </select>
                </div>

                <div className="shadow rounded-lg ml-auto w-[290px] flex flex-row items-center justify-end bg-white ">
                    <Flatpickr
                        className="text-gray-500 h-[45px] text-start py-2 px-4 w-full text-sm rounded-l-lg focus:outline-none"
                        value={date}
                        placeholder="Select Date Range"
                        options={{
                            mode: "range",
                            dateFormat: "Y-m-d",
                            enableTime: false,
                            onClose: function (selectedDates, dateStr, instance) {
                                setDate(dateStr);
                            },
                        }}
                    />

                    <i className="fi fi-rr-calendar w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 bg-white mr-4"></i>
                </div>


            </div>

            <table className="table bg-transparent h-px mb-4 text-sm w-full">

                <thead className="bg-[#DDE4F0] text-gray-800">
                    <tr className="rounded-lg">
                        <th className="pl-2 py-3 rounded-l-lg">
                            No.
                        </th>
                        <th className="py-3">
                            Produk & Harga
                        </th>
                        <th className="py-3">
                            Varian
                        </th>
                        <th className="py-3">
                            Stok
                        </th>
                        <th className="py-3">
                            ID Pesanan
                        </th>
                        <th className="py-3">
                            Store
                        </th>
                        <th className="py-3">
                            Gudang
                        </th>
                        <th className="py-3">
                            Supplier
                        </th>
                        <th className="py-3">
                            Status Barang
                        </th>
                        <th className="py-3">
                            Status Pembayaran
                        </th>
                        <th className="py-3 rounded-r-lg">
                            Action
                        </th>
                    </tr>
                </thead>

                {list_produk}

            </table>

            {
                showModal ? (
                    <>
                        <div className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
                                {/*content*/}
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[1000px]">
                                    {/*header*/}
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                        <span className="text-xl font-semibold">
                                            Tambah Produk
                                        </span>
                                    </div>
                                    {/*body*/}
                                    <div className="relative p-6 flex-auto">
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                        </form>
                                        <div className="pb-5 h-[auto]">
                                            <div className="grid grid-cols-2 gap-5 justify-center content-center items-start">
                                                <div>
                                                    <div className="mb-3">Nama Produk</div>
                                                    <input
                                                        className={`border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                        type="text"
                                                        placeholder="Masukan Produk"
                                                        {...register("produk", { required: false })}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="mb-3">Harga Beli</div>
                                                    <input
                                                        className={`border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                        type="number"
                                                        defaultValue={0}
                                                        placeholder="Masukan Harga Beli"
                                                        {...register("harga_beli", { required: false })}
                                                    />
                                                </div>

                                                <div>
                                                    <div className="mb-3">Brand</div>
                                                    <select {...register("brand", { required: false })} className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}>
                                                        <option value="">Pilih Brand</option>
                                                        {list_brand}
                                                    </select>
                                                </div>
                                                <div>
                                                    <div className="mb-3">Harga Jual</div>
                                                    <input
                                                        className={`border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                        type="number"
                                                        defaultValue={0}
                                                        placeholder="Masukan Harga Jual"
                                                        {...register("harga_jual", { required: false })}
                                                    />
                                                </div>

                                                <div>
                                                    <div className="mb-3">Warehouse</div>
                                                    <select {...register("warehouse", { required: false })} className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}>
                                                        <option value="">Pilih Warehouse</option>
                                                        {list_warehouse}
                                                    </select>
                                                </div>
                                                <div>
                                                    <div className="mb-3">Quality</div>
                                                    <select {...register("quality", { required: false })} className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}>
                                                        <option value="">Pilih Quality</option>
                                                        <option value="IMPORT">IMPORT</option>
                                                        <option value="LOKAL">LOKAL</option>
                                                        <option value="ORIGINAL">ORIGINAL</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <div className="mb-3">Supplier</div>
                                                    <select {...register("supplier", { required: false })} className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}>
                                                        <option value="">Pilih Supplier</option>
                                                        {list_supplier}
                                                    </select>
                                                </div>

                                                <div>
                                                    <div className="mb-3">Kategori</div>
                                                    <select {...register("kategori", { required: false })} className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}>
                                                        <option value="">Pilih Kategori</option>
                                                        {list_category}
                                                    </select>
                                                </div>

                                                <div>
                                                    <div className="mb-3">Size</div>
                                                    <input {...register(`size`, { required: false })}
                                                        className={`border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                        placeholder="Masukan Size"
                                                    />
                                                </div>

                                                <div>
                                                    <div className="mb-3">Qty</div>
                                                    <input defaultValue={0} {...register(`stok`, { required: false })}
                                                        className={`border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`} type="number"
                                                    />
                                                </div>

                                                <div>
                                                    <div className="mb-3">Pembayaran</div>
                                                    <select {...register("payment", { required: false })} className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}>
                                                        <option value="">Pilih Pembayaran</option>
                                                        <option value="PENDING">PENDING</option>
                                                        <option value="PAID">PAID</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <div className="text-base mb-3">Deskripsi</div>
                                                    <textarea {...register("deskripsi", { required: false })} rows={5} className="resize-none bg-white h-[140px] rounded-lg w-full py-3 px-5 text-gray-700 focus:outline-none border text-base "></textarea>
                                                </div>

                                            </div>
                                        </div>

                                    </div>
                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                        <button
                                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => {
                                                resetField('produk');
                                                resetField('harga_beli');
                                                resetField('harga_jual');
                                                resetField('warehouse');
                                                resetField('quality');
                                                resetField('supplier');
                                                resetField('kategori');
                                                resetField('size');
                                                resetField('stok');
                                                resetField('payment');
                                                resetField('deskripsi');
                                                resetField('brand');
                                                setShowModal(false);
                                            }}
                                        >
                                            Close
                                        </button>
                                        <button
                                            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={handleSubmit(onSubmit)}
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                ) : null
            }

            {editModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl ">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[500px]">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <span className="text-xl font-semibold">
                                        Edit Barang Luar
                                    </span>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto">

                                    <div className="text-sm">
                                        <label>Nama Produk</label>
                                        <input
                                            onChange={(e) => {
                                                setedit_produk(e.target.value);
                                            }}
                                            value={edit_produk}
                                            className="h-auto rounded-lg w-full bg-white py-2 px-5 mt-2 text-gray-700 focus:outline-none border"
                                            type="text"
                                            placeholder="Masukan Nama Produk" />
                                    </div>

                                    <div className="text-sm mt-6">
                                        <label>Harga Beli</label>
                                        <input
                                            onChange={(e) => {
                                                setedit_hargabeli(e.target.value);
                                            }}
                                            value={edit_hargabeli}
                                            className="h-auto rounded-lg w-full bg-white py-2 px-5 mt-2 text-gray-700 focus:outline-none border"
                                            type="text"
                                            placeholder="Masukan Harga Beli" />
                                    </div>

                                    <div className="text-sm mt-6">
                                        <label>Status Pembayaran</label>
                                        <div className="mt-2 flex flex-wrap items-center justify-end">
                                            <select
                                                onChange={(e) => {
                                                    setedit_payment(e.target.value)
                                                }}
                                                value={edit_payment}
                                                className="appearance-none h-auto cursor-pointer rounded-lg w-full bg-white py-2 px-5 focus:outline-none border text-sm" placeholder="Pilih Store">
                                                <option value="">Pilih Payment</option>
                                                <option value="PAID">PAID</option>
                                                <option value="PENDING">PENDING</option>

                                            </select>
                                            <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                                        </div>
                                    </div>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => {
                                            seteditModal(false);
                                        }}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={handleSubmit(onSubmitUpdate)}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}

            {
                delModal ? (
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
                                        <p className="text-sm font-semibold">
                                            Produk {produk_name} akan dihapus?
                                        </p>
                                        <p className="text-sm italic text-red-400">
                                            *Data penjualan akan tetap ada
                                        </p>
                                    </div>
                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                        <button
                                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                                            type="button"
                                            onClick={() => {
                                                setdelModal(false);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                            type="button"
                                            onClick={() => deleteData()}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                ) : null
            }

        </div >
    );
}
