<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inspection_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('inspection_id')->index();
            $table->uuid('user_id')->index();
            $table->text("description");
            $table->timestamp('created_at')->nullable();

            // FK
            $table->foreign("inspection_id")->references("id")->on("inspections")->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign("user_id")->references("id")->on("users")->restrictOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspection_logs');
    }
};
