<?php


require_once __DIR__ . '/../services/UserService.php';

class UserResolver {
    public static function getUserById($root, $args) {
        return UserService::getUserById($args['id']);
    }
}
