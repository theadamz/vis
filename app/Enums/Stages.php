<?php

namespace App\Enums;

enum Stages: string
{
    case CHECKED_IN = 'checkedin';
    case LOADING = 'loading';
    case CHECKED_OUT = 'checkedout';

    public function getName(): string
    {
        return match ($this) {
            self::CHECKED_IN => "Checked In",
            self::LOADING => "Loading",
            self::CHECKED_OUT => "Checked Out",
        };
    }
}
