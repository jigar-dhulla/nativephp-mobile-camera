/**
 * Camera Plugin for NativePHP Mobile
 *
 * @example Taking Photos
 * import { Camera } from '@nativephp/camera';
 *
 * // Take a photo
 * await Camera.getPhoto().id('profile-pic');
 *
 * @example Recording Video
 * import { Camera } from '@nativephp/camera';
 *
 * // Record a video with max duration
 * await Camera.recordVideo().maxDuration(60).id('clip');
 *
 * @example Gallery Picker
 * import { Camera, Gallery, PickImage, PickImages } from '@nativephp/camera';
 *
 * // Pick single image
 * await PickImage();
 *
 * // Pick multiple images with fluent API
 * await Gallery().images().multiple().maxItems(5);
 *
 * @example Event Listening
 * import { On } from '@nativephp/mobile';
 * import { Events } from '@nativephp/camera';
 *
 * On(Events.PhotoTaken, (event) => {
 *   console.log('Photo path:', event.path);
 * });
 */

const baseUrl = '/_native/api/call';

export async function BridgeCall(method, params = {}) {
    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
        },
        body: JSON.stringify({ method, params })
    });

    const result = await response.json();

    if (result.status === 'error') {
        throw new Error(result.message || 'Native call failed');
    }

    return result.data;
}

// ============================================================================
// Gallery Functions
// ============================================================================

/**
 * PendingGalleryPick - Fluent builder for picking media from device gallery
 */
class PendingGalleryPick {
    constructor() {
        this._mediaType = 'all';
        this._multiple = false;
        this._maxItems = 10;
        this._id = null;
        this._event = null;
        this._started = false;
    }

    /**
     * Pick only images
     * @returns {PendingGalleryPick}
     */
    images() {
        this._mediaType = 'image';
        return this;
    }

    /**
     * Pick only videos
     * @returns {PendingGalleryPick}
     */
    videos() {
        this._mediaType = 'video';
        return this;
    }

    /**
     * Pick any media type (images and videos)
     * @returns {PendingGalleryPick}
     */
    all() {
        this._mediaType = 'all';
        return this;
    }

    /**
     * Allow multiple selection
     * @param {boolean} enabled - Enable multiple selection (default: true)
     * @returns {PendingGalleryPick}
     */
    multiple(enabled = true) {
        this._multiple = enabled;
        return this;
    }

    /**
     * Set maximum number of items when multiple selection is enabled
     * @param {number} max - Maximum items (default: 10)
     * @returns {PendingGalleryPick}
     */
    maxItems(max) {
        this._maxItems = max;
        return this;
    }

    /**
     * Set a unique identifier for this gallery pick
     * @param {string} id - Session ID
     * @returns {PendingGalleryPick}
     */
    id(id) {
        this._id = id;
        return this;
    }

    /**
     * Set a custom event class name to fire
     * @param {string} event - Event class name
     * @returns {PendingGalleryPick}
     */
    event(event) {
        this._event = event;
        return this;
    }

    /**
     * Get the gallery pick session ID
     * @returns {string|null}
     */
    getId() {
        return this._id;
    }

    /**
     * Make this builder thenable so it can be awaited directly
     * @param {Function} resolve - Promise resolve function
     * @param {Function} reject - Promise reject function
     * @returns {Promise<void>}
     */
    then(resolve, reject) {
        if (this._started) {
            return resolve();
        }

        this._started = true;

        const params = {
            mediaType: this._mediaType,
            multiple: this._multiple,
            maxItems: this._maxItems
        };

        if (this._id) params.id = this._id;
        if (this._event) params.event = this._event;

        return BridgeCall('Camera.PickMedia', params).then(resolve, reject);
    }
}

/**
 * Create a new gallery picker instance
 * @returns {PendingGalleryPick}
 */
export function Gallery() {
    return new PendingGalleryPick();
}

/**
 * Pick a single image from gallery
 * @param {object} options - Gallery options (id, event)
 * @returns {Promise<void>}
 */
export async function PickImage(options = {}) {
    return BridgeCall('Camera.PickMedia', {
        mediaType: 'image',
        multiple: false,
        maxItems: 1,
        ...options
    });
}

/**
 * Pick multiple images from gallery
 * @param {object} options - Gallery options (maxItems, id, event)
 * @returns {Promise<void>}
 */
export async function PickImages(options = {}) {
    return BridgeCall('Camera.PickMedia', {
        mediaType: 'image',
        multiple: true,
        maxItems: options.maxItems || 10,
        ...options
    });
}

/**
 * Pick a single video from gallery
 * @param {object} options - Gallery options (id, event)
 * @returns {Promise<void>}
 */
export async function PickVideo(options = {}) {
    return BridgeCall('Camera.PickMedia', {
        mediaType: 'video',
        multiple: false,
        maxItems: 1,
        ...options
    });
}

/**
 * Pick multiple videos from gallery
 * @param {object} options - Gallery options (maxItems, id, event)
 * @returns {Promise<void>}
 */
export async function PickVideos(options = {}) {
    return BridgeCall('Camera.PickMedia', {
        mediaType: 'video',
        multiple: true,
        maxItems: options.maxItems || 10,
        ...options
    });
}

/**
 * Pick any media (images or videos) from gallery
 * @param {object} options - Gallery options (multiple, maxItems, id, event)
 * @returns {Promise<void>}
 */
export async function PickMedia(options = {}) {
    return BridgeCall('Camera.PickMedia', {
        mediaType: 'all',
        multiple: options.multiple || false,
        maxItems: options.maxItems || 10,
        ...options
    });
}

export { PendingGalleryPick };

// ============================================================================
// Camera Functions
// ============================================================================

/**
 * PendingPhotoCapture - Fluent builder for capturing photos
 */
class PendingPhotoCapture {
    constructor() {
        this._id = null;
        this._event = null;
        this._started = false;
    }

    /**
     * Set a unique identifier for this photo capture
     * @param {string} id - Operation ID
     * @returns {PendingPhotoCapture}
     */
    id(id) {
        this._id = id;
        return this;
    }

    /**
     * Set a custom event class name to fire
     * @param {string} event - Event class name
     * @returns {PendingPhotoCapture}
     */
    event(event) {
        this._event = event;
        return this;
    }

    /**
     * Get the operation ID
     * @returns {string|null}
     */
    getId() {
        return this._id;
    }

    /**
     * Make this builder thenable so it can be awaited directly
     * @param {Function} resolve - Promise resolve function
     * @param {Function} reject - Promise reject function
     * @returns {Promise<void>}
     */
    then(resolve, reject) {
        if (this._started) {
            return resolve();
        }

        this._started = true;

        const params = {};
        if (this._id) params.id = this._id;
        if (this._event) params.event = this._event;

        return BridgeCall('Camera.GetPhoto', params).then(resolve, reject);
    }
}

/**
 * PendingVideoRecorder - Fluent builder for recording videos
 */
class PendingVideoRecorder {
    constructor() {
        this._id = null;
        this._event = null;
        this._maxDuration = null;
        this._started = false;
    }

    /**
     * Set a unique identifier for this video recording
     * @param {string} id - Operation ID
     * @returns {PendingVideoRecorder}
     */
    id(id) {
        this._id = id;
        return this;
    }

    /**
     * Set a custom event class name to fire
     * @param {string} event - Event class name
     * @returns {PendingVideoRecorder}
     */
    event(event) {
        this._event = event;
        return this;
    }

    /**
     * Set maximum recording duration
     * @param {number} seconds - Maximum duration in seconds
     * @returns {PendingVideoRecorder}
     */
    maxDuration(seconds) {
        this._maxDuration = seconds;
        return this;
    }

    /**
     * Get the operation ID
     * @returns {string|null}
     */
    getId() {
        return this._id;
    }

    /**
     * Make this builder thenable so it can be awaited directly
     * @param {Function} resolve - Promise resolve function
     * @param {Function} reject - Promise reject function
     * @returns {Promise<void>}
     */
    then(resolve, reject) {
        if (this._started) {
            return resolve();
        }

        this._started = true;

        const params = {};
        if (this._id) params.id = this._id;
        if (this._event) params.event = this._event;
        if (this._maxDuration) params.maxDuration = this._maxDuration;

        return BridgeCall('Camera.RecordVideo', params).then(resolve, reject);
    }
}

/**
 * Capture a photo using the device camera
 * @returns {PendingPhotoCapture}
 */
function getPhotoFunction() {
    return new PendingPhotoCapture();
}

/**
 * Record a video using the device camera
 * @returns {PendingVideoRecorder}
 */
function recordVideoFunction() {
    return new PendingVideoRecorder();
}

/**
 * Pick media from the device gallery
 * @returns {PendingGalleryPick}
 */
function pickImagesFunction() {
    return new PendingGalleryPick();
}

export const Camera = {
    getPhoto: getPhotoFunction,
    recordVideo: recordVideoFunction,
    pickImages: pickImagesFunction
};

export { PendingPhotoCapture, PendingVideoRecorder };

// ============================================================================
// Native Event Constants
// ============================================================================

/**
 * Native event class name constants for type-safe event listening
 * Usage: import { Events } from '@nativephp/camera';
 *        import { On } from '@nativephp/mobile';
 *        On(Events.PhotoTaken, (event) => { ... });
 */
export const Events = {
    PhotoTaken: 'NativePHP\\Camera\\Events\\PhotoTaken',
    PhotoCancelled: 'NativePHP\\Camera\\Events\\PhotoCancelled',
    VideoRecorded: 'NativePHP\\Camera\\Events\\VideoRecorded',
    VideoCancelled: 'NativePHP\\Camera\\Events\\VideoCancelled',
    MediaSelected: 'NativePHP\\Camera\\Events\\MediaSelected',
};

export default Camera;
