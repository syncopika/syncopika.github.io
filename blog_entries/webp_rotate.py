# rotate webp images
#
# my jpg images taken via Samsung Galaxy A17 with the phone upright (e.g. portrait instead of landscape)
# get rotated when converted to webp :(. I think it has something to do with EXIF orientation tags? 

from PIL import Image

images_to_rotate = [
    #e.g. "images/okinawa + taiwan trip 2026/20261002_190311.webp",
]

for image in images_to_rotate:
    # my images need to be rotated 90 to the right (clockwise)
    with Image.open(image) as img:
        print(f"rotating {image}...")
        rotated_image = img.rotate(-90, expand=True)
        rotated_image.save(image, "webp")
        
print("done!")
    