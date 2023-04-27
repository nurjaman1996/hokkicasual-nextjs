import Head from "next/head";
import Image from "next/image";
import * as fa from "react-icons/fa";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import React, { Component, useRef, useState } from "react";
import { compareAsc, format } from 'date-fns'

export default function Home() {
    // format(new Date(2014, 1, 11), 'yyyy-MM-dd')

    const [date, setDate] = useState(format(new Date(), 'dd/MM/yyyy')
    );

    return (
        <>
            <div className="font-bold text-3xl border-b border-[#2125291A] h-16 mb-7">General Setting</div>

            <div className="mx-auto w-[50%]">
                <div className="mt-6">
                    <label className="block mb-2 ml-1 text-[20px] text-sm font-medium text-black">Username</label>
                    <input
                        className={`"border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        type="text"
                        placeholder="Username"
                        // ref={req_Alamat}
                        defaultValue=""
                    />
                </div>

                <div className="mt-6">
                    <label className="block mb-2 ml-1 text-[20px] text-sm font-medium text-black">Nama</label>
                    <input
                        className={`"border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        type="text"
                        placeholder="Nama"
                        // ref={req_Alamat}
                        defaultValue=""
                    />
                </div>

                <div className="mt-6">
                    <label className="block mb-2 ml-1 text-[20px] text-sm font-medium text-black">Password</label>
                    <input
                        className={`"border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        type="text"
                        placeholder="***********"
                        // ref={req_Alamat}
                        defaultValue=""
                    />
                </div>

                <div className="mt-6 justify-end flex flex-1">
                    <button className="cursor-pointer ml-3 shadow rounded-lg bg-blue-600 hover:bg-blue-800 h-[45px] text-white px-4 flex flex-wrap gap-2 content-center">
                        Simpan
                        <div className="my-auto">
                            <fa.FaSave size={13} className="text-white" />
                        </div>
                    </button>
                </div>
            </div>
        </>
    );
}
