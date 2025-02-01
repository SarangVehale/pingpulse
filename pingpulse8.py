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
import requests

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

        # Download and upload in parallel using threading
        results = {'download': None, 'upload': None}

        def download_speed():
            results['download'] = st.download()

        def upload_speed():
            results['upload'] = st.upload(pre_allocate=False)

        download_thread = threading.Thread(target=download_speed)
        upload_thread = threading.Thread(target=upload_speed)

        download_thread.start()
        upload_thread.start()

        download_thread.join()
        upload_thread.join()

        download_speed_mbps = results['download'] / 1_000_000  # Convert to Mbps
        upload_speed_mbps = results['upload'] / 1_000_000      # Convert to Mbps
        ping_result = st.results.ping

        # Fetch IP info
        ip_info = requests.get('https://ipinfo.io/json').json()

        print_speed_results(download_speed_mbps, upload_speed_mbps, ping_result, ip_info)

        # Save the results
        save_results(download_speed_mbps, upload_speed_mbps, ping_result, ip_info)

    except Exception as e:
        print(Fore.RED + f"An error occurred while measuring internet speed: {e}")

# Save results to JSON and CSV
def save_results(download_speed, upload_speed, ping_result, ip_info):
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    result_data = {
        'timestamp': timestamp,
        'download_speed_mbps': download_speed,
        'upload_speed_mbps': upload_speed,
        'ping_ms': ping_result,
        'ip_info': ip_info
    }

    # Save to JSON
    with open(RESULTS_FILE_JSON, 'a') as json_file:
        json.dump(result_data, json_file)
        json_file.write('\n')

    # Save to CSV
    file_exists = os.path.isfile(RESULTS_FILE_CSV)
    with open(RESULTS_FILE_CSV, 'a', newline='') as csv_file:
        fieldnames = ['timestamp', 'download_speed_mbps', 'upload_speed_mbps', 'ping_ms', 'ip', 'city', 'region', 'country', 'org']
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)

        if not file_exists:
            writer.writeheader()

        writer.writerow({
            'timestamp': timestamp,
            'download_speed_mbps': download_speed,
            'upload_speed_mbps': upload_speed,
            'ping_ms': ping_result,
            'ip': ip_info.get('ip', 'N/A'),
            'city': ip_info.get('city', 'N/A'),
            'region': ip_info.get('region', 'N/A'),
            'country': ip_info.get('country', 'N/A'),
            'org': ip_info.get('org', 'N/A')
        })

# Main function to handle arguments
def main():
    parser = argparse.ArgumentParser(description='PingPulse - Internet Speed Test Tool')
    parser.add_argument('--no-banner', action='store_true', help='Do not display the ASCII banner')
    args = parser.parse_args()

    if not args.no_banner:
        print_banner()

    measure_internet_speed()

if __name__ == "__main__":
    main()

