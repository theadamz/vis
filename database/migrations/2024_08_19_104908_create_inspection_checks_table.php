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
        Schema::create('inspection_checks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('inspection_id')->index();
            $table->uuid('inspection_form_check_id')->index();
            $table->string('result', 50)->comment("ok/no/filename.jpg");
            $table->string('remarks', 100)->nullable();

            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            // Index
            $table->unique(['inspection_id', 'inspection_form_check_id']);

            // FK
            $table->foreign("inspection_id")->references("id")->on("inspections")->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign("inspection_form_check_id")->references("id")->on("inspection_form_checks")->restrictOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspection_checks');
    }
};
