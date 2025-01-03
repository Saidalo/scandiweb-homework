<?php
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ObjectType;

class UserType extends ObjectType {
    public function __construct() {
        parent::__construct([
            'name' => 'User',
            'fields' => [
                'id' => Type::int(),
                'name' => Type::string(),
                'email' => Type::string(),
            ]
        ]);
    }
}
