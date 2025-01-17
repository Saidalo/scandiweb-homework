<?php


require_once __DIR__ . '/../Services/UserService.php';

class UserResolver {
    public static function getUserById($root, $args) {
        return UserService::getUserById($args['id']);
    }
}
