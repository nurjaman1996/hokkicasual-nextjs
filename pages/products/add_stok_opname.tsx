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

export default function StockOpname() {
    const [date, setDate] = useState(format(new Date(), "dd/MM/yyyy"));

    const [openSize, setopenSize] = useState(null);

    function toogleActive(index: any) {
        if (openSize === index) {
            setopenSize(null);
        } else {
            setopenSize(index);
        }
    }

    return (
        <>
            <div className="font-bold text-3xl border-b border-[#2125291A] h-16 mb-7">
                Buat Stok Opname Baru
            </div>

            <div className="flex flex-wrap items-center content-center mb-6">

                <div className="ml-auto flex flex-row items-center justify-end">
                    <button type="button" className="ml-3 shadow rounded-lg bg-blue-600 hover:bg-blue-800 h-[45px] text-white px-4 flex flex-wrap gap-2 content-center">
                        <Link href='/products/add_stok_opname'>Buat Stok Opname</Link>
                        <div className="my-auto">
                            <fa.FaPlus size={13} className="text-white" />
                        </div>
                    </button>
                </div>

            </div>

            <div className="bg-white h-auto rounded-lg pb-6">
                <div className="py-6 px-6 font-bold text-[22px]">Informasi Stok Opname</div>
                <div className="mx-6">
                    <hr />
                </div>

                <div className="grid grid-cols-2">
                    <div className="py-4 px-6 font-bold text-[16px]">Gudang<small className="text-[18px] text-red-400" >*</small></div>
                    <div className="py-4 px-6 font-bold text-[16px]">Tanggal Stok Opname</div>
                </div>
                <div className="grid grid-cols-2">
                    <div className="bg-gray-100 h-15 mx-6 py-4 px-4 border-collapse rounded-lg">
                        Gudang Utama
                    </div>
                    <div className="bg-gray-100 h-15 mx-6 py-4 px-4 border-collapse rounded-lg">
                        Gudang Utama
                    </div>
                </div>

                <div className="grid grid-cols-1">
                    <div className="py-4 px-6 font-bold text-[16px]">Keterangan<small className="text-[18px] text-red-400" >*</small></div>
                </div>
                <div className="mx-6">
                    <textarea className="bg-gray-100 w-full rounded-lg mx-0 h-32" cols={20}></textarea>
                </div>

            </div>

            <div className="bg-white h-auto rounded-lg pb-6 mt-6 mb-6">
                <div className="grid grid-cols-2">
                    <div className="py-6 px-6 font-bold text-[22px]">Informasi Stok Opname</div>
                    <button className="py-6 px-6 text-blue-500 text-[12px] text-right" type="button">Tambah baris <i className="fi fi-rr-add"></i></button>
                </div>
                <div className="mx-6">
                    <hr />
                </div>

                <div className="grid grid-cols-2">
                    <div className="py-4 px-6 font-bold text-[16px]">Produk<small className="text-[18px] text-red-400" >*</small></div>
                    <div className="flex flex-wrap text-center">
                        <div className="py-4 px-6 font-bold text-[16px] grow">Jumlah Di Sistem</div>
                        <div className="py-4 px-6 font-bold text-[16px] grow">Jumlah Di Gudang<small className="text-[14px] text-red-400" >*</small></div>
                        <div className="py-4 px-6 font-bold text-[16px] grow">Jumlah Stok Opname</div>
                    </div>
                </div>
                <div className="grid grid-cols-2">
                    <div className="bg-gray-100 h-15 mx-6 py-4 px-4 border-collapse rounded-lg">
                        <span className="text-gray-500">Cari Produk</span>
                    </div>
                    <div className="flex flex-wrap">
                        <div className="bg-gray-100 h-15 mx-6 py-4 px-4 border-collapse rounded-lg grow">
                            0
                        </div>
                        <div className="bg-gray-100 h-15 mx-6 py-4 px-4 border-collapse rounded-lg grow">
                            0
                        </div>
                        <div className="bg-gray-100 h-15 mx-6 py-4 px-4 border-collapse rounded-lg grow">
                            0
                        </div>
                    </div>
                </div>

            </div>


        </>
    );
}
