from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
import speedtest
import asyncio
import requests
from datetime import datetime

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SpeedTestResult(BaseModel):
    downloadSpeed: float
    uploadSpeed: float
    ping: float
    jitter: float
    timestamp: str
    serverId: str
    serverLocation: str
    networkScore: float
    ipInfo: Dict[str, Any]

def calculate_network_score(download_speed: float, upload_speed: float, ping: float, jitter: float) -> float:
    download_weight = 0.4
    upload_weight = 0.3
    ping_weight = 0.2
    jitter_weight = 0.1

    download_score = min(100, (download_speed / 200) * 100)
    upload_score = min(100, (upload_speed / 100) * 100)
    ping_score = max(0, 100 - (ping / 2))
    jitter_score = max(0, 100 - (jitter * 5))

    total_score = (
        download_score * download_weight +
        upload_score * upload_weight +
        ping_score * ping_weight +
        jitter_score * jitter_weight
    )

    return round(total_score, 2)

def get_ip_info():
    try:
        response = requests.get('https://ipinfo.io/json', timeout=5)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": f"Failed to fetch IP info: {str(e)}"}

async def run_speedtest():
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(None, perform_speedtest)

def perform_speedtest():
    st = speedtest.Speedtest()
    st.get_best_server()
    
    download_speed = st.download() / 1_000_000
    upload_speed = st.upload() / 1_000_000
    ping = st.results.ping
    jitter = st.results.jitter if hasattr(st.results, "jitter") else 0
    server = st.get_best_server()

    return {
        "download": download_speed,
        "upload": upload_speed,
        "ping": ping,
        "jitter": jitter,
        "server": server
    }

@app.post("/api/speedtest")
async def run_speed_test():
    try:
        # Run speed test asynchronously
        speedtest_results = await run_speedtest()

        # Fetch IP info
        ip_info = get_ip_info()

        # Calculate network score
        network_score = calculate_network_score(
            speedtest_results["download"],
            speedtest_results["upload"],
            speedtest_results["ping"],
            speedtest_results["jitter"]
        )

        result = SpeedTestResult(
            downloadSpeed=round(speedtest_results["download"], 2),
            uploadSpeed=round(speedtest_results["upload"], 2),
            ping=round(speedtest_results["ping"], 2),
            jitter=round(speedtest_results["jitter"], 2),
            timestamp=datetime.now().isoformat(),
            serverId=speedtest_results["server"]['id'],
            serverLocation=f"{speedtest_results['server']['name']}, {speedtest_results['server']['country']}",
            networkScore=network_score,
            ipInfo=ip_info
        )

        return result.dict()
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Speed test failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
