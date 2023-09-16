import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { exhaustMap, map, take } from "rxjs/operators";
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer';

@Injectable()
export default class AuthInterceptorService implements HttpInterceptor{

    constructor(
        private authService: AuthService,
        private store: Store<fromApp.AppState>) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.store.select('auth').pipe(
            take(1),         // take asks for a number, which will be the data subcribe will fetch before automatically unsubscribing
            map(authState => {
                return authState.user;
            }),
            exhaustMap(user => {    // exhaustMap will replace outside return value with inside value
                
                if (!user) {
                    return next.handle(req);
                }
                const modifiedReq = req.clone({
                    params: new HttpParams().set('auth', user.token)})
                return next.handle(modifiedReq);
            })
        );        
    }
}