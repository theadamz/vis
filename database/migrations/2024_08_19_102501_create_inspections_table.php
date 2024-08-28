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
        Schema::create('inspections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid("inspection_form_id")->index();
            $table->string('doc_no', 50)->unique();
            $table->date('doc_date')->index();
            $table->string("container_no", 50)->nullable();
            $table->string("seal_no", 50)->nullable();
            $table->uuid("inspected_by", 50)->index();
            $table->string("driver_name", 100);
            $table->string("driver_id_no", 50)->comment("Driver identity card ex: driver license");
            $table->string("driver_pic", 50);
            $table->string("driver_phone_no", 20);
            $table->string("vehicle_reg_no", 20)->index()->comment("Vehicle registration number");
            $table->string("vehicle_paper_no", 50)->nullable()->comment("Vehicle registration number paper");
            $table->string("vehicle_paper_pic", 50);
            $table->uuid("checked_in_by")->index();
            $table->timestamp("checked_in_at")->default(now());
            $table->uuid("loading_start_by")->index();
            $table->timestamp("loading_start_at")->nullable();
            $table->uuid("loading_end_by")->index();
            $table->timestamp("loading_end_at")->nullable();
            $table->uuid("checked_out_by")->index();
            $table->timestamp("checked_out_at")->nullable();
            $table->timestamp("arrival_time_at_fty")->nullable()->comment("Time arrived in factory to loading / unloading");
            $table->timestamp("depart_time_from_fty")->nullable()->comment("Time depart from factory to destination (harbour / airport)");
            $table->timestamp("eta_to_dest")->nullable()->comment("Estimation time to destination (harbour / airport)");
            $table->timestamp("actual_time_arrival_to_dest")->nullable()->comment("Actual time arrived at destination harbour / airport");
            $table->string("export_notified_by", 100)->nullable()->comment("Notified to Export Departure by");
            $table->string("remarks", 150)->nullable()->comment("Comments/notes about inspections");
            $table->string("stage", 20)->default('checkedin')->index()->comment("checkedin/loading/checkedout");

            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            // FK
            $table->foreign("inspection_form_id")->references("id")->on("inspection_forms")->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign("checked_in_by")->references("id")->on("users")->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign("loading_start_by")->references("id")->on("users")->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign("loading_end_by")->references("id")->on("users")->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign("checked_out_by")->references("id")->on("users")->restrictOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspections');
    }
};
