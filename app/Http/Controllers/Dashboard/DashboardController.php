<?php

declare(strict_types=1);

namespace App\Http\Controllers\Dashboard;

use App\Actions\Dashboard\GetDashboardStatsAction;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(GetDashboardStatsAction $action): Response
    {
        $stats = $action->handle();

        return Inertia::render('Dashboard/Index', $stats);
    }
}
