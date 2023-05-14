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

    const { data, error, isLoading, mutate } = useSWR(`https://api.hokkiscasual.com/products/${Query}`, fetcher);

    const { data: warehouse_data, error: warehouse_error, isLoading: warehouse_isLoading, mutate: warehouse_mutate } = useSWR(`https://api.hokkiscasual.com/getwarehouse`, fetcher);

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

    const { data: supplier_data, error: supplier_error, isLoading: supplier_isLoading, mutate: supplier_mutate } = useSWR(`https://api.hokkiscasual.com/getsupplier`, fetcher);
    const list_supplier: any = [];
    if (!supplier_isLoading && !supplier_error) {
        supplier_data.data_supplier.map((area: any, index: number) => {
            list_supplier.push(
                <option key={index} value={area.id_sup}>{area.supplier}</option>
            )
        })
    }

    const { data: historipo_data, error: historipo_error, isLoading: historipo_isLoading, mutate: historipo_mutate } = useSWR(`https://api.hokkiscasual.com/gethistoripo`, fetcher);
    const list_po: any = [];
    if (!historipo_isLoading && !historipo_error) {
        historipo_data.data_po.map((historipo: any, index: number) => {
            list_po.push(
                <option key={index} value={historipo.idpo}>{historipo.tanggal_receive} - {historipo.tipe_order} - {historipo.idpo}</option>
            )
        })
    }

    const { data: category_data, error: category_error, isLoading: category_isLoading, mutate: category_mutate } = useSWR(`https://api.hokkiscasual.com/getcategory`, fetcher);


    const list_category: any = [];

    if (!category_isLoading && !category_error) {
        category_data.data_cat.map((area: any, index: number) => {
            list_category.push(
                <option key={index} value={area.id_category}>{area.category}</option>
            )
        })
    }

    const { data: brand_data, error: brand_error, isLoading: brand_isLoading, mutate: brand_mutate } = useSWR(`https://api.hokkiscasual.com/getbrand`, fetcher);

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

    const { register, control, unregister, resetField, setValue, handleSubmit, watch, clearErrors, formState: { errors } } = useForm({
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
        // await axios.post("https://api.hokkiscasual.com/saveexpense", {
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
    const [idware, setidware] = React.useState(null);
    const [img, setimg] = React.useState(null);

    function showeditModal(id: any, produk: any, brand: any, kategori: any, kualitas: any, harga: any, img: any, index: number) {
        setid(id);
        setValue("edit_produk", produk);
        setValue("edit_brand", brand);
        setValue("edit_kategori", kategori);
        setValue("edit_kualitas", kualitas);
        setValue("edit_harga", harga);
        setShowModal(true);

        setimg(`https://hokkiscasual.com/apiupload/${img}`);
    }

    const onSubmitUpdate = async (data: any) => {
        await axios.post(`https://api.hokkiscasual.com/editproduk/${id}`, {
            data: data,
            image: !selectedImage ? null : selectedImage,
        }).then(function (response) {
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

    const [transferproduct, settransferproduct] = React.useState("");
    const [idtransferproduct, setidtransferproduct] = React.useState("");
    const [waretransferproduct, setwaretransferproduct] = React.useState("");

    async function showtransferModal(id: any, produk: any, id_produk: any, brand: any, kategori: any, kualitas: any, harga: any, img: any, variation: any, gudang_pengirim: any, ware: any, index: number) {
        settransferproduct(produk);
        setidtransferproduct(id_produk);
        setwaretransferproduct(ware);
        setnotwarehouse(ware);

        clearErrors();
        setValue("transferwaretujuan", "");
        setValue("gudangpengirim", gudang_pengirim);

        await axios.post(`https://api.hokkiscasual.com/getsizesales`, {
            idware: ware,
            idproduct: id_produk,
        }).then(function (response) {
            unregister('variasitransfer');
            setdatasize(response.data);
            settransferModal(true);
        });
    }

    const onSubmitTransfer = async (data: any) => {
        var qty_all = 0;
        for (let index = 0; index < data.variasitransfer.length; index++) {
            qty_all = qty_all + parseInt(data.variasitransfer[index].stok_baru);
        }

        if (qty_all < 1) {
            toast.warning("Jumlah Total Quantity Tidak Boleh Kosong", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 2000,
            });
        } else {
            // console.log(idtransferproduct)
            // console.log(waretransferproduct)
            // console.log(data.transferwaretujuan)
            // console.log(data.variasitransfer)

            await axios.post(`https://api.hokkiscasual.com/transferstok`, {
                idproduk: idtransferproduct,
                gudang_pengirim: waretransferproduct,
                gudang_tujuan: data.transferwaretujuan,
                variasitransfer: data.variasitransfer,
            }).then(function (response) {
                console.log(response.data);
                mutate();
            });

            toast.success("Repeat berhasil", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 2000,
            });

            settransferModal(false)
        }


    };

    const [repeatProduct, setrepeatProduct] = React.useState("");
    const [datasize, setdatasize] = React.useState([]);
    const [data_po, setdata_po]: any = React.useState([]);
    const [tipepo, settipepo] = React.useState("");
    const [gudang, setgudang] = React.useState(null);

    async function showrepeatModal(id: any, produk: any, id_produk: any, brand: any, kategori: any, kualitas: any, harga: any, img: any, variation: any, gudang_pengirim: any, ware: any, index: number) {
        setid(id);
        setValue("edit_produk", produk);
        setValue("edit_brand", brand);
        setValue("id_produk", id_produk);
        setValue("edit_kategori", kategori);
        setValue("edit_kualitas", kualitas);
        setValue("harga_beli", 0);
        setValue("id_gudang_pengirim", ware);
        setValue("gudang_pengirim", gudang_pengirim);
        setimg(`https://hokkiscasual.com/apiupload/${img}`);

        clearErrors();
        settipepo("")
        setValue("tipe_po", "")
        setValue("supplier_pobaru", "")

        setgudang(gudang_pengirim);
        setrepeatProduct(produk);

        unregister('variasirestock');

        await axios.post(`https://api.hokkiscasual.com/getsizesales`, {
            idware: ware,
            idproduct: id_produk,
        }).then(function (response) {
            unregister('variasirestock');
            setdatasize(response.data);
        });

        await axios.post(`https://api.hokkiscasual.com/gethistoriposelected`, {
            idware: ware,
            idproduct: id_produk,
        }).then(function (response) {
            setdata_po(response.data);
        });


        setrepeatModal(true);

        setProduk(index);
    }


    const onSubmitRepeat = async (data: any) => {
        var qty_all = 0;
        for (let index = 0; index < data.variasirestock.length; index++) {
            qty_all = qty_all + parseInt(data.variasirestock[index].stok_baru);
        }

        if (qty_all < 1) {
            toast.warning("Jumlah Total Quantity Tidak Boleh Kosong", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 2000,
            });
        } else {
            await axios.post(`https://api.hokkiscasual.com/repeatstok`, {
                data: data
            }).then(function (response) {
                console.log(response.data);
                mutate();
                setValue("harga_beli", null);
                // batas = 0;
                // setCount(batas);
                unregister('variasirestock');
            });

            toast.success("Repeat berhasil", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 2000,
            });

            setrepeatModal(false)
        }
    };

    function showdeleteModal(id_produk: any, produk: any, id_ware: any, index: number) {
        setid(id_produk);
        setidware(id_ware);
        setproduk_name(produk);
        setdelModal(true);
    }

    async function deleteData() {
        await axios.post(`https://api.hokkiscasual.com/deleteproduk/${id}/${idware}`)
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


    const [Count, setCount] = useState(0);
    const [Produk, setProduk] = useState(0);
    const [produk_name, setproduk_name] = useState(null);
    const list_produk: any = [];

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
                                        src={`https://hokkiscasual.com/apiupload/${data_produk.img}`}
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
                                    <button className="cursor-pointer text-green-600 font-medium hover:underline focus:underline" onClick={() => toogleActive(index)}>
                                        {(function (rows: number, i, len) {
                                            while (++i <= data_produk.variation.length) {
                                                if (data_produk.id_ware === data_produk.variation[i - 1].id_ware) {
                                                    rows = rows + parseInt(data_produk.variation[i - 1].qty);
                                                }
                                            }
                                            return rows + " in stock";
                                        })(0, 0, index + 1)}
                                    </button>
                                </div>
                            </td>
                            <td className="p-0 pt-4 h-full">
                                <div className="flex flex-wrap justify-center items-center h-full bg-white pt-2 md:pt-4 md:pb-[15px] px-4">
                                    {(function (rows: number, i, len) {
                                        while (++i <= data_produk.variation.length) {
                                            if (data_produk.id_ware === data_produk.variation[i - 1].id_ware) {
                                                rows = rows + 1;
                                            }
                                        }
                                        return rows;
                                    })(0, 0, index + 1)}
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
                                    <button className="text-green-500" onClick={() => showrepeatModal(data_produk.id, data_produk.produk, data_produk.id_produk, data_produk.id_brand, data_produk.id_category, data_produk.quality, data_produk.n_price, data_produk.img, data_produk.variation.length, data_produk.warehouse[0].warehouse, data_produk.id_ware, index)}>
                                        <i className="fi fi-rr-arrows-repeat text-center text-lg"></i>
                                    </button>
                                    <button className="text-blue-500" onClick={() => showeditModal(data_produk.id, data_produk.produk, data_produk.id_brand, data_produk.id_category, data_produk.quality, data_produk.n_price, data_produk.img, index)} >
                                        <i className="fi fi-rr-edit text-center text-lg"></i>
                                    </button>
                                    <button className="text-red-500" onClick={() => showdeleteModal(data_produk.id_produk, data_produk.produk, data_produk.id_ware, index)}>
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
                                                            {/* <th>Harga Jual</th> */}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(function (rows: any, i, len) {
                                                            while (++i <= data_produk.variation.length) {
                                                                if (data_produk.id_ware === data_produk.variation[i - 1].id_ware) {
                                                                    rows.push(
                                                                        <tr key={i} className="text-center">
                                                                            <td className="py-1">{data_produk.variation[i - 1].size}</td>
                                                                            <td>{data_produk.variation[i - 1].qty}</td>
                                                                            {/* <td>Rp{data_produk.n_price}</td> */}
                                                                        </tr>
                                                                    )
                                                                } else {

                                                                }
                                                            }
                                                            return rows;
                                                        })([], 0, index + 1)}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="flex justify-center items-center">
                                                <button className="text-white w-auto h-10 bg-blue-500 p-2 rounded-lg mr-6"
                                                    onClick={() => showtransferModal(data_produk.id, data_produk.produk, data_produk.id_produk, data_produk.id_brand, data_produk.id_category, data_produk.quality, data_produk.n_price, data_produk.img, data_produk.variation.length, data_produk.warehouse[0].warehouse, data_produk.id_ware, index)}
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
        <div className="p-5">
            <div className="font-bold text-3xl border-b border-[#2125291A] h-16 mb-7">
                Daftar Produk
            </div>

            {/* <span> {JSON.stringify(datasize)}</span> */}

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
                    <Link href='add_produk'>
                        <button type="button" className="ml-3 shadow rounded-lg bg-blue-600 hover:bg-blue-800 h-[45px] text-white px-4 flex flex-wrap gap-2 content-center">
                            Tambah Produk
                            <div className="my-auto">
                                <fa.FaPlus size={13} className="text-white" />
                            </div>
                        </button>
                    </Link >
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
                                                    // onClick={handleClick}
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    className="aspect-square m-auto w-[20rem] h-[20rem] border rounded-lg cursor-pointer"
                                                // onClick={handleClick}
                                                >
                                                    <img
                                                        src={img}
                                                        className="w-[100%] h-[100%] rounded-lg cursor-pointer"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* <div className="text-xs italic text-gray-500 text-center mt-3">*Klik Foto untuk merubah Foto</div> */}
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

                                        {/* <div className="mt-6">
                                            <label className="block mb-2 text-sm font-medium text-black">Harga Jual</label>
                                            <input
                                                className={`${errors.edit_produk ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                type="text"
                                                defaultValue="" {...register("edit_harga", { required: true })}
                                            />
                                            {errors.edit_harga && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div> */}
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
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="mb-[40px] mx-auto w-[60%]">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg flex flex-col bg-white outline-none focus:outline-none w-[100%]">
                                {/*header*/}
                                <div className="flex items-start justify-between px-5 py-3 border-b border-solid border-slate-200 rounded-t">
                                    <span className="text-base font-semibold">
                                        Restock : {repeatProduct} | {gudang}
                                    </span>
                                </div>

                                {/* <span className="text-xs px-3">{JSON.stringify(watch())}</span> */}
                                {/*body*/}
                                <div className="p-6 gap-4 flex flex-auto h-[auto]">
                                    <div className="w-[33%] text-sm flex flex-col">
                                        <div className="flex flex-wrap items-center justify-end">
                                            <select {...register("tipe_po", { required: true })}
                                                onChange={(e) => {
                                                    settipepo(e.target.value)
                                                    setValue('history_po', "")
                                                    setValue('supplier_pobaru', "")
                                                }}
                                                className={`${errors.tipe_po ? "border-red-500 border-2" : "border"} appearance-none border h-[30px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}>
                                                <option value="">Tipe Purchase order</option>
                                                <option value="PO_BARU">PO Baru</option>
                                                <option value="PO_LANJUTAN">PO Lanjutan</option>
                                            </select>
                                            <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                                        </div>
                                        {errors.tipe_po && <div className="mt-1 text-sm italic">This field is required</div>}

                                        {(function () {
                                            if (tipepo === "PO_LANJUTAN") {
                                                return (
                                                    <div>
                                                        <div className="mt-4 flex flex-wrap items-center justify-end">
                                                            <select {...register("history_po", { required: true })} className={`${errors.history_po ? "border-red-500 border-2" : "border"} appearance-none border h-[30px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}>
                                                                <option value="">Pilih Data PO</option>
                                                                {list_po}
                                                            </select>
                                                            <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                                                        </div>
                                                        {errors.history_po && <div className="mt-1 text-sm italic">This field is required</div>}
                                                    </div>
                                                )
                                            }
                                        }
                                        )()}

                                        <div>
                                            <div className="mt-4 flex flex-wrap items-center justify-end">
                                                <select {...register("supplier_pobaru", { required: true })} className={`${errors.supplier_pobaru ? "border-red-500 border-2" : "border"} appearance-none border h-[30px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}>
                                                    <option value="">Pilih Supplier PO</option>
                                                    {list_supplier}
                                                </select>
                                                <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                                            </div>
                                            {errors.supplier_pobaru && <div className="mt-1 text-sm italic">This field is required</div>}
                                        </div>

                                        <div className="mt-4 flex flex-wrap items-center justify-start gap-3">
                                            <div className="h-[30px] flex items-center text-sm font-medium text-black">Harga Beli :</div>
                                            <input
                                                className={`${errors.harga_beli ? "border-red-500 border-2" : "border"} h-[30px] grow pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                                                type="number"
                                                defaultValue="" {...register("harga_beli", { required: true, min: 1 })}
                                            />
                                        </div>
                                        {errors.harga_beli && <div className="mt-1 text-sm italic">This field is required</div>}

                                        <div className="grow">
                                            <table className="table table-auto bg-transparent text-sm mt-3">

                                                <thead className="bg-[#DDE4F0] text-gray-800 text-xs">
                                                    <tr className="">
                                                        <th className="py-2 rounded-l-lg">
                                                            Size
                                                        </th>
                                                        <th className="py-2">
                                                            Stok Gudang
                                                        </th>
                                                        <th className="py-2 rounded-r-lg">
                                                            Stok Baru
                                                        </th>
                                                    </tr>
                                                </thead>

                                                <tbody className="group rounded-lg text-xs">
                                                    {datasize.map((datasizes, index) => {
                                                        return (
                                                            <tr key={index} className="rounded-lg h-auto mt-7">
                                                                <td className="pt-2 p-0">
                                                                    <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
                                                                        <input readOnly defaultValue={datasizes.size} {...register(`variasirestock.${index}.size`, { required: true })} className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg" type="text"
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td className="pt-2 p-0">
                                                                    <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
                                                                        <input readOnly defaultValue={datasizes.qty} className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg" type="number"
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td className="pt-2 p-0">
                                                                    <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
                                                                        <input min={0} defaultValue={0} {...register(`variasirestock.${index}.stok_baru`, { required: true })} className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg" type="number" placeholder="Size"
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr >
                                                        );
                                                    })}
                                                </tbody>
                                            </table>

                                            {/* <button
                                                onClick={() => {
                                                    append({ size: null, stok_baru: 0 });
                                                    setCount(Count + 1);
                                                }}
                                                type="button" className="mt-3 mx-2 m-auto border-none rounded-lg bg-blue-600 hover:bg-blue-800 h-[30px] text-white px-2 flex flex-wrap gap-2 content-center">
                                                <div className="my-auto">
                                                    <fa.FaPlus size={13} className="text-white" />
                                                </div>
                                            </button> */}
                                        </div>

                                        <div className="h-[10%] mt-6 w-full grid grid-cols-2 items-end justify-start">
                                            <button
                                                className="bg-red-500 text-white font-bold uppercase text-xs px-6 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={() => {
                                                    setSelectedImage(null);
                                                    setValue("harga_beli", null);
                                                    // batas = 0;
                                                    // setCount(batas);
                                                    setrepeatModal(false);
                                                }}
                                            >
                                                Close
                                            </button>
                                            <button
                                                className="bg-emerald-500 text-white font-bold uppercase text-xs px-6 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={handleSubmit(onSubmitRepeat)}
                                            >
                                                Save Changes
                                            </button>
                                        </div>

                                    </div>

                                    <div className="grow flex flex-col justify-start">
                                        <div className="h-[500px] w-full pb-10">
                                            <div className="text-xs flex flex-auto text-center mb-2 font-bold">
                                                <div className="border py-1.5 w-[40%] rounded-l-lg">Detail</div>
                                                <div className="border py-1.5 grow">Total Pembelian</div>
                                                <div className="border py-1.5 w-[40%] rounded-r-lg">Size</div>
                                            </div>

                                            {/* {JSON.stringify(data_po)} */}

                                            <div className="h-[100%] overscroll-y-auto overflow-x-hidden scrollbar-none pb-20">
                                                {(function () {
                                                    if (data_po.data_po.length > 0) {
                                                        return (
                                                            data_po.data_po.map((datapo: any, index: any) => {
                                                                return (
                                                                    <div key={index} className="h-auto flex flex-auto text-xs items-center border rounded-lg px-2 py-2 mb-2">
                                                                        <div className="w-[40%] grid grid-rows-5 pl-4">
                                                                            <div className="grid grid-cols-3">
                                                                                <span>Tanggal</span>
                                                                                <span className="col-span-2">: {datapo.tanggal_receive}</span>
                                                                            </div>
                                                                            <div className="grid grid-cols-3">
                                                                                <span>ID PO</span>
                                                                                <span className="col-span-2 font-bold text-violet-600">: {datapo.idpo}</span>
                                                                            </div>
                                                                            <div className="grid grid-cols-3">
                                                                                <span>Tipe PO</span>
                                                                                <span className="col-span-2 font-bold">: {datapo.tipe_order}</span>
                                                                            </div>
                                                                            <div className="grid grid-cols-3">
                                                                                <span>Supplier</span>
                                                                                <span className="col-span-2">: {datapo.supplier}</span>
                                                                            </div>
                                                                            <div className="grid grid-cols-3">
                                                                                <span>Harga Satuan</span>
                                                                                <span className="col-span-2">: Rp {datapo.m_price}</span>
                                                                            </div>
                                                                            <div className="grid grid-cols-3">
                                                                                <span>Quantity</span>
                                                                                <span className="col-span-2">: {datapo.qty}</span>
                                                                            </div>
                                                                        </div>

                                                                        <div className="grow text-center font-bold">Rp {datapo.total_amount}</div>

                                                                        <div className="w-[40%] text-center grid grid-cols-4 px-2 gap-1">
                                                                            {(function () {
                                                                                return (
                                                                                    datapo.variation.map((variation: any, indexs: any) => {
                                                                                        return (
                                                                                            <div key={indexs} className="border rounded px-2">{variation.size}={variation.qty}</div>
                                                                                        );
                                                                                    })
                                                                                )
                                                                            }
                                                                            )()}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })
                                                        )
                                                    }
                                                }
                                                )()}
                                            </div>
                                        </div>
                                    </div>



                                </div>
                                {/*footer*/}
                                {/* <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    {JSON.stringify(watch())}
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
                                </div> */}

                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null
            }

            {transferModal ? (
                <>
                    <div className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative mt-[50px] mb-[40px] mx-auto w-[60%]">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[100%]">
                                {/*header*/}
                                <div className="flex items-start justify-between px-5 py-3 border-b border-solid border-slate-200 rounded-t">
                                    <span className="text-base font-semibold">
                                        Transfer Stock : {transferproduct}
                                    </span>
                                </div>

                                {/* <span className="text-xs px-3">{JSON.stringify(watch())}</span> */}
                                {/*body*/}
                                <div className="p-6 gap-4 flex flex-auto h-[auto]">
                                    <div className="w-[33%] text-sm flex flex-col pb-3">
                                        <div className="grow">
                                            <div className="">
                                                <label className="text-xs">Gudang Pengirim</label>
                                                <input readOnly {...register("gudangpengirim", { required: true })}
                                                    className={`${errors.gudangpengirim ? "border-red-500 border-2" : "border"} appearance-none border h-[30px] mt-2 w-[100%] pr-3 pl-5 text-gray-700 focus:outline-none rounded-lg`}>
                                                </input>
                                            </div>

                                            <div className="mt-3">
                                                <label className="text-xs">Gudang Penerima</label>
                                                <div className="mt-2 flex flex-wrap items-center justify-end">
                                                    <select {...register("transferwaretujuan", { required: true })} className={`${errors.transferwaretujuan ? "border-red-500 border-2" : "border"} appearance-none border h-[30px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}>
                                                        <option value="">Pilih Gudang Penerima</option>
                                                        {list_warehouse}
                                                    </select>
                                                    <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                                                </div>
                                                {errors.transferwaretujuan && <div className="mt-1 text-sm italic">This field is required</div>}
                                            </div>

                                        </div>

                                    </div>

                                    <div className="grow">
                                        <table className="table table-auto bg-transparent text-sm w-full">

                                            <thead className="bg-[#DDE4F0] text-gray-800 text-xs">
                                                <tr className="">
                                                    <th className="py-2 rounded-l-lg">
                                                        Size
                                                    </th>
                                                    <th className="py-2">
                                                        Stok Gudang
                                                    </th>
                                                    <th className="py-2 rounded-r-lg">
                                                        Stok Transfer
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="group rounded-lg text-xs">
                                                {datasize.map((datasizes, index) => {
                                                    return (
                                                        <tr key={index} className="rounded-lg h-auto mt-7">
                                                            <td className="pt-2 p-0">
                                                                <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
                                                                    <input readOnly defaultValue={datasizes.size} {...register(`variasitransfer.${index}.size`, { required: true })} className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg" type="text"
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="pt-2 p-0">
                                                                <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
                                                                    <input readOnly defaultValue={datasizes.qty} className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg" type="number"
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="pt-2 p-0">
                                                                <div className="h-[30px] flex flex-wrap justify-center items-center rounded-l-lg">
                                                                    <input min={0} defaultValue={0} {...register(`variasitransfer.${index}.stok_baru`, { required: true })} className="h-[100%] border w-[100%] pr-3 pl-5 mx-2 text-gray-700 focus:outline-none rounded-lg" type="number" placeholder="Size"
                                                                    />
                                                                </div>
                                                            </td>
                                                        </tr >
                                                    );
                                                })}
                                            </tbody>
                                        </table>

                                        <div className="h-[10%] py-2 mt-3 w-full grid grid-cols-2 items-end justify-start">
                                            <button
                                                className="bg-red-500 text-white font-bold uppercase text-xs px-6 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={() => {
                                                    setSelectedImage(null);
                                                    settransferModal(false);
                                                }}
                                            >
                                                Close
                                            </button>
                                            <button
                                                className="bg-emerald-500 text-white font-bold uppercase text-xs px-6 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={handleSubmit(onSubmitTransfer)}
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>



                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null
            }

            {
                delModal ? (
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
                ) : null
            }

        </div >
    );
}
