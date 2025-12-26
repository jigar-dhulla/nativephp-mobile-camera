<?php

beforeEach(function () {
    $this->pluginPath = dirname(__DIR__);
    $this->manifestPath = $this->pluginPath.'/nativephp.json';
});

describe('Plugin Manifest', function () {
    it('has a valid nativephp.json file', function () {
        expect(file_exists($this->manifestPath))->toBeTrue();

        $content = file_get_contents($this->manifestPath);
        $manifest = json_decode($content, true);

        expect(json_last_error())->toBe(JSON_ERROR_NONE);
    });

    it('has required fields', function () {
        $manifest = json_decode(file_get_contents($this->manifestPath), true);

        expect($manifest)->toHaveKeys(['namespace', 'bridge_functions']);
    });

    it('has valid bridge functions', function () {
        $manifest = json_decode(file_get_contents($this->manifestPath), true);

        expect($manifest['bridge_functions'])->toBeArray();

        foreach ($manifest['bridge_functions'] as $function) {
            expect($function)->toHaveKeys(['name']);
            expect($function)->toHaveAnyKeys(['android', 'ios']);
        }
    });

    it('has Camera.GetPhoto bridge function', function () {
        $manifest = json_decode(file_get_contents($this->manifestPath), true);

        $names = array_column($manifest['bridge_functions'], 'name');
        expect($names)->toContain('Camera.GetPhoto');
    });

    it('has Camera.RecordVideo bridge function', function () {
        $manifest = json_decode(file_get_contents($this->manifestPath), true);

        $names = array_column($manifest['bridge_functions'], 'name');
        expect($names)->toContain('Camera.RecordVideo');
    });

    it('has Camera.PickMedia bridge function', function () {
        $manifest = json_decode(file_get_contents($this->manifestPath), true);

        $names = array_column($manifest['bridge_functions'], 'name');
        expect($names)->toContain('Camera.PickMedia');
    });
});

describe('Native Code', function () {
    it('has Android Kotlin files', function () {
        $kotlinFiles = [
            '/resources/android/CameraFunctions.kt',
            '/resources/android/GalleryFunctions.kt',
            '/resources/android/CameraCoordinator.kt',
            '/resources/android/CameraForegroundService.kt',
        ];

        foreach ($kotlinFiles as $file) {
            expect(file_exists($this->pluginPath.$file))->toBeTrue("Missing: $file");
        }
    });

    it('has iOS Swift file', function () {
        $swiftFile = $this->pluginPath.'/resources/ios/CameraFunctions.swift';
        expect(file_exists($swiftFile))->toBeTrue();
    });
});

describe('PHP Classes', function () {
    it('has service provider', function () {
        $file = $this->pluginPath.'/src/CameraServiceProvider.php';
        expect(file_exists($file))->toBeTrue();
    });

    it('has facade', function () {
        $file = $this->pluginPath.'/src/Facades/Camera.php';
        expect(file_exists($file))->toBeTrue();
    });

    it('has main implementation class', function () {
        $file = $this->pluginPath.'/src/Camera.php';
        expect(file_exists($file))->toBeTrue();
    });

    it('has pending classes', function () {
        $files = [
            '/src/PendingPhotoCapture.php',
            '/src/PendingVideoRecorder.php',
            '/src/PendingMediaPicker.php',
        ];

        foreach ($files as $file) {
            expect(file_exists($this->pluginPath.$file))->toBeTrue("Missing: $file");
        }
    });

    it('has event classes', function () {
        $files = [
            '/src/Events/PhotoTaken.php',
            '/src/Events/PhotoCancelled.php',
            '/src/Events/VideoRecorded.php',
            '/src/Events/VideoCancelled.php',
            '/src/Events/MediaSelected.php',
        ];

        foreach ($files as $file) {
            expect(file_exists($this->pluginPath.$file))->toBeTrue("Missing: $file");
        }
    });
});

describe('Composer Configuration', function () {
    it('has valid composer.json', function () {
        $composerPath = $this->pluginPath.'/composer.json';
        expect(file_exists($composerPath))->toBeTrue();

        $content = file_get_contents($composerPath);
        $composer = json_decode($content, true);

        expect(json_last_error())->toBe(JSON_ERROR_NONE);
        expect($composer['type'])->toBe('nativephp-plugin');
    });
});