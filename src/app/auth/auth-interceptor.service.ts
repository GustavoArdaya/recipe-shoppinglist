import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { exhaustMap, take } from "rxjs/operators";

@Injectable()
export default class AuthInterceptorService implements HttpInterceptor{

    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.authService.user.pipe(
            take(1),         // take asks for a number, which will be the data subcribe will fetch before automatically unsubscribing
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