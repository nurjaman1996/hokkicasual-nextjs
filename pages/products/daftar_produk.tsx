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
import { useForm, useFieldArray } from "react-hook-form";
import useSWR from 'swr';
import axios from 'axios';
const fetcher = (url: string) => fetch(url).then(res => res.json());


export default function DaftarProduk() {
    // const [dataProduct, setData] = useState(dataProduct_.product);
    const [date, setDate] = useState(format(new Date(), "dd/MM/yyyy"));

    const [Query, setQuery] = useState("all");

    function querySet(e: any) {
        if (e.target.value === "") {
            setQuery("all");
        } else {
            setQuery(e.target.value);
        }

    }

    const { data, error, isLoading, mutate } = useSWR(`https://api.inovasimediakreatif.site/products/${Query}`, fetcher);

    const { data: warehouse_data, error: warehouse_error, isLoading: warehouse_isLoading, mutate: warehouse_mutate } = useSWR(`https://api.inovasimediakreatif.site/getwarehouse`, fetcher);

    const list_warehouse: any = [];

    const [notwarehouse, setnotwarehouse] = useState(null);

    if (!warehouse_isLoading && !warehouse_error) {
        warehouse_data.data_ware.map((area: any, index: number) => {
            if (notwarehouse != area.id_ware) {
                list_warehouse.push(
                    <option key={index} value={area.id_ware}>{area.warehouse}</option>
                )
            }
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

    const { data: brand_data, error: brand_error, isLoading: brand_isLoading, mutate: brand_mutate } = useSWR(`https://api.inovasimediakreatif.site/getbrand`, fetcher);

    const list_brand: any = [];

    if (!brand_isLoading && !brand_error) {
        brand_data.data_brand.map((area: any, index: number) => {
            list_brand.push(
                <option key={index} value={area.id_brand}>{area.brand}</option>
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

    const { register, control, unregister, resetField, setValue, handleSubmit, watch, formState: { errors } } = useForm({
        // defaultValues: {
        //     edit_produk: '',
        //     edit_brand: '',
        //     edit_kategori: '',
        //     edit_kualitas: '',
        //     edit_harga: '',
        // }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "variasi"
    });



    const [showModal, setShowModal] = React.useState(false);
    const [repeatModal, setrepeatModal] = React.useState(false);
    const [transferModal, settransferModal] = React.useState(false);
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

        resetField("edit_produk");
        resetField("edit_brand");
        resetField("edit_kategori");
        resetField("edit_kualitas");
        resetField("edit_harga");
        setShowModal(false);
    };

    const [id, setid] = React.useState(null);
    const [img, setimg] = React.useState(null);

    function showeditModal(id: any, produk: any, brand: any, kategori: any, kualitas: any, harga: any, img: any, index: number) {
        setid(id);
        setValue("edit_produk", produk);
        setValue("edit_brand", brand);
        setValue("edit_kategori", kategori);
        setValue("edit_kualitas", kualitas);
        setValue("edit_harga", harga);
        setShowModal(true);

        setimg(`https://buwanais.co.id/apiupload/${img}`);
    }

    const onSubmitUpdate = async (data: any) => {
        await axios.post(`https://api.inovasimediakreatif.site/editproduk/${id}`, data).then(function (response) {
            // console.log(response.data);
            mutate();
        });

        toast.success("Data telah diupdate", {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
            autoClose: 2000,
        });

        resetField("edit_produk");
        resetField("edit_brand");
        resetField("edit_kategori");
        resetField("edit_kualitas");
        resetField("edit_harga");
        setShowModal(false);
    };

    function showtransferModal(id: any, produk: any, brand: any, kategori: any, kualitas: any, harga: any, img: any, variation: any, gudang_pengirim: any, ware: any, index: number) {
        setid(id);
        setValue("edit_produk", produk);
        setValue("edit_brand", brand);
        setValue("edit_kategori", kategori);
        setValue("edit_kualitas", kualitas);
        setValue("edit_harga", harga);
        setValue("id_gudang_pengirim", ware);
        setValue("gudang_pengirim", gudang_pengirim);
        setnotwarehouse(ware);
        settransferModal(true);
        setimg(`https://buwanais.co.id/apiupload/${img}`);

        setCount(variation);
        setProduk(index);
    }

    function showrepeatModal(id: any, produk: any, brand: any, kategori: any, kualitas: any, harga: any, img: any, variation: any, index: number) {
        setid(id);
        setValue("edit_produk", produk);
        setValue("edit_brand", brand);
        setValue("edit_kategori", kategori);
        setValue("edit_kualitas", kualitas);
        setValue("edit_harga", harga);
        setrepeatModal(true);
        setimg(`https://buwanais.co.id/apiupload/${img}`);

        setCount(variation);
        setProduk(index);
    }

    const onSubmitRepeat = async (data: any) => {
        console.log(data);
    };

    function showdeleteModal(id_produk: any, produk: any, index: number) {
        setid(id_produk);
        setproduk_name(produk);
        setdelModal(true);
    }

    async function deleteData() {
        // await axios.post(`https://api.inovasimediakreatif.site/deletearea/${id}`)
        //     .then(function (response) {
        //         // console.log(response.data);
        //         mutate();
        //     });

        // toast.success("Data berhasil dihapus", {
        //     position: toast.POSITION.TOP_RIGHT,
        //     pauseOnHover: false,
        //     autoClose: 2000,
        // });

        // setdelModal(false)
    }


    const [Count, setCount] = useState(0);
    const [Produk, setProduk] = useState(0);
    const [produk_name, setproduk_name] = useState(null);
    const list_produk: any = [];
    let list_variasi: any = [];

    if (!isLoading && !error) {
        data.product.map((data_produk: any, index: any) => {
            return (
                list_produk.push(
                    <tbody key={index} className="group hover:shadow-lg rounded-lg">
                        <tr className="group-hover:drop-shadow-primary transition-filter rounded-lg">
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 pl-5 rounded-tl-lg">
                                    {index + 1}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-row gap-4 items-center h-full bg-white pt-5 pb-3 pl-4">
                                    <Image
                                        className="max-w-[80px] max-h-[80px] rounded"
                                        src={`https://buwanais.co.id/apiupload/${data_produk.img}`}
                                        alt="product-1"
                                        height="500"
                                        width="500"
                                        priority
                                    />
                                    <div className="flex flex-col">
                                        <div className="text-xs">#{data_produk.id_produk} | {data_produk.brand[0].brand}</div>
                                        <div className="text-base">{data_produk.produk}</div>
                                        <div className="text-xs">Rp{data_produk.n_price}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4 ">
                                    <button className="cursor-pointer text-green-600 font-medium hover:underline focus:underline" onClick={() => toogleActive(index)}>{data_produk.variationcount[0].total_qty} in stock</button>
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                                    {data_produk.variation.length}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                                    {data_produk.category[0].category}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                                    {data_produk.warehouse[0].warehouse}
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-warp gap-4 justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4 rounded-tr-lg">
                                    <button className="text-green-500" onClick={() => showrepeatModal(data_produk.id, data_produk.produk, data_produk.id_brand, data_produk.id_category, data_produk.quality, data_produk.n_price, data_produk.img, data_produk.variation.length, index)}>
                                        <i className="fi fi-rr-arrows-repeat text-center text-lg"></i>
                                    </button>
                                    <button className="text-blue-500" onClick={() => showeditModal(data_produk.id, data_produk.produk, data_produk.id_brand, data_produk.id_category, data_produk.quality, data_produk.n_price, data_produk.img, index)} >
                                        <i className="fi fi-rr-edit text-center text-lg"></i>
                                    </button>
                                    <button className="text-red-500" onClick={() => showdeleteModal(data_produk.id_produk, data_produk.produk, index)}>
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
                            <td className="p-0 h-full bg-white" colSpan={5}>
                                <div className=" items-center h-full">
                                    <Collapse isOpened={openSize === index}>
                                        <div className="pb-6 flex gap-6">
                                            <div className="h-[auto] w-[70%] border rounded-lg px-2 py-3">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="text-center">
                                                            <th className="py-1">Varian</th>
                                                            <th>Stock</th>
                                                            <th>Harga Jual</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(function (rows: any, i, len) {
                                                            while (++i <= data_produk.variation.length) {
                                                                rows.push(
                                                                    <tr key={i} className="text-center">
                                                                        <td className="py-1">{data_produk.variation[i - 1].size}</td>
                                                                        <td>{data_produk.variation[i - 1].qty}</td>
                                                                        <td>Rp{data_produk.n_price}</td>
                                                                    </tr>
                                                                )
                                                            }
                                                            return rows;
                                                        })([], 0, index + 1)}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="flex justify-center items-center">
                                                <button className="text-white w-auto h-10 bg-blue-500 p-2 rounded-lg mr-6"
                                                    onClick={() => showtransferModal(data_produk.id, data_produk.produk, data_produk.id_brand, data_produk.id_category, data_produk.quality, data_produk.n_price, data_produk.img, data_produk.variation.length, data_produk.warehouse[0].warehouse, data_produk.id_ware, index)}
                                                >
                                                    <span>Transfer Produk</span>
                                                </button>
                                            </div>
                                        </div>

                                    </Collapse>
                                </div>
                            </td>
                            {/* <td className="p-0 h-full">
                                <div className="h-full bg-white text-center">
                                </div>
                            </td> */}
                        </tr>

                        <tr className="group-hover:drop-shadow-primary transition-filter rounded-lg">
                            <td className="p-0 h-full">
                                <div className="h-full bg-white px-4 rounded-bl-lg pb-7">
                                </div>
                            </td>
                            <td className="p-0 h-full" colSpan={6}>
                                <div className="pr-6 bg-white rounded-br-lg ">
                                    <div className="flex items-center h-full pb-7 border-t">

                                    </div>
                                </div>

                            </td>
                        </tr>
                    </tbody>
                )
            )
        })

        if (data.product.length != 0) {
            var batas: any = data.product[Produk].variation.length;
        } else {
            var batas: any = 0;
        }

        {
            for (let index = 0; index < Count; index++) {
                list_variasi.push(
                    <tr key={index} className="rounded-lg h-auto mt-7">
                        {(function () {

                            if (index >= batas) {
                                return (
                                    <>
                                        <td className="pt-4 p-0">
                                            <div className="h-[46px] flex flex-wrap justify-center items-center rounded-l-lg">
                                                <input placeholder="Size" {...register(`variasi.${index}.size`, { required: true })} className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg" type="text"
                                                />
                                            </div>
                                        </td>
                                        <td className="pt-4 p-0">
                                            <div className="h-[46px] flex flex-wrap justify-center items-center rounded-l-lg">
                                                <input readOnly defaultValue={0} className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg" type="number"
                                                />
                                            </div>
                                        </td>
                                        <td className="pt-4 p-0">
                                            <div className="h-[46px] flex flex-wrap justify-center items-center rounded-l-lg">
                                                <input defaultValue={0} {...register(`variasi.${index}.stok_baru`, { required: true })} className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg" type="number" placeholder="Size"
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => {
                                                    remove(index)
                                                    setCount(Count - 1);
                                                }}
                                                type="button" className="mt-4 mx-2 m-auto border-none rounded-lg bg-red-600 hover:bg-red-800 h-[45px] text-white px-4 flex flex-wrap gap-2 content-center">
                                                <div className="my-auto">
                                                    <fa.FaMinus size={13} className="text-white" />
                                                </div>
                                            </button>
                                        </td>
                                    </>
                                )
                            } else {
                                return (
                                    <>
                                        <td className="pt-4 p-0">
                                            <div className="h-[46px] flex flex-wrap justify-center items-center rounded-l-lg">
                                                <input readOnly defaultValue={data.product[Produk].variation[index].size} {...register(`variasi.${index}.size`, { required: true })} className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg" type="text"
                                                />
                                            </div>
                                        </td>
                                        <td className="pt-4 p-0">
                                            <div className="h-[46px] flex flex-wrap justify-center items-center rounded-l-lg">
                                                <input readOnly defaultValue={data.product[Produk].variation[index].qty} className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg" type="number"
                                                />
                                            </div>
                                        </td>
                                        <td className="pt-4 p-0">
                                            <div className="h-[46px] flex flex-wrap justify-center items-center rounded-l-lg">
                                                <input defaultValue={0} {...register(`variasi.${index}.stok_baru`, { required: true })} className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg" type="number" placeholder="Size"
                                                />
                                            </div>
                                        </td>
                                    </>
                                )
                            }
                        })()}



                    </tr >


                )
            }
        }
    }

    const [selectedImage, setSelectedImage] = useState(null);

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

    return (
        <>
            <div className="font-bold text-3xl border-b border-[#2125291A] h-16 mb-7">
                Daftar Produk

            </div>

            <ToastContainer className="mt-[50px]" />

            <div className="flex flex-wrap items-center content-center mb-6">
                <div className="shadow rounded-lg w-auto flex flex-row text-center content-center">
                    <input onChange={(e) => querySet(e)} className="h-[50px] border-0 w-[280px] py-2 pl-5 pr-3 text-gray-700 focus:outline-none rounded-l-lg" type="text" placeholder="Pencarian..." />

                    <button type="button" className="rounded-r-lg bg-white hover:bg-gray-200 h-[50px] text-gray-700 font-medium px-5">
                        <div className="my-auto">
                            <fa.FaSearch size={17} className="text-gray-700" />
                        </div>
                    </button>
                </div>

                <div className="ml-auto flex flex-row items-center justify-end">
                    <button type="button" className="ml-3 shadow rounded-lg bg-blue-600 hover:bg-blue-800 h-[45px] text-white px-4 flex flex-wrap gap-2 content-center">
                        <Link href='add_produk'>Tambah Produk</Link >
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
                        <th className="py-3">
                            Produk & Harga
                        </th>
                        <th className="py-3">
                            Stok
                        </th>
                        <th className="py-3">
                            Varian
                        </th>
                        <th className="py-3">
                            Kategori
                        </th>
                        <th className="py-3">
                            Gudang
                        </th>
                        <th className="py-3 rounded-r-lg">
                            Action
                        </th>
                    </tr>
                </thead>

                {list_produk}

            </table>


            {showModal ? (
                <>
                    <div className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl ">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[100vh]">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <span className="text-xl font-semibold">
                                        Edit Produk
                                    </span>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex flex-auto gap-6">
                                    <div className="w-[40%] mr-4">
                                        <label className="block mb-2 text-sm font-medium text-black">Foto Produk</label>
                                        <div className="flex items-center justify-start">
                                            <input
                                                className="absolute w-0 opacity-0"
                                                accept="image/*"
                                                type="file"
                                                onChange={imageChange}
                                                ref={inputRef}
                                            />

                                            {selectedImage ? (
                                                <div className="">
                                                    <img
                                                        src={URL.createObjectURL(selectedImage)}
                                                        className="w-[20rem] h-[20rem] rounded-lg cursor-pointer"
                                                        onClick={handleClick}
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    className="aspect-square m-auto w-[20rem] h-[20rem] border rounded-lg cursor-pointer"
                                                    onClick={handleClick}
                                                >
                                                    <img
                                                        src={img}
                                                        className="w-[100%] h-[100%] rounded-lg cursor-pointer"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-xs italic text-gray-500 text-center mt-3">*Klik Foto untuk merubah Foto</div>
                                    </div>

                                    <div className="grow">
                                        <div className="">
                                            <label className="block mb-2 text-sm font-medium text-black">Nama Produk</label>
                                            <input
                                                className={`${errors.edit_produk ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                type="text"
                                                defaultValue="" {...register("edit_produk", { required: true })}
                                            />
                                            {errors.edit_produk && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>

                                        <div className="mt-6">
                                            <label className="block mb-2 text-sm font-medium text-black">Brand</label>
                                            <select {...register("edit_brand", { required: false })} className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}>
                                                <option value="">Pilih Brand</option>
                                                {list_brand}
                                            </select>
                                            {errors.edit_brand && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>

                                        <div className="mt-6">
                                            <label className="block mb-2 text-sm font-medium text-black">Kategori</label>
                                            <select {...register("edit_kategori", { required: false })} className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}>
                                                <option value="">Pilih Kategori</option>
                                                {list_category}
                                            </select>
                                            {errors.edit_kategori && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>

                                        <div className="mt-6">
                                            <label className="block mb-2 text-sm font-medium text-black">Kualitas</label>
                                            <select {...register("edit_kualitas", { required: false })} className={`appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}>
                                                <option value="">Pilih Quality</option>
                                                <option value="IMPORT">IMPORT</option>
                                                <option value="LOKAL">LOKAL</option>
                                                <option value="ORIGINAL">ORIGINAL</option>
                                            </select>
                                            {errors.edit_kualitas && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>

                                        <div className="mt-6">
                                            <label className="block mb-2 text-sm font-medium text-black">Harga Jual</label>
                                            <input
                                                className={`${errors.edit_produk ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                type="text"
                                                defaultValue="" {...register("edit_harga", { required: true })}
                                            />
                                            {errors.edit_harga && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>
                                    </div>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => {
                                            setSelectedImage(null);
                                            setShowModal(false);
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

            {repeatModal ? (
                <>
                    <div className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto mt-[20px] mb-[40px] mx-auto max-w-3xl ">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[auto]">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <span className="text-xl font-semibold">
                                        Repeat Stock
                                    </span>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex flex-auto">
                                    <div className="w-[60%] mr-4">
                                        <div className="">
                                            <label className="block mb-2 text-sm font-medium text-black">Nama Produk</label>
                                            <input
                                                className={`${errors.edit_produk ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                type="text"
                                                defaultValue="" {...register("edit_produk", { required: true })}
                                            />
                                            {errors.edit_produk && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>

                                        <div className="mt-5">
                                            <label className="block mb-2 text-sm font-medium text-black">Harga Beli</label>
                                            <input
                                                className={`${errors.harga_beli ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                type="text"
                                                defaultValue="" {...register("harga_beli", { required: true })}
                                            />
                                            {errors.harga_beli && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>
                                    </div>

                                    <div className="grow">
                                        <table className="table table-auto bg-transparent text-sm w-full">

                                            <thead className="bg-[#DDE4F0] text-gray-800">
                                                <tr className="">
                                                    <th className="py-3 rounded-l-lg">
                                                        Size
                                                    </th>
                                                    <th className="py-3">
                                                        Stok Gudang
                                                    </th>
                                                    <th className="py-3 rounded-r-lg">
                                                        Stok Baru
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="group rounded-lg">
                                                {list_variasi}
                                            </tbody>
                                        </table>

                                        <button
                                            onClick={() => {
                                                append({ size: null, stok_baru: 0 });
                                                setCount(Count + 1);
                                            }}
                                            type="button" className="mt-3 mx-2 m-auto border-none rounded-lg bg-blue-600 hover:bg-blue-800 h-[45px] text-white px-4 flex flex-wrap gap-2 content-center">
                                            <div className="my-auto">
                                                <fa.FaPlus size={13} className="text-white" />
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => {
                                            setSelectedImage(null);
                                            setValue("harga_beli", null);
                                            batas = 0;
                                            setCount(batas);
                                            unregister('variasi');
                                            setrepeatModal(false);
                                        }}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={handleSubmit(onSubmitRepeat)}
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

            {transferModal ? (
                <>
                    <div className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto mt-[20px] mb-[40px] mx-auto max-w-3xl ">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[auto]">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <span className="text-xl font-semibold">
                                        Transfer Stock
                                    </span>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex flex-auto">
                                    <div className="w-[60%] mr-4">
                                        <div className="">
                                            <label className="block mb-2 text-sm font-medium text-black">Nama Produk</label>
                                            <input
                                                className={`${errors.edit_produk ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                type="text"
                                                readOnly
                                                defaultValue="" {...register("edit_produk", { required: true })}
                                            />
                                            {errors.edit_produk && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>

                                        <div className="mt-5">
                                            <label className="block mb-2 text-sm font-medium text-black">ID Gudang</label>
                                            <input
                                                className={`${errors.id_gudang_pengirim ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                type="text"
                                                readOnly
                                                defaultValue="" {...register("id_gudang_pengirim", { required: true })}
                                            />
                                            {errors.id_gudang_pengirim && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>

                                        <div className="mt-5">
                                            <label className="block mb-2 text-sm font-medium text-black">Gudang Pengirim</label>
                                            <input
                                                className={`${errors.gudang_pengirim ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                type="text"
                                                readOnly
                                                defaultValue="" {...register("gudang_pengirim", { required: true })}
                                            />
                                            {errors.gudang_pengirim && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>

                                        <div className="mt-5">
                                            <div className="mb-3">Gudang penerima</div>
                                            <select {...register("gudang_penerima", { required: true })}
                                                className={`${errors.gudang_penerima ? "border-red-500 border-2" : "border"}appearance-none border h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}>
                                                <option value="">Pilih Warehouse</option>
                                                {list_warehouse}
                                            </select>
                                            {errors.gudang_penerima && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>
                                    </div>

                                    <div className="grow">
                                        <table className="table table-auto bg-transparent text-sm w-full">

                                            <thead className="bg-[#DDE4F0] text-gray-800">
                                                <tr className="">
                                                    <th className="py-3 rounded-l-lg">
                                                        Size
                                                    </th>
                                                    <th className="py-3">
                                                        Stok Gudang
                                                    </th>
                                                    <th className="py-3 rounded-r-lg">
                                                        Stok Transfer
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="group rounded-lg">
                                                {list_variasi}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => {
                                            batas = 0;
                                            setCount(batas);
                                            setValue('gudang_penerima', '');
                                            settransferModal(false);
                                        }}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={handleSubmit(onSubmitRepeat)}
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
                                    <p className="text-sm font-semibold">
                                        Produk {produk_name} akan dihapus?
                                    </p>
                                    <p className="text-sm italic text-red-400">
                                        *Semua data dan Variasi Stok akan ikut terhapus
                                    </p>
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

        </>
    );
}
