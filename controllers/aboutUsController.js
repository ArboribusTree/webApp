
async function getAboutUsPage(req, res) {
    try {
        const npmPackages = [
            { name: 'bcryptjs', version: '2.4.3', description: 'Library for hashing passwords securely.' },
            { name: 'body-parser', version: '1.20.2', description: 'Middleware for parsing incoming request bodies.' },
            { name: 'cookie-parser', version: '1.4.6', description: 'Middleware for parsing cookies.' },
            { name: 'ejs', version: '3.1.9', description: 'Embedded JavaScript templates for dynamic content rendering.' },
            { name: 'express', version: '4.18.2', description: 'Fast, unopinionated, minimalist web framework for Node.js.' },
            { name: 'express-ejs-layouts', version: '2.5.1', description: 'Layout support for EJS templates in Express.' },
            { name: 'express-handlebars', version: '7.1.2', description: 'Handlebars view engine for Express.' },
            { name: 'express-session', version: '1.17.3', description: 'Middleware for managing sessions in Express.' },
            { name: 'method-override', version: '3.0.0', description: 'Middleware for HTTP method override.' },
            { name: 'mongoose', version: '8.0.0', description: 'MongoDB object modeling tool designed for Node.js.' },
            { name: 'multer', version: '1.4.5-lts.1', description: 'Middleware for handling multipart/form-data, used for file uploads.' },
            { name: 'passport', version: '0.6.0', description: 'Authentication middleware for Node.js.' },
            { name: 'passport-local', version: '1.0.0', description: 'Passport strategy for authenticating with a username and password.' },
            { name: 'dotenv', version: '16.3.1', description: 'Load environment variables from a .env file.' },
            { name: 'nodemon', version: '3.0.1', description: 'Monitor for changes in your application and automatically restart the server.' },
        
        ];

        res.render('about/aboutus', {
            npmPackages: npmPackages
        });
    } catch (error) {
        console.error('Error fetching NPM packages:', error);
        res.render('error', {
            message: 'Error fetching NPM packages',
            error: error
        });
    }
}

module.exports = {
    getAboutUsPage
}