<?php

namespace NativePHP\Camera;

use Illuminate\Support\ServiceProvider;

class CameraServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(Camera::class, function () {
            return new Camera;
        });
    }

    public function boot(): void
    {
        //
    }
}