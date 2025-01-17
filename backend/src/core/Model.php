<?php
namespace App\core;

use \PDO;
use App\core\Database;
class Model {
    protected $db;

    public function __construct() {
        $retries = 5;
        while ($retries > 0) {
            try {
                $this->db = new PDO(
                    'mysql:host=db;port=3306;dbname=my_database;charset=utf8',
                    'user',
                    'password'
                );
                $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                return;
            } catch (PDOException $e) {
                $retries--;
                if ($retries == 0) {
                    die("Database connection failed: " . $e->getMessage());
                }
                sleep(2);  // Wait for 2 seconds before retrying
            }
        }
    }

    public static function getConnection() {
        $connection = null;

        try {
            return Database::getConnection();
        } catch (PDOException $e) {
            if ($retries == 0) {
                die("Database connection failed: " . $e->getMessage());
            }
            sleep(2);  // Wait for 2 seconds before retrying
        }
    }
}
