import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css'
  ]
})
export class LoginComponent implements OnInit {
  public formSubmitted = false;
  public auth2;

  public loginForm = this.formBuilder.group(
    {
    email: [
      localStorage.getItem('email') || '',
      [Validators.required, Validators.email],
    ],
    password: ['', Validators.required],
    remember: [false],
  });  

  constructor(private router: Router, private formBuilder: FormBuilder, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.renderButton();
  }

  login() {
 
    
    this.formSubmitted = true;
    this.usuarioService.login(this.loginForm.value).subscribe((resp: any) => {
      console.log(resp.status);
      if (resp.status) {
       
        
        if (this.loginForm.get('remember').value) {
          localStorage.setItem('email', this.loginForm.get('email').value);
        } else {
          localStorage.removeItem('email');
        }
        Swal.fire({
          title: 'Exito!',
          text: resp.message,
          icon: 'success',
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.setItem('email', this.loginForm.get('email').value);
            this.router.navigateByUrl('/');
          }
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Contraseña o usuario incorrecto',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      }
    });
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });
    this.startApp();
  }
  startApp () {
    gapi.load('auth2', () => {
     //Retrieve the singleton for the GoogleAuth library and set up the client.
      this.auth2 = gapi.auth2.init({
        client_id: '805357656432-c1kkslq5om77m28cbdbstjs6v5er1qds.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
      });
      this.attachSignin(document.getElementById('my-signin2'));
    });
  };

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
        (googleUser) => {
          const id_token=googleUser.getAuthResponse().id_token;
          const email = googleUser.getBasicProfile().du;
          console.log(id_token);
          this.usuarioService.loginGoogle(id_token).subscribe((resp) => {
          //
          
            
            
            if (resp.status) {
              //console.log(resp.data);
              localStorage.setItem('token',resp.data);
              localStorage.setItem('email', email);
             this.router.navigateByUrl('/');
            } else {
            }
          });
        }, 
        (error) => {
          alert(JSON.stringify(error, undefined, 2));
        }
        );
  }

  resetPassword(){
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2', '3']
    }).queue([
      {
        title: 'Email',
        text: 'Ingresa tu correo'
      },
      {
        title: 'Password',
        text: 'Ingresa la nueva password'
      },{
        title: 'Confirma tu password',
        text: 'Ingresa tu password de nuevo'
      }
          ]).then((result:any) => {
      if (result.value) {
        const answers = JSON.stringify(result.value)
        Swal.fire({
          title: 'Listo! Password restablecida',
          html: `
            Your answers:
            <pre><code>${answers}</code></pre>
          `,
          confirmButtonText: 'Aceptar'
        })
      }
    })
  }

}
