# Camera Plugin for NativePHP Mobile

Camera plugin for NativePHP Mobile (Photo capture, Video recording, Gallery picker).

## Installation

```bash
# Install the package
composer require nativephp/camera

# Publish the plugins provider (first time only)
php artisan vendor:publish --tag=nativephp-plugins-provider

# Register the plugin
php artisan native:plugin:register nativephp/camera

# Verify registration
php artisan native:plugin:list
```

## Usage

### PHP (Livewire/Blade)

```php
use NativePHP\Camera\Facades\Camera;

// Capture a photo
Camera::getPhoto()->start();

// Record a video
Camera::recordVideo()->maxDuration(30)->start();

// Pick images from gallery
Camera::pickImages('image', true, 5)->start();
```

### With Event Correlation

```php
// Capture with ID for event correlation
$capture = Camera::getPhoto()->id('my-photo');
$id = $capture->getId(); // Store for later comparison
$capture->start();

// In event handler
#[OnNative(PhotoTaken::class)]
public function handlePhoto($path, $mimeType, $id)
{
    if ($id === session('expected_photo_id')) {
        // Handle this specific photo
    }
}
```

## Events

- `NativePHP\Camera\Events\PhotoTaken` - Photo captured successfully
- `NativePHP\Camera\Events\PhotoCancelled` - Photo capture cancelled
- `NativePHP\Camera\Events\VideoRecorded` - Video recorded successfully
- `NativePHP\Camera\Events\VideoCancelled` - Video recording cancelled
- `NativePHP\Camera\Events\MediaSelected` - Media selected from gallery

## Listening for Events

```php
use Livewire\Attributes\On;
use NativePHP\Camera\Events\PhotoTaken;

#[On('native:NativePHP\Camera\Events\PhotoTaken')]
public function handlePhotoTaken($path, $mimeType, $id = null)
{
    // Handle the photo
}
```

## License

MIT