## Description
This full-stack web application enables users to upload images of diseased plants to diagnose their illnesses. When logged in, it includes a dashboard with analytics and submission history to provide actionable insights. We used PyTorch to build a Machine Learning classification model on the backend, along with utilizing Google's Gemini Model to provide further insights, augmenting the disease classification and giving solutions to help cure the plants.

## Getting Started

The frontend is already hosted on https://crop-guard-peach.vercel.app/. However, the backend needs to be run locally. Instructions to set up local backend:

1. Clone git repo into your local folder
2. Enter the backend directory
3. Create a virtual environment with ```python -m venv .```
4. Install dependencies with ```pip install -r requirements.txt```
   This might take some time.
5. Start server by running ```python main.py```

From there, you should be able to use Crop Guard through the above link. Without backend, while the website will load it will not function correctly.

## Tech stack

Frontend - Next.js, Tailwind CSS, TypeScript
Backend - Python, FastAPI, PyTorch, SQLite

## Demo
video: https://youtu.be/x2lnc4zBGOo

<img width="1470" alt="Screenshot 2024-06-23 at 10 11 24 AM" src="https://github.com/kylej21/CropGuard/assets/111208810/55c0b262-8148-470e-80e4-fe45d89fb2eb">

<img width="1470" alt="Screenshot 2024-06-23 at 10 13 09 AM" src="https://github.com/kylej21/CropGuard/assets/111208810/c3c32b67-b527-4ff6-9c62-36edde7462d3">

## To Do
1. Improve model + expand to other plant types
2. Incorporate DB storage + retrieval of images
3. Live cam of model
4. Responsive UI for mobile + browser types
5. Fix HTTPS proxy security with Vercel - maybe nginx
6. Admin analytics
