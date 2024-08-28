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
        Schema::create('inspection_loading_pictures', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('inspection_id')->index();
            $table->string('pic_file', 50)->comment("filename.jpg");
            $table->uuid('created_by')->nullable();
            $table->timestamp('created_at')->nullable();

            // FK
            $table->foreign("inspection_id")->references("id")->on("inspections")->restrictOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspection_loading_pictures');
    }
};
