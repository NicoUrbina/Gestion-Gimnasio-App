# 🗃️ Diagrama de Entidad-Relación

## Diagrama General del Sistema

```mermaid
erDiagram
    %% ===== USUARIOS Y ROLES =====
    Role ||--o{ User : "tiene"
    Role {
        int id PK
        string name
        string description
    }
    
    User {
        int id PK
        string email UK
        string username UK
        string password
        string first_name
        string last_name
        string phone
        int role_id FK
        bool is_active
        datetime date_joined
    }

    %% ===== MIEMBROS =====
    User ||--o| Member : "es"
    Member {
        int id PK
        int user_id FK
        date date_of_birth
        string gender
        string phone
        string address
        string emergency_contact_name
        string emergency_contact_phone
        text medical_notes
        string subscription_status
        date joined_date
        datetime last_access
    }

    %% ===== MEMBRESÍAS =====
    MembershipPlan ||--o{ Membership : "define"
    Member ||--o{ Membership : "tiene"
    
    MembershipPlan {
        int id PK
        string name
        text description
        decimal price
        int duration_days
        int max_classes_per_month
        bool includes_trainer
        bool can_freeze
        int max_freeze_days
        bool is_active
    }
    
    Membership {
        int id PK
        int member_id FK
        int plan_id FK
        date start_date
        date end_date
        string status
        datetime frozen_at
        int frozen_days_used
    }

    Membership ||--o{ MembershipFreeze : "tiene"
    MembershipFreeze {
        int id PK
        int membership_id FK
        date start_date
        date end_date
        string reason
    }

    %% ===== STAFF =====
    User ||--o| Staff : "es"
    Staff ||--o{ Schedule : "tiene"
    
    Staff {
        int id PK
        int user_id FK
        string staff_type
        json specializations
        text bio
        json certifications
        date hire_date
        decimal hourly_rate
        bool is_instructor
        bool is_active
    }
    
    Schedule {
        int id PK
        int staff_id FK
        int day_of_week
        time start_time
        time end_time
        bool is_available
    }

    %% ===== CLASES =====
    ClassType ||--o{ GymClass : "define"
    Staff ||--o{ GymClass : "instruye"
    
    ClassType {
        int id PK
        string name
        text description
        int default_duration_minutes
        int default_capacity
        string color
        string icon
        bool is_active
    }
    
    GymClass {
        int id PK
        int class_type_id FK
        int instructor_id FK
        string title
        text description
        datetime start_datetime
        datetime end_datetime
        int capacity
        string location
        bool is_recurring
        bool is_cancelled
    }

    GymClass ||--o{ Reservation : "tiene"
    Member ||--o{ Reservation : "hace"
    
    Reservation {
        int id PK
        int gym_class_id FK
        int member_id FK
        string status
        int waitlist_position
        datetime reserved_at
        datetime cancelled_at
        datetime attended_at
    }

    %% ===== RUTINAS =====
    Staff ||--o{ Routine : "crea"
    Routine ||--o{ RoutineAssignment : "asignada"
    Member ||--o{ RoutineAssignment : "recibe"
    
    Routine {
        int id PK
        int trainer_id FK
        string name
        text description
        string difficulty_level
        int duration_minutes
        bool is_active
    }
    
    RoutineAssignment {
        int id PK
        int member_id FK
        int routine_id FK
        int assigned_by_id FK
        datetime assigned_at
        text notes
    }

    %% ===== PAGOS =====
    Member ||--o{ Payment : "realiza"
    Membership ||--o{ Payment : "genera"
    User ||--o{ Payment : "registra"
    
    Payment {
        int id PK
        int member_id FK
        int membership_id FK
        decimal amount
        string payment_method
        string status
        string reference_number
        text description
        datetime payment_date
        int created_by_id FK
    }

    Payment ||--o| Invoice : "genera"
    Invoice {
        int id PK
        int payment_id FK
        string invoice_number UK
        date issued_date
        decimal subtotal
        decimal tax
        decimal total
        string pdf_file
    }

    %% ===== PROGRESO =====
    Member ||--o{ ProgressLog : "registra"
    User ||--o{ ProgressLog : "registrado_por"
    
    ProgressLog {
        int id PK
        int member_id FK
        date date
        decimal weight
        decimal height
        decimal body_fat_percentage
        decimal muscle_mass
        decimal chest
        decimal waist
        decimal hips
        int registered_by_id FK
    }

    Member ||--o{ Achievement : "obtiene"
    Achievement {
        int id PK
        int member_id FK
        string achievement_type
        string title
        text description
        date achieved_date
        string icon
    }

    %% ===== ACCESO =====
    Member ||--o{ AccessLog : "registra"
    User ||--o{ AccessLog : "registrado_por"
    
    AccessLog {
        int id PK
        int member_id FK
        string access_type
        datetime timestamp
        int registered_by_id FK
        text notes
    }

    Member ||--o{ AbandonmentAlert : "genera"
    AbandonmentAlert {
        int id PK
        int member_id FK
        int days_inactive
        string status
        datetime created_at
        datetime resolved_at
        int resolved_by_id FK
    }
```

## Módulos Adicionales

### Analytics del Atleta

```mermaid
erDiagram
    MetricType ||--o{ AthleteMetric : "mide"
    Member ||--o{ AthleteMetric : "tiene"
    
    MetricType {
        int id PK
        string name
        string category
        string unit
        bool is_higher_better
        decimal min_value
        decimal max_value
        bool is_active
    }
    
    AthleteMetric {
        int id PK
        int member_id FK
        int metric_type_id FK
        decimal value
        date recorded_date
        time recorded_time
        string source
    }

    Member ||--o{ MetricSnapshot : "tiene"
    MetricSnapshot {
        int id PK
        int member_id FK
        string period_type
        date period_start
        date period_end
        json metrics_data
        text summary
    }

    MetricType ||--o{ PerformanceGoal : "mide"
    Member ||--o{ PerformanceGoal : "establece"
    
    PerformanceGoal {
        int id PK
        int member_id FK
        int metric_type_id FK
        decimal initial_value
        decimal target_value
        decimal current_value
        date start_date
        date target_date
        string status
    }

    Member ||--o{ TrainingLog : "registra"
    TrainingLog {
        int id PK
        int member_id FK
        date date
        int duration_minutes
        string training_type
        string intensity
        int calories_burned
        json exercises_data
        string mood_before
        string mood_after
    }
```

### Equipamiento y Documentos

```mermaid
erDiagram
    EquipmentCategory ||--o{ Equipment : "contiene"
    Equipment ||--o{ MaintenanceRecord : "tiene"
    Equipment ||--o{ EquipmentReservation : "reservado"
    Member ||--o{ EquipmentReservation : "reserva"
    
    Equipment {
        int id PK
        string name
        int category_id FK
        string serial_number
        string status
        string location
        date purchase_date
        bool is_reservable
    }

    Member ||--o{ Contract : "firma"
    Member ||--o{ Document : "sube"
    Member ||--o{ Waiver : "acepta"
    Member ||--o{ Feedback : "envía"
    
    Contract {
        int id PK
        int member_id FK
        string contract_number
        string status
        date signed_date
        date end_date
    }
    
    Feedback {
        int id PK
        int member_id FK
        string feedback_type
        int rating
        text comments
        bool is_resolved
    }
```

## Leyenda

| Símbolo | Significado |
|---------|-------------|
| `PK` | Primary Key (Clave primaria) |
| `FK` | Foreign Key (Clave foránea) |
| `UK` | Unique Key (Clave única) |
| `||--o{` | Uno a muchos |
| `||--o|` | Uno a uno |
| `}o--o{` | Muchos a muchos |

## Notas

- Los modelos incluyen campos `created_at` y `updated_at` automáticos
- Las propiedades calculadas (como `days_remaining`, `bmi`) no se muestran en el diagrama
- Los JSONFields almacenan datos estructurados (ejercicios, métricas, etc.)
