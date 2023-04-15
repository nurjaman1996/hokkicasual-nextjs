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


export default function DaftarProduk() {
    // const [dataProduct, setData] = useState(dataProduct_.product);
    const [date, setDate] = useState(format(new Date(), "dd/MM/yyyy"));

    const [Query, setQuery] = useState("all");

    const { data, error, isLoading, mutate } = useSWR(`https://api.inovasimediakreatif.site/products/${Query}`, fetcher);

    const [openSize, setopenSize] = useState(null);

    function toogleActive(index: any) {
        if (openSize === index) {
            setopenSize(null);
        } else {
            setopenSize(index);
        }
    }

    const { register, resetField, setValue, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            deskripsi: '',
            amount: '',
            qty: '',
            total_amount: '',
            edit_deskripsi: '',
            edit_amount: '',
            edit_qty: '',
            edit_total_amount: '',
        }
    });

    const [showModal, setShowModal] = React.useState(false);
    const [delModal, setdelModal] = React.useState(false);
    const [editModal, seteditModal] = React.useState(false);

    const onSubmit = async (data: any) => {
        // await axios.post("https://api.inovasimediakreatif.site/saveexpense", {
        //     data: data,
        //     tanggal: date
        // }).then(function (response) {
        //     // console.log(response.data);
        //     mutate();
        // });

        console.log(data);

        toast.success("Data telah disimpan", {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
            autoClose: 2000,
        });

        resetField("deskripsi");
        resetField("amount");
        resetField("qty");
        resetField("total_amount");
        setShowModal(false);
    };

    const list_produk: any = [];

    if (!isLoading && !error) {
        data.product.map((data_produk: any, index: any) => {
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
                                    <Image
                                        className="max-w-[80px] max-h-[80px] rounded"
                                        src={`https://buwanais.co.id/apiupload/${data_produk.img}`}
                                        alt="product-1"
                                        height="500"
                                        width="500"
                                        priority
                                    />
                                    <div className="flex flex-col">
                                        <div className="text-xs">#{data_produk.id_produk} | {data_produk.id_brand}</div>
                                        <div className="text-base">{data_produk.produk}</div>
                                        <div className="text-xs">Rp{data_produk.n_price}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4 ">
                                    <button className="cursor-pointer text-green-600 font-medium hover:underline focus:underline" onClick={() => toogleActive(index)}>{data_produk.variationcount[0].total_qty} in stock</button>
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                                    {data_produk.variation.length}
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
                            <td className="p-0 h-full bg-white" colSpan={4}>
                                <div className=" items-center h-full px-4">
                                    <Collapse isOpened={openSize === index}>
                                        <div className="pb-6">
                                            <div className="h-[auto] w-[100%] border rounded-lg px-2 py-3">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="text-center">
                                                            <th className="py-1">Varian</th>
                                                            <th>Stock</th>
                                                            <th>Harga Jual</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(function (rows: any, i, len) {
                                                            while (++i <= data_produk.variation.length) {
                                                                rows.push(
                                                                    <tr key={i} className="text-center">
                                                                        <td className="py-1">{data_produk.variation[i - 1].size}</td>
                                                                        <td>{data_produk.variation[i - 1].qty}</td>
                                                                        <td>Rp{data_produk.n_price}</td>
                                                                    </tr>
                                                                )
                                                            }
                                                            return rows;
                                                        })([], 0, index + 1)}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </Collapse>
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
                            <td className="p-0 h-full" colSpan={6}>
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
                Daftar Produk
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
                    <button type="button" className="ml-3 shadow rounded-lg bg-blue-600 hover:bg-blue-800 h-[45px] text-white px-4 flex flex-wrap gap-2 content-center">
                        <Link href='add_produk'>Tambah Produk</Link >
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
                            Stok
                        </th>
                        <th className="py-3">
                            Varian
                        </th>
                        <th className="py-3">
                            Kategori
                        </th>
                        <th className="py-3">
                            Gudang
                        </th>
                        <th className="py-3 rounded-r-lg">
                            Action
                        </th>
                    </tr>
                </thead>

                {list_produk}

            </table>

        </>
    );
}
