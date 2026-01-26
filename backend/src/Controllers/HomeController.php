<?php
namespace App\Controllers;
require_once __DIR__ . '/../../vendor/autoload.php';
use GraphQL\Type\Schema;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\GraphQL;
use App\Core\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Order;
use App\Services\ProductService;

class HomeController extends Controller {
    public function index() {
      print_r(Category::all());die();

        $rawData = file_get_contents('php://input');

        $requestData = json_decode($rawData, true);
        if (!is_array($requestData) || !isset($requestData['query'])) {
          http_response_code(400);
          echo json_encode(['errors' => [['message' => 'Invalid GraphQL request']]]);
          return;
        }
        $categoryType = new ObjectType([
            "name" => "Category",
            "description" => "Product Categories",
            "fields" => [
                "id" => Type::int(),
                "name" => Type::string()
            ]
        ]);

        $pricesType = new ObjectType([
            "name" => "prices",
            "description" => "Prices of product",
            "fields" => [
                "amount" => Type::float(),
                "currency" => Type::string(),
            ]
        ]);

        $itemsType = new ObjectType([
            "name" => "Item",
            "description" => "Attribute item",
            "fields" => [
                "display_value" => Type::string(),
                "value" => Type::string(),
                "id" => Type::string(),
            ]
        ]);

        $attributesType = new ObjectType([
            "name" => "Attribute",
            "description" => "Attrinute type",
            "fields" => [
                "id" => Type::string(),
                "items" => Type::listOf($itemsType),
                "name" => Type::string(),
                "type" => Type::string(),
            ]
        ]);

        $productType = new ObjectType([
            "name" => "Product",
            "description" => "Product type",
            "fields" => [
                "id" => Type::string(),
                "name" => Type::string(),
                "inStock" => Type::boolean(),
                "gallery" => Type::listOf(Type::string()),
                "description" => Type::string(),
                "category" => Type::string(),
                "attributes" => Type::listOf($attributesType),
                "prices" =>Type::listOf($pricesType),
                "brand" => Type::string(),
            ]
        ]);

        $orderInputType = new InputObjectType([
            'name' => 'OrderInput',
            'fields' => [
                'product_id' => Type::nonNull(Type::string()),
                'quantity' => Type::nonNull(Type::int()),
                'selectedAttributes' => Type::string(),
            ],
        ]);

        try {
            $queryType = new ObjectType([
                'name' => 'Query',
                'fields' => [
                    'categories' => [
                        'type' => Type::listOf($categoryType),
                        'description' => "Product categories",
                        'resolve' => function(){
                            return Category::all();
                        }
                    ],
                    'products' => [
                        'type' => Type::listOf($productType),
                        'description' => 'List of products',
                        'args' => [
                            'category' => Type::nonNull(Type::string()),
                        ],
                        'resolve' => function($root, $args) {
                            $products = ProductService::assertProductProperties(Product::getAll($args['category']));
                            return $products;
                        }
                    ],
                    'product' => [
                        'type' => $productType,
                        'description' => 'Retrieve a single product by ID',
                        'args' => [
                            'id' => Type::nonNull(Type::string()), // ID is required for this query
                        ],
                        'resolve' => function ($root, $args) {
                            $product = ProductService::assertProductProperties(Product::find($args['id']));

                            return $product[$args['id']];
                        },
                    ],
                ]
            ]);


            $mutationType = new ObjectType([
                'name' => 'Mutation',
                'fields' => [
                    'placeOrder' => [
                        'type' => Type::string(), // Return type of the mutation
                        'args' => [
                            'orders' => Type::nonNull(Type::listOf(Type::nonNull($orderInputType))),
                        ],
                        'resolve' => function ($root, $args) {
                            if (!isset($args['orders'])) {
                                throw new \Exception('Orders input is required.');
                            }
                            $product = new Order($args['orders']);

                            $product->create();
                            return 'success';
                        },
                    ],
                ],
            ]);

            $schema = new Schema([
                'query' => $queryType,
                'mutation' => $mutationType
            ]);

            if (!is_array($requestData) || !isset($requestData['query'])) {
              http_response_code(400);
              echo json_encode(['error' => 'Invalid GraphQL request']);
              return;
            }

            $result = GraphQL::executeQuery(
              $schema,
              $requestData['query'],
              null,
              null,
              $requestData['variables'] ?? null
            )->toArray();
        } catch(\Throwable $e) {
            $result = [
                'error' => [
                      ['message' => $e->getMessage()]
                ]
            ];
        }

        //error_log(json_encode(headers_list()));
        echo json_encode($result);
        //$this->render('home', $result);  // This will look for ../views/home.php
    }
}
