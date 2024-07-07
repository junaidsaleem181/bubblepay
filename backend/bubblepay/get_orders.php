<?php

require_once 'connect_db.php';

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

$sql = "SELECT * FROM orders";

$result = $conn->query($sql);

if ($result->num_rows > 0) {

    $orders = array();

    // Fetch rows and add to $orders array
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }

    // Respond with JSON-encoded array of orders
    echo json_encode($orders);
} else {
    // If no orders found
    echo json_encode(array('message' => 'No orders found'));
}

$conn->close();
?>
