## DreamCanvas

### Description
DreamCanvas is a versatile mobile application that allows users to unleash their creativity by generating unique and artistic images from text inputs. The app provides a seamless experience with features like user authentication, image creation, model training, and account management.

### Features

##### User Authentication:
- Sign up for a new account.
- Log in with existing credentials.
<p align="center">
    <img src="sd-frontend-app/public/images/screenshots/signup.png" height="400" alt="signup">
    <img src="sd-frontend-app/public/images/screenshots/login.png" height="400" alt="login">
</p>

##### Image Creation:
- Generate artistic images from text.
    <p align="center">
    <img src="sd-frontend-app/public/images/screenshots/generate.png" height="400" alt="generate">
    <img src="sd-frontend-app/public/images/screenshots/generated_image.png" height="400" alt="generated_image">
    </p>
- Combine text with uploaded images to create unique compositions.
    <p align="center">
    <img src="sd-frontend-app/public/images/screenshots/uploaded_image.png" height="400" alt="uploaded_image">
    <img src="sd-frontend-app/public/images/screenshots/img2img_result.png" height="400" alt="img2img_result">
    </p>
- Explore various artistic styles using Stable Diffusion.
    <p align="center">
    <img src="sd-frontend-app/public/images/screenshots/artistic_styles.png" height="400" alt="artistic_styles">
    </p>

##### Model Training:
- Train your own models to customize image generation.
    <p align="center">
    <img src="sd-frontend-app/public/images/screenshots/mila_1.jpg" height="400" alt="mila_1">
    <img src="sd-frontend-app/public/images/screenshots/mila_2.JPG" height="400" alt="mila_2">
    <img src="sd-frontend-app/public/images/screenshots/create_model.png" height="400" alt="create_model">
    <img src="sd-frontend-app/public/images/screenshots/created_model.png" height="400" alt="created_model">
    <img src="sd-frontend-app/public/images/screenshots/model_image.png" height="400" alt="model_image">
    </p>

##### Account Management:
- Change password.
- Update first and last name.
- Delete your account.
    <p align="center">
        <img src="sd-frontend-app/public/images/screenshots/account.png" height="400" alt="account">
    </p>

##### Instructions:
- Read detailed instructions on using different features.
    <p align="center">
        <img src="sd-frontend-app/public/images/screenshots/info.png" height="400" alt="info">
    </p>

##### Image Management:
- View and manage created images.
- Save or delete images based on your preference.
    <p align="center">
    <img src="sd-frontend-app/public/images/screenshots/album.png" height="400" alt="album">
    <img src="sd-frontend-app/public/images/screenshots/image_view.png" height="400" alt="image_view">
    </p>

### Technologies Used
1. Node.js
2. React Native
3. MySQL
4. Ngrok
5. StableDiffusionAPI (ModelsLab)

### Getting Started

##### Prerequisites
- Node.js installed
- MySQL database set up
- Ngrok installed
- StableDiffusionAPI (ModelsLab) key
- Expo App

##### Installation
1. Clone the repository:
   `git clone https://github.com/smurzz/dream-canvas-project.git`
2. For Windows users, install `cross-env`:
   `npm install --save-dev cross-env`
   - In `sd-backend-app/dev.js`, replace `exec: 'NGROK_URL=${url} node'` with `exec: 'cross-env NGROK_URL=${url} node'`.
3. Navigate to the backend directory:
   `cd dream-canvas-project/sd-backend-app`
4. Install dependencies:
   `npm install`
5. Navigate to the frontend directory:
   `cd ../sd-frontend-app`
6. Install dependencies:
   `npm install`
7. Configure the `ip_address` variable in `sd-frontend-app/src/config/apiConfig.js` with your own IP address to ensure network connection between backend and frontend.
8. Set up the database and configure environment variables in `.env`.
9. Start the application:
   - In `sd-backend-app`, run `npm run dev`.
   - In `sd-frontend-app`, run `npx expo start` or `npm run ios`.

### Usage
- Launch the app on your mobile device using the Expo App or an emulator.
- Sign up or log in to your account.
- Explore different features, create images, and manage your account.

### Acknowledgments
Special thanks to the developers of the StableDiffusionAPI.

### Contact
For any inquiries, please contact [Sofya Murzakova](mailto:murz.sophie@gmail.com).
