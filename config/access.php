<?php

return [
    'userIdExceptions' => ['00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001'],
    'roleIdExceptions' => ['00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001'],
    'groups' => [
        ['code' => 'app', 'name' => 'Application', 'visible' => true],
        ['code' => 'dsh', 'name' => 'Dashboard', 'visible' => true],
        ['code' => 'bsc', 'name' => 'Basic', 'visible' => true],
        ['code' => 'ins', 'name' => 'Inspection', 'visible' => true],
        ['code' => 'rpt', 'name' => 'Reports', 'visible' => true],
    ],
    'menus' => [
        /* Aplikasi */
        ['group_code' => 'app', 'parent_menu_code' => 'app-role', 'code' => 'app-role', 'name' => 'Roles', 'description' => 'Role Management', 'path' => '/app/roles', 'icon' => 'users-round', 'visible' => true, 'children' => null],
        ['group_code' => 'app', 'parent_menu_code' => 'app-site', 'code' => 'app-site', 'name' => 'Sites', 'description' => 'Site Management', 'path' => '/app/sites', 'icon' => 'building', 'visible' => true, 'children' => null],
        ['group_code' => 'app', 'parent_menu_code' => 'app-access', 'code' => 'app-access', 'name' => 'System Access', 'description' => 'System Access Management', 'path' => '/app/accesses', 'icon' => 'shield-check', 'visible' => true, 'children' => null],
        ['group_code' => 'app', 'parent_menu_code' => 'app-user', 'code' => 'app-user', 'name' => 'Users', 'description' => 'User Management', 'path' => '/app/users', 'icon' => 'users', 'visible' => true, 'children' => null],
        ['group_code' => 'app', 'parent_menu_code' => 'app-transaction', 'code' => 'app-transaction', 'name' => 'Transaction', 'description' => 'Transaction Parent', 'path' => null, 'icon' => 'file-digit', 'visible' => true, 'children' => [
            ['group_code' => 'app', 'parent_menu_code' => 'app-transaction', 'code' => 'app-transaction-type', 'name' => 'Type', 'description' => 'Transaction Type Management', 'path' => '/app/transactions/types', 'icon' => 'dot', 'visible' => true, 'children' => null],
            ['group_code' => 'app', 'parent_menu_code' => 'app-transaction', 'code' => 'app-transaction-seq', 'name' => 'Sequence Number', 'description' => 'Transaction Sequence Preview', 'path' => '/app/transactions/sequences', 'icon' => 'dot', 'visible' => true, 'children' => null],
        ]],

        /* Dashboard */
        ['group_code' => 'dsh', 'parent_menu_code' => 'dashboard', 'code' => 'dashboard', 'name' => 'Dashboard', 'description' => 'dashboard', 'path' => '/dashboard', 'icon' => 'circle-gauge', 'visible' => true, 'children' => null],

        /* Basic */
        ['group_code' => 'bsc', 'parent_menu_code' => 'bsc-vhc-type', 'code' => 'bsc-vhc-type', 'name' => 'Vehicle Types', 'description' => 'Vehicle Type Management', 'path' => '/basic/vehicle-types', 'icon' => 'bus', 'visible' => true, 'children' => null],

        /* Inspection */
        ['group_code' => 'ins', 'parent_menu_code' => 'ins-form', 'code' => 'ins-form', 'name' => 'Forms', 'description' => 'Inspection Form Management', 'path' => '/inspections/forms', 'icon' => 'file', 'visible' => true, 'children' => null],
        ['group_code' => 'ins', 'parent_menu_code' => 'ins-inspection', 'code' => 'ins-inspection', 'name' => 'Vehicle Inspections', 'description' => 'Vehicle Inspection', 'path' => '/inspections', 'icon' => 'scan-search', 'visible' => true, 'children' => null],

        /* Laporan */
        ['group_code' => 'rpt', 'parent_menu_code' => 'rpt-list', 'code' => 'rpt-list', 'name' => 'Report List', 'description' => 'Report List', 'path' => '/reports', 'icon' => 'dot', 'visible' => true, 'children' => null],
    ],
    'lists' => [
        /* access khusus */
        ['code' => 'as-approval', 'name' => 'Akses Approval Inspection', 'permissions' => ['approve']],
        ['code' => 'as-inspector', 'name' => 'Akses Inspection App (PWA)', 'permissions' => ['read']],

        /* Menu access */

        /* Aplikasi */
        ['code' => 'app-role', 'name' => 'Menu Role Management', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'app-site', 'name' => 'Menu Site Management', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'app-access', 'name' => 'Menu System Access', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'app-user', 'name' => 'Menu User Management', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'app-transaction', 'name' => 'Menu Parent Transaction', 'permissions' => ['read']],
        ['code' => 'app-transaction-type', 'name' => 'Menu Transaction - Type Management', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'app-transaction-seq', 'name' => 'Menu Transaction - Sequences Preview', 'permissions' => ['read']],

        /* Dashboard */
        ['code' => 'dashboard', 'name' => 'Menu Dashboard', 'permissions' => ['read']],

        /* Basic */
        ['code' => 'bsc-vhc-type', 'name' => 'Menu Vehicle Type Management', 'permissions' => ['read', 'create', 'edit', 'delete']],

        /* Inspection */
        ['code' => 'ins-form', 'name' => 'Menu Form Inspection Management', 'permissions' => ['read', 'create', 'edit', 'delete']],
        ['code' => 'ins-inspection', 'name' => 'Menu Vehicle Inspection', 'permissions' => ['read', 'create', 'edit', 'delete']],

        /* Laporan */
        ['code' => 'rpt-list', 'name' => 'Menu Report List', 'permissions' => ['read']],
    ]
];
