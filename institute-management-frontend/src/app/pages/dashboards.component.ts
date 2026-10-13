import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ApiService } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { Student, Trainer } from '../core/models';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="dashboard-head">
      <div>
        <span class="eyebrow">STUDENT PORTAL</span>
        <h1>My Profile</h1>
        <p class="muted">Welcome back. Here are your registered details.</p>
      </div>
      <button class="button secondary" type="button" (click)="auth.logout()">Logout</button>
    </section>

    <p class="error" *ngIf="error">
      {{ error }} <a routerLink="/login/student">Login again</a>
    </p>

    <section class="profile-card" *ngIf="student as s">
      <div class="avatar">{{ (s.name || '?').charAt(0).toUpperCase() }}</div>
      <h2>{{ s.name }}</h2>
      <p class="muted">Student ID: {{ s.id }}</p>
      <div class="details">
        <div><span>Email</span><strong>{{ s.email }}</strong></div>
        <div><span>City</span><strong>{{ s.city }}</strong></div>
        <div><span>Course</span><strong>{{ s.courseName }}</strong></div>
        <div><span>Trainer</span><strong>{{ s.trainerName || 'Not assigned' }}</strong></div>
      </div>
    </section>
  `
})
export class StudentDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  auth = inject(AuthService);
  student?: Student;
  error = '';

  ngOnInit(): void {
    this.api.studentMe().subscribe({
      next: data => {
        this.student = data;
        this.cdr.markForCheck();
      },
      error: (e: Error) => {
        this.error = e.message;
        this.cdr.markForCheck();
      }
    });
  }
}

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="dashboard-head">
      <div>
        <span class="eyebrow">TRAINER PORTAL</span>
        <h1>My Trainer Profile</h1>
        <p class="muted">Manage your course and view your students.</p>
      </div>
      <button class="button secondary" type="button" (click)="auth.logout()">Logout</button>
    </section>

    <p class="error" *ngIf="error">
      {{ error }} <a routerLink="/login/trainer">Login again</a>
    </p>

    <section class="profile-card" *ngIf="trainer as t">
      <div class="avatar">{{ (t.name || '?').charAt(0).toUpperCase() }}</div>
      <h2>{{ t.name }}</h2>
      <p class="muted">Employee No: {{ t.employeeNumber }}</p>
      <div class="details">
        <div><span>Email</span><strong>{{ t.email }}</strong></div>
        <div><span>Class / Batch</span><strong>{{ t.className }}</strong></div>
        <div><span>Course</span><strong>{{ t.courseName }}</strong></div>
        <div><span>Experience</span><strong>{{ t.experience }} years</strong></div>
      </div>
      <a class="button" routerLink="/trainer/students">View My Students</a>
    </section>
  `
})
export class TrainerDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  auth = inject(AuthService);
  trainer?: Trainer;
  error = '';

  ngOnInit(): void {
    this.api.trainerMe().subscribe({
      next: data => {
        this.trainer = data;
        this.cdr.markForCheck();
      },
      error: (e: Error) => {
        this.error = e.message;
        this.cdr.markForCheck();
      }
    });
  }
}

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="dashboard-head">
      <div>
        <a routerLink="/trainer" class="back">← Trainer dashboard</a>
        <h1>Students in My Course</h1>
      </div>
      <button class="button secondary" type="button" (click)="auth.logout()">Logout</button>
    </section>

    <p class="error" *ngIf="error">{{ error }}</p>

    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th><th>City</th><th>Course</th></tr>
        </thead>
        <tbody>
          @for (s of students; track s.id) {
            <tr>
              <td>{{ s.id }}</td><td>{{ s.name }}</td><td>{{ s.email }}</td>
              <td>{{ s.city }}</td><td>{{ s.courseName }}</td>
            </tr>
          }
        </tbody>
      </table>
      <p class="empty" *ngIf="students.length === 0 && !error">No students assigned yet.</p>
    </div>
  `
})
export class TrainerStudentsComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  auth = inject(AuthService);
  students: Student[] = [];
  error = '';

  ngOnInit(): void {
    this.api.myStudents().subscribe({
      next: data => {
        this.students = Array.isArray(data) ? data : [];
        this.cdr.markForCheck();
      },
      error: (e: Error) => {
        this.error = e.message;
        this.cdr.markForCheck();
      }
    });
  }
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="dashboard-head">
      <div>
        <span class="eyebrow">ADMINISTRATION</span>
        <h1>Admin Dashboard</h1>
        <p class="muted">View, edit, and remove student or trainer records.</p>
      </div>
      <button class="button secondary" type="button" (click)="auth.logout()">Logout</button>
    </section>

    <p class="error" *ngIf="error">{{ error }}</p>
    <p class="success" *ngIf="message">{{ message }}</p>

    <section class="admin-section">
      <h2>Students <span class="count">{{ students.length }}</span></h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>City</th>
              <th>Course</th><th>Trainer</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (s of students; track s.id) {
              <tr style="display: table-row; color: #172033; background: #ffffff;">
                <td style="color: #172033; background: #ffffff;">{{ s.id }}</td>
                <td style="color: #172033; background: #ffffff;">{{ s.name }}</td>
                <td style="color: #172033; background: #ffffff;">{{ s.email }}</td>
                <td style="color: #172033; background: #ffffff;">{{ s.city }}</td>
                <td style="color: #172033; background: #ffffff;">{{ s.courseName }}</td>
                <td style="color: #172033; background: #ffffff;">{{ s.trainerName || 'Not assigned' }}</td>
                <td class="actions" style="color: #172033; background: #ffffff;">
                  <button class="mini" type="button" (click)="editStudent(s)">Edit</button>
                  <button class="mini danger" type="button" (click)="deleteStudent(s)">Delete</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
        <p class="empty" *ngIf="students.length === 0">No students yet.</p>
      </div>
    </section>

    <section class="admin-section">
      <h2>Trainers <span class="count">{{ trainers.length }}</span></h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Course</th>
              <th>Class</th><th>Employee No.</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (t of trainers; track t.id) {
              <tr style="display: table-row; color: #172033; background: #ffffff;">
                <td style="color: #172033; background: #ffffff;">{{ t.id }}</td>
                <td style="color: #172033; background: #ffffff;">{{ t.name }}</td>
                <td style="color: #172033; background: #ffffff;">{{ t.email }}</td>
                <td style="color: #172033; background: #ffffff;">{{ t.courseName }}</td>
                <td style="color: #172033; background: #ffffff;">{{ t.className }}</td>
                <td style="color: #172033; background: #ffffff;">{{ t.employeeNumber }}</td>
                <td class="actions" style="color: #172033; background: #ffffff;">
                  <button class="mini" type="button" (click)="editTrainer(t)">Edit</button>
                  <button class="mini danger" type="button" (click)="deleteTrainer(t)">Delete</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
        <p class="empty" *ngIf="trainers.length === 0">No trainers yet.</p>
      </div>
    </section>

    <div class="modal-backdrop" *ngIf="editingStudent || editingTrainer">
      <section class="form-card modal">
        <button class="close" type="button" (click)="cancelEdit()">×</button>
        <h2>Edit {{ editingStudent ? 'Student' : 'Trainer' }}</h2>

        <form *ngIf="editingStudent" (ngSubmit)="saveStudent()" class="form-grid">
          <label>Name<input name="sname" [(ngModel)]="studentForm.name" required></label>
          <label>City<input name="scity" [(ngModel)]="studentForm.city" required></label>
          <label>Email<input name="semail" type="email" [(ngModel)]="studentForm.email" required></label>
          <label>Course<input name="scourse" [(ngModel)]="studentForm.courseName" required></label>
          <label>Trainer ID<input name="strainer" type="number" [(ngModel)]="studentForm.trainerId" required></label>
          <label>New password (optional)<input name="spassword" type="password" [(ngModel)]="studentForm.password"></label>
          <button class="button span-all" type="submit">Save Student</button>
        </form>

        <form *ngIf="editingTrainer" (ngSubmit)="saveTrainer()" class="form-grid">
          <label>Name<input name="tname" [(ngModel)]="trainerForm.name" required></label>
          <label>Class / Batch<input name="tclass" [(ngModel)]="trainerForm.className" required></label>
          <label>Course<input name="tcourse" [(ngModel)]="trainerForm.courseName" required></label>
          <label>Experience<input name="texp" type="number" min="0" [(ngModel)]="trainerForm.experience" required></label>
          <label>Email<input name="temail" type="email" [(ngModel)]="trainerForm.email" required></label>
          <label>Employee number<input name="temp" [(ngModel)]="trainerForm.employeeNumber" required></label>
          <label class="span-all">New password (optional)<input name="tpassword" type="password" [(ngModel)]="trainerForm.password"></label>
          <button class="button span-all" type="submit">Save Trainer</button>
        </form>
      </section>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  auth = inject(AuthService);

  students: Student[] = [];
  trainers: Trainer[] = [];
  error = '';
  message = '';
  editingStudent?: Student;
  editingTrainer?: Trainer;
  studentForm: any = {};
  trainerForm: any = {};

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.error = '';

    this.api.students().subscribe({
      next: data => {
        this.students = Array.isArray(data) ? data : [];
        console.log('Admin students loaded:', this.students);
        this.cdr.markForCheck();
      },
      error: (e: Error) => {
        this.error = e.message;
        this.cdr.markForCheck();
      }
    });

    this.api.adminTrainers().subscribe({
      next: data => {
        this.trainers = Array.isArray(data) ? data : [];
        console.log('Admin trainers loaded:', this.trainers);
        this.cdr.markForCheck();
      },
      error: (e: Error) => {
        this.error = e.message;
        this.cdr.markForCheck();
      }
    });
  }

  editStudent(student: Student): void {
    this.editingStudent = student;
    this.editingTrainer = undefined;
    this.studentForm = {
      name: student.name,
      city: student.city,
      email: student.email,
      courseName: student.courseName,
      trainerId: student.trainerId,
      password: ''
    };
  }

  editTrainer(trainer: Trainer): void {
    this.editingTrainer = trainer;
    this.editingStudent = undefined;
    this.trainerForm = {
      name: trainer.name,
      className: trainer.className,
      courseName: trainer.courseName,
      experience: trainer.experience,
      email: trainer.email,
      employeeNumber: trainer.employeeNumber,
      password: ''
    };
  }

  cancelEdit(): void {
    this.editingStudent = undefined;
    this.editingTrainer = undefined;
  }

  saveStudent(): void {
    if (!this.editingStudent) return;
    const student = this.editingStudent;
    this.api.updateStudent(student.id, {
      ...this.studentForm,
      trainerId: Number(this.studentForm.trainerId)
    }).subscribe({
      next: () => {
        this.message = 'Student updated.';
        this.error = '';
        this.cancelEdit();
        this.refresh();
      },
      error: (e: Error) => this.error = e.message
    });
  }

  saveTrainer(): void {
    if (!this.editingTrainer) return;
    const trainer = this.editingTrainer;
    this.api.updateTrainer(trainer.id, {
      ...this.trainerForm,
      experience: Number(this.trainerForm.experience)
    }).subscribe({
      next: () => {
        this.message = 'Trainer updated.';
        this.error = '';
        this.cancelEdit();
        this.refresh();
      },
      error: (e: Error) => this.error = e.message
    });
  }

  deleteStudent(student: Student): void {
    if (!confirm(`Delete student ${student.name}?`)) return;
    this.api.deleteStudent(student.id).subscribe({
      next: () => {
        this.message = 'Student deleted.';
        this.error = '';
        this.refresh();
      },
      error: (e: Error) => this.error = e.message
    });
  }

  deleteTrainer(trainer: Trainer): void {
    if (!confirm(`Delete trainer ${trainer.name}? Trainers with assigned students cannot be deleted.`)) return;
    this.api.deleteTrainer(trainer.id).subscribe({
      next: () => {
        this.message = 'Trainer deleted.';
        this.error = '';
        this.refresh();
      },
      error: (e: Error) => this.error = e.message
    });
  }
}
