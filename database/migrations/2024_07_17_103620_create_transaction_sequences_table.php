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
        Schema::create('transaction_sequences', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('site_id')->index();
            $table->tinyInteger('year');
            $table->tinyInteger('month');
            $table->uuid('transaction_type_id')->index();
            $table->integer('next_no')->default(1);
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            // indexes
            $table->unique(['site_id', 'year', 'month', 'transaction_type_id']);

            // FK
            $table->foreign('transaction_type_id')->references('id')->on('transaction_types')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign('site_id')->references('id')->on('sites')->restrictOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_sequences');
    }
};
