<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tournaments', function (Blueprint $table) {
            $table->string('round_type')->default('single_elimination')->after('max_players');
            $table->unsignedInteger('sets_to_win')->default(1)->after('round_type'); // e.g. best of 3 = 2
            $table->unsignedInteger('points_to_win')->default(11)->after('sets_to_win'); // pickleball
            $table->boolean('win_by_two')->default(true)->after('points_to_win');
            $table->unsignedInteger('games_to_win_set')->default(6)->after('win_by_two'); // padel
        });
    }

    public function down(): void
    {
        Schema::table('tournaments', function (Blueprint $table) {
            $table->dropColumn(['round_type', 'sets_to_win', 'points_to_win', 'win_by_two', 'games_to_win_set']);
        });
    }
};
