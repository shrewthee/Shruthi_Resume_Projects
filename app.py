from flask import Flask, render_template, jsonify, request
import requests

app = Flask(__name__)

API_KEY = "b3b37615c1d6dcc42ed38d41"  # Free key from exchangerate-api.com
BASE_URL = "https://v6.exchangerate-api.com/v6"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/currencies")
def get_currencies():
    res = requests.get(f"{BASE_URL}/{API_KEY}/codes")
    data = res.json()
    if data["result"] != "success":
        return jsonify({"error": "Could not fetch currencies"}), 500
    return jsonify(data["supported_codes"])

@app.route("/api/convert")
def convert():
    from_currency = request.args.get("from", "USD")
    to_currency = request.args.get("to", "EUR")
    amount = request.args.get("amount", 1, type=float)

    res = requests.get(f"{BASE_URL}/{API_KEY}/pair/{from_currency}/{to_currency}/{amount}")
    data = res.json()

    if data["result"] != "success":
        return jsonify({"error": "Conversion failed"}), 500

    return jsonify({
        "from": from_currency,
        "to": to_currency,
        "amount": amount,
        "result": round(data["conversion_result"], 2),
        "rate": round(data["conversion_rate"], 4),
        "last_updated": data["time_last_update_utc"]
    })

if __name__ == "__main__":
    app.run(debug=True)