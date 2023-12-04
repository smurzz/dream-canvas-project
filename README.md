## DreamCanvas
### Description
DreamCanvas is a versatile mobile application that allows users to unleash their creativity by generating unique and artistic images from text inputs. The app provides a seamless experience with features like user authentication, image creation, model training, and account management.

### Features
##### User Authentication:

- Sign up for a new account.
- Log in with existing credentials.
<p style="text-align: center;">
    <img src="sd-frontend-app/public/images/screenshots/signup.png" height="400">
    <img src="sd-frontend-app/public/images/screenshots/login.png" height="400">
</p>

##### Image Creation:
- Generate artistic images from text.
    <p style="text-align: center;">
    <img src="sd-frontend-app/public/images/screenshots/generate.png" height="400">
    <img src="sd-frontend-app/public/images/screenshots/generated_image.png" height="400">
    </p>
- Combine text with uploaded images to create unique compositions.
    <p style="text-align: center;">
    <img src="sd-frontend-app/public/images/screenshots/uploaded_image.png" height="400">
    <img src="sd-frontend-app/public/images/screenshots/img2img_result.png" height="400">
    </p>
- Explore various artistic styles using Stablediffusion AI.
    ![Styles screenshot](sd-frontend-app/public/images/screenshots/artistic_styles.png "Styles screenshot")
    <p style="text-align: center;">
    <img src="sd-frontend-app/public/images/screenshots/artistic_styles.png" height="400">
    </p>


##### Model Training:
- Train your own models to customize image generation.
    <p style="text-align: center;">
    <img src="sd-frontend-app/public/images/screenshots/mila_1.png" height="400">
    <img src="sd-frontend-app/public/images/screenshots/mila_2.png" height="400">
    </p>
    <p style="text-align: center;">
    <img src="sd-frontend-app/public/images/screenshots/create_model.png" height="400">
    <img src="sd-frontend-app/public/images/screenshots/created_model.png" height="400">
    <img src="sd-frontend-app/public/images/screenshots/model_image.png" height="400">
    </p>

##### Account Management:
- Change password.
- Update first and last name.
- Delete your account.
    <p style="text-align: center;">
    <img src="sd-frontend-app/public/images/screenshots/account.png" height="400">
    </p>

##### Instructions:
- Read detailed instructions on using different features.
    <p style="text-align: center;">
    <img src="sd-frontend-app/public/images/screenshots/info.png" height="400">
    </p>

##### Image Management:
- View and manage created images.
- Save or delete images based on your preference.
    <p style="text-align: center;">
    <img src="sd-frontend-app/public/images/screenshots/album.png" height="400">
    <img src="sd-frontend-app/public/images/screenshots/image_view.png" height="400">
    </p>

### Technologies Used
1) Node.js
2) React Native
3) MySQL
5) Ngrok
6) Stablediffusion API

### Getting Started
##### Prerequisites
- Node.js installed
- MySQL database set up
- Stablediffusion API key

##### Installation
1) Clone the repository:
`git clone https://github.com/smurzz/dream-canvas-project.git`
2) Navigate to the backend directory:
`cd dream-canvas-project/sd-backend-app`
3) Install dependencies:
`npm install`
2) Navigate to the frontend directory:
`cd dream-canvas-project/sd-frontend-app`
3) Install dependencies:
`npm install`
4) Set up the database and configure environment variables in *_.env_*.
5) Start the application:
    * In _dream-canvas-project/sd-backend-app_ `npm dev run`
    * In _dream-canvas-project/sd-frontend-app_ `npm run web` or `npm run ios`.

### Usage
- Launch the app on your mobile device or emulator.
- Sign up or log in to your account.
- Explore different features, create images, and manage your account.

### Acknowledgments
Special thanks to the developers of Stablediffusion API.

### Contact
For any inquiries, please contact [Sofya Murzakova](murz.sophie@gmail.com).