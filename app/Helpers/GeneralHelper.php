<?php

namespace App\Helpers;

use DateTimeZone;
use Illuminate\Support\Facades\Http;
use Intervention\Image\ImageManager;

class GeneralHelper
{

    public function compressImage(string $path, int $height): void
    {
        // create new manager instance with desired driver
        $image = ImageManager::gd()->read($path);
        $image->scaleDown(height: $height);
        $image->toJpeg()->save($path);
    }

    public function compressImageWidth(string $path, int $width): void
    {
        // create new manager instance with desired driver
        $image = ImageManager::gd()->read($path);
        $image->scaleDown(width: $width);
        $image->toJpeg()->save($path);
    }

    public function getTimezone(): array
    {
        return DateTimeZone::listIdentifiers(DateTimeZone::ALL);
    }

    public function checkIfMenuExist(string $menuCode): bool
    {
        // ambil menu berdasarkan code
        $menu = collect(config('access.menus'))->firstWhere('code', $menuCode);

        // jika tidak ditemukan maka loop children
        if (empty($menu)) {
            // get menu with childrens
            $childrens = collect(config('access.menus'))->whereNotNull('children')->pluck('children');

            // jika childrens tidak kosong
            if (!empty($childrens)) {
                // loop childrens
                foreach ($childrens as $children) {
                    // buat map
                    $menu = collect($children)->firstWhere('code', $menuCode);
                }
            }
        }

        // jika masih tidak ditemukan juga maka false
        if (empty($menu)) {
            return false;
        }

        return $menu['visible'];
    }

    public function getMenuByCode(string $menuCode): ?array
    {
        $menu = collect(config('access.menus'))->firstWhere('code', $menuCode);

        // jika tidak ditemukan maka loop children
        if (empty($menu)) {
            // get menu with childrens
            $childrens = collect(config('access.menus'))->whereNotNull('children')->pluck('children');

            // jika childrens tidak kosong
            if (!empty($childrens)) {
                // loop childrens
                foreach ($childrens as $children) {
                    // buat map
                    $menu = collect($children)->firstWhere('code', $menuCode);
                }
            }
        }

        return $menu;
    }

    public function getMenuFromNestedByCode(array $menuData, string $menuCode): ?array
    {
        // loop $menuData
        foreach ($menuData as $menu) {
            // jika menu ditemukan maka return datanya
            if ($menu['code'] === $menuCode) {
                return $menu;
            }

            // jika menu children tidak kosong
            if (!empty($menu['children'])) {
                return $this->getMenuFromNestedByCode($menu['children'], $menuCode);
            }
        }

        return null;
    }

    public function getInfoIPPublic(): ?array
    {
        try {
            $request = Http::get('https://ipinfo.io/json');

            if ($request->status() === 200) {
                return $request->json();
            } else {
                return null;
            }
        } catch (\Exception $e) {
            return null;
        }
    }
}
