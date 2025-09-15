:: https://www.reddit.com/r/FoundryVTT/comments/ssnyq9/bulk_convert_jpeg_to_webp/

@echo off
for %%f in (*.jpg) do cwebp -q 80 %%~nf.jpg -o %%~nf.webp