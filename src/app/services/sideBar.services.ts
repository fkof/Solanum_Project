import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SideBarService {
    private isCollapsedSubject = new BehaviorSubject<boolean>(false);
    //public isCollapsed$: Observable<boolean> = this.isCollapsedSubject.asObservable();
    
    isCollapsed$ = this.isCollapsedSubject.asObservable();
    isCollapsed(isCollapsed: boolean) {
        
        this.isCollapsedSubject.next(isCollapsed);
    }
}