import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {

  registerForm: FormGroup;
  serverError: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Validación de correo electrónico
      password: ['', [Validators.required, Validators.minLength(6)]], // Contraseña mínima de 6 caracteres
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.serverError = null; // Limpia errores previos
      this.http
        .post<{ message: string }>(
          'http://localhost:3000/api/register',
          this.registerForm.value
        )
        .subscribe({
          next: (response: { message: string }) => {
            alert(response.message); // Mensaje exitoso del servidor
            this.registerForm.reset();
          },
          error: (err: { error: { message: string } }) => {
            this.serverError =
              err.error.message || 'Ocurrió un error. Inténtalo nuevamente.';
          },
        });
    } else {
      this.serverError = 'Por favor, complete el formulario correctamente.';
    }
  }
}

