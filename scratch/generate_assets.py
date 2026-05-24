import os
from PIL import Image, ImageDraw

# This script generates all custom launcher and in-app branding assets for Coach Tushar Raut.
# It reads the square JPEG profile picture, crops it to a perfect circle with a transparent background,
# and generates the correct multi-density assets for both the web app avatar and native Android launcher.

# Paths configuration
BASE_PATH = "/Users/apple/Desktop/Antigravity"
SOURCE_IMAGE_PATH = os.path.join(BASE_PATH, "app/src/main/assets/www/coach_avatar.jpg")
WEB_AVATAR_PATH = os.path.join(BASE_PATH, "app/src/main/assets/www/coach_avatar.png")
RES_PATH = os.path.join(BASE_PATH, "app/src/main/res")

# Density directories and their respective pixel sizes
# For adaptive icons, the standard canvas size is 108dp.
# To ensure the circular icon stays safe from outer mask clipping, we scale the coach's face to 66% size (72dp) in the center.
DENSITIES = {
    "mdpi": {"launcher": 48, "foreground": 108, "safe_size": 72},
    "hdpi": {"launcher": 72, "foreground": 162, "safe_size": 108},
    "xhdpi": {"launcher": 96, "foreground": 216, "safe_size": 144},
    "xxhdpi": {"launcher": 144, "foreground": 324, "safe_size": 216},
    "xxxhdpi": {"launcher": 192, "foreground": 432, "safe_size": 288}
}

def crop_to_circle(src_img):
    # Crop a square image to a perfect circle with transparency.
    # 1. Force the source image to be a square matching the smallest dimension
    w, h = src_img.size
    min_dim = min(w, h)
    square_img = src_img.crop(((w - min_dim) // 2, (h - min_dim) // 2, (w + min_dim) // 2, (h + min_dim) // 2))
    
    # 2. Convert to RGBA mode to support transparent alpha transparency
    square_img = square_img.convert("RGBA")
    
    # 3. Create a circular mask
    mask = Image.new("L", (min_dim, min_dim), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, min_dim, min_dim), fill=255)
    
    # 4. Generate the final circular image with a transparent background
    circular_img = Image.new("RGBA", (min_dim, min_dim), (0, 0, 0, 0))
    circular_img.paste(square_img, (0, 0), mask=mask)
    return circular_img

def main():
    print(f"Loading source profile picture from: {SOURCE_IMAGE_PATH}")
    if not os.path.exists(SOURCE_IMAGE_PATH):
        raise FileNotFoundError(f"Source image not found at: {SOURCE_IMAGE_PATH}")
        
    src_img = Image.open(SOURCE_IMAGE_PATH)
    print(f"Source image dimensions: {src_img.size}, mode: {src_img.mode}")
    
    # 1. Generate the Web App Avatar (coach_avatar.png)
    print("Generating transparent circular web avatar (coach_avatar.png)...")
    web_avatar = crop_to_circle(src_img)
    web_avatar = web_avatar.resize((1024, 1024), Image.Resampling.LANCZOS)
    web_avatar.save(WEB_AVATAR_PATH, "PNG")
    print(f"Web avatar successfully saved: {WEB_AVATAR_PATH}")
    
    # 2. Generate Native Android Launcher Icons for all densities
    for density, sizes in DENSITIES.items():
        dir_path = os.path.join(RES_PATH, f"mipmap-{density}")
        os.makedirs(dir_path, exist_ok=True)
        
        # --- A. Legacy Icons (ic_launcher.png and ic_launcher_round.png) ---
        # Legacy icons are standard transparent circles.
        legacy_size = sizes["launcher"]
        print(f"Generating legacy launcher icons for {density} ({legacy_size}x{legacy_size})...")
        
        legacy_icon = web_avatar.resize((legacy_size, legacy_size), Image.Resampling.LANCZOS)
        
        # Save standard and round legacy icons in their respective mipmap folder
        legacy_path = os.path.join(dir_path, "ic_launcher.png")
        round_path = os.path.join(dir_path, "ic_launcher_round.png")
        legacy_icon.save(legacy_path, "PNG")
        legacy_icon.save(round_path, "PNG")
        
        # --- B. Adaptive Foreground Icons (ic_launcher_foreground.png) ---
        # The adaptive foreground is a 108dp canvas where the face is centered at 66% scale (72dp) to prevent mask cropping.
        fg_canvas_size = sizes["foreground"]
        fg_safe_size = sizes["safe_size"]
        print(f"Generating adaptive foreground for {density} ({fg_canvas_size}x{fg_canvas_size}, safe face size={fg_safe_size})...")
        
        # Rescale the circular avatar to fit the safe center zone
        face_resized = web_avatar.resize((fg_safe_size, fg_safe_size), Image.Resampling.LANCZOS)
        
        # Create a new completely transparent canvas of the full size
        fg_canvas = Image.new("RGBA", (fg_canvas_size, fg_canvas_size), (0, 0, 0, 0))
        
        # Calculate centering offsets to paste the face perfectly in the center
        offset = (fg_canvas_size - fg_safe_size) // 2
        fg_canvas.paste(face_resized, (offset, offset))
        
        # Save foreground asset in the mipmap folder
        fg_path = os.path.join(dir_path, "ic_launcher_foreground.png")
        fg_canvas.save(fg_path, "PNG")
        
    print("\n[SUCCESS] All multi-density branding assets generated beautifully!")

if __name__ == "__main__":
    main()
