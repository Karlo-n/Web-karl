from flask import Flask, request, send_file
from PIL import Image, ImageDraw, ImageFont
import requests
from io import BytesIO
import os

app = Flask(__name__)

# Asegurar que la carpeta de fuentes existe
FONT_PATH = "api/utility/boostcard/fonts/NotoSans-VariableFont_wdth,wght.ttf"
if not os.path.exists(FONT_PATH):
    raise FileNotFoundError(f"La fuente no se encontró en {FONT_PATH}")

@app.route("/api/utility/boostcard")
def boostcard():
    # Obtener parámetros de la URL
    avatar_url = request.args.get("avatar")
    username = request.args.get("username", "Usuario")
    background_url = request.args.get("background")
    avatar_pos = request.args.get("avatarposicion", "50,50")
    username_pos = request.args.get("usernameposicion", "300,300")
    text_color = request.args.get("color", "#FFFFFF")
    
    # Convertir posiciones
    try:
        avatar_x, avatar_y = map(int, avatar_pos.split(","))
        username_x, username_y = map(int, username_pos.split(","))
    except ValueError:
        return {"error": "Las posiciones deben ser en formato x,y"}, 400
    
    # Descargar imágenes
    try:
        background = Image.open(BytesIO(requests.get(background_url).content)) if background_url else Image.new("RGB", (600, 300), (30, 30, 30))
        avatar = Image.open(BytesIO(requests.get(avatar_url).content)).convert("RGBA") if avatar_url else None
    except Exception:
        return {"error": "No se pudieron cargar las imágenes"}, 400
    
    # Redimensionar avatar
    if avatar:
        avatar = avatar.resize((100, 100))
        background.paste(avatar, (avatar_x, avatar_y), avatar)
    
    # Dibujar texto
    draw = ImageDraw.Draw(background)
    try:
        font = ImageFont.truetype(FONT_PATH, 40)
    except IOError:
        font = ImageFont.load_default()
    
    # Validar color en formato RGB
    try:
        text_color = tuple(int(text_color[i:i+2], 16) for i in (1, 3, 5))
    except ValueError:
        text_color = (255, 255, 255)  # Color por defecto blanco
    
    draw.text((username_x, username_y), username, fill=text_color, font=font)
    
    # Guardar la imagen resultante en un buffer
    output = BytesIO()
    background.save(output, format="PNG")
    output.seek(0)
    
    return send_file(output, mimetype="image/png")

if __name__ == "__main__":
    app.run(debug=True)
