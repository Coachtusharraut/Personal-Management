from PIL import Image, ImageDraw

# This script crops the square profile picture into a perfect circle with a transparent background.
# This removes the black corner areas so that the app launcher icon looks clean on all mobile devices.

# 1. Open the original JPEG profile picture and convert it to RGBA format (which supports transparency).
img = Image.open("/Users/apple/Desktop/Antigravity/app/src/main/assets/www/coach_avatar.jpg").convert("RGBA")
width, height = img.size

# 2. Create a solid black mask of the exact same dimensions as our square profile image.
mask = Image.new("L", (width, height), 0)
draw = ImageDraw.Draw(mask)

# 3. Draw a solid white circle inside the mask. The white area represents what we keep, and black will be transparent.
# We set the ellipse bounds exactly from (0, 0) to (width, height) to crop out the black corners outside the green ring.
draw.ellipse((0, 0, width, height), fill=255)

# 4. Create a new, completely transparent image of the same dimensions.
result = Image.new("RGBA", (width, height), (0, 0, 0, 0))

# 5. Paste the original image colors onto the transparent canvas, using the circular white mask to clip it.
result.paste(img, (0, 0), mask=mask)

# 6. Save the resulting transparent circular image as a PNG file.
result.save("/Users/apple/Desktop/Antigravity/app/src/main/assets/www/coach_avatar.png", "PNG")
print("Transparent circular avatar saved successfully as coach_avatar.png!")
