import Head from "next/head";
import Image from "next/image";
import * as fa from "react-icons/fa";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import React, { Component, useRef, useState } from "react";
import { compareAsc, format } from "date-fns";
import Link from "next/link";
import TableHeaderRow from "@nextui-org/react/types/table/table-header-row";
import { Collapse } from "react-collapse"; import useSWR from 'swr';
const fetcher = (url: string) => fetch(url).then(res => res.json());

// export async function getServerSideProps() {
//     const response = await fetch('https://api.inovasimediakreatif.site/products/');
//     const dataProduct = await response.json();
//     return {
//         props: {
//             dataProduct
//         }
//     };
// }

export default function NotaBarang() {
    // const [dataProduct, setData] = useState(dataProduct_.product);
    const [date, setDate] = useState(format(new Date(), "dd/MM/yyyy"));

    const [Query, setQuery] = useState("all");

    const { data, error, isLoading } = useSWR(`https://api.inovasimediakreatif.site/notabarang/${Query}`, fetcher);

    const [openSize, setopenSize] = useState(null);

    function toogleActive(index: any) {
        if (openSize === index) {
            setopenSize(null);
        } else {
            setopenSize(index);
        }
    }

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
                                    <Image
                                        className="max-w-[80px] max-h-[80px] rounded"
                                        src={data_produk.img}
                                        alt="product-1"
                                        height="500"
                                        width="500"
                                        priority
                                    />
                                    <div className="flex flex-col justify-center">
                                        <div className="text-xs">{data_produk.id_produk} | {data_produk.brand[0].brand}</div>
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
                    <button type="button" className="ml-3 shadow rounded-lg bg-blue-600 hover:bg-blue-800 h-[45px] text-white px-4 flex flex-wrap gap-2 content-center">
                        <Link href='/order/add_order'>Tambah Produk</Link>
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
        </>
    );
}
