<?php

namespace NativePHP\Camera\Facades;

use Illuminate\Support\Facades\Facade;
use NativePHP\Camera\PendingMediaPicker;
use NativePHP\Camera\PendingPhotoCapture;
use NativePHP\Camera\PendingVideoRecorder;

/**
 * @method static PendingPhotoCapture getPhoto(array $options = [])
 * @method static PendingMediaPicker pickImages(string $media_type = 'all', bool $multiple = false, int $max_items = 10)
 * @method static PendingVideoRecorder recordVideo(array $options = [])
 *
 * @see \NativePHP\Camera\Camera
 */
class Camera extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \NativePHP\Camera\Camera::class;
    }
}