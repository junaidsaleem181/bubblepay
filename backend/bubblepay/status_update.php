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

// Endpoint to handle Status Update request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $input = json_decode(file_get_contents('php://input'), true);

    // Validate input (order ID and new status)
    $orderId = isset($input['id']) ? intval($input['id']) : null;
    $newStatus = isset($input['status']) ? $input['status'] : null;
    if (!$orderId || !$newStatus) {
        http_response_code(400); // Bad request
        echo json_encode(array('error' => 'Order ID and new status are required'));
        exit;
    }

    // Update order status in the database
    $stmt = $conn->prepare("UPDATE orders SET order_status = ? WHERE id = ?");
    $stmt->bind_param("si", $newStatus, $orderId);
    $stmt->execute();

    // Check if update was successful
    if ($stmt->affected_rows > 0) {
        // Respond with success
        echo json_encode(array('message' => 'Order status updated successfully'));
    } else {
        http_response_code(404); // Not found
        echo json_encode(array('error' => 'Order not found or status already set to ' . $newStatus));
    }

    $stmt->close();
}
?>