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
        Schema::create('inspection_forms', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid("vehicle_type_id")->index();
            $table->string("type", 20)->index()->comment("loading/unloading");
            $table->string('code', 20)->unique();
            $table->string("name", 50);
            $table->boolean("use_eta_dest")->default(false)->comment("Flag to show Estimatin Time Arrival datetime in form inspection");
            $table->boolean("use_ata_dest")->default(false)->comment("Flag to show Actual Time Arrival datetime in form inspection");
            $table->boolean('is_publish')->default(true);
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            // FK
            $table->foreign('vehicle_type_id')->references('id')->on('vehicle_types')->restrictOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspection_forms');
    }
};
