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
import DataTable, { ExpanderComponentProps } from 'react-data-table-component';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from "react-hook-form";
import useSWR from 'swr';
import axios from 'axios'

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Area() {
    const [date, setDate] = useState(format(new Date(), "dd/MM/yyyy"));

    const { data, error, isLoading, mutate } = useSWR(`https://api.hokkiscasual.com/getarea`, fetcher);

    const { register, resetField, setValue, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            provinsi: '',
            kota: '',
            up_price: '0',
            edit_provinsi: '',
            edit_kota: '',
            edit_up_price: '0'
        }
    });

    const onSubmit = async (data: any) => {
        await axios.post("https://api.hokkiscasual.com/savearea", {
            data: data,
        }).then(function (response) {
            // console.log(response.data);
            mutate();
        });

        toast.success("Data telah disimpan", {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
            autoClose: 2000,
        });

        resetField("provinsi");
        resetField("kota");
        resetField("up_price");
        setShowModal(false);
    };

    const [id, setid] = React.useState(null);

    function showeditModal(id: any, provinsi: any, kota: any, up_price: any, index: number) {
        setid(id);
        setValue("edit_provinsi", provinsi);
        setValue("edit_kota", kota);
        setValue("edit_up_price", up_price);
        seteditModal(true);
    }

    const onSubmitUpdate = async (data: any) => {
        await axios.post(`https://api.hokkiscasual.com/editarea/${id}`, {
            data: data,
        }).then(function (response) {
            // console.log(response.data);
            mutate();
        });

        toast.success("Data telah diupdate", {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
            autoClose: 2000,
        });

        seteditModal(false);
    };

    const columns: any = [
        {
            name: 'ID Area',
            selector: (row: { id_area: any }) => row.id_area,
            sortable: true,
        },
        {
            name: 'Provinsi',
            selector: (row: { provinsi: any }) => row.provinsi,
            sortable: true,
        },
        {
            name: 'Kota',
            selector: (row: { kota: any }) => row.kota,
            sortable: true,
        },
        {
            name: 'Up Price',
            selector: (row: { up_price: any }) => row.up_price,
            sortable: true,
        },
        {
            name: 'Action',
            selector: (row: { action: any }) => row.action,
        },

    ];

    const list_area: any = [];

    if (!isLoading && !error) {
        data.data_area.map((data_area: any, index: number) => {
            return (
                list_area.push(
                    {
                        id: index,
                        id_area: data_area.id_area,
                        provinsi: data_area.provinsi,
                        kota: data_area.kota,
                        up_price: data_area.up_price,
                        action: (
                            <div className="flex flex-warp gap-4">
                                <button className="text-blue-500" onClick={() => showeditModal(data_area.id, data_area.provinsi, data_area.kota, data_area.up_price, index)}>
                                    <i className="fi fi-rr-edit text-center text-xl"></i>
                                </button>
                                <button className="text-red-500" onClick={() => showdeleteModal(data_area.id, index)}>
                                    <i className="fi fi-rr-trash text-center text-xl"></i>
                                </button>
                            </div>
                        ),
                    },
                )
            )
        })
    }

    const [filterText, setFilterText] = React.useState("");

    const filteredItems = list_area.filter((list_area: any) => {
        return (
            list_area.id_area.toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) ||
            list_area.kota.toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) ||
            list_area.provinsi.toLocaleLowerCase().includes(filterText.toLocaleLowerCase())
        );
    });

    const CustomMaterialPagination = ({ rowsPerPage, rowCount, onChangePage, onChangeRowsPerPage, currentPage }: any) => (
        <div className="bg-white border-t px-3 py-2 flex flex-wrap justify-start h-14 items-center">
            <div className="grow">
                Menampilkan {String(currentPage)}-{String(Math.ceil(rowCount / 10))} dari {String(rowCount)} items
            </div>

            <div className="grid grid-cols-2 gap-2">
                <button className="bg-white border rounded-lg border-gray-300 p-2 text-sm font-normal" onClick={({ }) => onChangePage(currentPage === 1 ? currentPage : currentPage - 1)}>Back</button>
                <button className="bg-white border rounded-lg border-gray-300 p-2 text-sm font-normal" onClick={({ }) => onChangePage(currentPage + 1)}>Next</button>
            </div>
        </div>
    );

    const [showModal, setShowModal] = React.useState(false);
    const [delModal, setdelModal] = React.useState(false);
    const [editModal, seteditModal] = React.useState(false);

    const [provinsi, setprovinsi] = React.useState(null);
    const [kota, setkota] = React.useState(null);

    function showdeleteModal(id: any, index: number) {
        setid(id)
        setprovinsi(list_area[index].provinsi)
        setkota(list_area[index].kota)
        setdelModal(true)
    }

    async function deleteData() {
        await axios.post(`https://api.hokkiscasual.com/deletearea/${id}`)
            .then(function (response) {
                // console.log(response.data);
                mutate();
            });

        toast.success("Data berhasil dihapus", {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
            autoClose: 2000,
        });

        setdelModal(false)
    }

    return (
        <div className="p-5">
            <div className="font-bold text-3xl border-b border-[#2125291A] h-16 mb-7">
                Data Area
            </div>

            <ToastContainer className="mt-[50px]" />

            <div className="flex flex-wrap items-center content-center mb-6">
                <div className="shadow rounded-lg w-auto flex flex-row text-center content-center">
                    <input className="h-[45px] border-0 w-[300px] pr-3 pl-5  text-gray-700 focus:outline-none rounded-l-lg" type="text" placeholder="Cari data Area"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />

                    <button type="button" className="rounded-r-lg bg-white h-[45px] text-gray-700 font-medium px-5">
                        <div className="my-auto">
                            <fa.FaSearch size={17} className="text-gray-700" />
                        </div>
                    </button>
                </div>

                <div className="ml-auto flex flex-row items-center justify-end">
                    <button onClick={() => setShowModal(true)} className="cursor-pointer ml-3 shadow rounded-lg bg-blue-600 hover:bg-blue-800 h-[45px] text-white px-4 flex flex-wrap gap-2 content-center">
                        Tambah Data
                        <div className="my-auto">
                            <fa.FaPlus size={13} className="text-white" />
                        </div>
                    </button>
                </div>
            </div>


            <div className="mb-20">
                <DataTable
                    columns={columns}
                    data={filteredItems}
                    pagination
                    paginationComponent={CustomMaterialPagination}
                />
            </div>

            {showModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl ">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[500px]">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <span className="text-xl font-semibold">
                                        Tambah Data Area
                                    </span>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="">
                                            <label className="block mb-2 text-sm font-medium text-black">Provinsi</label>
                                            <input
                                                className={`${errors.provinsi ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                type="text"
                                                placeholder="Masukan Provinsi"
                                                // ref={req_provinsi}
                                                defaultValue="" {...register("provinsi", { required: true })}
                                            />
                                            {errors.provinsi && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>
                                        <div className="mt-6">
                                            <label className="block mb-2 text-sm font-medium text-black">Kota</label>
                                            <input
                                                className={`${errors.kota ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                type="text"
                                                placeholder="Masukan Kota"
                                                // ref={req_kota}
                                                defaultValue="" {...register("kota", { required: true })}
                                            />
                                            {errors.kota && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>
                                        <div className="mt-6">
                                            <label className="block mb-2 text-sm font-medium text-black">Up Price</label>
                                            <input
                                                className={`${errors.up_price ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                type="number"
                                                placeholder="Nilai Up Price"
                                                // ref={req_upprice}
                                                defaultValue="" min={0} {...register("up_price", { required: true })}
                                            />
                                            {errors.up_price && <div className="mt-1 text-sm italic">This field is required</div>}

                                        </div>
                                    </form>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => {
                                            resetField("provinsi");
                                            resetField("kota");
                                            resetField("up_price");
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

            {editModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl ">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[500px]">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <span className="text-xl font-semibold">
                                        Edit Data Area
                                    </span>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                    <form onSubmit={handleSubmit(onSubmitUpdate)}>
                                        <div className="">
                                            <label className="block mb-2 text-sm font-medium text-black">Provinsi</label>
                                            <input
                                                className={`${errors.provinsi ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                type="text"
                                                placeholder="Masukan Provinsi"
                                                // ref={req_provinsi}
                                                {...register("edit_provinsi", { required: true })}
                                            />
                                            {errors.provinsi && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>
                                        <div className="mt-6">
                                            <label className="block mb-2 text-sm font-medium text-black">Kota</label>
                                            <input
                                                className={`${errors.kota ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                type="text"
                                                placeholder="Masukan Kota"
                                                // ref={req_kota}
                                                {...register("edit_kota", { required: true })}
                                            />
                                            {errors.kota && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>
                                        <div className="mt-6">
                                            <label className="block mb-2 text-sm font-medium text-black">Up Price</label>
                                            <input
                                                className={`${errors.up_price ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                type="number"
                                                placeholder="Nilai Up Price"
                                                // ref={req_upprice}
                                                min={0} {...register("edit_up_price", { required: true })}
                                            />
                                            {errors.up_price && <div className="mt-1 text-sm italic">This field is required</div>}

                                        </div>
                                    </form>
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

            {delModal ? (
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
                                    <span className="text-sm font-semibold">
                                        Provinsi {provinsi}, Kota {kota} akan dihapus?
                                    </span>
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
            ) : null}

        </div>
    );
}
