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
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Warehouse() {
    const [date, setDate] = useState(format(new Date(), "dd/MM/yyyy"));

    const columns: any = [
        {
            name: 'ID Warehouse',
            selector: (row: { id_ware: any }) => row.id_ware,
        },
        {
            name: 'ID Area',
            selector: (row: { id_area: any }) => row.id_area,
        },
        {
            name: 'Warehouse',
            selector: (row: { warehouse: any }) => row.warehouse,
        },
        {
            name: 'Alamat',
            selector: (row: { alamat: any }) => row.alamat,
        },
        {
            name: 'Action',
            selector: (row: { action: any }) => row.action,
        },

    ];

    const list_ware: any = [];

    const { data, error, isLoading } = useSWR(`https://api.inovasimediakreatif.site/getwarehouse`, fetcher);

    if (!isLoading && !error) {
        data.data_ware.map((data_ware: any, index: number) => {
            return (
                list_ware.push(
                    {
                        id: index,
                        id_ware: data_ware.id_ware,
                        id_area: data_ware.id_area,
                        warehouse: data_ware.warehouse,
                        alamat: data_ware.address,
                        action: (
                            <div className="flex flex-warp gap-4">
                                <button className="text-blue-500">
                                    <i className="fi fi-rr-edit text-center text-xl"></i>
                                </button>
                                <button className="text-red-500">
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

    const filteredItems = list_ware.filter((list_ware: any) => {
        return (
            list_ware.id_ware.toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) ||
            list_ware.id_area.toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) ||
            list_ware.warehouse.toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) ||
            list_ware.alamat.toLocaleLowerCase().includes(filterText.toLocaleLowerCase())
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

    return (
        <>
            <div className="font-bold text-3xl border-b border-[#2125291A] h-16 mb-7">
                Data Warehouse
            </div>

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
                    className="items-center"
                    columns={columns}
                    data={filteredItems}
                    selectableRows
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
                                    <div className="">
                                        <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-black">Provinsi</label>
                                        <input className="h-[45px] border w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg" type="text" placeholder="Masukan Provinsi"
                                            value={filterText}
                                            onChange={(e) => setFilterText(e.target.value)}
                                        />
                                    </div>
                                    <div className="mt-6">
                                        <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-black">Kota</label>
                                        <input className="h-[45px] border w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg" type="text" placeholder="Masukan Kota"
                                            value={filterText}
                                            onChange={(e) => setFilterText(e.target.value)}
                                        />
                                    </div>
                                    <div className="mt-6">
                                        <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-black">Up Price</label>
                                        <input className="h-[45px] border w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg" type="text" placeholder="Nilai Up Price"
                                            value={filterText}
                                            onChange={(e) => setFilterText(e.target.value)}
                                        />
                                    </div>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setShowModal(false)}
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
