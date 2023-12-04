## DreamCanvas
### Description
DreamCanvas is a versatile mobile application that allows users to unleash their creativity by generating unique and artistic images from text inputs. The app provides a seamless experience with features like user authentication, image creation, model training, and account management.

### Features
##### User Authentication:

- Sign up for a new account.
- Log in with existing credentials.
![Signup screenshot](sd-frontend-app/public/images/screenshots/signup.png =250x)
![Login screenshot](sd-frontend-app/public/images/screenshots/login.png "Login screenshot")

##### Image Creation:
- Generate artistic images from text.
    ![Homepage screenshot](sd-frontend-app/public/images/screenshots/generate.png "Homepage screenshot")
    ![Generated image screenshot](sd-frontend-app/public/images/screenshots/generated_image.png "Generated image screenshot")
- Combine text with uploaded images to create unique compositions.
    ![Img2img uploaded image screenshot](sd-frontend-app/public/images/screenshots/uploaded_image.png "Img2img uploaded image screenshot")
    ![Img2img uploaded image screenshot](sd-frontend-app/public/images/screenshots/uploaded_image.png "Img2img result screenshot")
- Explore various artistic styles using Stablediffusion AI.
    ![Styles screenshot](sd-frontend-app/public/images/screenshots/artistic_styles.png "Styles screenshot")


##### Model Training:
- Train your own models to customize image generation.
    ![Mila 1 screenshot](sd-frontend-app/public/images/screenshots/mila_1.jpg "Mila 1 screenshot")
    ![Mila 2 screenshot](sd-frontend-app/public/images/screenshots/mila_2.JPG "Mila 2 screenshot")
    ![Create model screenshot](sd-frontend-app/public/images/screenshots/create_model.png "Create model screenshot")
    ![Created model screenshot](sd-frontend-app/public/images/screenshots/created_model.png "Created model screenshot")
    ![Create model screenshot](sd-frontend-app/public/images/screenshots/model_image.png "Create model screenshot")

##### Account Management:
- Change password.
- Update first and last name.
- Delete your account.
    ![Account screenshot](sd-frontend-app/public/images/screenshots/account.png "Account screenshot")

##### Instructions:
- Read detailed instructions on using different features.
    ![Info screenshot](sd-frontend-app/public/images/screenshots/info.png "Info screenshot")

##### Image Management:
- View and manage created images.
- Save or delete images based on your preference.
    ![Info screenshot](sd-frontend-app/public/images/screenshots/album.png "Info screenshot")
    ![Image view screenshot](sd-frontend-app/public/images/screenshots/image_view.png "Image view screenshot")

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