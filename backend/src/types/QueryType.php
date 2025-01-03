<?php
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ObjectType;

class QueryType extends ObjectType {
    public function __construct() {
        parent::__construct([
            'name' => 'Query',
            'fields' => [
                'user' => [
                    'type' => new UserType(),
                    'args' => [
                        'id' => Type::nonNull(Type::int())
                    ],
                    'resolve' => ['UserResolver', 'getUserById']
                ]
            ]
        ]);
    }
}
