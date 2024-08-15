<?php

namespace App\Services;

use App\Contracts\AccessRepositoryContract;

class AccessService
{
    protected AccessRepositoryContract $repository;

    public function __construct(AccessRepositoryContract $repository)
    {
        $this->repository = $repository;
    }

    public function hasAccess(string $roleId, string $accessCode): bool
    {
        return $this->repository->hasAccess($roleId, $accessCode);
    }

    public function getPermissions(string $roleId, string $accessCode): ?array
    {
        return $this->repository->getPermissions($roleId, $accessCode);
    }

    public function getAccessByRole(string $roleId): array
    {
        return $this->repository->getAccessByRole($roleId);
    }

    public function retiveAccessMenuByCodes(array $accessCodes): array
    {
        // variabel
        $data = [];

        // ambil akses menu
        $accessMenus = collect(config('access.menus'));

        // looping $accessMenus
        foreach ($accessMenus as $accessMenu) {
            // jika code terdapat pada $accessCodes dan visible = true maka tambahkan
            if (in_array($accessMenu['code'], $accessCodes) && $accessMenu['visible'] === true) {
                // jika children tidak kosong
                if ($accessMenu['children'] !== null) {
                    $accessMenu['children'] = $this->retiveAccessMenuChildrenByCodes($accessCodes, $accessMenu['children']);
                }

                $data[] = collect($accessMenu)->only(['group_code', 'parent_menu_code', 'code', 'name', 'path', 'icon', 'children'])->toArray();
            }
        }

        return $data;
    }

    private function retiveAccessMenuChildrenByCodes(array $accessCodes, ?array $childrenAccessMenus): array
    {
        // variabel
        $data = [];

        // looping $childrenAccessMenus
        foreach ($childrenAccessMenus as $accessMenu) {
            // jika code terdapat pada $accessCodes dan visible = true maka tambahkan
            if (in_array($accessMenu['code'], $accessCodes) && $accessMenu['visible'] === true) {
                // jika children tidak kosong
                if ($accessMenu['children'] !== null) {
                    $accessMenu['children'] = $this->retiveAccessMenuChildrenByCodes($accessCodes, $accessMenu['children']);
                }

                $data[] = collect($accessMenu)->only(['group_code', 'parent_menu_code', 'code', 'name', 'path', 'icon', 'children'])->toArray();
            }
        }

        return $data;
    }

    public function retriveMenuGroupsByMenuCodes(array $accessCodes): array
    {
        // variable
        $data = [];

        // ambil akses menu
        $groups = collect(config('access.groups'))->whereIn('code', collect($accessCodes)->pluck('group_code')->unique())->where('visible', true)->toArray();

        // loop
        foreach ($groups as $group) {
            $data[] = collect($group)->only(['code', 'name'])->toArray();
        }

        return $data;
    }

    public function isAllowed(string $roleId, string $accessCode, string $permission = 'read'): bool
    {
        return $this->repository->isAllowed($roleId, $accessCode, $permission);
    }

    public function getRoles(bool $activeOnly = false): array
    {
        $data = collect(config('access.roles'));

        if ($activeOnly) {
            $data->where('visible', true);
        }

        return $data->toArray();
    }
}
