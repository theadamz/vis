<?php

namespace App\Enums;

enum InspectionTypes: string
{
    case LOADING = 'loading';
    case UNLOADING = 'unloading';

    public function getName(): string
    {
        return match ($this) {
            self::LOADING => "Loading",
            self::UNLOADING => "Unloading",
        };
    }
}
