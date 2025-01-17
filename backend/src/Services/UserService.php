<?php

require_once __DIR__ . '/../core/Database.php';

class UserService {
    public static function getUserById($id) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
