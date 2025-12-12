# Wise Wizards Fitness Tracker

A comprehensive React-based fitness tracking application that helps users monitor their daily nutrition, exercise, and progress toward their fitness goals.

## Overview

Wise Wizards is a full-stack fitness tracking application built with React and Parse (Back4App). It enables users to:

- Set and manage daily fitness goals (calories, cardio, and lifting)
- Log food intake and exercise activities
- Track weekly progress with detailed analytics and trends
- Calculate personalized calorie goals based on body metrics

## Features

### 🔐 Authentication
- User registration and login
- Protected routes for authenticated users
- Session management via Parse SDK

### 🎯 Daily Goals Management
- **Manual Goal Entry**: Set custom daily goals for calories, cardio (minutes), and lifting (minutes)
- **Automatic Calculation**: Calculate personalized calorie goals based on:
  - Body measurements (height, weight, age, gender, body fat %)
  - Weight goals (lose/maintain/gain weight)
  - Activity level
  - Uses BMR (Basal Metabolic Rate) and TDEE (Total Daily Energy Expenditure) calculations
- **Goal Display**: View and edit current goals with visual progress indicators

### 📝 Activity Logging
- **Food Logging**: Track daily calorie intake
- **Exercise Logging**: Log cardio and lifting activities with duration tracking
- **Daily Summary**: View today's totals at a glance

### 📊 Trends & Analytics
- **Weekly Dashboard**: View weekly statistics including:
  - Average calories, cardio, and lifting minutes
  - Total weekly values
  - Progress toward goals
- **Week View**: Visual grid showing all 7 days of the week
- **Day Details**: Click on any day to see detailed statistics
- **Progress Tracking**: Color-coded progress bars indicating goal completion

### 🏠 Dashboard
- Personalized welcome screen
- Quick stats for today's activities
- Navigation cards to main features
- Helpful tips and guidance

## Tech Stack

- **Frontend Framework**: React 19.2.0
- **Routing**: React Router DOM 6.30.1
- **Backend**: Parse SDK 3.5.1 (Back4App)
- **Build Tool**: Create React App 5.0.1
- **Testing**: React Testing Library

## Project Structure

```
src/
├── Components/
│   ├── Auth/              # Authentication components
│   │   ├── Auth.js
│   │   ├── AuthForm.js
│   │   ├── AuthLogin.js
│   │   └── AuthRegister.js
│   ├── Daily/              # Daily goals management
│   │   ├── Daily.js
│   │   ├── BodyDataForm.js
│   │   ├── CalorieCalculator.js
│   │   ├── DailyGoalsDisplay.js
│   │   ├── DailyGoalsForm.js
│   │   └── GoalPrompt.js
│   ├── Log/                # Activity logging
│   │   ├── Log.js
│   │   ├── FoodLog.js
│   │   └── ExerciseLog.js
│   ├── Trends/             # Analytics and trends
│   │   ├── Trends.js
│   │   ├── WeeklyDashboard.js
│   │   ├── WeekDisplay.js
│   │   ├── WeekSelector.js
│   │   └── DayDetailModal.js
│   ├── Main/               # Dashboard
│   │   └── Main.js
│   ├── Navbar/             # Navigation
│   │   └── Navbar.js
│   └── ProtectedRoute/     # Route protection
│       └── ProtectedRoute.js
├── Services/               # Backend service layer
│   ├── AuthService.js
│   ├── Logs.js
│   └── People.js
├── Utils/                  # Utility functions
│   ├── calculations.js     # BMR, TDEE, calorie calculations
│   ├── dateUtils.js        # Date manipulation
│   ├── statistics.js       # Statistical calculations
│   └── colors.js          # Color constants
├── App.js                  # Root component
└── index.js                # Entry point
```

## Database Schema

The application uses Parse (Back4App) with the following main classes:

### `_User` (Parse built-in)
- User authentication and credentials
- Username, email, password

### `people`
- User profile and goals
- Body measurements: height, weight, age, body fat %, gender
- Goals: calorieGoal, cardioGoal, liftGoal
- Weight goal settings: weightGoalType, weightGoalRate
- Metadata: goalsSet, goalsLastUpdated

### `DailyLogs`
- Daily activity tracking
- Fields: date, trackedCalories, trackedCardio, trackedLift
- One-to-many relationship with `_User`

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Parse/Back4App account (for backend)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mwd_wise_wizards
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - The application uses `src/environments.js` for Parse configuration
   - Update with your Parse Application ID, JavaScript Key, and Server URL

4. Start the development server:
```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production

## Usage

1. **Register/Login**: Create an account or log in to an existing one
2. **Set Goals**: Navigate to Daily Goals to set your fitness targets
   - Enter body measurements for automatic calculation
   - Or manually set your goals
3. **Log Activities**: Use the Log page to record food intake and exercises
4. **Track Progress**: View your weekly trends and statistics on the Trends page

## Key Features Explained

### Calorie Calculation
The app uses scientific formulas to calculate personalized calorie goals:
- **BMR Calculation**: Uses Mifflin-St Jeor equation (with or without body fat %)
- **TDEE Calculation**: Adjusts BMR based on activity level
- **Goal Adjustment**: Modifies TDEE based on weight goals (lose/maintain/gain)

### Data Aggregation
- Daily logs are automatically aggregated per day
- Weekly statistics calculate averages, totals, and progress percentages
- Duplicate entries are merged to ensure data integrity

## Documentation

Additional documentation files:
- `COMPONENT_TREE.md` - Detailed component hierarchy and relationships
- `DATABASE_UML.md` - Database schema and relationships
- `CHANGELOG.md` - Version history and changes

## Version

Current version: **0.4.0**

## License

This project is private and proprietary.

## Contributing

This is a private project. For questions or issues, please contact the development team.
