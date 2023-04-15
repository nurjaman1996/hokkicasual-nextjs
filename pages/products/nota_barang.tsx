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

export default function NotaBarang() {
    // const [dataProduct, setData] = useState(dataProduct_.product);
    const [date, setDate] = useState(format(new Date(), "dd/MM/yyyy"));

    const [Query, setQuery] = useState("all");

    const { data, error, isLoading, mutate } = useSWR(`https://api.inovasimediakreatif.site/notabarang/${Query}`, fetcher);

    const { data: brand_data, error: brand_error, isLoading: brand_isLoading, mutate: brand_mutate } = useSWR(`https://api.inovasimediakreatif.site/getbrand`, fetcher);

    const list_brand: any = [];

    if (!brand_isLoading && !brand_error) {
        brand_data.data_brand.map((area: any, index: number) => {
            list_brand.push(
                <option key={index} value={area.id_brand}>{area.brand}</option>
            )
        })
    }

    const { data: category_data, error: category_error, isLoading: category_isLoading, mutate: category_mutate } = useSWR(`https://api.inovasimediakreatif.site/getcategory`, fetcher);

    const list_category: any = [];

    if (!category_isLoading && !category_error) {
        category_data.data_cat.map((area: any, index: number) => {
            list_category.push(
                <option key={index} value={area.id_category}>{area.category}</option>
            )
        })
    }

    const { data: supplier_data, error: supplier_error, isLoading: supplier_isLoading, mutate: supplier_mutate } = useSWR(`https://api.inovasimediakreatif.site/getsupplier`, fetcher);

    const list_supplier: any = [];

    if (!supplier_isLoading && !supplier_error) {
        supplier_data.data_supplier.map((area: any, index: number) => {
            list_supplier.push(
                <option key={index} value={area.id_sup}>{area.supplier}</option>
            )
        })
    }

    const { data: warehouse_data, error: warehouse_error, isLoading: warehouse_isLoading, mutate: warehouse_mutate } = useSWR(`https://api.inovasimediakreatif.site/getwarehouse`, fetcher);

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
    const [delModal, setdelModal] = React.useState(false);
    const [editModal, seteditModal] = React.useState(false);

    const onSubmit = async (data: any) => {
        await axios.post("https://api.inovasimediakreatif.site/savenota", {
            data: data
        }).then(function (response) {
            // console.log(response.data);
            mutate();
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

    const list_produk: any = [];

    if (!isLoading && !error) {
        data.data_notabarang.map((data_produk: any, index: any) => {
            return (
                list_produk.push(
                    <tbody key={index} className="group hover:shadow-lg rounded-lg">
                        <tr className="group-hover:drop-shadow-primary transition-filter rounded-lg">
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 pl-5 rounded-tl-lg">
                                    {index + 1}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-row gap-4 items-center h-full bg-white pt-5 pb-3 pl-4">
                                    {/* <Image
                                        className="max-w-[80px] max-h-[80px] rounded"
                                        src={data_produk.img}
                                        alt="product-1"
                                        height="500"
                                        width="500"
                                        priority
                                    /> */}
                                    <div className="flex flex-col justify-center">
                                        <div className="text-xs">{data_produk.id_nota} | {data_produk.brand[0].brand}</div>
                                        <div className="text-base">{data_produk.produk}</div>
                                        <div className="text-xs">Harga Beli : Rp{data_produk.m_price}</div>
                                        <div className="text-xs">Harga Jual : Rp{data_produk.selling_price}</div>
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
                                    {data_produk.category[0].category}
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
                                <div className="flex flex-warp gap-4 justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4 rounded-tr-lg">
                                    <button className="text-blue-500">
                                        <i className="fi fi-rr-edit text-center text-lg"></i>
                                    </button>
                                    <button className="text-red-500">
                                        <i className="fi fi-rr-trash text-center text-lg"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>


                        <tr className="group-hover:drop-shadow-primary transition-filter rounded-lg">
                            <td className="p-0 h-full" colSpan={2}>
                                <div className="flex items-center h-full bg-white px-4">

                                </div>
                            </td>
                            <td className="p-0 h-full">
                                <div className="h-full bg-white">
                                </div>
                            </td>
                        </tr>

                        <tr className="group-hover:drop-shadow-primary transition-filter rounded-lg">
                            <td className="p-0 h-full">
                                <div className="h-full bg-white px-4 rounded-bl-lg pb-7">
                                </div>
                            </td>
                            <td className="p-0 h-full" colSpan={7}>
                                <div className="pr-6 bg-white rounded-br-lg ">
                                    <div className="flex items-center h-full pb-7 border-t">

                                    </div>
                                </div>

                            </td>
                        </tr>
                    </tbody>
                )
            )
        })
    }



    return (
        <>
            <div className="font-bold text-3xl border-b border-[#2125291A] h-16 mb-7">
                Daftar Nota Barang
            </div>

            <div className="flex flex-wrap items-center content-center mb-6">
                <div className="shadow rounded-lg w-auto flex flex-row text-center content-center">
                    <input className="h-[45px] border-0 w-[300px]  pr-3 pl-5  text-gray-700 focus:outline-none rounded-l-lg" type="text" placeholder="Cari nama, SKU, atau scan barcode..." />

                    <button type="button" className="rounded-r-lg bg-white hover:bg-gray-200 h-[45px] text-gray-700 font-medium px-5">
                        <div className="my-auto">
                            <fa.FaSearch size={17} className="text-gray-700" />
                        </div>
                    </button>
                </div>

                <div className="ml-auto flex flex-row items-center justify-end">
                    <button onClick={() => setShowModal(true)} type="button" className="ml-3 shadow rounded-lg bg-blue-600 hover:bg-blue-800 h-[45px] text-white px-4 flex flex-wrap gap-2 content-center">
                        Tambah Produk
                        <div className="my-auto">
                            <fa.FaPlus size={13} className="text-white" />
                        </div>
                    </button>
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
                            Kategori
                        </th>
                        <th className="py-3">
                            Gudang
                        </th>
                        <th className="py-3">
                            Supplier
                        </th>
                        <th className="py-3 rounded-r-lg">
                            Action
                        </th>
                    </tr>
                </thead>

                {list_produk}

            </table>

            {showModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
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
        </>
    );
}
