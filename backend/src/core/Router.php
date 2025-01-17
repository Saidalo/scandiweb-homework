<?php
namespace App\core;
require_once __DIR__ . '/../../vendor/autoload.php';


class Router {
    protected $routes = [];

    public function add($route, $controller, $method) {
        $this->routes[$route] = ['controller' => $controller, 'method' => $method];
    }

    public function dispatch($url) {
        if (array_key_exists($url, $this->routes)) {
            $controllerName = $this->routes[$url]['controller'];
            $method = $this->routes[$url]['method'];
            $controller = new $controllerName();
            $controller->$method();
        } else {
            echo "404 - Page not found";
        }
    }
}
