# DreamCanvas App

Welcome to the DreamCanvas App! This application allows you to create unique artwork using Stable Diffusion models and explore various artistic styles.

## App Features:
- User authentication: login, logout, and signup functionality
- Image generation based on ideas, artistic styles, and artist styles
- View created images
- Change user parameters such as first name, last name, and password
- Delete the user account along with all associated images

Please note that the app is currently in the development stage, and additional features may be added in the future.

## Installation Steps:
### 1. Install Stable Diffusion:
- For macOS: [Stable Diffusion for Mac](https://stable-diffusion-art.com/install-mac/)
- For Windows: [Stable Diffusion for Windows](https://stable-diffusion-art.com/install-windows/)

### 2. Download and Add Model v1.5:
- [Download Stable Diffusion Model v1.5](https://huggingface.co/runwayml/stable-diffusion-v1-5)

### 3. Run the Stable Diffusion API:

- For macOS: Navigate to `~/stable-diffusion-webui` and run `./webui.sh --no-half --api`
- For Windows: Edit the `webui-user.bat` file in the `stable-diffusion-webui` folder and set `COMMANDLINE_ARGS=--api`. Then, double-click on `webui-user.bat`.

### 4. Clone the Repository:
``` 
git clone https://github.com/smurzz/dream-canvas-project.git 
```
### 5. Run the Backend Application:
- Navigate to the `sd-backend-app` directory, create a `.env` file with the following parameters:

    ```
    PORT=4848
    MYSQL_HOST=YOUR_MYSQL_HOST
    MYSQL_USER=YOUR_MYSQL_USER
    MYSQL_PASSWORD=YOUR_MYSQL_PASSWORD
    MYSQL_DB=YOUR_MYSQL_DB
    TOKEN_KEY=YOUR_TOKEN_KEY
    ```
- In the `sd-backend-app` directory, run `npm install` and then `npm dev run`

### 6. Install and Run the App:
- Navigate to the `sd-frontend-app` directory, run `npm install`.
- For iOS: Install an iOS simulator and run `npm run ios`
- For web: Run `npm run web`

## Requirements:
Before using the app, ensure that you have all the necessary dependencies installed locally:
- Stable Diffusion (generative AI)
- Node.js (backend); 
- React Native (frontend);
- MySQL (database). 