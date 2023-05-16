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

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Expense() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const columns: any = [
    {
      name: 'Tanggal',
      selector: (row: { tanggal: any }) => row.tanggal,
    },
    {
      name: 'ID Expense',
      selector: (row: { id_expense: any }) => row.id_expense,
    },
    {
      name: 'Deskripsi',
      selector: (row: { deskripsi: any }) => row.deskripsi,
    },
    {
      name: 'Store',
      selector: (row: { id_store: any }) => row.id_store,
    },
    {
      name: 'Amount',
      selector: (row: { amount: any }) => row.amount,
    },
    {
      name: 'Quantity',
      selector: (row: { qty: any }) => row.qty,
    },
    {
      name: 'Total Amount',
      selector: (row: { total_amount: any }) => row.total_amount,
    },
    {
      name: 'Action',
      selector: (row: { action: any }) => row.action,
    },

  ];

  const list_expense: any = [];

  const { data, error, isLoading, mutate } = useSWR(`https://api.hokkiscasual.com/getexpense`, fetcher);

  const { data: store_data, error: store_error, isLoading: store_isLoading, mutate: store_mutate } = useSWR(`https://api.hokkiscasual.com/getstore`, fetcher);
  const list_store: any = [];
  if (!store_isLoading && !store_error) {
    store_data.data_store.map((store: any, index: number) => {
      list_store.push(
        <option key={index} value={store.id_store}>{store.store}</option>
      )
    })
  }

  const { register, resetField, setValue, handleSubmit, getValues, watch, formState: { errors } } = useForm({
    defaultValues: {
      deskripsi: '',
      amount: 0,
      qty: 1,
      total_amount: 0,
      id_store: 'ALL-STORE',
      edit_id_store: 'ALL-STORE',
      edit_deskripsi: '',
      edit_amount: 0,
      edit_qty: 1,
      edit_total_amount: 0,
    }
  });

  const [showModal, setShowModal] = React.useState(false);
  const [delModal, setdelModal] = React.useState(false);
  const [editModal, seteditModal] = React.useState(false);
  const [Deskripsi, setDeskripsi] = React.useState(null);
  const [id, setid] = React.useState(null);

  function hitungAmount() {
    var jumlah = getValues("amount") * getValues("qty");
    setValue('total_amount', jumlah)
  }

  function hitungAmountedit() {
    var jumlah = getValues("edit_amount") * getValues("edit_qty");
    setValue('edit_total_amount', jumlah)
  }

  const onSubmit = async (data: any) => {
    await axios.post("https://api.hokkiscasual.com/saveexpense", {
      data: data,
      tanggal: date
    }).then(function (response) {
      // console.log(response.data);
      mutate();
    });

    toast.success("Data telah disimpan", {
      position: toast.POSITION.TOP_RIGHT,
      pauseOnHover: false,
      autoClose: 2000,
    });

    resetField("deskripsi");
    resetField("amount");
    resetField("qty");
    resetField("total_amount");
    setShowModal(false);
  };

  function showeditModal(id: any, deskripsi: any, amount: any, qty: any, total_amount: any, index: number, id_store: any) {
    setid(id);
    setValue("edit_deskripsi", deskripsi);
    setValue("edit_amount", amount);
    setValue("edit_qty", qty);
    setValue("edit_total_amount", total_amount);
    setValue("edit_id_store", id_store);
    seteditModal(true);
  }

  const onSubmitUpdate = async (data: any) => {
    await axios.post(`https://api.hokkiscasual.com/editexpense/${id}`, {
      data: data,
      tanggal: date
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

  function showdeleteModal(id: any, index: number) {
    setid(id)
    setDeskripsi(list_expense[index].deskripsi)
    setdelModal(true)
  }

  async function deleteData() {
    await axios.post(`https://api.hokkiscasual.com/deleteexpense/${id}`)
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

  if (!isLoading && !error) {
    data.data_expense.map((data_expense: any, index: number) => {
      return (
        list_expense.push(
          {
            id: index,
            tanggal: data_expense.tanggal,
            id_expense: data_expense.id_expense,
            deskripsi: data_expense.deskripsi,
            amount: data_expense.amount,
            qty: data_expense.qty,
            total_amount: data_expense.total_amount,
            id_store: data_expense.id_store === "ALL-STORE" ? "ALL-STORE" : data_expense.store[0]['store'],
            action: (
              <div className="flex flex-warp gap-4">
                <button className="text-blue-500" onClick={() => showeditModal(data_expense.id, data_expense.deskripsi, data_expense.amount, data_expense.qty, data_expense.total_amount, index, data_expense.id_store)}>
                  <i className="fi fi-rr-edit text-center text-xl"></i>
                </button>
                <button className="text-red-500" onClick={() => showdeleteModal(data_expense.id, index)}>
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

  const filteredItems = list_expense.filter((list_expense: any) => {
    return (
      list_expense.tanggal.toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) ||
      list_expense.id_expense.toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) ||
      list_expense.deskripsi.toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) ||
      list_expense.id_store.toLocaleLowerCase().includes(filterText.toLocaleLowerCase())
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

  return (
    <div className="p-5">
      <div className="font-bold text-3xl border-b border-[#2125291A] h-16 mb-7">
        Pengeluaran Toko
      </div>

      <div className="flex flex-wrap items-center content-center mb-6">
        <div className="shadow rounded-lg w-auto flex flex-row text-center content-center">
          <input className="h-[45px] border-0 w-[300px] pr-3 pl-5  text-gray-700 focus:outline-none rounded-l-lg" type="text" placeholder="Cari data Expense"
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
            Tambah Pengeluaran
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
                    Tambah Data Expense
                  </span>
                </div>
                {/*body*/}
                <div className="relative p-3 px-4 flex-auto">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="">
                      <label className="block mb-2 text-sm font-medium text-black">Tanggal</label>
                      <Flatpickr
                        className="text-start h-full rounded-lg w-full py-2.5 px-5 text-gray-700 focus:outline-none border"
                        value={date}
                        placeholder="Pilih Tanggal Order"
                        options={{
                          mode: "single",
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
                    </div>
                    <div className="mt-6">
                      <label className="block mb-2 text-sm font-medium text-black">Store</label>
                      <select
                        className={`${errors.id_store ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        {...register("id_store", { required: true })}
                      >
                        <option value="ALL-STORE">ALL STORE</option>
                        {list_store}
                      </select>
                      {errors.id_store && <div className="mt-1 text-sm italic">This field is required</div>}
                    </div>

                    <div className="mt-6">
                      <label className="block mb-2 text-sm font-medium text-black">Deskripsi</label>
                      <input
                        className={`${errors.deskripsi ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        type="text"
                        placeholder="Masukan Deskripsi"
                        // ref={req_brand}
                        defaultValue="" {...register("deskripsi", { required: true })}
                      />
                      {errors.deskripsi && <div className="mt-1 text-sm italic">This field is required</div>}
                    </div>
                    <div className="mt-6">
                      <label className="block mb-2 text-sm font-medium text-black">Amount</label>
                      <input
                        className={`${errors.amount ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        type="number"
                        placeholder="Masukan Amount"
                        // ref={req_brand}
                        defaultValue="" {...register("amount", { required: true, onChange: () => hitungAmount() })}
                      />
                      {errors.amount && <div className="mt-1 text-sm italic">This field is required</div>}
                    </div>
                    <div className="mt-6">
                      <label className="block mb-2 text-sm font-medium text-black">Quantity</label>
                      <input
                        className={`${errors.qty ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        type="number"
                        placeholder="Masukan Quantity"
                        // ref={req_brand}
                        defaultValue="" {...register("qty", { required: true, onChange: () => hitungAmount() })}
                      />
                      {errors.qty && <div className="mt-1 text-sm italic">This field is required</div>}
                    </div>
                    <div className="mt-6">
                      <label className="block mb-2 text-sm font-medium text-black">Total Ammount</label>
                      <input
                        className={`${errors.total_amount ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        type="number"
                        readOnly
                        placeholder="Masukan Total Amount"
                        // ref={req_brand}
                        defaultValue="" {...register("total_amount", { required: true })}
                      />
                      {errors.total_amount && <div className="mt-1 text-sm italic">This field is required</div>}
                    </div>
                  </form>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      resetField("deskripsi");
                      resetField("amount");
                      resetField("qty");
                      resetField("total_amount");
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
                    Edit Data Expense
                  </span>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <form onSubmit={handleSubmit(onSubmitUpdate)}>
                    <div className="">
                      <label className="block mb-2 text-sm font-medium text-black">Tanggal</label>
                      <Flatpickr
                        className="text-start h-full rounded-lg w-full py-2.5 px-5 text-gray-700 focus:outline-none border"
                        value={date}
                        placeholder="Pilih Tanggal Order"
                        options={{
                          mode: "single",
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
                    </div>
                    <div className="mt-6">
                      <label className="block mb-2 text-sm font-medium text-black">Deskripsi</label>
                      <input
                        className={`${errors.edit_deskripsi ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        type="text"
                        placeholder="Masukan Deskripsi"
                        // ref={req_brand}
                        defaultValue="" {...register("edit_deskripsi", { required: true })}
                      />
                      {errors.edit_deskripsi && <div className="mt-1 text-sm italic">This field is required</div>}
                    </div>
                    <div className="mt-6">
                      <label className="block mb-2 text-sm font-medium text-black">Store</label>
                      <select
                        className={`${errors.edit_id_store ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        {...register("edit_id_store", { required: true })}
                      >
                        <option value="ALL-STORE">ALL STORE</option>
                        {list_store}
                      </select>
                      {errors.edit_id_store && <div className="mt-1 text-sm italic">This field is required</div>}
                    </div>
                    <div className="mt-6">
                      <label className="block mb-2 text-sm font-medium text-black">Amount</label>
                      <input
                        className={`${errors.edit_amount ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        type="number"
                        placeholder="Masukan Amount"
                        // ref={req_brand}
                        defaultValue="" {...register("edit_amount", { required: true, onChange: () => hitungAmountedit() })}
                      />
                      {errors.edit_amount && <div className="mt-1 text-sm italic">This field is required</div>}
                    </div>
                    <div className="mt-6">
                      <label className="block mb-2 text-sm font-medium text-black">Quantity</label>
                      <input
                        className={`${errors.edit_qty ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        type="number"
                        placeholder="Masukan Quantity"
                        // ref={req_brand}
                        defaultValue="" {...register("edit_qty", { required: true, onChange: () => hitungAmountedit() })}
                      />
                      {errors.edit_qty && <div className="mt-1 text-sm italic">This field is required</div>}
                    </div>
                    <div className="mt-6">
                      <label className="block mb-2 text-sm font-medium text-black">Total Ammount</label>
                      <input
                        className={`${errors.edit_total_amount ? "border-red-500 border-2" : "border"} h-[45px]  w-[100%] pr-3 pl-5  text-gray-700 focus:outline-none rounded-lg`}
                        type="number"
                        placeholder="Masukan Total Amount"
                        readOnly
                        // ref={req_brand}
                        defaultValue="" {...register("edit_total_amount", { required: true })}
                      />
                      {errors.edit_total_amount && <div className="mt-1 text-sm italic">This field is required</div>}
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
                    Data Expense {Deskripsi} akan dihapus?
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
