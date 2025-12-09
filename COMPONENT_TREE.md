# Component Tree Diagram

## Wise Wizards Fitness Application

### Interactive Component Graph (Mermaid)

This graph shows the complete component hierarchy and relationships:

```mermaid
graph TD
    A[App] --> B[Components Router]
    B --> C[Navbar]
    C --> C1[NavLink: Daily]
    C --> C2[NavLink: Log]
    C --> C3[NavLink: Trends]
    
    B --> D[Routes]
    D --> E["/ Route<br/>Navigate"]
    D --> F["/auth/* Route"]
    D --> L["/main Route"]
    D --> N["/daily Route"]
    D --> Q["/log Route"]
    D --> T["/trends Route"]
    
    F --> G[AuthModule]
    G --> H[AuthLogin]
    G --> I[AuthRegister]
    H --> J[AuthForm]
    I --> J
    
    L --> M[Main]
    
    N --> O[ProtectedRoute]
    O --> P[Daily]
    P --> P1["BodyDataForm<br/>(viewMode: bodyData)"]
    P --> P2["GoalPrompt<br/>(viewMode: goalPrompt)"]
    P --> P3["DailyGoalsDisplay<br/>(viewMode: display)"]
    P --> P4["CalorieCalculator<br/>(viewMode: calculate)"]
    P --> P5["DailyGoalsForm<br/>(viewMode: manual)"]
    
    P1 --> P1a[BodyDataInput x5]
    P2 --> P2a[GoalPromptOption x2]
    P3 --> P3a[GoalCard x3]
    P3a --> P3a1[GoalInput]
    P4 --> P4a[BodyDataForm]
    P4 --> P4b[CalculationPreview]
    P5 --> P5a[GoalInput x3]
    
    Q --> R[ProtectedRoute]
    R --> S[Log]
    S --> S2["FoodLog<br/>(view: food)"]
    S --> S3["ExerciseLog<br/>(view: exercise)"]
    S --> S4[Today's Summary]
    S4 --> S4a[Stat Cards x3]
    
    T --> U[ProtectedRoute]
    U --> V[Trends]
    V --> V2[WeekSelector]
    V --> V3[WeeklyDashboard]
    V --> V4[WeekDisplay]
    V --> V5["DayDetailModal<br/>(conditional)"]
    
    V3 --> V3a[StatCard x4]
    V3 --> V3e[ProgressBar x3]
    V4 --> V4a[DayCard x7]
    V4a --> V4a1[MiniChart]
    V5 --> V5a[Statistics Grid]
    V5 --> V5b[ProgressBar x3]
    
    style A fill:#e1f5ff,stroke:#0066cc,stroke-width:3px
    style B fill:#c3e6ff,stroke:#0066cc,stroke-width:2px
    style P fill:#fff4e6,stroke:#ff9900,stroke-width:2px
    style S fill:#fff4e6,stroke:#ff9900,stroke-width:2px
    style V fill:#fff4e6,stroke:#ff9900,stroke-width:2px
    style G fill:#ffe6f2,stroke:#cc0066,stroke-width:2px
    style O fill:#e6ffe6,stroke:#00cc00,stroke-width:2px
    style R fill:#e6ffe6,stroke:#00cc00,stroke-width:2px
    style U fill:#e6ffe6,stroke:#00cc00,stroke-width:2px
```

### Simplified High-Level Graph

For a clearer overview of the main routes:

```mermaid
graph LR
    A[App] --> B[Components Router]
    B --> C[Navbar]
    B --> D[Routes]
    
    D --> E["/auth/*<br/>AuthModule"]
    D --> F["/main<br/>Main"]
    D --> G["/daily<br/>ProtectedRoute → Daily"]
    D --> H["/log<br/>ProtectedRoute → Log"]
    D --> I["/trends<br/>ProtectedRoute → Trends"]
    
    E --> E1[AuthLogin/Register]
    E1 --> E2[AuthForm]
    
    G --> G1[BodyDataForm]
    G --> G2[GoalPrompt]
    G --> G3[DailyGoalsDisplay]
    G --> G4[CalorieCalculator]
    G --> G5[DailyGoalsForm]
    
    H --> H1[FoodLog]
    H --> H2[ExerciseLog]
    
    I --> I1[WeekSelector]
    I --> I2[WeeklyDashboard]
    I --> I3[WeekDisplay]
    I --> I4[DayDetailModal]
    
    style A fill:#e1f5ff
    style B fill:#c3e6ff
    style E fill:#ffe6f2
    style G fill:#fff4e6
    style H fill:#fff4e6
    style I fill:#fff4e6
```

## Component Details

### Core Routing Components
- **App**: Root component, initializes Parse SDK
- **Components**: Main router wrapper, manages authentication state
- **ProtectedRoute**: HOC that checks authentication before rendering protected pages
- **Navbar**: Navigation bar shown only when user is logged in

### Authentication Module
- **AuthModule**: Wrapper for login/register flow
- **AuthLogin**: Login form component
- **AuthRegister**: Registration form component
- **AuthForm**: Reusable form component for both login and register

### Main Features

#### Daily Goals Page
- **Daily**: Main container managing multiple view modes
- **BodyDataForm**: Form for entering body measurements
  - **BodyDataInput**: Reusable input component for body data fields
- **GoalPrompt**: Initial prompt to choose goal setting method
  - **GoalPromptOption**: Clickable option card
- **DailyGoalsDisplay**: Display current goals with edit capability
  - **GoalCard**: Display card for individual goal
  - **GoalInput**: Editable input component for goals
- **CalorieCalculator**: Calculator for automatic goal calculation
  - **CalculationPreview**: Preview of calculated goals
- **DailyGoalsForm**: Manual goal entry form
  - **GoalInput**: Input components for each goal type

#### Log Page
- **Log**: Main logging page container
- **FoodLog**: Food logging form with USDA API integration
- **ExerciseLog**: Exercise logging form

#### Trends Page
- **Trends**: Main trends/analytics page container
- **WeekSelector**: Week navigation controls
- **WeeklyDashboard**: Weekly summary statistics
  - **StatCard**: Reusable statistic display card
  - **ProgressBar**: Reusable progress bar component
- **WeekDisplay**: Grid of day cards for the week
  - **DayCard**: Individual day card
    - **MiniChart**: Mini bar chart showing day's stats
- **DayDetailModal**: Modal showing detailed day information
  - **ProgressBar**: Progress bars for goal tracking

### Shared/Reusable Components
- **StatCard**: Displays statistics in card format
- **ProgressBar**: Shows progress toward goals with color coding
- **MiniChart**: Mini bar chart for day cards
- **GoalInput**: Editable goal input field
- **BodyDataInput**: Body measurement input field

## Data Flow

### Services Layer
- **Services/AuthService**: Authentication operations
- **Services/Logs**: Daily log operations (food, exercise, aggregates)
- **Services/People**: User profile and goals management

### Utils Layer
- **Utils/dateUtils**: Date manipulation and formatting
- **Utils/statistics**: Statistical calculations
- **Utils/colors**: Color constants for theming
- **Utils/calculations**: Body data and calorie calculations

## State Management

- **Components**: Manages `currentUser` state (shared across app)
- **Daily**: Manages `viewMode` state (bodyData, goalPrompt, display, calculate, manual)
- **Log**: Manages `view` state (none, food, exercise)
- **Trends**: Manages week selection, day selection, loading states
- **AuthModule**: Manages auth `mode` state (login/register)

## Conditional Rendering Patterns

1. **Authentication-based**: Navbar, protected routes
2. **Mode-based**: Daily page (6 different view modes)
3. **View-based**: Log page (food/exercise forms)
4. **State-based**: Modal (DayDetailModal shown when day clicked)
5. **Data-based**: Empty states, loading states, error states

