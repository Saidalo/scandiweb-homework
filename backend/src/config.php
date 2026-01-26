<?php
return [
    'db' => [
        'host' =>  getEnv('host'),
        'port' => getEnv('port'),
        'dbname' => getEnv('dbname'),
        'user' => getEnv('user'),
        'password' => getEnv('password'),
        'ssl_ca' => getEnv('ssl_ca'),
    ],
];
