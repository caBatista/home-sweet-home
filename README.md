# Home Sweet Home

Welcome to the Home Sweet Home project! This is a simple marketplace web application built with Next.js and TypeScript, allowing friends to purchase selected products and donate to support the project.

## Features

- **Product Listing**: A homepage displaying a list of custom products.
- **Category Filters**: A header with options to filter products by category.
- **Donation Option**: A feature allowing users to donate any amount they wish.
- **Payment Integration**: Utilizes MercadoPago for processing payments.
- **Email Confirmation**: Sends confirmation emails to users after a successful purchase.

## Project Structure

```
home-sweet-home
├── prisma
│   ├── schema.prisma        # Database schema for Prisma
│   └── migrations            # Migration files for database changes
├── public                    # Static files (images, icons, etc.)
├── src
│   ├── pages
│   │   ├── api
│   │   │   ├── auth
│   │   │   │   └── [...nextauth].ts  # Authentication logic
│   │   │   ├── products.ts   # API routes for managing products
│   │   │   ├── checkout.ts    # Handles checkout process
│   │   │   └── donate.ts      # Manages donation requests
│   │   ├── _app.tsx          # Custom App component
│   │   ├── index.tsx         # Homepage
│   │   └── products.tsx      # Detailed view of products
│   ├── components
│   │   ├── Header.tsx        # Header component with navigation
│   │   ├── ProductList.tsx    # Component to display product list
│   │   └── DonateForm.tsx    # Form for submitting donations
│   ├── styles
│   │   └── globals.css       # Global CSS styles
│   ├── lib
│   │   ├── prisma.ts         # Initializes Prisma client
│   │   └── mercadopago.ts    # Functions for MercadoPago API
│   └── types
│       └── index.ts          # TypeScript types and interfaces
├── .env                      # Environment variables
├── .gitignore                # Files and directories to ignore by Git
├── next.config.js            # Next.js configuration settings
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```

## Getting Started

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd home-sweet-home
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add your configuration settings, including database connection strings and MercadoPago API keys.

4. **Run the Development Server**:

   ```bash
   npm run dev
   ```

5. **Access the Application**:
   Open your browser and navigate to `http://localhost:3000`.

## Deployment

Deployment instructions will be provided later. Ensure that you have configured your environment variables and database settings appropriately for production.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
