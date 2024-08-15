<?php

namespace App\Repositories;

use App\Contracts\AccessRepositoryContract;
use App\Models\Application\Access;

class AccessRepository implements AccessRepositoryContract
{

    public function hasAccess(string $roleId, string $code): bool
    {
        return Access::where([
            ['role_id', '=', $roleId],
            ['code', '=', $code],
        ])->exists();
    }

    public function getPermissions(string $roleId, string $code): ?array
    {
        // variable
        $data = [];

        // ambil data access
        $accesses = Access::where([
            ['role_id', '=', $roleId],
            ['code', '=', $code],
        ])->get(['permission', 'is_allowed'])->toArray();

        foreach ($accesses as $access) {
            $data[$access['permission']] = boolval($access['is_allowed']);
        }

        return $data;
    }

    public function getAccessByRole(string $roleId): array
    {
        // ambil data access
        return Access::where([
            ['role_id', '=', $roleId],
        ])->pluck('code')->unique()->toArray();
    }

    public function isAllowed(string $roleId, string $code, string $permission): bool
    {
        // ambil data access
        $dataAccess = Access::where([
            ['role_id', '=', $roleId],
            ['code', '=', $code],
            ['permission', '=', $permission]
        ])->first();

        // jika null, return false
        if ($dataAccess === null) {
            return false;
        }

        return boolval($dataAccess->is_allowed);
    }
}
