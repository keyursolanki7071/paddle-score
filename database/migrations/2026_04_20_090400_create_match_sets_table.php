<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('match_sets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('match_id');
            $table->uuid('winner_id')->nullable();
            $table->foreign('match_id')->references('id')->on('tournament_matches')->onDelete('cascade');
            $table->foreign('winner_id')->references('id')->on('teams')->nullOnDelete();
            $table->unsignedInteger('set_number')->default(1);
            $table->unsignedInteger('team_a_score')->default(0);
            $table->unsignedInteger('team_b_score')->default(0);
            // For Padel: game score within a set (e.g. 3-2 games)
            $table->unsignedInteger('team_a_games')->default(0);
            $table->unsignedInteger('team_b_games')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('match_sets');
    }
};
