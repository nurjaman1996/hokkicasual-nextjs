import * as fa from "react-icons/fa";

const Items = [
    {
        "title": "Dashboard",
        "href": "/dashboard",
        "text": "Dashboard",
        "icon_item": "fi fi-rr-layout-fluid"
    }, {
        "title": "Orders",
        "href": "#",
        "text": "Orders",
        "icon_item": "fi fi-rr-bags-shopping",
        "path": "order",
        "children": [
            {
                "title": "Semua Order",
                "href": "/order/all_order",
                "icon_item": "fi fi-rr-database",
                "text": "Semua Order"
            },
            {
                "title": "Sedang Dikirim",
                "href": "/order/shipping",
                "icon_item": "fi fi-rs-truck-side",
                "text": "Sedang Dikirim"
            },
            {
                "title": "Pesanan Selesai",
                "href": "/order/pesanan_selesai",
                "icon_item": "fi fi-rr-checkbox",
                "text": "Pesanan Selesai"
            },
            {
                "title": "Cancel Order",
                "href": "/order/cancel_order",
                "icon_item": "fi fi-rr-time-delete",
                "text": "Cancel Order",
            }
        ]
    }, {
        "title": "Product",
        "href": "#",
        "text": "Product",
        "icon_item": "fi fi-rr-box",
        "path": "products",
        "children": [
            {
                "title": "Daftar Produk",
                "href": "/products/list_product",
                "icon_item": "fi fi-rr-box-alt",
                "text": "Daftar Produk"
            },
            {
                "title": "Stok Opname",
                "href": "/products/stock_opname",
                "icon_item": "fi fi-rr-boxes",
                "text": "Stok Opname",
            }
        ]
    }, {
        "title": "Expense",
        "href": "/expense",
        "text": "Expense",
        "icon_item": "fi fi-rr-label"
    }, {
        "title": "Report",
        "href": "/",
        "text": "Report",
        "icon_item": "fi fi-rr-document-signed"
    }, {
        "title": "Settings",
        "href": "/",
        "text": "Settings",
        "icon_item": "fi fi-rr-settings"
    },
];

export default Items