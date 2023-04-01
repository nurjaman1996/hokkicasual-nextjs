import Head from "next/head";
import Image from "next/image";
import * as fa from "react-icons/fa";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import React, { Component, useRef, useState } from "react";
import { compareAsc, format } from "date-fns";
import Link from "next/link";

export default function ListProduk() {
    const [date, setDate] = useState(format(new Date(), "dd/MM/yyyy"));
    return (
        <>
            <div className="font-bold text-3xl border-b border-[#2125291A] h-16 mb-7">
                Daftar Produk
            </div>

            <div className="my-6">
                <div className="grid grid-cols-2 gap-6 grow h-auto content-start">
                    <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-auto bg-white px-5 py-5 group">

                        <div className="grid grid-rows-3 items-center">
                            <div className="flex content-center items-center justify-start">
                                <div className="grow">
                                    <Image
                                        className="w-[36px] h-[36px] max-w-full max-h-full"
                                        src="/dashboard/artikel.png"
                                        alt="Picture of the author"
                                        width={100}
                                        height={100}
                                    />
                                </div>

                            </div>

                            <div className="font-medium text-base text-gray-400">
                                Artikel
                            </div>

                            <div className="font-bold text-xl text-black">
                                958
                            </div>
                        </div>

                    </a>

                    <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-auto bg-white px-5 py-5 group">

                        <div className="grid grid-rows-3 items-center">
                            <div className="flex content-center items-center justify-start">
                                <div className="grow">
                                    <Image
                                        className="w-[36px] h-[36px] max-w-full max-h-full"
                                        src="/dashboard/qty.png"
                                        alt="Picture of the author"
                                        width={100}
                                        height={100}
                                    />
                                </div>

                            </div>

                            <div className="font-medium text-base text-gray-400">
                                Qty
                            </div>

                            <div className="font-bold text-xl text-black">
                                20206
                            </div>
                        </div>

                    </a>

                </div>

                <div className="flex flex-nowrap gap-6 grow h-auto content-start mt-6">
                    <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-auto bg-white px-5 py-5 grow group">
                        <div className="grid grid-rows-3 items-center">

                            <div className="font-bold text-base text-center text-black">
                                GUDANG RUMAH
                            </div>

                            <div className="flex flex-wrap mt-2">
                                <div className="text-ml text-gray-400 grow text-center ">
                                    Artikel
                                </div>
                                <div className="text-ml text-gray-400 grow text-center">
                                    Qty
                                </div>
                            </div>

                            <div className="flex flex-wrap">
                                <div className="text-ml font-bold text-black grow text-center ">
                                    20206
                                </div>
                                <div className="text-ml font-bold text-black grow text-center">
                                    20206
                                </div>
                            </div>
                        </div>
                    </a>
                    <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-auto bg-white px-5 py-5 grow group">
                        <div className="grid grid-rows-3 items-center">

                            <div className="font-bold text-base text-center text-black">
                                GUDANG RUMAH
                            </div>

                            <div className="flex flex-wrap mt-2">
                                <div className="text-ml text-gray-400 grow text-center ">
                                    Artikel
                                </div>
                                <div className="text-ml text-gray-400 grow text-center">
                                    Qty
                                </div>
                            </div>

                            <div className="flex flex-wrap">
                                <div className="text-ml font-bold text-black grow text-center ">
                                    20206
                                </div>
                                <div className="text-ml font-bold text-black grow text-center">
                                    20206
                                </div>
                            </div>
                        </div>
                    </a>
                    <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-auto bg-white px-5 py-5 grow group">
                        <div className="grid grid-rows-3 items-center">

                            <div className="font-bold text-base text-center text-black">
                                GUDANG RUMAH
                            </div>

                            <div className="flex flex-wrap mt-2">
                                <div className="text-ml text-gray-400 grow text-center ">
                                    Artikel
                                </div>
                                <div className="text-ml text-gray-400 grow text-center">
                                    Qty
                                </div>
                            </div>

                            <div className="flex flex-wrap">
                                <div className="text-ml font-bold text-black grow text-center ">
                                    20206
                                </div>
                                <div className="text-ml font-bold text-black grow text-center">
                                    20206
                                </div>
                            </div>
                        </div>
                    </a>
                    <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-auto bg-white px-5 py-5 grow group">
                        <div className="grid grid-rows-3 items-center">

                            <div className="font-bold text-base text-center text-black">
                                GUDANG RUMAH
                            </div>

                            <div className="flex flex-wrap mt-2">
                                <div className="text-ml text-gray-400 grow text-center ">
                                    Artikel
                                </div>
                                <div className="text-ml text-gray-400 grow text-center">
                                    Qty
                                </div>
                            </div>

                            <div className="flex flex-wrap">
                                <div className="text-ml font-bold text-black grow text-center ">
                                    20206
                                </div>
                                <div className="text-ml font-bold text-black grow text-center">
                                    20206
                                </div>
                            </div>
                        </div>
                    </a>

                </div>
            </div>

            <div className="flex flex-wrap items-center content-center">
                <div className="shadow rounded-lg w-auto flex flex-row text-center content-center">
                    {/* <button
                        type="button"
                        className="rounded-l-lg bg-gray-200 hover:bg-gray-300 h-[50px] text-gray-700 font-medium px-4 flex flex-wrap gap-2 content-center"
                    >
                        <span>Order ID</span>
                        <div className="my-auto">
                            <fa.FaChevronDown size={10} className="text-gray-700" />
                        </div>
                    </button> */}

                    <input
                        className="h-[50px] border-0 w-[280px] py-2 px-3 text-gray-700 focus:outline-none rounded-l-lg"
                        type="text"
                        placeholder="Pencarian..."
                    />

                    <button
                        type="button"
                        className="rounded-r-lg bg-white hover:bg-gray-200 h-[50px] text-gray-700 font-medium px-5"
                    >
                        <div className="my-auto">
                            <fa.FaSearch size={17} className="text-gray-700" />
                        </div>
                    </button>
                </div>

                <div className="rounded-lg ml-auto w-[290px] flex flex-row items-center justify-end">
                    <button
                        type="button"
                        className="ml-3 shadow rounded-lg bg-blue-600 hover:bg-blue-800 h-[50px] text-white px-4 flex flex-wrap gap-2 content-center"
                    >
                        <Link href="/order/add_order">Tambah Order</Link>
                        <div className="my-auto">
                            <fa.FaPlus size={13} className="text-white" />
                        </div>
                    </button>
                </div>

            </div>

            <div className="w-full mt-6 rounded-xl">
                <table className="table-auto w-full order-collapse border border-slate-500">
                    <thead>
                        <tr>
                            <th className="border border-slate-300">
                                Produk & Harga
                            </th>
                            <th className="border border-slate-300">
                                Stok
                            </th>
                            <th className="border border-slate-300">
                                Varian
                            </th>
                            <th className="border border-slate-300">
                                Kategori
                            </th>
                            <th className="border border-slate-300">
                                Keterangan
                            </th>
                            <th className="border border-slate-300">
                                Grosir
                            </th>
                        </tr>
                    </thead>
                </table>
            </div>

        </>
    );
}
