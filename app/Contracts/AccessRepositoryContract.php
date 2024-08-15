<?php

namespace App\Contracts;

interface AccessRepositoryContract
{
    public function hasAccess(string $roleCode, string $menuCode): bool;

    public function getPermissions(string $roleCode, string $menuCode): ?array;

    public function getAccessByRole(string $roleCode): array;

    public function isAllowed(string $roleCode, string $menuCode, string $permission): bool;
}
