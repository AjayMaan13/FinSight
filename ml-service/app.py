"""FinSight ML microservice (Flask).

Endpoints
---------
GET  /            service metadata
GET  /health      liveness/readiness probe
POST /forecast    30-day balance forecast with confidence band
POST /anomaly     transaction anomaly detection
POST /insights    computed spending insights

All POST endpoints accept JSON: {"transactions": [...], ...}. Requests are
validated and errors return a consistent JSON shape:
    {"success": false, "error": "<message>"}
"""

from __future__ import annotations

import os

from flask import Flask, jsonify, request
from flask_cors import CORS

from ml.anomaly import detect_anomalies
from ml.forecast import forecast_balance
from ml.insights import generate_insights

app = Flask(__name__)
CORS(app)


def _get_transactions(payload):
    """Validate and extract the transactions list from a request body."""
    if not isinstance(payload, dict):
        raise ValueError("Request body must be a JSON object")
    txns = payload.get("transactions")
    if txns is None:
        raise ValueError("No 'transactions' field provided")
    if not isinstance(txns, list):
        raise ValueError("'transactions' must be a list")
    return txns


def _error(message, status=400):
    return jsonify({"success": False, "error": message}), status


@app.errorhandler(500)
def _internal_error(err):  # pragma: no cover - safety net
    return jsonify({"success": False, "error": "Internal server error"}), 500


@app.route("/", methods=["GET"])
def home():
    return jsonify(
        {
            "service": "FinSight ML Service",
            "version": "1.0.0",
            "endpoints": {
                "GET /health": "Health check",
                "POST /forecast": "30-day balance forecast with confidence band",
                "POST /anomaly": "Transaction anomaly detection (Isolation Forest)",
                "POST /insights": "Computed spending insights",
            },
        }
    )


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/forecast", methods=["POST"])
def get_forecast():
    try:
        payload = request.get_json(silent=True)
        txns = _get_transactions(payload)
        days = int(payload.get("days", 30))
        starting_balance = float(payload.get("starting_balance", 0.0))
        result = forecast_balance(txns, days=days, starting_balance=starting_balance)
        return jsonify({"success": True, **result})
    except ValueError as exc:
        return _error(str(exc))
    except Exception as exc:  # pragma: no cover - unexpected
        return _error(str(exc), status=500)


@app.route("/anomaly", methods=["POST"])
def get_anomalies():
    try:
        payload = request.get_json(silent=True)
        txns = _get_transactions(payload)
        contamination = float(payload.get("contamination", 0.05))
        result = detect_anomalies(txns, contamination=contamination)
        return jsonify({"success": True, **result})
    except ValueError as exc:
        return _error(str(exc))
    except Exception as exc:  # pragma: no cover - unexpected
        return _error(str(exc), status=500)


@app.route("/insights", methods=["POST"])
def get_insights():
    try:
        payload = request.get_json(silent=True)
        txns = _get_transactions(payload)
        budgets = payload.get("budgets")
        starting_balance = float(payload.get("starting_balance", 0.0))
        result = generate_insights(
            txns, budgets=budgets, starting_balance=starting_balance
        )
        return jsonify({"success": True, **result})
    except ValueError as exc:
        return _error(str(exc))
    except Exception as exc:  # pragma: no cover - unexpected
        return _error(str(exc), status=500)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5002))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug)
