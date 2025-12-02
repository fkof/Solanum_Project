import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingServices {
    private showLoadingSubject = new BehaviorSubject<boolean>(false);
    public showLoading$: Observable<boolean> = this.showLoadingSubject.asObservable();
    setLogin(isShow: boolean) {
        this.showLoadingSubject.next(isShow);
    }
}