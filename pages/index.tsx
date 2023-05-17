import Head from "next/head";
import Image from "next/image";
import * as fa from "react-icons/fa";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import React, { Component, useRef, useState } from "react";
import { compareAsc, format } from 'date-fns'
import useSWR from 'swr';
import axios from 'axios';
const fetcher = (url: string) => fetch(url).then(res => res.json());

let Rupiah = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});
// Rupiah.format(data.gross_sale)

export default function Home() {
    // format(new Date(2014, 1, 11), 'yyyy-MM-dd')

    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const [Store, setStore] = useState("all");

    const { data, error, isLoading, mutate } = useSWR(`https://api.hokkiscasual.com/dashboard/${Store}/${date}`, fetcher);

    if (!isLoading && !error) {
        var gross_sale = Rupiah.format(data.gross_sale);
        var expense = Rupiah.format(data.expense);
        var netsale = Rupiah.format(data.netsale);
        var transactions = data.transactions;
        var produkgudangsold = data.produkgudangsold;
        var produkextsold = data.produkextsold;

        var costgudang = Rupiah.format(data.costgudang);
        var costluar = Rupiah.format(data.costluar);

        var profit = Rupiah.format(data.profit);
    }

    const { data: store_data, error: store_error, isLoading: store_isLoading } = useSWR(`https://api.hokkiscasual.com/getstore`, fetcher);
    let list_store: any = [];
    if (!store_isLoading && !store_error) {
        store_data.data_store.map((store: any, index: number) => {
            list_store.push(
                <option key={index} value={store.id_store}>{store.store}</option>
            )
        })
    } else {
        var data_store: any = [];
    }

    return (
        <div className="p-5">
            <div className="flex flex-wrap gap-3 pb-4 items-center border-b border-[#2125291A] content-center mb-7">
                <div className="font-bold text-xl">Dashboard</div>
                <div className="grow font-normal italic text-sm pt-1">Menampilkan Data : {String(date)} </div>
                <div className="flex text-sm flex-row items-center w-[20%] justify-end">
                    <select
                        value={Store}
                        onChange={(e) => {
                            setStore(e.target.value);
                        }}
                        className={`appearance-none border h-[45px] w-[100%] px-5  text-gray-700 focus:outline-none rounded-lg`}>
                        <option value="all">All Store</option>
                        {list_store}
                    </select>
                </div>
                <div className="shadow rounded-lg ml-auto w-[290px] flex flex-row items-center justify-end">
                    <Flatpickr
                        className="text-gray-500 h-[45px] text-start py-2 px-4 w-full rounded-lg focus:outline-none"
                        value={date}
                        placeholder="Select Date Range"
                        options={{
                            mode: "range",
                            dateFormat: "Y-m-d",
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
            </div>

            <div className="grid grid-cols-5 gap-5 grow h-auto content-start">

                <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-[90%] bg-white px-5 py-5 group">

                    <div className="grid grid-rows-3 h-full items-center">
                        <div className="flex content-center items-center justify-start">
                            <div className="grow">
                                <Image
                                    className="w-[36px] h-[36px] max-w-full max-h-full"
                                    src="/shopping-cart.png"
                                    alt="Picture of the author"
                                    width={100}
                                    height={100}
                                />
                            </div>

                            {/* <div>
            <fa.FaChevronRight size={18} className="text-gray-400 group-hover:text-gray-800" />
        </div> */}
                        </div>

                        <div className="font-medium text-sm text-gray-400">
                            Transaksi
                        </div>

                        <div className="font-bold text-xl text-black">
                            {transactions ? transactions : 0} Pesanan
                        </div>
                    </div>

                </a>



                <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-[90%] bg-white px-5 py-5 group">

                    <div className="grid grid-rows-3 h-full items-center">
                        <div className="flex content-center items-center justify-start">
                            <div className="grow">
                                <Image
                                    className="w-[36px] h-[36px] max-w-full max-h-full"
                                    src="/sell.png"
                                    alt="Picture of the author"
                                    width={100}
                                    height={100}
                                />
                            </div>

                            {/* <div>
                                <fa.FaChevronRight size={18} className="text-gray-400 group-hover:text-gray-800" />
                            </div> */}
                        </div>

                        <div className="font-medium text-sm text-gray-400">
                            Omzet Kotor Penjualan
                        </div>

                        <div className="font-bold text-xl text-black">
                            {gross_sale ? gross_sale : 0}
                        </div>
                    </div>

                </a>

                <a href="/expense" className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-[90%] bg-white px-5 py-5 group">

                    <div className="grid grid-rows-3 h-full items-center">
                        <div className="flex content-center items-center justify-start">
                            <div className="grow">
                                <Image
                                    className="w-[36px] h-[36px] max-w-full max-h-full"
                                    src="/expenses.png"
                                    alt="Picture of the author"
                                    width={100}
                                    height={100}
                                />
                            </div>

                            {/* <div>
                                <fa.FaChevronRight size={18} className="text-gray-400 group-hover:text-gray-800" />
                            </div> */}
                        </div>

                        <div className="font-medium text-sm text-gray-400">
                            Pengeluaran
                        </div>

                        <div className="font-bold text-xl text-black">
                            {expense ? expense : 0}
                        </div>
                    </div>

                </a>

                <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-[90%] bg-white px-5 py-5 group">

                    <div className="grid grid-rows-3 h-full items-center">
                        <div className="flex content-center items-center justify-start">
                            <div className="grow">
                                <Image
                                    className="w-[36px] h-[36px] max-w-full max-h-full"
                                    src="/money-bag.png"
                                    alt="Picture of the author"
                                    width={100}
                                    height={100}
                                />
                            </div>

                            {/* <div>
                                <fa.FaChevronRight size={18} className="text-gray-400 group-hover:text-gray-800" />
                            </div> */}
                        </div>

                        <div className="font-medium text-sm text-gray-400">
                            Omzet Bersih
                        </div>

                        <div className="font-bold text-xl text-black">
                            {netsale ? netsale : 0}
                        </div>
                    </div>

                </a>

                <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-[90%] bg-white px-5 py-5 group">

                    <div className="grid grid-rows-3 h-full items-center">
                        <div className="flex content-center items-center justify-start">
                            <div className="grow">
                                <Image
                                    className="w-[36px] h-[36px] max-w-full max-h-full"
                                    src="/money-bag.png"
                                    alt="Picture of the author"
                                    width={100}
                                    height={100}
                                />
                            </div>

                            {/* <div>
                                <fa.FaChevronRight size={18} className="text-gray-400 group-hover:text-gray-800" />
                            </div> */}
                        </div>

                        <div className="font-medium text-sm text-gray-400">
                            Net Profit
                        </div>

                        <div className="font-bold text-xl text-black">
                            {profit ? profit : 0}
                        </div>
                    </div>

                </a>

            </div>

            <div className="grid grid-cols-4 gap-5 grow h-auto content-start">
                <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-[90%] bg-white px-5 py-5 group">
                    <div className="grid grid-rows-3 h-full items-center">
                        <div className="flex content-center items-center justify-start">
                            <div className="grow">
                                <Image
                                    className="w-[36px] h-[36px] max-w-full max-h-full"
                                    src="/warehouse.png"
                                    alt="Picture of the author"
                                    width={100}
                                    height={100}
                                />
                            </div>

                            {/* <div>
                                <fa.FaChevronRight size={18} className="text-gray-400 group-hover:text-gray-800" />
                            </div> */}
                        </div>

                        <div className="font-medium text-sm text-gray-400">
                            Barang Gudang terjual
                        </div>

                        <div className="font-bold text-xl text-black">
                            {produkgudangsold ? produkgudangsold : 0} Pcs
                        </div>
                    </div>
                </a>

                <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-[90%] bg-white px-5 py-5 group">
                    <div className="grid grid-rows-3 h-full items-center">
                        <div className="flex content-center items-center justify-start">
                            <div className="grow">
                                <Image
                                    className="w-[36px] h-[36px] max-w-full max-h-full"
                                    src="/delivery-box.png"
                                    alt="Picture of the author"
                                    width={100}
                                    height={100}
                                />
                            </div>

                            {/* <div>
                                <fa.FaChevronRight size={18} className="text-gray-400 group-hover:text-gray-800" />
                            </div> */}
                        </div>

                        <div className="font-medium text-sm text-gray-400">
                            Modal Barang Gudang
                        </div>

                        <div className="font-bold text-xl text-black">
                            {costgudang}
                        </div>
                    </div>
                </a>




                <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-[90%] bg-white px-5 py-5 group">
                    <div className="grid grid-rows-3 h-full items-center">
                        <div className="flex content-center items-center justify-start">
                            <div className="grow">
                                <Image
                                    className="w-[36px] h-[36px] max-w-full max-h-full"
                                    src="/warehouse.png"
                                    alt="Picture of the author"
                                    width={100}
                                    height={100}
                                />
                            </div>

                            {/* <div>
                            <fa.FaChevronRight size={18} className="text-gray-400 group-hover:text-gray-800" />
                        </div> */}
                        </div>

                        <div className="font-medium text-sm text-gray-400">
                            Barang Luar Terjual
                        </div>

                        <div className="font-bold text-xl text-black">
                            {produkextsold ? produkextsold : 0} Pcs
                        </div>
                    </div>
                </a>

                <a className="hover:shadow-[0px_3px_11px_1px_#2125291A] rounded-xl h-[90%] bg-white px-5 py-5 group">
                    <div className="grid grid-rows-3 h-full items-center">
                        <div className="flex content-center items-center justify-start">
                            <div className="grow">
                                <Image
                                    className="w-[36px] h-[36px] max-w-full max-h-full"
                                    src="/delivery-box.png"
                                    alt="Picture of the author"
                                    width={100}
                                    height={100}
                                />
                            </div>

                            {/* <div>
                                <fa.FaChevronRight size={18} className="text-gray-400 group-hover:text-gray-800" />
                            </div> */}
                        </div>

                        <div className="font-medium text-sm text-gray-400">
                            Modal Barang Luar
                        </div>

                        <div className="font-bold text-xl text-black">
                            {costluar}
                        </div>
                    </div>
                </a>

            </div>

        </div>
    );
}
