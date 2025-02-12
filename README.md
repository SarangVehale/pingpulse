# PingPulse - Internet Speed Test Tool

PingPulse is a Python-based tool for measuring your internet connection's download speed, upload speed, and ping latency. The results are displayed in a clean, color-coded format and saved in both JSON and CSV formats for record-keeping. Additionally, PingPulse fetches your IP information, including geolocation and service provider details.

*Note* : Refer to pingpulse-frontend3/ if you need a GUI (react-based), else if you only want the cli-version follow the below instructions.
## Features

- Measure download speed, upload speed, and ping latency
- Display results in a user-friendly, color-coded format
- Fetch and display IP information (location, ISP, etc.)
- Save results in JSON and CSV formats
- Optimized for faster performance using threading
- Customizable output with command-line arguments

## Requirements

- Python 3.x
- Required Libraries:
  - `speedtest-cli`
  - `argparse`
  - `json`
  - `csv`
  - `os`
  - `sys`
  - `pyfiglet`
  - `colorama`
  - `threading`
  - `requests`

Install the required libraries using pip:

```bash
pip install speedtest-cli pyfiglet colorama requests fastapi
```

## Usage

Run the script using Python:

```bash
python pingpulse8.py
```

### Command-Line Arguments

- `--json`: Save results in JSON format (default).
- `--csv`: Save results in CSV format.
- `--both`: Save results in both JSON and CSV formats.
- `--no-save`: Run the test without saving the results.

### Example Commands

- Save results in JSON format:
  ```bash
  python pingpulse8.py --json
  ```

- Save results in CSV format:
  ```bash
  python pingpulse8.py --csv
  ```

- Save results in both JSON and CSV formats:
  ```bash
  python pingpulse8.py --both
  ```

- Run the test without saving results:
  ```bash
  python pingpulse8.py --no-save
  ```

## Output

The output will display:

- Download Speed (in Mbps)
- Upload Speed (in Mbps)
- Ping (in ms)
- IP Address
- Location (City, Region, Country)
- Service Provider

### Example Output

```
========================================
Speed Test Results
----------------------------------------
Download Speed: 95.32 Mbps
Upload Speed: 32.15 Mbps
Ping: 15.42 ms

----------------------------------------
IP Address: 192.168.1.1
Location: New York, NY, USA
Service Provider: Example ISP
========================================
```

## Saving Results

Results are saved in the following files in the script directory:

- `speed_test_results.json`
- `speed_test_results.csv`

## License

This project is licensed under the MIT License.

## Contributions

Feel free to submit issues or pull requests if you'd like to contribute to this project!

## Acknowledgments

- [speedtest-cli](https://github.com/sivel/speedtest-cli) for the speed testing functionality.
- [pyfiglet](https://github.com/pwaller/pyfiglet) for the ASCII art banner.
- [colorama](https://github.com/tartley/colorama) for terminal text formatting.
- [ipinfo.io](https://ipinfo.io/) for IP geolocation information.


