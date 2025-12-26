<?php

namespace NativePHP\Camera\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Media selected from gallery event
 *
 * This event is dispatched from native code (Kotlin/Swift) via JavaScript injection,
 * directly triggering Livewire listeners with #[On('native:NativePHP\Camera\Events\MediaSelected')]
 */
class MediaSelected
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public bool $success,
        public array $files = [],
        public int $count = 0,
        public ?string $error = null,
        public bool $cancelled = false,
        public ?string $id = null
    ) {}
}
