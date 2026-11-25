"""Genera los recursos de marca del sitio a partir del logo original.

- emblem.png: emblema circular con fondo blanco y exterior transparente.
- icon.png / apple-icon.png: icono de la aplicación.
- logo.jpeg: copia del logotipo completo para el footer.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "frontend" / "public"
SOURCE = ROOT / "logo.jpeg"

NAVY = (7, 27, 51)


def build_emblem() -> Image.Image:
    original = Image.open(SOURCE).convert("RGB")

    # El emblema ocupa aproximadamente x=165..635, y=75..550 del original.
    emblem = original.crop((165, 75, 635, 550)).convert("RGBA")
    width, height = emblem.size

    # Limpia el fondo gris claro a blanco puro.
    pixels = emblem.load()
    for y in range(height):
        for x in range(width):
            r, g, b, _ = pixels[x, y]
            if min(r, g, b) > 226 and max(r, g, b) - min(r, g, b) < 20:
                pixels[x, y] = (255, 255, 255, 255)

    # Recorta en círculo para eliminar el patrón de fondo de las esquinas.
    mask = Image.new("L", (width, height), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((2, 2, width - 3, height - 3), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(1.2))
    emblem.putalpha(mask)

    size = 640
    canvas = Image.new("RGBA", (size, size), (255, 255, 255, 0))
    emblem.thumbnail((size - 28, size - 28), Image.LANCZOS)
    canvas.alpha_composite(
        emblem,
        ((size - emblem.width) // 2, (size - emblem.height) // 2),
    )
    return canvas


def build_icon(emblem: Image.Image) -> Image.Image:
    size = 512
    icon = Image.new("RGBA", (size, size), NAVY)
    draw = ImageDraw.Draw(icon)
    draw.ellipse((10, 10, size - 11, size - 11), outline=(201, 162, 74, 255), width=3)
    inner = emblem.copy()
    inner.thumbnail((size - 74, size - 74), Image.LANCZOS)
    icon.alpha_composite(inner, ((size - inner.width) // 2, (size - inner.height) // 2))
    return icon


def main() -> None:
    PUBLIC.mkdir(parents=True, exist_ok=True)
    Image.open(SOURCE).save(PUBLIC / "logo.jpeg", quality=94)

    emblem = build_emblem()
    emblem.save(PUBLIC / "emblem.png")

    icon = build_icon(emblem)
    icon.save(PUBLIC / "icon.png")
    icon.save(PUBLIC / "apple-icon.png")

    print("Recursos generados en", PUBLIC)


if __name__ == "__main__":
    main()
