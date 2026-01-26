<?php
namespace App\Resolvers;
use App\Services\UserService;

class UserResolver {
    public static function getUserById($root, $args) {
        return UserService::getUserById($args['id']);
    }
}
