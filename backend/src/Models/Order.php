<?php
namespace App\Models;
use App\Core\Model;
use \PDO;

class Order extends Model {
    public $orders;

    function __construct($orders = []) {
        $this->orders = $orders;
    }

    public function prepare() {
        $values = [];
        foreach ($this->orders as $order) {
            $attributes = json_encode($order['selectedAttributes']);
            array_push($values, "('".$order['product_id']."', ".$order['quantity'].", '$attributes')");
        }
        return $values;
    }

    public function create() {
        $db = Product::getConnection();
        $prepared_values = join(", ", $this->prepare());
        $stmt = $db->prepare(
            "INSERT INTO orders (product_id, quantity, selectedAttributes)
            VALUES $prepared_values");
        $stmt->execute();
    }
}