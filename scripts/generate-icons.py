import os
from PIL import Image


def generate_icons(source_path, output_dir):
    try:
        img = Image.open(source_path)

        # Convert to RGBA for transparency support if needed
        if img.mode != "RGBA":
            img = img.convert("RGBA")

        # Make it square by cropping to center
        width, height = img.size
        new_size = min(width, height)

        left = (width - new_size) / 2
        top = (height - new_size) / 2
        right = (width + new_size) / 2
        bottom = (height + new_size) / 2

        img = img.crop((left, top, right, bottom))

        sizes = [72, 96, 128, 144, 152, 192, 384, 512]

        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        for size in sizes:
            resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
            output_path = os.path.join(output_dir, f"icon-{size}x{size}.png")
            resized_img.save(output_path, "PNG")
            print(f"Generated: {output_path}")

        # Generate favicon.ico
        favicon_size = (64, 64)
        favicon_img = img.resize(favicon_size, Image.Resampling.LANCZOS)
        favicon_path = os.path.join(os.path.dirname(output_dir), "favicon.ico")
        favicon_img.save(favicon_path, format="ICO", sizes=[(64, 64)])
        print(f"Generated: {favicon_path}")

        print("Success! All icons generated.")

    except ImportError:
        print("Error: Pillow library is not installed. Please run 'pip install Pillow'")
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    # Adjust paths relative to script location
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    source_img = os.path.join(project_root, "public", "original.jpg")
    output_icons = os.path.join(project_root, "public", "icons")

    generate_icons(source_img, output_icons)
