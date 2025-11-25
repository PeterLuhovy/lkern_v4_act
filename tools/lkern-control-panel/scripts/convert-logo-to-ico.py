"""
================================================================
FILE: convert-logo-to-ico.py
PATH: /convert-logo-to-ico.py
DESCRIPTION: Convert Luhovy PNG logo to ICO format for Windows shortcuts
VERSION: v1.0.0
UPDATED: 2025-11-23 16:00:00
================================================================
"""

from PIL import Image
import os

def convert_png_to_ico(png_path, ico_path, sizes=None):
    """
    Convert PNG image to ICO format.

    Args:
        png_path: Path to source PNG file
        ico_path: Path to output ICO file
        sizes: List of icon sizes (default: [16, 32, 48, 64, 128, 256])
    """
    if sizes is None:
        sizes = [16, 32, 48, 64, 128, 256]

    print(f"Converting {png_path} to {ico_path}")

    # Open PNG image
    img = Image.open(png_path)

    # Convert to RGBA if needed
    if img.mode != 'RGBA':
        img = img.convert('RGBA')

    # Create list of resized images
    icon_images = []
    for size in sizes:
        resized = img.resize((size, size), Image.Resampling.LANCZOS)
        icon_images.append(resized)

    # Save as ICO with multiple sizes
    icon_images[0].save(
        ico_path,
        format='ICO',
        sizes=[(img.size[0], img.size[1]) for img in icon_images],
        append_images=icon_images[1:]
    )

    print(f"✅ Created: {ico_path}")
    print(f"   Sizes: {sizes}")


if __name__ == '__main__':
    # Paths
    png_logo = r"L:\divisions\lind\branding\logo-lind.png"
    ico_output = r"L:\system\lkern_codebase_v4_act\lkern-logo.ico"

    # Check if PNG exists
    if not os.path.exists(png_logo):
        print(f"❌ ERROR: PNG logo not found at {png_logo}")
        input("Press Enter to exit...")
        exit(1)

    # Convert
    try:
        convert_png_to_ico(png_logo, ico_output)
        print("\n✅ Conversion successful!")
        print(f"\nICO file location: {ico_output}")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        input("\nPress Enter to exit...")
        exit(1)

    input("\nPress Enter to exit...")
