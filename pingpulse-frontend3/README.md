# NetSpeed Analyzer

NetSpeed Analyzer is an internet speed testing application built with a FastAPI backend and a React (Next.js) frontend. The backend uses [speedtest-cli](https://github.com/sivel/speedtest-cli) to measure download/upload speeds and ping, while the frontend displays the results in a user-friendly dashboard.

## Features

- **Backend (FastAPI):**
  - **Endpoints:**
    - `GET /health` – Health check.
    - `POST /api/speedtest` – Runs an internet speed test and returns download speed, upload speed, ping, timestamp, and IP info.
  - Uses the `speedtest-cli` package for speed testing.
  - Logs key events during the test (server selection, download/upload speeds, etc.).
  - Configured with CORS to allow requests from the frontend (e.g. `http://localhost:3000`).

- **Frontend (React/Next.js):**
  - Provides an interactive UI to display speed test results.
  - Communicates with the backend API to fetch and render network performance data.
  - Includes a modern design with components for file search, dashboards, and more.

## Prerequisites

### Backend
- Python 3.8 or higher
- pip (Python package installer)

> **Important:**  
> To ensure you have the correct speed testing module, uninstall any package named `speedtest` and install `speedtest-cli`:
> ```bash
> pip uninstall speedtest
> pip install speedtest-cli
> ```

### Frontend
- Node.js (v14 or higher recommended)
- npm or yarn

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/SarangVehale/pingpulse.git
cd pingpulse
```

This repository contains two main directories: one for the backend and one for the frontend.

### 2. Setup the Backend

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment and activate it:

- **On Linux/macOS:**
  ```bash
  python -m venv venv
  source venv/bin/activate
  ```
- **On Windows:**
  ```bash
  python -m venv venv
  venv\Scripts\activate
  ```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

Ensure the correct speedtest module is installed (see Prerequisites).

### 3. Setup the Frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install Node.js dependencies:

```bash
npm install
```
or if using yarn:
```bash
yarn install
```

## Running the Application

### Start the Backend

In the `backend` directory, run:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

This will start the FastAPI server on port 8000.

### Start the Frontend

In the `frontend` directory, run:

```bash
npm run dev
```
or
```bash
yarn dev
```

This will start the React/Next.js development server on [http://localhost:3000](http://localhost:3000).

## API Endpoints

### Health Check
- **Endpoint:** `GET /health`  
- **Response:**
  ```json
  { "status": "ok" }
  ```

### Run Speed Test
- **Endpoint:** `POST /api/speedtest`  
- **Response Example:**
  ```json
  {
    "downloadSpeed": 50.23,
    "uploadSpeed": 10.45,
    "ping": 20.5,
    "timestamp": "2025-02-12T20:10:19.123456",
    "ipInfo": {
      "ip": "192.168.1.100",
      "city": "Your City",
      "region": "Your Region",
      "country": "Your Country",
      "org": "Your ISP"
    }
  }
  ```

## Troubleshooting

- **Error: `module 'speedtest' has no attribute 'Speedtest'`**  
  This error typically indicates that the wrong package was installed. Make sure you have uninstalled any package named `speedtest` and have installed `speedtest-cli`:
  ```bash
  pip uninstall speedtest
  pip install speedtest-cli
  ```

- **CORS Issues:**  
  If you encounter CORS errors when the frontend calls the backend, confirm that the backend’s CORS middleware is configured to allow requests from `http://localhost:3000`.

## Logging

The backend logs important events (e.g., starting the speed test, best server selection, download/upload speeds) to help with debugging and monitoring. Check the console output for detailed logs.

## Contributing

Contributions are welcome! Feel free to fork this repository and submit pull requests for improvements, bug fixes, or new features.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [FastAPI](https://fastapi.tiangolo.com/) – The web framework used for the backend.
- [speedtest-cli](https://github.com/sivel/speedtest-cli) – Provides the internet speed testing functionality.
- [Next.js](https://nextjs.org/) or [React](https://reactjs.org/) – Framework for the frontend.
- Thanks to all contributors and the open source community.
```

---

