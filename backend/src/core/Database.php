<?php
namespace App\core;
use \PDO;
class Database {
    private static $pdo = null;

    public static function getConnection() {
        if (self::$pdo === null) {
            $config = include(__DIR__ . '/../config.php');
            $dbConfig = $config['db'];
            
            $dsn = "mysql:host={$dbConfig['host']};dbname={$dbConfig['dbname']}";
            try {
                self::$pdo = new PDO($dsn, $dbConfig['user'], $dbConfig['password']);
                
                self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                die("Database connection failed: " . $e->getMessage());
            }
        }
        return self::$pdo;
    }
}
