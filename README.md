# Travel Tracker App

This project allows users to keep track of their travels with ease! I also made updates to the project 
to include family members or friends to allow others to share in the fun. This application allows users to view their journey locations on an interactive map by integrating a map API, and it stores data efficiently in a PostgreSQL database. 

## Technologies Used

- Node.js: JavaScript runtime environment used for building the server.
- Express: Web framework for Node.js that simplifies server creation and routing.
- Body-Parser: Middleware to parse incoming request bodies in various formats (JSON, URL-encoded).
- PostgreSQL: Used to store user data and information about visited countries. 
- Map API Interaction: The map is integrated with http://www.w3.org/2000/svg to show users' visited countries.

## Installation Steps

To install this project, you will want to follow these instructions in order:
1. Ensure you have Node.js installed on your local machine. Once Node.js is running, open a new terminal and move to the next step. 
2. Clone the repository by entering 'git clone https://github.com/ericdurban/World-Travel-Tracker.git' in the terminal.
3. Enter in terminal, 'cd World-Travel-Tracker'. 
4. Enter in terminal, 'npm install' to ensure all the needed dependencies are added and installed locally. 
PLEASE NOTE: If you have any issues in later steps running the project, try individually installing dependencies listed on top of index.js file. For example, enter in terminal, 'npm i express' to install express dependency package. 
5. Enter in terminal, 'npm start'. Your terminal should register the command and provide a message "Server running on port: 3000". 

## Usage

Steps to utilize the application:
1. Once you've received the message from your terminal that the server is running, open your browser and navigate to http://localhost:3000. 
2. Now that you are on the application, you have three options.
    1. Add countries under a user: You can select a pre-existing user. Once that user is selected, you can then enter a country name in the add section. 
    2. Reset countries for a user: You can enter a user's name in the middle bar and click the 'reset' button. Once clicked, you will see that that user's data will be reset. In other words the highlighted countries will all be removed. 
    3. Remove a user: You can enter a user in the far right bar and click 'remove'. This will remove the user from the table permanently. 
    PLEASE NOTE: These functions will not work if the country or user is spelled incorrectly or is missing proper capitilization. 

## Contributing 

If you'd like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch (git checkout -b feature/your-feature).
3. Make your changes.
4. Commit your changes (git commit -am 'Add new feature').
5. Push to the branch (git push origin feature/your-feature).
6. Create a new pull request.

## License
This project does not currently have a license. All rights reserved. 
This project is free to use for personal, non-commercial purposes only. You may not distribute or modify the project without the author's permission.

## Acknowledgements

- Thanks to Bootstrap for the great UI Framework.
- Thanks to Angela Yu and her amazing bootcamp that helped me develop the tools I needed to make this website!
- Thanks to http://www.w3.org/2000/svg for allowing me to pull their data publicly. 
