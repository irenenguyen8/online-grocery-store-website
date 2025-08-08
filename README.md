# OnlineGroceryStore

A dynamic web application that allows users to browse, filter, and reserve grocery items from a virtual store.

This project uses HTML, CSS, JavaScript for the frontend, Node.js with Express for the backend, and MySQL for the database.

Video Demo: https://youtu.be/nQiwrQ08-sA 

---

## Features

- Search and filter grocery items by category and availability  
- Add items to a shopping cart and make reservations  
- Real-time updates using AJAX without full-page reloads  
- Dynamic frontend and backend interaction via JSON  
- Responsive layout for mobile and desktop views

---

## Grocery System Elements

### Products

Each product includes:
- Name, description, price, quantity
- Category (e.g., fruits, vegetables, dairy, snacks)
- Image and availability status

### Categories

Grocery items are grouped into logical categories for easy navigation:
- Fruits, Vegetables, Beverages, Snacks, Dairy, etc.

### Reservation System

- Users can reserve items by filling a simple form
- System stores reservation details using JSON and MySQL
- Confirmation screen displays summary of reservation

---

## Data Models

### Product

Represents an individual grocery item.
- `id` (INT)
- `name` (VARCHAR)
- `description` (TEXT)
- `price` (DECIMAL)
- `quantity` (INT)
- `category_id` (INT)

### Category

Groups related products together.
- `id` (INT)
- `name` (VARCHAR)

### Reservation

Captures a customer’s grocery reservation.
- `id` (INT)
- `customer_name` (VARCHAR)
- `contact_info` (VARCHAR)
- `reserved_items` (JSON)
- `reservation_date` (DATETIME)

---

## Architecture

The app follows a modular architecture with separation of concerns:

### Frontend

- Static HTML pages styled with CSS  
- JavaScript for interactive behavior and AJAX requests

### Backend

- Node.js with Express routes for API endpoints  
- Serves data in JSON format to frontend  
- Handles reservation logic and data persistence

### Database

- MySQL for structured storage of products, categories, and reservations

---

## Technologies

- HTML, CSS, JavaScript (Vanilla)  
- Node.js + Express.js  
- MySQL (via XAMPP for local development)  
- AJAX + JSON for asynchronous communication

---

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/YourUsername/OnlineGroceryStore.git
```
2. Set up MySQL database with grocery_store.sql file in the /database folder.

3. Run the backend server
```bash
cd backend
node server.js
```
## University Project Statement

This repository was created as part of an assignment for a course at UTS.

All contributors have reviewed and agreed to publicly share this project under the MIT License for educational and non-commercial purposes. This project remains the intellectual property of the contributing team members.

---

## License

This project is licensed under the MIT License.

---

## Future Roadmap
- [ ] Implement user authentication and login

- [ ] Add payment and order tracking system

- [ ] Enable inventory management for store admin

- [ ] Improve mobile responsiveness and accessibility
      
- [ ]  Add email confirmation for reservations
      
- [ ]  Integrate with external APIs (e.g., product recommendations, delivery tracking)
