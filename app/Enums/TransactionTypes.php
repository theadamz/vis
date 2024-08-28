<?php

namespace App\Enums;

enum TransactionTypes: string
{
    case INSPECTION = 'INS';

    public function getName(): string
    {
        return match ($this) {
            self::INSPECTION => "Inspection"
        };
    }
}
