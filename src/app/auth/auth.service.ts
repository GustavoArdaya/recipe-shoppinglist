import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

interface AuthResponseData {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string
}

@Injectable({providedIn: 'root'})
export class AuthService {
    
    constructor(private http : HttpClient) {}
    
    signup(newEmail: string, newPassword: string) {
        return this.http
            .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCugxDlD9GWEFsI03rsuNDk1uFDL6hr8S4',
            {
                email: newEmail,
                password: newPassword,
                returnSecureToken: true
            })
    }
}