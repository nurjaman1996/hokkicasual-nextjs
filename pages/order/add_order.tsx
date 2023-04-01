import Head from "next/head";
import Image from "next/image";
import * as fa from "react-icons/fa";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import React, { Component, useRef, useState, useEffect } from "react";
import { compareAsc, format } from 'date-fns';
import { useRouter } from "next/router";
import Select from 'react-select';
import { table } from "console";
import TableRows from "../../components/tablerows";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// export async function getServerSideProps() {
//     const response = await fetch('https://dummyjson.com/products?limit=30&skip=0');
//     const dataProducts = await response.json();

//     return {
//         props: {
//             dataProducts
//         }
//     };
// }

// export default function AddOrder({ dataProducts: dataProduct_ }: any) {
export default function AddOrder() {
    const [dataProduct, setData] = useState([]);

    async function focusSearch(event: any) {
        if (event.target.value === '') {
            setLoading('standby');
        } else {
            setLoading('searching');
            const req = await fetch(`https://dummyjson.com/products/search?q=${event.target.value}`);
            const newDataProduct = await req.json();

            setData(newDataProduct.products);
            setLoading('showing');
        }
    }

    // const size = useRef([]);

    let productList: any = []
    {
        dataProduct.map((product: any, index) => {
            return (
                productList.push(
                    <div key={product.id} className="flex flex-warp gap-5 items-center py-4 w-full hover:bg-gray-100 px-3">
                        <div className="h-[70px] w-[70px] rounded-lg">
                            <Image
                                className='m-auto max-w-[100%] max-h-[100%]'
                                src={product.thumbnail}
                                alt='product-1'
                                height="500"
                                width="500"
                                priority
                            />
                        </div>
                        <div className="h-auto grow w-fit text-sm grid grid-rows-2">
                            <span>{product.title}</span>
                            <div className="border border-blue-700 text-blue-700 w-fit px-2 py-1 rounded-lg font-medium">size {product.stock}</div>
                            {/* <select ref={(element) => { size.current[index] = element; }} className="w-[70px] focus:outline-none rounded-lg px-1"> */}
                        </div>
                        <div className="text-end">
                            <button className="py-2 px-3 rounded-lg bg-blue-700 text-white text-xs" onClick={() => addProduk(index, product.title, product.id, product.stock, product.price, product.thumbnail)}>
                                Tambahkan
                            </button>
                        </div>
                    </div>
                )
            )
        })
    }

    const [date, setDate] = useState(format(new Date(), 'dd/MM/yyyy'));
    const router = useRouter();

    const [showProduct_, setshowProduct_] = useState(false);
    const [isLoading, setLoading] = useState('standby');

    function showProduct() {
        setshowProduct_(true);
    }

    const inputRef = useRef(null);
    const searchInput = useRef(null);

    const [rowsData, setRowsData] = useState([]);

    const [idEdit, setidEdit] = useState(null);

    const totalInvoice = (rowsData.reduce((total, currentItem) => total = total + currentItem.subtotal, 0));

    const [totalQty, settotalQty] = useState(0);

    const editTools = useRef([]);
    const editButton = useRef([]);

    function editToolsButton(index: any) {
        if (editTools.current[index].classList.contains('hidden')) {
            setidEdit(index);
            editTools.current[index].classList.remove('hidden');
            editTools.current[index].classList.add('block');
        } else {
            editTools.current[index].classList.remove('block');
            editTools.current[index].classList.add('hidden');
        }
    }

    function addProduk(index: any, produk: any, idproduk: any, size: any, harga: any, img: any) {
        if (!rowsData.find(item => item.idproduk === idproduk && item.size === size)) {
            const rowsInput = {
                produk: produk,
                idproduk: idproduk,
                // size: size.current[index].value,
                size: size,
                harga: harga,
                discount_item: 0,
                qty: 1,
                subtotal: harga * 1,
                img: img
            }
            setRowsData([...rowsData, rowsInput]);
            searchInput.current.value = "";
            setshowProduct_(false);
            setLoading('standby');

            settotalQty(totalQty + 1);
        } else {
            toast.info("Produk dengan size yang sama telah ditambahkan sebelumnya", {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnHover: false,
                autoClose: 2000,
            });
            searchInput.current.value = "";
            setshowProduct_(false);
            setLoading('standby');
        }
    }

    const deleteTableRows = (index: number) => {
        const rows = [...rowsData];
        rows.splice(index, 1);
        setRowsData(rows);
        settotalQty(totalQty - 1);
        setidEdit(null);
        editTools.current[index].classList.remove('block');
        editTools.current[index].classList.add('hidden');
    }

    const handleChange = (index: any) => {
        const rowsInput = [...rowsData];
        rowsData[index].discount_item = 100000;
        setRowsData(rowsInput);

        editTools.current[index].classList.remove('block');
        editTools.current[index].classList.add('hidden');
    }

    useEffect(() => {
        let handler = (e: any) => {
            if (!inputRef.current.contains(e.target)) {
                searchInput.current.value = "";
                setshowProduct_(false);
                setLoading('standby');
            }

            if (rowsData.length > 0 && idEdit != null) {
                if (!editTools.current[idEdit].contains(e.target) && !editButton.current[idEdit].contains(e.target)) {
                    editTools.current[idEdit].classList.remove('block');
                    editTools.current[idEdit].classList.add('hidden');
                    setidEdit(null);
                }
            }
        };

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        };

    })

    return (
        <>
            <div className="border-b border-[#2125291A] h-16 mb-7">
                <div className="flex flex-wrap items-center">
                    <button className="bg-gray-200 p-4 rounded-lg mr-6 " onClick={() => router.back()}>
                        <fa.FaChevronLeft size={13} />
                    </button>
                    <span className="font-bold text-3xl">Tambah Order</span>
                </div>
            </div>

            <ToastContainer className="mt-[50px]" />

            <div className="flex flex-wrap gap-8">
                <div className="bg-white h-fit w-[32%] rounded-lg p-5">
                    <div className="mb-3">
                        <span className="font-bold">Nama Penerima</span>
                        <input className="h-auto rounded-lg focus:bg-white w-full bg-zinc-100 py-2 px-5 mt-2 text-gray-700 focus:outline-none border text-base " type="text" placeholder="Nama Penerima" />
                    </div>

                    <div className="mb-3">
                        <span className="font-bold">ID Pesanan</span>
                        <input className="h-auto rounded-lg w-full focus:bg-white bg-zinc-100 py-2 px-5 mt-2 text-gray-700 focus:outline-none border text-base " type="text" placeholder="Masukan ID Pesanan" />
                    </div>

                    <div className="mb-3">
                        <span className="font-bold">Store Channel</span>
                        {/* <input className="h-auto rounded-lg w-full bg-zinc-100 py-2 px-5 mt-2 text-gray-700 focus:outline-none border text-base " type="text" placeholder="Pilih Store" /> */}
                        <div className="flex flex-wrap items-center mt-2 justify-end">
                            <select name="" id="" className="appearance-none h-auto cursor-pointer rounded-lg w-full bg-zinc-100 py-2 px-5 focus:outline-none border text-base" placeholder="Pilih Store">
                                <option value="">Pilih Store Channel</option>
                                <option value="Shopee">Shopee</option>
                                <option value="Tokopedia">Tokopedia</option>
                                <option value="Lazada">Lazada</option>
                            </select>
                            <i className="fi fi-rr-angle-small-down w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                        </div>

                    </div>

                    <div className="mb-3">
                        <span className="font-bold">Tanggal Order</span>
                        <div className="rounded-lg ml-auto w-full mt-2 flex flex-row items-center justify-end">
                            <Flatpickr
                                className="text-start h-full rounded-lg w-full bg-zinc-100 py-2.5 px-5 text-gray-700 focus:outline-none border"
                                // value={date}
                                placeholder="Pilih Tanggal Order"
                                options={{
                                    mode: "single",
                                    dateFormat: "d/m/Y",
                                    enableTime: false,
                                    // disable: [
                                    //   function (date) {
                                    //     return !(date.getDate() % 8);
                                    //   }
                                    // ]
                                    onClose: function (selectedDates, dateStr, instance) {
                                    },
                                }}
                            />

                            <i className="fi fi-rr-calendar w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                        </div>
                    </div>

                    <div className="mb-3">
                        <span className="font-bold">Note</span>
                        <textarea name="" id="" rows={5} className="resize-none focus:bg-white h-auto rounded-lg w-full bg-zinc-100 py-3 px-5 mt-2 text-gray-700 focus:outline-none border text-base "></textarea>
                    </div>
                </div>

                <div className="grow rounded-lg grid grid-flow-row auto-rows-max gap-5">

                    <div className="bg-white h-auto rounded-lg p-5 w-full" ref={inputRef}>
                        <div className="flex flex-wrap items-center justify-end">
                            <input onFocus={showProduct} ref={searchInput} onChange={focusSearch} className="h-auto focus:bg-white rounded-lg w-full bg-zinc-100 py-2 px-5 pr-12 text-gray-700 focus:outline-none border text-base " type="text" placeholder="Cari Produk" />
                            <i className="fi fi-rr-barcode-read w-[1.12rem] h-[1.12rem] text-center text-gray-500 text-[1.12rem] leading-4 absolute mr-5"></i>
                        </div>
                        <div className={`${showProduct_ ? 'block' : 'hidden'} w-full relative `}>
                            {(function () {
                                if (isLoading === 'standby') {
                                    return (
                                        <div className="p-4 h-auto bg-white absolute w-full rounded shadow overscroll-y-auto overflow-x-hidden">
                                            <span>Belum ada produk ditampilkan...</span>
                                        </div>
                                    );
                                } else if (isLoading === 'searching') {
                                    return (
                                        <div className="p-4 h-auto bg-white absolute w-full rounded shadow overscroll-y-auto overflow-x-hidden">
                                            <div className="animate-pulse flex flex-warp gap-5 items-center">
                                                <div className="bg-gray-200 h-[45px] w-[45px]"></div>
                                                <div className="bg-gray-200 h-[25px] w-[40%]"></div>
                                                <div className="bg-gray-200 h-[25px] w-[50%]"></div>
                                            </div>
                                            <div className="animate-pulse flex flex-warp gap-5 items-center mt-4">
                                                <div className="bg-gray-200 h-[45px] w-[45px]"></div>
                                                <div className="bg-gray-200 h-[25px] w-[40%]"></div>
                                                <div className="bg-gray-200 h-[25px] w-[50%]"></div>
                                            </div>
                                            <div className="animate-pulse flex flex-warp gap-5 items-center mt-4">
                                                <div className="bg-gray-200 h-[45px] w-[45px]"></div>
                                                <div className="bg-gray-200 h-[25px] w-[40%]"></div>
                                                <div className="bg-gray-200 h-[25px] w-[50%]"></div>
                                            </div>
                                        </div>
                                    );
                                } else if (isLoading === 'showing') {
                                    return (
                                        <div className="h-auto max-h-[300px] bg-white  absolute w-full rounded shadow z-10 ">
                                            <div className="h-full max-h-[300px] overscroll-y-auto overflow-x-hidden scrollbar-none">
                                                {productList}
                                            </div>
                                        </div>
                                    );
                                }
                            })()}
                        </div>
                    </div>

                    <div className="bg-white h-auto rounded-lg py-5 px-10">
                        <div className="mt-1 pb-5">
                            <span className="font-bold">Orderan</span>
                            <table className="w-full mt-2 ">
                                <thead className="">
                                    <tr>
                                        <th className=" text-gray-500 text-xs text-start py-2 w-auto">Nama</th>
                                        <th className=" text-gray-500 text-xs text-start py-2 w-[10%]">Size</th>
                                        <th className=" text-gray-500 text-xs text-start py-2 w-[7%]">Qty</th>
                                        <th className=" text-gray-500 text-xs text-start py-2 w-[10%]">Harga</th>
                                        <th className=" text-gray-500 text-xs text-start py-2 w-[13%]">Discount Item</th>
                                        <th className=" text-gray-500 text-xs text-end py-2 w-[10%]">Total</th>
                                        <th className=" text-gray-500 text-xs text-end py-2 w-[7%]"></th>
                                    </tr>
                                </thead>
                                <tbody className="text-black font-medium text-sm">

                                    {rowsData.length > 0 ?
                                        <TableRows editButton={editButton} rowsData={rowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} editTools={editTools} editToolsButton={editToolsButton} />
                                        :
                                        <tr className="h-[200px]">
                                            <td colSpan={7}>
                                                <div className="grid grid-flow-row auto-rows-max items-center justify-center text-center gap-1">
                                                    <Image
                                                        className="w-[70px] h-auto m-auto"
                                                        src="/open-box.png"
                                                        alt="Picture of the author"
                                                        width={100}
                                                        height={100}
                                                        placeholder="blur"
                                                        blurDataURL={'/open-box.png'}
                                                    />
                                                    <span className="text-gray-400">Belum ada produk ditambahkan</span>
                                                </div>
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                                <tbody className="text-black border-[#2125291A] font-medium text-sm">
                                    <tr className="border-b">
                                        <td className="py-2" colSpan={5}>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5" colSpan={2}>
                                            <span className="">Subtotal</span>
                                        </td>
                                        <td className="py-2.5 text-start">
                                            <span className="">{totalQty}</span>
                                        </td>
                                        <td className="py-2.5 text-end" colSpan={3}>
                                            <span className="">Rp{totalInvoice}</span>
                                        </td>
                                        <td className="py-2.5 px-3 text-end">
                                            <button className="">
                                                <i className="text-blue-700 m-auto fi fi-br-menu-dots"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>

                                <tbody className="text-black border-b border-t border-[#2125291A] font-medium text-sm">
                                    <tr>
                                        <td className="py-2.5" colSpan={5}>
                                            <span className="">Diskon Nota</span>
                                        </td>
                                        <td className="py-2.5 text-end">
                                            <span className="text-red-500 font-bold">(Rp{totalInvoice})</span>
                                        </td>
                                        <td className="py-2.5 px-3 text-end">
                                            <button className="">
                                                <i className="text-blue-700 m-auto fi fi-br-menu-dots"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>

                                <tbody className="text-black border-b border-t border-[#2125291A] font-medium text-sm">
                                    <tr>
                                        <td className="py-2.5" colSpan={5}>
                                            <span className="">Biaya Lainnya</span>
                                        </td>
                                        <td className="py-2.5 text-end">
                                            <span className="">Rp{totalInvoice}</span>
                                        </td>
                                        <td className="py-2.5 px-3 text-end">
                                            <button className="">
                                                <i className="text-blue-700 m-auto fi fi-br-menu-dots"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody className="text-black border-b border-[#2125291A] font-medium text-sm">
                                    <tr>
                                        <td className="py-5" colSpan={5}>
                                            <span className="font-bold">TOTAL PAYMENT</span>
                                        </td>
                                        <td className="py-5 text-end">
                                            <span className="font-bold text-xl text-blue-600">Rp{totalInvoice}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white h-[150px] rounded-lg">

                    </div>

                    <div className="flex flex-wrap pb-10 gap-4">
                        <button className="bg-transparent border-2 text-blue-700 border-blue-700 p-2 rounded-lg w-1/2">
                            Simpan dan Tambah Order Baru
                        </button>

                        <button className="bg-blue-700 text-white border-2 border-blue-700 hover:bg-blue-800 hover:border-blue-800 p-2 rounded-lg grow">
                            Simpan Order
                        </button>
                    </div>
                </div>
            </div >
        </>
    );
}
