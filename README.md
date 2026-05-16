#  ShikshaSetu | Full-Stack Learning Management System

An advanced, gamified Learning Management System designed to handle interactive student learning tracks, dynamic assessments, and real-time performance analytics. 

## 🌐 Repository Architecture
To maintain an enterprise-level separation of concerns, this project is managed across two specialized development tracks within this repository:
* **`main` Branch:** Hosts the complete monolithic **Spring Boot Backend Engine** and PostgreSQL integration layers.
* **`frontend` Branch:** Hosts the state-driven, responsive **React.js Dashboard Application**.

---

## 🚀 Core Feature Configurations

###  1. Stateless Security & Gating
* Implements **Spring Security** paired with **JWT (JSON Web Tokens)** to handle stateless user sessions.
* Enforces strict role-based endpoint protection to securely gate student interfaces from administrative control panels.

### 2. Dynamic Performance Analytics
* Tracks total quiz interactions and score metrics using structured relational mapping.
* Calculates data pipelines natively to serve a live global **Leaderboard Matrix** and student metrics.

###  3. AI-Powered Assistant Engine
* Integrates an interactive **AI Doubt Solver** that processes incoming coding queries over secure HTTP protocols to return instant architectural explanations.

###  4. Responsive User Interfaces
* Built a highly dynamic, context-driven React application featuring smooth global Light/Dark mode toggles and optimized table structures.

---

##  Technological Blueprints

* **Backend Framework:** Java, Spring Boot, Spring Security
* **Frontend Engine:** React.js, Context API, CSS3 Grid/Flexbox
* **Database Management:** PostgreSQL (Relational schema modeling)
* **State & Token Handling:** JWT Architecture, LocalStorage Caching
* **Development Tools:** Git, Maven, Axios

---

## 🚧 Roadmap Status: Active Development (~80% Complete)
The primary system architecture, secure filtering pipelines, and user database models are fully complete. Current development sprints are focused on optimizing real-time local state updates for track-specific score sets.
