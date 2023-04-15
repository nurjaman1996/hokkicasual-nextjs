import Head from "next/head";
import Image from "next/image";
import * as fa from "react-icons/fa";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import React, { Component, useRef, useState } from "react";
import { useRouter } from "next/router";
import { compareAsc, format } from "date-fns";
import Link from "next/link";
import TableHeaderRow from "@nextui-org/react/types/table/table-header-row";
import { Collapse } from "react-collapse";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm, useFieldArray } from "react-hook-form";
import useSWR from 'swr';
import axios from 'axios';
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AddProduk() {
    const [date, setDate] = useState(format(new Date(), "dd/MM/yyyy"));
    const router = useRouter();

    const { data: brand_data, error: brand_error, isLoading: brand_isLoading, mutate: brand_mutate } = useSWR(`https://api.inovasimediakreatif.site/getbrand`, fetcher);

    const list_brand: any = [];

    if (!brand_isLoading && !brand_error) {
        brand_data.data_brand.map((area: any, index: number) => {
            list_brand.push(
                <option key={index} value={area.id_brand}>{area.brand}</option>
            )
        })
    }

    const { data: category_data, error: category_error, isLoading: category_isLoading, mutate: category_mutate } = useSWR(`https://api.inovasimediakreatif.site/getcategory`, fetcher);

    const list_category: any = [];

    if (!category_isLoading && !category_error) {
        category_data.data_cat.map((area: any, index: number) => {
            list_category.push(
                <option key={index} value={area.id_category}>{area.category}</option>
            )
        })
    }

    const { data: supplier_data, error: supplier_error, isLoading: supplier_isLoading, mutate: supplier_mutate } = useSWR(`https://api.inovasimediakreatif.site/getsupplier`, fetcher);

    const list_supplier: any = [];

    if (!supplier_isLoading && !supplier_error) {
        supplier_data.data_supplier.map((area: any, index: number) => {
            list_supplier.push(
                <option key={index} value={area.id_sup}>{area.supplier}</option>
            )
        })
    }

    const { data: warehouse_data, error: warehouse_error, isLoading: warehouse_isLoading, mutate: warehouse_mutate } = useSWR(`https://api.inovasimediakreatif.site/getwarehouse`, fetcher);

    const list_warehouse: any = [];

    if (!warehouse_isLoading && !warehouse_error) {
        warehouse_data.data_ware.map((area: any, index: number) => {
            list_warehouse.push(
                <option key={index} value={area.id_ware}>{area.warehouse}</option>
            )
        })
    }

    const [Count, setCount] = useState(1);

    const { register, control, resetField, setValue, trigger, handleSubmit, watch, formState: { errors } } = useForm({
        // defaultValues: {
        //     produk: '',
        //     brand: '',
        //     warehouse: '',
        //     supplier: '',
        //     harga_beli: '',
        //     harga_jual: '',
        //     quality: '',
        //     kategori: '',
        //     deskripsi: '',
        //     img: '',
        // }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "variasi"
    });

    let list_variasi: any = [];
    {
        for (let index = 0; index < Count; index++) {
            list_variasi.push(
                <tr key={index} className="rounded-lg h-auto mt-7">
                    <td className="pt-4 p-0">
                        <div className="h-[46px] flex flex-wrap justify-center items-center rounded-l-lg">
                            <input {...register(`variasi.${index}.size`, { required: false })} className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg" type="text" placeholder="Size"
                            />
                        </div>
                    </td>
                    <td className="pt-4 p-0">
                        <div className="h-[46px] flex flex-wrap justify-center items-center rounded-l-lg">
                            <input defaultValue={0} {...register(`variasi.${index}.stok`, { required: false })} className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg" type="number" placeholder="Size"
                            />
                        </div>
                    </td>
                    <td className="pt-4 p-0">
                        {(function () {
                            if (index < 1) {
                                return (
                                    <button onClick={() => {
                                        append({ size: "", stok: 0 });
                                        setCount(Count + 1);
                                    }}
                                        type="button" className="mx-2 m-auto border-none rounded-lg bg-blue-600 hover:bg-blue-800 h-[45px] text-white px-4 flex flex-wrap gap-2 content-center">
                                        <div className="my-auto">
                                            <fa.FaPlus size={13} className="text-white" />
                                        </div>
                                    </button>
                                )
                            } else {
                                return (
                                    <button
                                        // onClick={() => { setCount(Count - 1) }}
                                        onClick={() => {
                                            remove(index)
                                            setCount(Count - 1);
                                        }}
                                        type="button" className="mx-2 m-auto border-none rounded-lg bg-red-600 hover:bg-red-800 h-[45px] text-white px-4 flex flex-wrap gap-2 content-center">
                                        <div className="my-auto">
                                            <fa.FaMinus size={13} className="text-white" />
                                        </div>
                                    </button>
                                )
                            }
                        })()}
                    </td>
                </tr >
            )
        }
    }

    const [selectedImage, setSelectedImage] = useState(null);

    const onSubmit = async (data: any) => {
        await axios.post("https://api.inovasimediakreatif.site/saveproduk", {
            data: data,
            image: !selectedImage ? null : selectedImage,
        }, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).then(function (response) {
            toast.success("Data telah disimpan", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 2000,
                onClose: () => router.back(),
            });

        });
    };

    const inputRef = useRef(null);

    const handleClick = async () => {
        inputRef.current.click();
        // await trigger();
    };

    const imageChange = (e: any) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImage(e.target.files[0]);
        }


    };

    const removeSelectedImage = () => {
        setSelectedImage(null);
    };

    return (
        <>
            <div className="border-b border-[#2125291A] h-16 mb-7">
                <div className="flex flex-wrap items-center">
                    <button className="bg-gray-200 p-4 rounded-lg mr-6 " onClick={() => router.back()}>
                        <fa.FaChevronLeft size={13} />
                    </button>
                    <span className="font-bold text-3xl">Tambah Produk</span>
                </div>

                {/* <span>
                    {JSON.stringify(watch())}
                </span> */}
            </div>

            <ToastContainer className="mt-[50px]" />

            <div className="w-full h-[auto] pb-5 gap-5">
                <div className="bg-white p-8 pb-14 rounded-lg gap-3">
                    <span className="font-bold text-lg">Informasi Produk</span>

                    <div className="flex flex-1 gap-5">
                        <div className="flex items-center justify-center w-[500px]">
                            <input
                                className="absolute w-0 opacity-0"
                                accept="image/*"
                                type="file"
                                onChange={imageChange}
                                ref={inputRef}
                            />

                            {/* <input
                                accept="image/*"
                                type="file"
                                {...register("img", {
                                    onChange: imageChange,
                                    required: false
                                })}
                            /> */}

                            {selectedImage ? (
                                <div className="">
                                    <img
                                        src={URL.createObjectURL(selectedImage)}
                                        className="w-[20rem] h-[20rem] rounded-lg cursor-pointer"
                                        onClick={handleClick}
                                    // onDoubleClick={removeSelectedImage}
                                    />
                                </div>
                            ) : (
                                <div
                                    className="aspect-square m-auto w-[20rem] h-[20rem] border rounded-lg cursor-pointer"
                                    onClick={handleClick}
                                >
                                    <fa.FaPlus size={13} className="m-auto h-full" color="grey" />
                                </div>
                            )}
                        </div>

                        <div className="grow">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="grid grid-cols-2 gap-5 justify-center content-center items-center">
                                    <div>
                                        <div className="mb-3">Nama Produk</div>
                                        <input
                                            className={`border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                            type="text"
                                            placeholder="Masukan Produk"
                                            {...register("produk", { required: false })}
                                        />
                                    </div>
                                    <div>
                                        <div className="mb-3">Harga Beli</div>
                                        <input
                                            className={`border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                            type="number"
                                            placeholder="Masukan Harga Beli"
                                            {...register("harga_beli", { required: false })}
                                        />
                                    </div>

                                    <div>
                                        <div className="mb-3">Brand</div>
                                        <select {...register("brand", { required: false })} className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}>
                                            <option value="">Pilih Brand</option>
                                            {list_brand}
                                        </select>
                                    </div>
                                    <div>
                                        <div className="mb-3">Harga Jual</div>
                                        <input
                                            className={`border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                            type="number"
                                            placeholder="Masukan Harga Jual"
                                            {...register("harga_jual", { required: false })}
                                        />
                                    </div>

                                    <div>
                                        <div className="mb-3">Warehouse</div>
                                        <select {...register("warehouse", { required: false })} className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}>
                                            <option value="">Pilih Warehouse</option>
                                            {list_warehouse}
                                        </select>
                                    </div>
                                    <div>
                                        <div className="mb-3">Quality</div>
                                        <select {...register("quality", { required: false })} className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}>
                                            <option value="">Pilih Quality</option>
                                            <option value="IMPORT">IMPORT</option>
                                            <option value="LOKAL">LOKAL</option>
                                            <option value="ORIGINAL">ORIGINAL</option>
                                        </select>
                                    </div>

                                    <div>
                                        <div className="mb-3">Supplier</div>
                                        <select {...register("supplier", { required: false })} className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}>
                                            <option value="">Pilih Supplier</option>
                                            {list_supplier}
                                        </select>
                                    </div>

                                    <div>
                                        <div className="mb-3">Kategori</div>
                                        <select {...register("kategori", { required: false })} className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}>
                                            <option value="">Pilih Kategori</option>
                                            {list_category}
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>

                <div className="bg-white p-8 pb-14 rounded-lg gap-3 mt-5">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-1 gap-5">
                            <div className="w-[500px]">
                                <table className="table table-auto bg-transparent text-sm w-full">

                                    <thead className="bg-[#DDE4F0] text-gray-800">
                                        <tr className="">
                                            <th className="py-3 rounded-l-lg">
                                                Size
                                            </th>
                                            <th className="py-3">
                                                Stok
                                            </th>
                                            <th className="py-3 rounded-r-lg">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="group rounded-lg">
                                        {list_variasi}
                                    </tbody>
                                </table>
                            </div>
                            <div className="grow">
                                <div className="text-base mb-3">Deskripsi</div>
                                <textarea {...register("deskripsi", { required: false })} rows={5} className="resize-none bg-white h-[140px] rounded-lg w-full py-3 px-5 text-gray-700 focus:outline-none border text-base "></textarea>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="py-5 rounded-lg flex justify-end">
                    <button onClick={handleSubmit(onSubmit)} className="cursor-pointer rounded-lg bg-blue-600 hover:bg-blue-800 h-[45px] text-white px-4 flex flex-wrap gap-2 content-center">
                        Simpan Produk
                    </button>
                </div>

            </div>

            {/* <div className="grid grid-cols-3 gap-5 pb-10 justify-center">
                <div className="col-span-3">
                    <table className="table table-auto bg-transparent text-sm w-full">

                        <thead className="bg-[#DDE4F0] text-gray-800">
                            <tr className="">
                                <th className="py-3 rounded-l-lg">
                                    Size
                                </th>
                                <th className="py-3">
                                    Stok
                                </th>
                                <th className="py-3 rounded-r-lg">
                                    Aksi
                                </th>
                            </tr>
                        </thead>

                        <tbody className="group rounded-lg">
                            {list_variasi}
                        </tbody>
                    </table>
                </div>
            </div> */}

        </>
    );
}

const styles = {
    preview: {
        marginTop: 50,
        display: "flex",
        flexDirection: "column",
    },
    delete: {
        cursor: "pointer",
        padding: 15,
        background: "red",
        color: "white",
        border: "none",
    },
};