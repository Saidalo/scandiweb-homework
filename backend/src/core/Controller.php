<?php
namespace App\core;

class Controller {
    public function render($view, $data = []) {
        $viewPath = __DIR__ . '/../views/' . $view . '.php';
        if (file_exists($viewPath)) {
            include($viewPath);
        } else {
            echo "View file not found: " . $viewPath;
        }
    }
}
