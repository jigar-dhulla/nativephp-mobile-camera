## nativephp/camera

Camera plugin for NativePHP Mobile providing photo capture, video recording, and gallery picker functionality.

### Installation

```bash
composer require nativephp/camera
php artisan native:plugin:register nativephp/camera
```

### PHP Usage (Livewire/Blade)

Use the `Camera` facade:

@verbatim
<code-snippet name="Taking Photos" lang="php">
use Native\Mobile\Facades\Camera;

// Take a photo
Camera::getPhoto();

// With custom ID for tracking
Camera::getPhoto()->id('profile-photo')->remember();

// With custom event class
Camera::getPhoto()->event(MyPhotoEvent::class);
</code-snippet>
@endverbatim

@verbatim
<code-snippet name="Recording Videos" lang="php">
use Native\Mobile\Facades\Camera;

// Basic video recording
Camera::recordVideo();

// With maximum duration (30 seconds)
Camera::recordVideo(['maxDuration' => 30]);

// Using fluent API
Camera::recordVideo()
    ->maxDuration(60)
    ->id('my-video-123')
    ->start();
</code-snippet>
@endverbatim

@verbatim
<code-snippet name="Picking Media from Gallery" lang="php">
use Native\Mobile\Facades\Camera;

// Pick a single image
Camera::pickImages('images', false);

// Pick multiple images
Camera::pickImages('images', true);

// Pick any media type (images or videos)
Camera::pickImages('all', true);
</code-snippet>
@endverbatim

### Handling Camera Events

@verbatim
<code-snippet name="Listening for Photo Events" lang="php">
use Native\Mobile\Attributes\OnNative;
use Native\Mobile\Events\Camera\PhotoTaken;

#[OnNative(PhotoTaken::class)]
public function handlePhotoTaken(string $path)
{
    // Process the captured photo
    $this->processPhoto($path);
}
</code-snippet>
@endverbatim

@verbatim
<code-snippet name="Listening for Video Events" lang="php">
use Native\Mobile\Attributes\OnNative;
use Native\Mobile\Events\Camera\VideoRecorded;
use Native\Mobile\Events\Camera\VideoCancelled;

#[OnNative(VideoRecorded::class)]
public function handleVideoRecorded(string $path, string $mimeType, ?string $id = null)
{
    // Process the recorded video
    $this->processVideo($path);
}

#[OnNative(VideoCancelled::class)]
public function handleVideoCancelled(bool $cancelled, ?string $id = null)
{
    // Handle cancellation
}
</code-snippet>
@endverbatim

@verbatim
<code-snippet name="Listening for Gallery Events" lang="php">
use Native\Mobile\Attributes\OnNative;
use Native\Mobile\Events\Gallery\MediaSelected;

#[OnNative(MediaSelected::class)]
public function handleMediaSelected($success, $files, $count)
{
    foreach ($files as $file) {
        // Process each selected media item
        $this->processMedia($file);
    }
}
</code-snippet>
@endverbatim

### Available Methods

#### Camera Facade

- `Camera::getPhoto(array $options = [])` - Returns PendingPhotoCapture
- `Camera::recordVideo(array $options = [])` - Returns PendingVideoRecorder
- `Camera::pickImages(string $mediaType = 'all', bool $multiple = false, int $maxItems = 10)` - Returns PendingMediaPicker

#### PendingPhotoCapture Methods

- `->id(string $id)` - Set unique identifier
- `->event(string $class)` - Set custom event class
- `->remember()` - Flash ID to session

#### PendingVideoRecorder Methods

- `->maxDuration(int $seconds)` - Set max recording duration
- `->id(string $id)` - Set unique identifier
- `->event(string $class)` - Set custom event class
- `->remember()` - Flash ID to session
- `->start()` - Explicitly start recording

#### PendingMediaPicker Methods

- `->images()` - Only allow image selection
- `->videos()` - Only allow video selection
- `->all()` - Allow both images and videos
- `->multiple(bool $multiple = true, int $maxItems = 10)` - Allow multiple selection
- `->single()` - Only allow single selection
- `->id(string $id)` - Set unique identifier
- `->event(string $class)` - Set custom event class

### Events

- `Native\Mobile\Events\Camera\PhotoTaken` - Photo captured successfully
- `Native\Mobile\Events\Camera\PhotoCancelled` - Photo capture cancelled
- `Native\Mobile\Events\Camera\VideoRecorded` - Video recorded successfully
- `Native\Mobile\Events\Camera\VideoCancelled` - Video recording cancelled
- `Native\Mobile\Events\Gallery\MediaSelected` - Media selected from gallery
- `Native\Mobile\Events\Camera\PermissionDenied` - Camera permission denied

### Storage Locations

- **Photos (Android):** `{cache}/captured.jpg`
- **Photos (iOS):** `~/Library/Application Support/Photos/captured.jpg`
- **Videos (Android):** `{cache}/video_{timestamp}.mp4`
- **Videos (iOS):** `~/Library/Application Support/Videos/captured_video_{timestamp}.mp4`

### Platform Details

- **iOS**: Uses AVFoundation and PHPickerViewController
- **Android**: Uses CameraX and Photo Picker APIs
- Requires `camera` permission in `config/nativephp.php`
