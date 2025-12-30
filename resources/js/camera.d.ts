/**
 * Camera Plugin for NativePHP Mobile - TypeScript Declarations
 */

export function BridgeCall(method: string, params?: Record<string, any>): Promise<any>;

export interface GalleryOptions {
    mediaType?: 'image' | 'video' | 'all';
    multiple?: boolean;
    maxItems?: number;
    id?: string | null;
    event?: string | null;
}

export class PendingGalleryPick implements PromiseLike<void> {
    constructor();
    images(): PendingGalleryPick;
    videos(): PendingGalleryPick;
    all(): PendingGalleryPick;
    multiple(enabled?: boolean): PendingGalleryPick;
    maxItems(max: number): PendingGalleryPick;
    id(id: string): PendingGalleryPick;
    event(event: string): PendingGalleryPick;
    getId(): string | null;
    then<TResult1 = void, TResult2 = never>(
        onfulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | null,
        onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
    ): PromiseLike<TResult1 | TResult2>;
}

export function Gallery(): PendingGalleryPick;
export function PickImage(options?: Omit<GalleryOptions, 'mediaType' | 'multiple' | 'maxItems'>): Promise<void>;
export function PickImages(options?: Omit<GalleryOptions, 'mediaType' | 'multiple'>): Promise<void>;
export function PickVideo(options?: Omit<GalleryOptions, 'mediaType' | 'multiple' | 'maxItems'>): Promise<void>;
export function PickVideos(options?: Omit<GalleryOptions, 'mediaType' | 'multiple'>): Promise<void>;
export function PickMedia(options?: Omit<GalleryOptions, 'mediaType'>): Promise<void>;

export class PendingPhotoCapture implements PromiseLike<void> {
    constructor();
    id(id: string): PendingPhotoCapture;
    event(event: string): PendingPhotoCapture;
    getId(): string | null;
    then<TResult1 = void, TResult2 = never>(
        onfulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | null,
        onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
    ): PromiseLike<TResult1 | TResult2>;
}

export class PendingVideoRecorder implements PromiseLike<void> {
    constructor();
    id(id: string): PendingVideoRecorder;
    event(event: string): PendingVideoRecorder;
    maxDuration(seconds: number): PendingVideoRecorder;
    getId(): string | null;
    then<TResult1 = void, TResult2 = never>(
        onfulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | null,
        onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
    ): PromiseLike<TResult1 | TResult2>;
}

export const Camera: {
    getPhoto(): PendingPhotoCapture;
    recordVideo(): PendingVideoRecorder;
    pickImages(): PendingGalleryPick;
};

export function On(eventName: string, callback: (payload: any, eventName: string) => void): void;
export function Off(eventName: string, callback: (payload: any, eventName: string) => void): void;

export const CameraEvents: {
    PhotoTaken: string;
    PhotoCancelled: string;
    VideoRecorded: string;
    VideoCancelled: string;
    MediaSelected: string;
};

export default Camera;
