# BubblePay Project Setup Guide

## Frontend Setup

1. **Navigate to Frontend Directory**
   ```
   cd frontend/bubblepay
   ```

2. **Install Dependencies**
   ```
   npm install
   ```
   This command installs all the necessary dependencies required for the frontend application to run. 

3. **Run Development Server**
   ```
   npm run dev
   ```
   This command starts a development server for the frontend application. 

## Backend Setup

1. **Install XAMPP**

   - Download and install [XAMPP](https://www.apachefriends.org/index.html).
   - Start the Apache and MySQL services from the XAMPP Control Panel.

2. **Create Database**

   - Open your web browser and go to `http://localhost/phpmyadmin`.
   - Log in with your XAMPP credentials (if any).
   - Click on the "Databases" tab and create a new database named `bubblepay`.

3. **Create Orders Table**

   - Go to the `SQL` tab in phpMyAdmin for the `bubblepay` database.
   - Execute the following SQL query to create the `orders` table:

     ```sql
     CREATE TABLE orders (
         id INT AUTO_INCREMENT PRIMARY KEY,
         phone VARCHAR(20),
         email VARCHAR(100),
         otp VARCHAR(6),
         order_status VARCHAR(20) DEFAULT 'received',
         created_at TIMESTAMP
     );
     ```
     This SQL query creates a table named `orders` within the `bubblepay` database.

4. **Place Backend Folder**

   - Move your `bubblepay` folder (containing backend code) into the `htdocs` folder of your XAMPP installation directory (e.g., `C:\xampp\htdocs` for Windows or `/Applications/XAMPP/htdocs` for macOS).

---

### Admin Panel Login Credentials:
- Username: admin
- Password: admin

### Notes:
- Ensure XAMPP services (Apache and MySQL) are running when accessing `http://localhost/phpmyadmin`.
- Adjust paths and commands based on your operating system and project structure.
- Replace your root password in connect_db.php file.
- Enter email for dropoff as OTP will be sent on the email for now. 
