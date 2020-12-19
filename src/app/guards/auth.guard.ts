import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private usuarioService:UsuarioService, private router:Router){ }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) {
    console.log('paso por el guardian');
   return this.usuarioService.validarToken().pipe(
     tap(isAuth=>{
       console.log(isAuth);
       
       if(!isAuth){
        this.router.navigateByUrl('/login');
       }
     })
   )
   //return true;
  }
  
}
