import * as fa from "react-icons/fa";

const Items = [
    {
        "title": "Dashboard",
        "href": "/",
        "text": "Dashboard",
        "icon_item": "fi fi-rr-layout-fluid"
    }, {
        "title": "Data Master",
        "href": "#",
        "text": "Data Master",
        "icon_item": "fi fi-rr-folder",
        "path": "datamaster",
        "children": [
            {
                "title": "Area",
                "href": "/datamaster/area",
                "icon_item": "fi fi-rs-map-marker",
                "text": "Area",
            },
            {
                "title": "Warehouse",
                "href": "/datamaster/warehouse",
                "icon_item": "fi fi-rr-garage",
                "text": "Warehouse",
            },
            {
                "title": "Store",
                "href": "/datamaster/store",
                "icon_item": "fi fi-rr-shop",
                "text": "Store",
            },
            {
                "title": "Brand",
                "href": "/datamaster/brand",
                "icon_item": "fi fi-rr-tags",
                "text": "Brand",
            },
            {
                "title": "Category",
                "href": "/datamaster/category",
                "icon_item": "fi fi-rr-cube",
                "text": "Category",
            },
            {
                "title": "Supplier",
                "href": "/datamaster/supplier",
                "icon_item": "fi fi-rr-package",
                "text": "Supplier",
            },
            {
                "title": "Karyawan",
                "href": "/datamaster/karyawan",
                "icon_item": "fi fi-rr-user",
                "text": "Karyawan",
            },
        ]
    }, {
        "title": "Produk",
        "href": "#",
        "text": "Produk",
        "icon_item": "fi fi-rr-box",
        "path": "products",
        "children": [
            {
                "title": "Daftar Produk",
                "href": "/products/daftar_produk",
                "icon_item": "fi fi-rr-box-alt",
                "text": "Daftar Produk"
            },
            {
                "title": "Nota Barang",
                "href": "/products/nota_barang",
                "icon_item": "fi fi-rr-file-invoice",
                "text": "Nota Barang"
            },
            {
                "title": "Stok Opname",
                "href": "/products/stock_opname",
                "icon_item": "fi fi-rr-boxes",
                "text": "Stok Opname",
            },
            {
                "title": "Barcode",
                "href": "/products/barcode",
                "icon_item": "fi fi-ss-barcode-read",
                "text": "Cetak Barcode"
            }
        ]
    }, {
        "title": "Pesanan",
        "href": "#",
        "text": "Pesanan",
        "icon_item": "fi fi-rr-bags-shopping",
        "path": "order",
        "children": [
            {
                "title": "Tambah Pesanan",
                "href": "/order/add_order",
                "icon_item": "fi fi-rr-database",
                "text": "Tambah Pesanan"
            },
            {
                "title": "Daftar Pesanan",
                "href": "/order/shipping",
                "icon_item": "fi fi-rs-truck-side",
                "text": "Daftar Pesanan"
            },
            // {
            //     "title": "Pesanan Selesai",
            //     "href": "/order/pesanan_selesai",
            //     "icon_item": "fi fi-rr-checkbox",
            //     "text": "Pesanan Selesai"
            // },
            // {
            //     "title": "Pesanan Cancel",
            //     "href": "/order/cancel_order",
            //     "icon_item": "fi fi-rr-time-delete",
            //     "text": "Pesanan Cancel",
            // }
        ]
    }, {
        "title": "Pengeluaran Toko",
        "href": "/expense",
        "text": "Pengeluaran Toko",
        "icon_item": "fi fi-rr-label"
    }, {
        "title": "Assets",
        "href": "/assets",
        "text": "Assets",
        "icon_item": "fi fi-rs-sack-dollar"
    },
    // {
    //     "title": "Report",
    //     "href": "/",
    //     "text": "Report",
    //     "icon_item": "fi fi-rr-document-signed"
    // }, 
    {
        "title": "Settings",
        "href": "/settings/setting",
        "text": "Settings",
        "icon_item": "fi fi-rr-settings"
    },
];

export default Items