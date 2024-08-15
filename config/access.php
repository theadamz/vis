<?php

return [
    'userIdExceptions' => ['00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001'],
    'roleIdExceptions' => ['00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001'],
    'groups' => [
        ['code' => 'app', 'name' => 'Aplikasi', 'visible' => true],
        ['code' => 'dsh', 'name' => 'Dashboard', 'visible' => true],
        ['code' => 'bsc', 'name' => 'Basic', 'visible' => true],
        ['code' => 'ins', 'name' => 'Inspeksi', 'visible' => true],
        ['code' => 'rpt', 'name' => 'Laporan', 'visible' => true],
    ],
    'menus' => [
        /* Aplikasi */
        ['group_code' => 'app', 'parent_menu_code' => 'app-role', 'code' => 'app-role', 'name' => 'Roles', 'description' => 'Manajemen Role', 'path' => '/app/roles', 'icon' => 'users-round', 'visible' => true, 'children' => null],
        ['group_code' => 'app', 'parent_menu_code' => 'app-site', 'code' => 'app-site', 'name' => 'Sites', 'description' => 'Manajemen Site', 'path' => '/app/sites', 'icon' => 'building', 'visible' => true, 'children' => null],
        ['group_code' => 'app', 'parent_menu_code' => 'app-access', 'code' => 'app-access', 'name' => 'Akses Sistem', 'description' => 'Manajemen Akses Sistem', 'path' => '/app/accesses', 'icon' => 'shield-check', 'visible' => true, 'children' => null],
        ['group_code' => 'app', 'parent_menu_code' => 'app-user', 'code' => 'app-user', 'name' => 'Pengguna', 'description' => 'Manajemen Pengguna', 'path' => '/app/users', 'icon' => 'users', 'visible' => true, 'children' => null],
        ['group_code' => 'app', 'parent_menu_code' => 'app-transaction', 'code' => 'app-transaction', 'name' => 'Transaksi', 'description' => 'Transaksi Parent', 'path' => null, 'icon' => 'file-digit', 'visible' => true, 'children' => [
            ['group_code' => 'app', 'parent_menu_code' => 'app-transaction', 'code' => 'app-transaction-type', 'name' => 'Tipe', 'description' => 'Manajemen Tipe Transaksi', 'path' => '/app/transactions/types', 'icon' => 'dot', 'visible' => true, 'children' => null],
            ['group_code' => 'app', 'parent_menu_code' => 'app-transaction', 'code' => 'app-transaction-seq', 'name' => 'Nomor Urutan', 'description' => 'Nomor Urut Transaksi', 'path' => '/app/transactions/sequences', 'icon' => 'dot', 'visible' => true, 'children' => null],
        ]],

        /* Dashboard */
        ['group_code' => 'dsh', 'parent_menu_code' => 'dashboard', 'code' => 'dashboard', 'name' => 'Dashboard', 'description' => 'dashboard', 'path' => '/dashboard', 'icon' => 'circle-gauge', 'visible' => true, 'children' => null],

        /* Basic */
        ['group_code' => 'bsc', 'parent_menu_code' => 'bsc-vhc-type', 'code' => 'bsc-vhc-type', 'name' => 'Tipe Kendaraan', 'description' => 'Tipe Kendaraan', 'path' => '/basic/vehicles/types', 'icon' => 'bus', 'visible' => true, 'children' => null],

        /* Inspection */
        ['group_code' => 'ins', 'parent_menu_code' => 'ins-form', 'code' => 'ins-form', 'name' => 'Formulir', 'description' => 'Formulir Inspeksi', 'path' => '/inspections/forms', 'icon' => 'file', 'visible' => true, 'children' => null],
        ['group_code' => 'ins', 'parent_menu_code' => 'ins-inspection', 'code' => 'ins-inspection', 'name' => 'Inspeksi Kendaraan', 'description' => 'Inspeksi Kendaraan', 'path' => '/inspections', 'icon' => 'scan-search', 'visible' => true, 'children' => null],

        /* Laporan */
        ['group_code' => 'rpt', 'parent_menu_code' => 'rpt-list', 'code' => 'rpt-list', 'name' => 'Daftar Laporan', 'description' => 'Daftar Laporan', 'path' => '/reports', 'icon' => 'dot', 'visible' => true, 'children' => null],
    ],
    'lists' => [
        /* access khusus */
        ['code' => 'as-approval', 'name' => 'Akses Approval Inspection', 'permissions' => ['approve']],
        ['code' => 'as-operator', 'name' => 'Akses Inspection App (PWA)', 'permissions' => ['read']],

        /* Menu access */

        /* Aplikasi */
        ['code' => 'app-role', 'name' => 'Akses Menu Manajemen Role', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'app-site', 'name' => 'Akses Menu Manajemen Site', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'app-access', 'name' => 'Akses Menu Manajemen Sistem', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'app-user', 'name' => 'Akses Menu Manajemen pengguna', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'app-transaction', 'name' => 'Akses Menu Transaksi Parent', 'permissions' => ['read']],
        ['code' => 'app-transaction-type', 'name' => 'Akses Menu Manajemen Tipe Transaksi', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'app-transaction-seq', 'name' => 'Akses Menu Nomor Urut Transaksi', 'permissions' => ['read']],

        /* Dashboard */
        ['code' => 'dashboard', 'name' => 'Akses Menu Dashboard', 'permissions' => ['read']],

        /* Basic */
        ['code' => 'bsc-vhc-type', 'name' => 'Akses Menu Tipe Kendaraan', 'permissions' => ['read', 'create', 'edit', 'delete']],

        /* Inspection */
        ['code' => 'ins-form', 'name' => 'Akses Menu Manajemen Formulir Inspeksi', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'ins-inspection', 'name' => 'Akses Menu Inspeksi', 'permissions' => ['read', 'create', 'edit', 'delete']],

        /* Laporan */
        ['code' => 'rpt-list', 'name' => 'Akses Menu Daftar Laporan', 'permissions' => ['read']],
    ]
];
