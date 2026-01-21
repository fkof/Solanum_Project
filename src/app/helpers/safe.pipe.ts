

// src/app/safe.pipe.ts
import { Pipe } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
    name: 'safe'
})
export class SafePipe {
    constructor(private sanitizer: DomSanitizer) { }

    transform(url: string): SafeResourceUrl {
        // Note: Use this method only if you are confident the URL is safe.
        // Untrusted user data can expose your application to XSS risks.
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
