from flask import Flask, render_template, jsonify, request
import requests

app = Flask(__name__)

#api = The MealDB API: pulling recipe information

MEALDB_BASE = "https://www.themealdb.com/api/json/v1/1"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/random")
def random_meal():
    res = requests.get(f"{MEALDB_BASE}/random.php")
    data = res.json()
    return jsonify(format_meal(data["meals"][0]))

@app.route("/api/search")
def search_by_ingredient():
    ingredient = request.args.get("ingredient", "")
    res = requests.get(f"{MEALDB_BASE}/filter.php?i={ingredient}")
    data = res.json()
    if not data["meals"]:
        return jsonify({"error": "No meals found"}), 404
    # Pick a random one from results
    import random
    meal_stub = random.choice(data["meals"])
    detail = requests.get(f"{MEALDB_BASE}/lookup.php?i={meal_stub['idMeal']}")
    meal = detail.json()["meals"][0]
    return jsonify(format_meal(meal))

def format_meal(meal):
    ingredients = []
    for i in range(1, 21):
        ing = meal.get(f"strIngredient{i}", "").strip()
        measure = meal.get(f"strMeasure{i}", "").strip()
        if ing:
            ingredients.append(f"{measure} {ing}".strip())
    return {
        "name": meal["strMeal"],
        "category": meal["strCategory"],
        "area": meal["strArea"],
        "instructions": meal["strInstructions"],
        "image": meal["strMealThumb"],
        "youtube": meal.get("strYoutube", ""),
        "ingredients": ingredients
    }

if __name__ == "__main__":
    app.run(debug=True)