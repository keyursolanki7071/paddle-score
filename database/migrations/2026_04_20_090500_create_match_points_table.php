<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('match_points', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('match_id');
            $table->uuid('set_id');
            $table->uuid('scored_by_team_id');
            $table->uuid('server_team_id');
            $table->foreign('match_id')->references('id')->on('tournament_matches')->onDelete('cascade');
            $table->foreign('set_id')->references('id')->on('match_sets')->onDelete('cascade');
            $table->foreign('scored_by_team_id')->references('id')->on('teams')->onDelete('cascade');
            $table->foreign('server_team_id')->references('id')->on('teams')->onDelete('cascade');
            // Score snapshot after this point was recorded
            $table->unsignedInteger('team_a_score_after');
            $table->unsignedInteger('team_b_score_after');
            $table->boolean('is_undone')->default(false);
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('match_points');
    }
};
