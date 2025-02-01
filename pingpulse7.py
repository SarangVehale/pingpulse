import speedtest
import argparse
import json
import csv
import os
import sys
import pyfiglet   
from datetime import datetime
from colorama import Fore, Style, init
import threading
import requests  # For getting IP info

# Initialize colorama
init(autoreset=True)

# Constants
RESULTS_FILE_JSON = 'speed_test_results.json'
RESULTS_FILE_CSV = 'speed_test_results.csv'

# Print ASCII Banner
def print_banner():
    banner = pyfiglet.figlet_format("pingpulse")
    print(Fore.CYAN + banner)

# Displaying Speed Test Results in a Clean Layout
def print_speed_results(download_speed, upload_speed, ping_result, ip_info):
    print("\n" + "="*40)
    print(Fore.YELLOW + "Speed Test Results")
    print("-"*40)
    
    # Speed Information
    print(Fore.LIGHTCYAN_EX + f"Download Speed: {download_speed:.2f} Mbps")
    print(Fore.LIGHTMAGENTA_EX + f"Upload Speed: {upload_speed:.2f} Mbps")
    print(Fore.LIGHTGREEN_EX + f"Ping: {ping_result:.2f} ms")
    
    # IP Info
    print("\n" + "-"*40)
    print(Fore.YELLOW + f"IP Address: {ip_info.get('ip', 'N/A')}")
    print(Fore.LIGHTYELLOW_EX + f"Location: {ip_info.get('city', 'N/A')}, {ip_info.get('region', 'N/A')}, {ip_info.get('country', 'N/A')}")
    print(Fore.LIGHTWHITE_EX + f"Service Provider: {ip_info.get('org', 'N/A')}")
    print("="*40 + "\n")

# Measure Internet Speed with Optimizations
def measure_internet_speed():
    try:
        st = speedtest.Speedtest()
        st.get_best_server()

        # Initial Message about the Server
        server = st.results.server
        print(f"\nTesting against server: {server.get('sponsor', 'Unknown')} located in {server.get('name', 'Unknown')}, {server.get('country', 'Unknown')}")

        # Start download and upload simultaneously
        download_thread = threading.Thread(target=lambda: st.download())
        upload_thread = threading.Thread(target=lambda: st.upload())

        download_thread.start()
        upload_thread.start()

        download_thread.join()  # Wait for download to finish
        upload_thread.join()    # Wait for upload to finish

        download_speed = st.results.download / 1_000_000  # Convert to Mbps
        upload_speed = st.results.upload / 1_000_000      # Convert to Mbps
        ping_result = st.results.ping

        # Fetch IP info from an API
        ip_info = get_ip_info()

        return download_speed, upload_speed, ping_result, ip_info

    except Exception as e:
        print(Fore.RED + f"Error during speed test: {e}")
        sys.exit(1)

# Fetch IP Information
def get_ip_info():
    try:
        response = requests.get("https://ipinfo.io/json")
        return response.json()
    except Exception as e:
        print(Fore.RED + f"Could not fetch IP info: {e}")
        return {}

# Save Results to JSON
def save_results_json(data):
    try:
        if os.path.exists(RESULTS_FILE_JSON):
            with open(RESULTS_FILE_JSON, 'r') as f:
                results = json.load(f)
        else:
            results = []

        results.append(data)

        with open(RESULTS_FILE_JSON, 'w') as f:
            json.dump(results, f, indent=4)
    except Exception as e:
        print(Fore.RED + f"Error saving JSON results: {e}")

# Save Results to CSV
def save_results_csv(data):
    file_exists = os.path.isfile(RESULTS_FILE_CSV)
    try:
        with open(RESULTS_FILE_CSV, mode='a', newline='') as file:
            writer = csv.writer(file)
            if not file_exists:
                writer.writerow(["Timestamp", "Download Speed (Mbps)", "Upload Speed (Mbps)", "Ping (ms)", "IP Address", "Location", "Service Provider"])
            writer.writerow([
                data["timestamp"],
                data["download_speed"],
                data["upload_speed"],
                data["ping"],
                data["ip_info"].get("ip", "N/A"),
                f"{data['ip_info'].get('city', 'N/A')}, {data['ip_info'].get('region', 'N/A')}, {data['ip_info'].get('country', 'N/A')}",
                data["ip_info"].get("org", "N/A")
            ])
    except Exception as e:
        print(Fore.RED + f"Error saving CSV results: {e}")

# Display Graph of Results
def plot_results():
    if not os.path.exists(RESULTS_FILE_CSV):
        print(Fore.RED + "No CSV file found to plot results.")
        return

    timestamps, download_speeds, upload_speeds, pings = [], [], [], []
    try:
        with open(RESULTS_FILE_CSV, mode='r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                timestamps.append(datetime.strptime(row['Timestamp'], '%Y-%m-%d %H:%M:%S'))
                download_speeds.append(float(row['Download Speed (Mbps)']))
                upload_speeds.append(float(row['Upload Speed (Mbps)']))
                pings.append(float(row['Ping (ms)']))

        plt.figure(figsize=(10, 5))
        plt.plot(timestamps, download_speeds, label='Download Speed (Mbps)', marker='o')
        plt.plot(timestamps, upload_speeds, label='Upload Speed (Mbps)', marker='x')
        plt.plot(timestamps, pings, label='Ping (ms)', marker='s')

        plt.xlabel('Time')
        plt.ylabel('Speed / Ping')
        plt.title('Internet Speed Over Time')
        plt.legend()
        plt.grid(True)
        plt.tight_layout()
        plt.show()
    except Exception as e:
        print(Fore.RED + f"Error plotting results: {e}")

# Main Function
def main():
    parser = argparse.ArgumentParser(description="PingPulse - A Simple Internet Speed Test Tool")
    parser.add_argument('--plot', action='store_true', help='Plot the saved speed test results')
    args = parser.parse_args()

    if args.plot:
        plot_results()
        return

    print_banner()
    download_speed, upload_speed, ping_result, ip_info = measure_internet_speed()

    print_speed_results(download_speed, upload_speed, ping_result, ip_info)

    result_data = {
        "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        "download_speed": download_speed,
        "upload_speed": upload_speed,
        "ping": ping_result,
        "ip_info": ip_info
    }

    save_results_json(result_data)
    save_results_csv(result_data)

if __name__ == "__main__":
    main()

