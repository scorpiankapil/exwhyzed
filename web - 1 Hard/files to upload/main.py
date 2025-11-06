# main.py
from flask import Flask, request, jsonify, render_template, redirect, url_for, session, flash
from pathlib import Path
from flask import send_from_directory
import json
import threading

APP_ROOT = Path(__file__).parent
DATA_DIR = APP_ROOT.parent / "private_data" 
ADMINS_FILE = DATA_DIR / "admins.json"
CTF_FLAG = "ctf7{auth_bypass_007}"
MAX_ADMINS = 10

app = Flask(__name__, static_folder='static', template_folder='templates')
# Replace this with a secure random value for real deployments
app.secret_key = "change-this-secret-to-a-random-value"
lock = threading.Lock()

# Ensure data dir & file exist
DATA_DIR.mkdir(exist_ok=True)
if not ADMINS_FILE.exists():
    ADMINS_FILE.write_text(json.dumps({"admins": []}, indent=2))


def load_admins():
    with lock:
        return json.loads(ADMINS_FILE.read_text())


def save_admins(data):
    with lock:
        ADMINS_FILE.write_text(json.dumps(data, indent=2))


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/gallery")
def gallery():
    return render_template("gallery.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/aadmin")
def admin_page():
    # Hidden admin page (not linked on index). Intentionally provides hint for CTF.
    return render_template("admin_page.html")

from flask import Response

@app.route("/robots.txt")
def robots_txt():
    content = """
    <html>
    <head>
        <style>
            body {
                font-family: monospace;
                white-space: pre; /* preserve spacing like a text file */
                margin: 0;
                padding: 0;
            }
            .error-section {
                background-color: #ffffff;
                color: black;
                padding: 20px;
            }
            .error-section h1 {
                font-family: 'Times New Roman', Times, serif;
                font-size: 32px;
                margin: 0 0 10px 0;
            }
            .error-section p {
                font-family: 'Times New Roman', Times, serif;
                font-size: 16px;
                margin: 0;
            }
            .robots-section {
                background-color: #fffff;
                color: white;
                padding: 20px;
            }
        </style>
    </head>
    <body>
        <div class="error-section">
<h1>Not Found</h1>
<p>The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.</p>
        </div>
        <div class="robots-section">
User-agent: *
Disallow: /aadmin
        </div>
    </body>
    </html>
    """
    return Response(content, mimetype="text/html")


@app.route("/api/admins", methods=["POST"])
def create_admin():
    """
    Vulnerable endpoint: unauthenticated admin creation.
    Expected JSON: { "username": "..", "password": "..", "display": "..." }
    """
    if not request.is_json:
        return jsonify({"error": "Request must be application/json"}), 400

    payload = request.get_json()
    username = (payload.get("username") or "").strip()
    password = (payload.get("password") or "").strip()
    display = (payload.get("display") or "").strip()

    if not username or not password:
        return jsonify({"error": "username and password required"}), 400

    data = load_admins()
    admins = data.get("admins", [])

    # check cap
    if len(admins) >= MAX_ADMINS:
        return jsonify({"error": "admin limit reached"}), 403

    # check unique username
    if any(a["username"].lower() == username.lower() for a in admins):
        return jsonify({"error": "username already exists"}), 409

    new = {
        "id": len(admins) + 1,
        "username": username,
        # NOTE: storing plaintext passwords deliberately for the CTF simplicity
        "password": password,
        "display": display,
    }
    admins.append(new)
    data["admins"] = admins
    save_admins(data)

    # Return public-safe response
    return jsonify({"id": new["id"], "username": new["username"]}), 201


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return render_template("login.html")

    # POST
    username = (request.form.get("username") or "").strip()
    password = (request.form.get("password") or "").strip()

    if not username or not password:
        flash("username and password required")
        return redirect(url_for("login"))

    data = load_admins()
    admins = data.get("admins", [])

    # verify
    matched = [
        a for a in admins
        if a["username"].lower() == username.lower() and a["password"] == password
    ]
    if not matched:
        flash("Invalid credentials")
        return redirect(url_for("login"))

    # success
    session.clear()
    session["is_admin"] = True
    session["username"] = matched[0]["username"]
    return redirect(url_for("flag"))


@app.route("/flag")
def flag():
    if not session.get("is_admin"):
        flash("You must log in to view the flag")
        return redirect(url_for("login"))
    return render_template("flag.html", flag=CTF_FLAG, username=session.get("username"))


@app.route("/api/admins/meta", methods=["GET"])
def meta():
    # optional metadata endpoint that does NOT leak passwords
    data = load_admins()
    admins = data.get("admins", [])
    return jsonify({"count": len(admins), "usernames": [a["username"] for a in admins]})


if __name__ == "__main__":
    # For development only. Use a production WSGI server for public deployments.
    app.run(host="127.0.0.1", port=5000, debug=True)
