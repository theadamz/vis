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

    public function getMenuByCode(string $menuCode): ?array
    {
        return $this->getMenuFromNestedByCode(collect(config('access.menus'))->toArray(), $menuCode);
    }

    public function getMenuFromNestedByCode(array $menuData, string $menuCode): ?array
    {
        // loop $menuData
        foreach ($menuData as $menu) {
            // if menu found then return the data
            if ($menu['code'] === $menuCode) {
                return $menu;
            }

            // if menu children not empty then loop again this function
            if (!empty($menu['children'])) {
                $menu = $this->getMenuFromNestedByCode($menu['children'], $menuCode);

                // if menu empty then return it
                if (!empty($menu)) {
                    return $menu;
                }
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
