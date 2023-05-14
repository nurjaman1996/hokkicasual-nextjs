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
import axios from 'axios';
import { json } from "body-parser";
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function DaftarProduk() {
    // const [dataProduct, setData] = useState(dataProduct_.product);
    const [date, setDate] = useState(format(new Date(), "dd/MM/yyyy"));

    const columns: any = [
        {
            name: 'Username',
            selector: (row: { username: any }) => row.username,
        },
        {
            name: 'Nama',
            selector: (row: { nama: any }) => row.nama,
        },
        {
            name: 'Contact',
            selector: (row: { contact: any }) => row.contact,
        },
        {
            name: 'Domisili',
            selector: (row: { domisili: any }) => row.domisili,
        },
        {
            name: 'Role',
            selector: (row: { role: any }) => row.role,
        },
        {
            name: 'Store',
            selector: (row: { store: any }) => row.store,
        },
        {
            name: 'Action',
            selector: (row: { action: any }) => row.action,
        },

    ];

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

    const { data, error, isLoading, mutate } = useSWR(`https://api.hokkiscasual.com/getkaryawan`, fetcher);

    const { data: store_data, error: store_error, isLoading: store_isLoading, mutate: store_mutate } = useSWR(`https://api.hokkiscasual.com/getstore`, fetcher);

    const list_store: any = [];

    if (!store_isLoading && !store_error) {
        store_data.data_store.map((store: any, index: number) => {
            list_store.push(
                <option key={index} value={store.id_store}>{store.store}</option>
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
        defaultValues: {
            name: '',
            tlp: '',
            domisili: '',
            role: '',
            store: '',

            edit_name: '',
            edit_tlp: '',
            edit_domisili: '',
            edit_role: '',
            edit_store: '',
        }
    });

    const list_karyawan: any = [];

    if (!isLoading && !error) {
        data.data_karyawan.map((data_karyawan: any, index: any) => {
            return (
                list_karyawan.push(
                    {
                        id: index,
                        username: data_karyawan.username,
                        nama: data_karyawan.name,
                        contact: data_karyawan.tlp,
                        domisili: data_karyawan.domisili,
                        role: data_karyawan.role,
                        store: data_karyawan.store[0]['store'],
                        action: (
                            <div className="flex flex-warp gap-4">
                                <button className="text-blue-500" onClick={() => showeditModal(data_karyawan.id, data_karyawan.name, data_karyawan.tlp, data_karyawan.domisili, data_karyawan.id_store, data_karyawan.role, index)}>
                                    <i className="fi fi-rr-edit text-center text-xl"></i>
                                </button>
                                <button className="text-red-500" onClick={() => showdeleteModal(data_karyawan.id, index)}>
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

    const filteredItems = list_karyawan.filter((list_karyawan: any) => {
        return (
            list_karyawan.username.toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) ||
            list_karyawan.nama.toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) ||
            list_karyawan.store.toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) ||
            list_karyawan.role.toLocaleLowerCase().includes(filterText.toLocaleLowerCase())
        );
    });

    const [showModal, setShowModal] = React.useState(false);
    const [delModal, setdelModal] = React.useState(false);
    const [editModal, seteditModal] = React.useState(false);
    const [Deskripsi, setDeskripsi] = React.useState(null);

    const onSubmit = async (data: any) => {
        await axios.post("https://api.hokkiscasual.com/savekaryawan", data).then(function (response) {
            console.log(response.data);
            mutate();
        });

        toast.success("Data telah disimpan", {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
            autoClose: 2000,
        });

        resetField('name');
        resetField('domisili');
        resetField('tlp');
        setValue("store", "");
        setValue("role", "");
        setShowModal(false);
    };

    const [id, setid] = React.useState(null);

    function showeditModal(id: any, edit_name: any, edit_tlp: any, edit_domisili: any, edit_store: any, edit_role: any, index: number) {
        setid(id);
        setValue("edit_name", edit_name);
        setValue("edit_tlp", edit_tlp);
        setValue("edit_domisili", edit_domisili);
        setValue("edit_store", edit_store);
        setValue("edit_role", edit_role);
        seteditModal(true);
    }

    const onSubmitUpdate = async (data: any) => {
        await axios.post(`https://api.hokkiscasual.com/editkaryawan/${id}`, data).then(function (response) {
            console.log(response.data);
            mutate();
        });

        toast.success("Data telah diupdate", {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
            autoClose: 2000,
        });

        seteditModal(false);
    };

    function showdeleteModal(id: any, index: number) {
        setid(id)
        setDeskripsi(list_karyawan[index].name)
        setdelModal(true)
    }

    async function deleteData() {
        await axios.post(`https://api.hokkiscasual.com/deletekaryawan/${id}`)
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
                Data Karyawan
            </div>

            <ToastContainer className="mt-[50px]" />

            <div className="flex flex-wrap items-center content-center mb-6">
                <div className="shadow rounded-lg w-auto flex flex-row text-center content-center">
                    <input className="h-[45px] border-0 w-[300px] pr-3 pl-5  text-gray-700 focus:outline-none rounded-l-lg" type="text" placeholder="Cari data Karyawan"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />

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


            <div className="mb-20">
                <DataTable
                    className="items-center"
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
                                                defaultValue="" {...register("tlp", { required: false })}
                                            />
                                            {errors.tlp && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>
                                        <div className="mt-6">
                                            <label className="block mb-2 text-sm font-medium text-black">Domisili</label>
                                            <input
                                                className={`${errors.domisili ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                type="text"
                                                placeholder="Kota Domisili"
                                                // ref={req_brand}
                                                defaultValue="" {...register("domisili", { required: true })}
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
                                                {list_store}
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
                                                <option value="HEAD-STORE">HEAD STORE</option>
                                                <option value="MANAGER">MANAGER</option>
                                                <option value="ADMIN">ADMIN</option>
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
                                            resetField('name');
                                            resetField('domisili');
                                            resetField('tlp');
                                            setValue("store", "");
                                            setValue("role", "");
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
                                        Tambah Data Karyawan
                                    </span>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                    <form onSubmit={handleSubmit(onSubmitUpdate)}>
                                        <div className="">
                                            <label className="block mb-2 text-sm font-medium text-black">Nama</label>
                                            <input
                                                className={`${errors.edit_name ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                type="text"
                                                placeholder="Masukan Nama Karyawan"
                                                // ref={req_brand}
                                                defaultValue="" {...register("edit_name", { required: true })}
                                            />
                                            {errors.edit_name && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>
                                        <div className="mt-6">
                                            <label className="block mb-2 text-sm font-medium text-black">Tlp</label>
                                            <input
                                                className={`${errors.edit_tlp ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                type="text"
                                                placeholder="Masukan No Tlp (Opsional)"
                                                // ref={req_brand}
                                                defaultValue="" {...register("edit_tlp", { required: false })}
                                            />
                                            {errors.edit_tlp && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>
                                        <div className="mt-6">
                                            <label className="block mb-2 text-sm font-medium text-black">Domisili</label>
                                            <input
                                                className={`${errors.edit_domisili ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                type="text"
                                                placeholder="Kota Domisili"
                                                // ref={req_brand}
                                                defaultValue="" {...register("edit_domisili", { required: true })}
                                            />
                                            {errors.edit_domisili && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>

                                        <div className="mt-6">
                                            <label className="block mb-2 text-sm font-medium text-black">Store</label>
                                            <select
                                                className={`${errors.edit_store ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                {...register("edit_store", { required: true })}
                                            >
                                                <option value="">Pilih Store</option>
                                                {list_store}
                                            </select>
                                            {errors.edit_store && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>

                                        <div className="mt-6">
                                            <label className="block mb-2 text-sm font-medium text-black">Roles</label>
                                            <select
                                                className={`${errors.edit_role ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                {...register("edit_role", { required: true })}
                                            >
                                                <option value="">Pilih Roles</option>
                                                <option value="HEAD-STORE">HEAD STORE</option>
                                                <option value="MANAGER">MANAGER</option>
                                                <option value="ADMIN">ADMIN</option>
                                            </select>
                                            {errors.edit_role && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>
                                    </form>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => {
                                            resetField('name');
                                            resetField('domisili');
                                            resetField('tlp');
                                            setValue("store", "");
                                            setValue("role", "");
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
                                        Data Karyawan {Deskripsi} akan dihapus?
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
