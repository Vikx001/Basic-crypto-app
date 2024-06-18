Here's a properly formatted `README.md` file in code format:

```markdown
# Basic Crypto Dashboard

A simple cryptocurrency dashboard application built with React and Node.js, providing real-time cryptocurrency prices and displaying them in various chart formats. The application fetches data from the CoinGecko API and displays it on a dashboard with interactive features.

## Features

- Real-time cryptocurrency prices
- Line, Bar, and Candlestick charts for price visualization
- Detailed information on selected cryptocurrency
- Light and Dark mode toggle

## Tech Stack

- **Frontend**: React, Chart.js
- **Backend**: Node.js, Express
- **API**: CoinGecko

## Project Structure

```

crypto-project/
├── api/
│   ├── crypto/
│   │   └── index.js
├── public/
├── src/
│   ├── components/
│   │   ├── CryptoDashboard.js
│   │   └── CryptoDashboard.css
│   ├── App.css
│   ├── App.js
│   ├── index.css
│   └── index.js
├── .gitignore
├── package-lock.json
├── package.json
└── README.md

```

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Vercel CLI (optional, for deployment)

### Installation

1. **Clone the repository**

   ```sh
   git clone git@github.com:Vikx001/Basic-crypto-app.git
   cd Basic-crypto-app
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

### Running the Application

1. **Start the backend server**

   ```sh
   cd api
   node index.js
   ```

2. **Start the React development server**

   ```sh
   cd ..
   npm start
   ```

3. **Open your browser**

   Navigate to `http://localhost:3000` to view the application.

### Deployment

#### Deploying Frontend to Vercel

1. **Initialize Vercel**

   ```sh
   vercel
   ```

2. **Follow the prompts to deploy**

3. **Update API Endpoints**

   Ensure the API endpoints in `CryptoDashboard.js` point to the correct URLs.

#### Deploying Backend to Vercel

1. **Create a `vercel.json` file in the root directory**

   ```json
   {
     "version": 2,
     "builds": [
       { "src": "api/**/*.js", "use": "@vercel/node" }
     ],
     "routes": [
       { "src": "/api/(.*)", "dest": "/api/$1" }
     ]
   }
   ```

2. **Move backend code to `api` folder**

3. **Deploy backend**

   ```sh
   vercel
   ```

### Usage

- **View Real-Time Prices**: The dashboard will automatically fetch and display the latest prices every minute.
- **Toggle Chart Type**: Use the dropdown to switch between Line, Bar, and Candlestick charts.
- **View Coin Details**: Click on a cryptocurrency icon to view detailed information.
- **Toggle Theme**: Use the button to switch between light and dark mode.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [CoinGecko](https://www.coingecko.com) for the API
- [Chart.js](https://www.chartjs.org) for the charting library
- [Vercel](https://vercel.com) for deployment
```
