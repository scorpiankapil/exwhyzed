from flask import Flask, render_template, request, redirect, url_for, abort
from flask import render_template_string
import os

app = Flask(__name__)

# Simple "shop" context to give templates something to play with
shop = {
    "name": "Wood & Wonder",
    "owner": "Elias Carpenter",
    "bio": "Fine furniture and curious customers.",
    # small easter comment referencing the (not-so-obvious) carpenter name
    "_hidden": "<!-- carpenter: Adam Smartschan -->"
}

@app.route("/")
def index():
    return render_template("index.html", shop=shop)

@app.route("/render", methods=["POST"])
def render_preview():
    # INTENTIONALLY VULNERABLE: we accept a template from the user and render it directly.
    # This is the SSTI vulnerability that participants must discover and exploit.
    template = request.form.get("template", "")
    # Bind a small context - intentionally includes shop and os so players can experiment
    context = {
        "shop": shop,
        "request": request,
        "user_agent": request.headers.get("User-Agent", ""),
        # os intentionally exposed as a *tempting* red herring (players may need to chain)
        "os": os
    }
    try:
        output = render_template_string(template, **context)
    except Exception as e:
        output = f"Template error: {e}"
    return render_template("result.html", output=output, shop=shop)

@app.route("/about")
def about():
    # Minor, safe route to give a story bit
    return (
        f"{shop['name']} — Owner: {shop['owner']}<br>"
        "The workshop holds many things. Some things are hidden deep."
    )

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
