from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
import speedtest
import requests
import json
from datetime import datetime
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
    timestamp: str
    ipInfo: Dict[str, Any]

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/api/speedtest")
async def run_speed_test():
    try:
        logger.info("Starting speed test")
        
        # Initialize speed test
        st = speedtest.Speedtest()
        
        # Get best server
        logger.info("Finding best server")
        st.get_best_server()
        
        # Test download speed
        logger.info("Testing download speed")
        download_speed = st.download() / 1_000_000  # Convert to Mbps
        
        # Test upload speed
        logger.info("Testing upload speed")
        upload_speed = st.upload() / 1_000_000      # Convert to Mbps
        
        # Get ping
        ping = st.results.ping
        
        # Get IP info with error handling
        try:
            ip_info = requests.get('https://ipinfo.io/json', timeout=5).json()
        except requests.RequestException as e:
            logger.error(f"Error fetching IP info: {e}")
            ip_info = {
                "ip": "Unknown",
                "city": "Unknown",
                "region": "Unknown",
                "country": "Unknown",
                "org": "Unknown"
            }
        
        result = SpeedTestResult(
            downloadSpeed=round(download_speed, 2),
            uploadSpeed=round(upload_speed, 2),
            ping=round(ping, 2),
            timestamp=datetime.now().isoformat(),
            ipInfo=ip_info
        )
        
        logger.info("Speed test completed successfully")
        return result.dict()
        
    except Exception as e:
        logger.error(f"Speed test failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

