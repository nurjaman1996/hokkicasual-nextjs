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

    const { data, error, isLoading, mutate } = useSWR(`https://api.inovasimediakreatif.site/getkaryawan`, fetcher);

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
            name: '',
            deskripsi: '',
            tlp: '',
            domisili: '',
            role: '',
            store: '',
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

        resetField("name");
        resetField("tlp");
        resetField("domisili");
        setShowModal(false);
    };

    const list_karyawan: any = [];

    if (!isLoading && !error) {
        data.data_karyawan.map((data_karyawan: any, index: any) => {
            return (
                list_karyawan.push(
                    <tbody key={index} className="group hover:shadow-lg rounded-lg">
                        <tr className="group-hover:drop-shadow-primary transition-filter rounded-lg">
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 pl-5 rounded-tl-lg">
                                    {index + 1}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-left items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                                    {data_karyawan.username}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4 ">
                                    {data_karyawan.name}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                                    {data_karyawan.tlp}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                                    {data_karyawan.domisili}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                                    {data_karyawan.role}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                                    {data_karyawan.store[0].store}
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


                    </tbody>
                )
            )
        })
    }



    return (
        <>
            <div className="font-bold text-3xl border-b border-[#2125291A] h-16 mb-7">
                Data Karyawan
            </div>

            <div className="flex flex-wrap items-center content-center mb-6">
                <div className="shadow rounded-lg w-auto flex flex-row text-center content-center">
                    <input className="h-[45px] border-0 w-[300px]  pr-3 pl-5  text-gray-700 focus:outline-none rounded-l-lg" type="text" placeholder="Cari nama karyawan..." />

                    <button type="button" className="rounded-r-lg bg-white hover:bg-gray-200 h-[45px] text-gray-700 font-medium px-5">
                        <div className="my-auto">
                            <fa.FaSearch size={17} className="text-gray-700" />
                        </div>
                    </button>
                </div>

                <div className="ml-auto flex flex-row items-center justify-end">
                    <button onClick={() => setShowModal(true)} className="ml-3 shadow rounded-lg bg-blue-600 hover:bg-blue-800 h-[45px] text-white px-4 flex flex-wrap gap-2 content-center">
                        Tambah Karyawan
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
                        <th className="py-3 text-left">
                            Username
                        </th>
                        <th className="py-3">
                            Nama
                        </th>
                        <th className="py-3">
                            Tlp
                        </th>
                        <th className="py-3">
                            Domisili
                        </th>
                        <th className="py-3">
                            Role
                        </th>
                        <th className="py-3">
                            Store
                        </th>
                        <th className="py-3 rounded-r-lg">
                            Act
                        </th>
                    </tr>
                </thead>

                {list_karyawan}

            </table>

            {showModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl ">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[500px]">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <span className="text-xl font-semibold">
                                        Tambah Data Karyawan
                                    </span>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="">
                                            <label className="block mb-2 text-sm font-medium text-black">Nama</label>
                                            <input
                                                className={`${errors.name ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                type="text"
                                                placeholder="Masukan Nama Karyawan"
                                                // ref={req_brand}
                                                defaultValue="" {...register("name", { required: true })}
                                            />
                                            {errors.name && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>
                                        <div className="mt-6">
                                            <label className="block mb-2 text-sm font-medium text-black">Tlp</label>
                                            <input
                                                className={`${errors.tlp ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                type="text"
                                                placeholder="Masukan No Tlp (Opsional)"
                                                // ref={req_brand}
                                                defaultValue="" {...register("name", { required: true })}
                                            />
                                            {errors.tlp && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>
                                        <div className="mt-6">
                                            <label className="block mb-2 text-sm font-medium text-black">Domisili</label>
                                            <input
                                                className={`${errors.domisili ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                type="text"
                                                placeholder="Isi Domisili"
                                                // ref={req_brand}
                                                defaultValue="" {...register("name", { required: true })}
                                            />
                                            {errors.domisili && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>

                                        <div className="mt-6">
                                            <label className="block mb-2 text-sm font-medium text-black">Store</label>
                                            <select
                                                className={`${errors.store ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                {...register("store", { required: true })}
                                            >
                                                <option value="">Pilih Store</option>
                                                <option value="SHOPEE">SHOPEE</option>
                                                <option value="TOKOPEDIA">TOKOPEDIA</option>
                                                <option value="BLIBLI">BLIBLI</option>
                                                <option value="LAZADA">LAZADA</option>
                                                <option value="OFFLINE STORE">OFFLINE STORE</option>
                                            </select>
                                            {errors.store && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>

                                        <div className="mt-6">
                                            <label className="block mb-2 text-sm font-medium text-black">Roles</label>
                                            <select
                                                className={`${errors.role ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                {...register("role", { required: true })}
                                            >
                                                <option value="">Pilih Roles</option>
                                                <option value="SHOPEE">SHOPEE</option>
                                                <option value="TOKOPEDIA">TOKOPEDIA</option>
                                                <option value="BLIBLI">BLIBLI</option>
                                                <option value="LAZADA">LAZADA</option>
                                                <option value="OFFLINE STORE">OFFLINE STORE</option>
                                            </select>
                                            {errors.role && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>
                                    </form>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => {

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
            ) : null}
        </>
    );
}
