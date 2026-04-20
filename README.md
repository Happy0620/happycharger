# Feasto - Food Delivery App

## Backend Setup with Local MongoDB

This application is configured to connect to a real, local MongoDB instance. Follow these steps to set up the backend:

### 1. Install MongoDB

If you haven't already, download and install MongoDB Community Server from the official website:
[https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

Follow the installation instructions for your operating system.

### 2. Start MongoDB

Ensure the MongoDB server is running.

- On **Windows**, it usually runs as a background service automatically.
- On **macOS** (using Homebrew), you can start it with: `brew services start mongodb-community`
- On **Linux**, you can start it with: `sudo systemctl start mongod`

The default port is `27017`.

### 3. Configure Environment Variables

Create a `.env` file in the root of the project (if it doesn't exist) and add your MongoDB connection string:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/food-delivery
JWT_SECRET=your_super_secret_key_here
```

### 4. Run the Application

Start the development server:

```bash
npm run dev
```

The server will automatically connect to your local MongoDB instance. If the database is empty, it will automatically seed it with initial restaurant and menu data.

## Admin Management

To test the Admin Dashboard:

1. Go to the **Sign Up** page.
2. Fill in your details and check the **"Register as Admin (for testing)"** checkbox.
3. Once logged in, you will see an **Admin** link in the navigation bar.
4. Click on **Admin** to access the dashboard where you can add new restaurants.
