<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('players', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            $table->string('name');
            $table->string('rank')->default('bronze'); // bronze, silver, gold, diamond
            $table->timestamps();
        });

        Schema::create('team_player', function (Blueprint $table) {
            $table->uuid('team_id');
            $table->uuid('player_id');
            $table->foreign('team_id')->references('id')->on('teams')->onDelete('cascade');
            $table->foreign('player_id')->references('id')->on('players')->onDelete('cascade');
            $table->primary(['team_id', 'player_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_player');
        Schema::dropIfExists('players');
    }
};
