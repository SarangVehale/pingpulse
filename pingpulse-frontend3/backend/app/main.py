from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
import speedtest
import requests
import json
from datetime import datetime
import logging
import time
import statistics
import threading

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Speed Test API")

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

def get_best_server():
    servers = []
    s = speedtest.Speedtest()
    s.get_servers(servers)
    s.get_best_server()
    return s

def perform_speed_test():
    try:
        # Initialize with a fresh connection each time
        st = get_best_server()
        logger.info(f"Selected server: {st.results.server['sponsor']} ({st.results.server['name']})")

        # Perform download test with multiple samples
        logger.info("Starting download test...")
        download_speeds = []
        for i in range(7):  # Increased samples
            logger.info(f"Download test {i+1}/7")
            download_speed = st.download(threads=8) / 1_000_000
            download_speeds.append(download_speed)
            time.sleep(0.2)

        # Remove outliers and calculate average download
        sorted_downloads = sorted(download_speeds)
        avg_download = statistics.mean(sorted_downloads[1:-1])  # Remove highest and lowest
        logger.info(f"Average download speed: {avg_download:.2f} Mbps")

        # Reset connection for upload test
        st = get_best_server()
        
        # Perform upload test with multiple samples
        logger.info("Starting upload test...")
        upload_speeds = []
        for i in range(7):  # Increased samples
            logger.info(f"Upload test {i+1}/7")
            upload_speed = st.upload(threads=8) / 1_000_000
            upload_speeds.append(upload_speed)
            time.sleep(0.2)

        # Remove outliers and calculate average upload
        sorted_uploads = sorted(upload_speeds)
        avg_upload = statistics.mean(sorted_uploads[1:-1])  # Remove highest and lowest
        logger.info(f"Average upload speed: {avg_upload:.2f} Mbps")

        # Get ping with multiple samples
        pings = []
        for _ in range(5):
            st = get_best_server()
            pings.append(st.results.ping)
            time.sleep(0.1)
        
        ping = statistics.mean(pings)
        logger.info(f"Ping: {ping:.2f} ms")

        return avg_download, avg_upload, ping
    except Exception as e:
        logger.error(f"Speed test error: {str(e)}")
        raise

@app.post("/api/speedtest")
async def run_speed_test():
    try:
        logger.info("Starting new speed test")
        
        # Perform speed test with averages
        download_speed, upload_speed, ping = perform_speed_test()
        
        # Get IP info
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
        
        logger.info(f"Speed test completed successfully")
        return result.dict()
        
    except Exception as e:
        logger.error(f"Speed test failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)