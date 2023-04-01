import Head from "next/head";
import Image from "next/image";
import * as fa from "react-icons/fa";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import React, { Component, useRef, useState } from "react";
import { compareAsc, format } from 'date-fns';

export default function PesananSelesai() {
    // format(new Date(2014, 1, 11), 'yyyy-MM-dd')

    const [date, setDate] = useState(format(new Date(), 'dd/MM/yyyy')
    );

    const total_data = 17;


    let data_order: any = [];
    {
        for (let index = 0; index < total_data; index++) {
            data_order.push(
                <div key={index} className="shadow-lg w-full h-auto bg-white rounded-lg p-6">

                    <div className="flex flex-wrap content-end">
                        <div className="grid grid-rows-2 gap-1 h-auto">
                            <span className="text-blue-700 text-sm font-bold">#278LKANSDJN72U2S8</span>
                            <span className="text-gray-400 text-sm">Selasa, 28 Mar 2023 23:50:21</span>
                        </div>

                        <div className="grow flex flex-wrap justify-end items-center gap-3">
                            <span className="font-bold text-green-500">Selesai</span>
                            <Image
                                className="w-[40px] h-auto"
                                src="/done.png"
                                alt="Picture of the author"
                                width={100}
                                height={100}
                            />
                        </div>
                    </div>

                    <hr className="border-t-2 border-basic-3 mt-2 mb-3"></hr>

                    <div className="flex flex-wrap gap-7 h-auto">
                        <div className="w-[300px]">
                            <div className="grid grid-flow-row h-auto">
                                <span className="text-gray-600 text-sm">Pemesan</span>
                                <span className="text-black text-lg font-bold">HOKKICASUAL.ID</span>
                                <span className="text-orange-500 text-lg font-bold">SHOPEE</span>

                                <div className="flex flex-wrap h-auto mb-2">
                                    <span className="text-gray-800 text-sm mt-6 text-start">Status Bayar & Total bayar</span>
                                    <span className="text-blue-700 font-bold text-sm mt-6 text-end grow">Lihat Riwayat</span>
                                </div>

                                <div className="bg-white border-2 h-auto rounded-lg py-2 px-3 grid grid-flow-row w-[300px]">
                                    <span className="text-black text-lg font-bold mb-2">Rp1.235.334</span>
                                    <div className="flex flex-wrap gap-2 h-auto mb-1">
                                        <span className="bg-green-500 p-1 px-3 text-sm text-white rounded-md">Paid</span>
                                        <span className="bg-gray-800 p-1 px-3 text-sm text-white rounded-md">CASH (28-10-2039)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-gray-600 text-sm grow">
                            <span>Produk (total {index + 1 * 5} item)</span>
                            <div className="mt-2">
                                <table className="table-auto w-full text-center">
                                    <thead>
                                        <tr>
                                            <th className="bg-blue-600 text-white py-2 border border-blue-600">No.</th>
                                            <th className="bg-blue-600 text-white py-2 border border-blue-600">PRODUCT</th>
                                            <th className="bg-blue-600 text-white py-2 border border-blue-600">ID PRODUCT</th>
                                            <th className="bg-blue-600 text-white py-2 border border-blue-600">SIZE</th>
                                            <th className="bg-blue-600 text-white py-2 border border-blue-600">QTY</th>
                                            <th className="bg-blue-600 text-white py-2 border border-blue-600">PRICE</th>
                                            <th className="bg-blue-600 text-white py-2 border border-blue-600">DISC ITEM</th>
                                            <th className="bg-blue-600 text-white py-2 border border-blue-600">SUB TOTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(function (rows: any, i, len) {
                                            while (++i <= len) {
                                                rows.push(
                                                    <tr key={i}>
                                                        <td className="border py-2 border-gray-300">{i}</td>
                                                        <td className="border py-2 border-gray-300">Nike Air Force 1 07 Triple White</td>
                                                        <td className="border py-2 border-gray-300">125081399</td>
                                                        <td className="border py-2 border-gray-300">38</td>
                                                        <td className="border py-2 border-gray-300">2</td>
                                                        <td className="border py-2 border-gray-300">Rp 750.000</td>
                                                        <td className="border py-2 border-gray-300">Rp 0</td>
                                                        <td className="border py-2 border-gray-300">Rp 750.000</td>
                                                    </tr>
                                                )
                                            }
                                            return rows;
                                        })([], 0, index + 1 * 5)}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <hr className="border-t-2 border-basic-3 mt-5 mb-3"></hr>

                    <div className="flex flex-wrap justify-end gap-3">
                        <button className="bg-white border-2 border-blue-400 h-auto rounded-lg py-2 px-3 grid grid-flow-row">
                            <span className="text-blue-500 text-sm font-medium">Print</span>
                        </button>

                        <button className="bg-white border-2 border-blue-400 h-auto rounded-lg py-2 px-3 grid grid-flow-row">
                            <span className="text-blue-500 text-sm font-medium">Selesaikan Pesanan</span>
                        </button>

                        <button className="bg-white border-2 border-blue-400 h-auto rounded-lg py-2 px-3 grid grid-flow-row">
                            <span className="text-blue-500 text-sm font-medium">Edit Pesanan</span>
                        </button>
                    </div>

                </div>
            )
        }

    }

    return (
        <>
            <div className="font-bold text-3xl border-b border-[#2125291A] h-16 mb-7">Pesanan Selesai</div>

            <div className="flex flex-wrap items-center content-center">
                <div className="shadow rounded-lg w-auto flex flex-row text-center content-center">
                    <button type="button" className="rounded-l-lg bg-gray-200 hover:bg-gray-300 h-[50px] text-gray-700 font-medium px-4 flex flex-wrap gap-2 content-center">
                        <span>Order ID</span>
                        <div className="my-auto">
                            <fa.FaChevronDown size={10} className="text-gray-700" />
                        </div>
                    </button>

                    <input className="h-[50px] border-0 w-[280px] py-2 px-3 text-gray-700 focus:outline-none " type="text" placeholder="Pencarian..." />

                    <button type="button" className="rounded-r-lg bg-white hover:bg-gray-200 h-[50px] text-gray-700 font-medium px-5">
                        <div className="my-auto">
                            <fa.FaSearch size={17} className="text-gray-700" />
                        </div>
                    </button>
                </div>

                <div className="shadow rounded-lg ml-auto w-[290px] flex flex-row items-center justify-end">
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

                    <i className="fi fi-rr-calendar w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-4"></i>
                </div>

                <button type="button" className="ml-3 shadow rounded-lg bg-blue-600 hover:bg-blue-800 h-[50px] text-white px-4 flex flex-wrap gap-2 content-center">
                    <span>Tambah Order</span>
                    <div className="my-auto">
                        <fa.FaPlus size={13} className="text-white" />
                    </div>
                </button>
            </div>

            <div className="font-medium text-black py-5">
                <span>{total_data} order ditampilkan</span>
            </div>

            <div className="grid grid-cols-1 gap-4 w-full h-auto pb-10">
                {data_order}
            </div>
        </>
    );
}
