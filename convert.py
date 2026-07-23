import os
from PIL import Image
from pillow_heif import register_heif_opener

register_heif_opener()

brand_dir = 'Brand Images'
public_dir = 'public/brand'

if not os.path.exists(public_dir):
    os.makedirs(public_dir)

for filename in os.listdir(brand_dir):
    if filename.lower().endswith('.heic'):
        filepath = os.path.join(brand_dir, filename)
        img = Image.open(filepath)
        
        # Convert to RGB (jpeg doesn't support alpha)
        rgb_img = img.convert('RGB')
        
        # Save as jpeg
        new_filename = os.path.splitext(filename)[0] + '.jpeg'
        out_path = os.path.join(public_dir, new_filename)
        rgb_img.save(out_path, format='JPEG', quality=90)
        print(f"Converted {filename} to {new_filename}")
