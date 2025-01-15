<?php
namespace App;
require_once __DIR__ . '/../vendor/autoload.php';
// Manually include the Router class
require_once __DIR__ . '/core/Router.php';
use App\Core\Router;


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Max-Age: 86400'); // Cache the preflight response for 1 day
    exit(0); // Terminate further script execution for OPTIONS requests
}

header('Access-Control-Allow-Origin: *'); // Replace with your frontend URL for production
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

spl_autoload_register(function ($class) {
    $paths = [
        __DIR__ . '/core/' . $class . '.php',
        __DIR__ . '/controllers/' . $class . '.php',
        __DIR__ . '/models/' . $class . '.php',
    ];
    echo 'spl_autoload_register';
    foreach ($paths as $file) {
        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }
});

// Create Router instance and define routes
$router = new Router();
$router->add('/graphql', 'App\Controllers\HomeController', 'index');

// Parse the URL to get the route (e.g., / or /about)
$url = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Dispatch the URL to the appropriate controller and method
$router->dispatch($url);
