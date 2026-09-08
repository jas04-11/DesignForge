# DesignForge

**DesignForge** is a Low-Level Design (LLD) practice platform that helps developers practice designing software systems and receive structured feedback on their designs.

Instead of only solving coding problems, users create classes, interfaces, fields, methods, and relationships for common LLD problems such as Parking Lot, Elevator System, Vending Machine, and Library Management System.

## Features

* Practice common LLD problems
* Create classes and interfaces
* Define fields and methods
* Define relationships between classes
* Submit designs for evaluation
* Rule-based requirement checking
* AI-powered design evaluation using Gemini
* Category-based scoring
* Strengths, weaknesses, and improvement suggestions
* Track previous attempts and score progression
* Simple and structured design interface

## Evaluation System

DesignForge uses two types of evaluation.

### Rule-Based Evaluation

The rule-based evaluator checks objective requirements such as:

* Required classes
* Required interfaces
* Required methods
* Required fields
* Required relationships

This evaluation is fast, consistent, and does not depend on AI.

### AI Evaluation

The AI evaluator uses Gemini to evaluate areas that require design judgment, such as:

* Abstraction
* SOLID principles
* Design quality
* Extensibility
* Responsibility assignment

AI feedback is returned in a structured format so that it can be displayed consistently.

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### AI

* Google Gemini API

## System Architecture

```text
┌───────────────┐
│   React SPA   │
│   Frontend    │
└───────┬───────┘
        │ HTTP / JSON
        ▼
┌───────────────┐
│ Express API   │
│   Backend     │
└───────┬───────┘
        │
        ├───────────────┐
        ▼               ▼
┌───────────────┐ ┌───────────────┐
│   MongoDB     │ │ Evaluation    │
│               │ │   Service     │
└───────────────┘ └───────┬───────┘
                          │
                 ┌────────┴────────┐
                 ▼                 ▼
        ┌───────────────┐ ┌───────────────┐
        │ Rule-Based    │ │ AI Evaluator  │
        │ Evaluator     │ │   (Gemini)    │
        └───────────────┘ └───────────────┘
```

## Project Structure

```text
DesignForge/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── evaluators/
│   ├── middleware/
│   ├── app.js
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/DesignForge.git
cd DesignForge
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Do not commit the `.env` file to GitHub.

## Running the Project

### Start Backend

```bash
cd backend
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### Start Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

## How DesignForge Works

The basic workflow is:

```text
Choose LLD Problem
       ↓
Create Design
       ↓
Add Classes & Interfaces
       ↓
Define Relationships
       ↓
Submit Design
       ↓
Rule-Based Evaluation
       ↓
AI Evaluation
       ↓
Combined Feedback
       ↓
View Score & Suggestions
       ↓
Improve Design
       ↓
Try Again
```

## Evaluation Categories

Designs can be evaluated across important LLD concepts such as:

| Category             | Description                                                 |
| -------------------- | ----------------------------------------------------------- |
| Responsibility       | Whether classes have clear responsibilities                 |
| Abstraction          | Whether common and changing behavior is properly abstracted |
| Relationships        | Whether class relationships are appropriate                 |
| Extensibility        | Whether the design can handle future requirements           |
| Requirement Coverage | Whether the required elements are present                   |

## Design Principles

DesignForge focuses on important object-oriented design principles including:

* Single Responsibility Principle
* Open/Closed Principle
* Encapsulation
* Abstraction
* Composition
* Inheritance
* Loose Coupling
* High Cohesion

## Why DesignForge?

Traditional coding platforms mainly evaluate whether code produces the correct output.

LLD is different because there can be multiple valid designs for the same problem.

DesignForge focuses on the complete learning cycle:

**Design → Feedback → Revision → Improvement**

The goal is to help users understand not only **what is wrong with their design**, but also **why it is wrong and how it can be improved**.

## Future Improvements

Possible future enhancements include:

* More LLD problems
* Improved AI feedback
* Difficulty levels
* Leaderboards
* User profiles
* Interview simulation mode
* More detailed design comparisons
* Background evaluation for large-scale usage
* Design history and analytics

## License

This project is developed for educational and learning purposes.

## Author

**Jasleen Kaur**

DesignForge — LLD Practice Platform
