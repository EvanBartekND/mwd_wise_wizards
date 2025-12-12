
# Change Log
All notable changes to this project will be documented in this file.

## [Feature 6] - 2025-12-12 - 0.4.0
 
 project for feature 6

### Added
- [Log Page]
  Page allows users to log their food and exercise intake for the day 
  Can choose food from a USDA intigrated API
  User can manually input calories for food  
  User can only log for the current day 
- [Trends Page] 
  User can now see their logs as they relate to their goals
  User can keep track of exercise and claorie intake and how it pertains to their goals
  User can now see cards for each specific day logged
  User can go back and forth to see progress between weeks 


### Changed
 - [Daily page]
   Changes so that goals are calculated based off a formula 
   User can input information about themselves and the formula will compute their caloric goals
-  [style ]
   Updated css to give the webiste a better look 
   [Database classes]
   changed days class into a dailyExercise class with updated information
-

### Fixed
  - []

### Deleted 
- Days class  

## [Feature 5] - 2025-11-06 - 0.3.0
 
 project for feature 5

### Added
- [Auth Module]
  component that contains login and register 
- [Auth Service]
  has createlogin, logout, get and update 


### Changed
 - [Protected Routes]
   added protected routes so users cannot go to pages that are not meant to be public or access other user data
-  [componets ]
   redirecting to where they are supposed to 
-  [Main ]
  


### Fixed
  - [added comments]

### Deleted 
- Auth and register, made new ones 



  
## [Feature 4] - 2025-10-17 0.2.0
 
Initialization of project for feature 4

### Added
- [Parse models]
  created parse models for the person and day classes, with a one to many realtionship
- [Routing]
  added dynamic routing bewteen pages based on the user signed in. Also includes protected routes that require a username
- [added changelog]
- [Home page]
  includes Login and Signup componentes


### Changed
 - [Convert preact feature 3 to react]
  also included a componentes component for organization
- [Log page]
  now displays all user's usernames
- [Trends page]
  now displays all days from the back4app

### Fixed
  - [added comments for clarity]


