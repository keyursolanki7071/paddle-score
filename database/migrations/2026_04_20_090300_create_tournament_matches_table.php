<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tournament_matches', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tournament_id');
            $table->uuid('team_a_id');
            $table->uuid('team_b_id');
            $table->uuid('server_team_id')->nullable(); // who serves first
            $table->uuid('winner_id')->nullable();
            $table->string('status')->default('scheduled'); // scheduled, live, completed, abandoned
            $table->unsignedInteger('round')->default(1); // 1=QF, 2=SF, 3=Final
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();

            $table->foreign('tournament_id')->references('id')->on('tournaments')->onDelete('cascade');
            $table->foreign('team_a_id')->references('id')->on('teams')->onDelete('cascade');
            $table->foreign('team_b_id')->references('id')->on('teams')->onDelete('cascade');
            $table->foreign('server_team_id')->references('id')->on('teams')->nullOnDelete();
            $table->foreign('winner_id')->references('id')->on('teams')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tournament_matches');
    }
};
