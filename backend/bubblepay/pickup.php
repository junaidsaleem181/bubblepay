<?php

require_once 'connect_db.php'; 

// Allow CORS
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

// Endpoint to handle Pickup request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $input = json_decode(file_get_contents('php://input'), true);

    // Validate input (OTP)
    $otp = isset($input['otp']) ? intval($input['otp']) : null;
    if (!$otp) {
        http_response_code(400); // Bad request
        echo json_encode(array('error' => 'OTP is required'));
        exit;
    }

    $sql = "SELECT * FROM orders WHERE otp = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $otp);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Order found, fetch details
        $order = $result->fetch_assoc();

        if ($order['order_status'] === 'ready') {
            // Update order status to 'picked'
            $updateSql = "UPDATE orders SET order_status = 'picked' WHERE id = ?";
            $stmt = $conn->prepare($updateSql);
            $stmt->bind_param("i", $order['id']);
            if ($stmt->execute()) {
                http_response_code(200); 
                echo json_encode(array('message' => 'Order picked up successfully'));
            } else {
                http_response_code(500); // Server error
                echo json_encode(array('error' => 'Error updating order status'));
            }
        } else if ($order['order_status'] === 'received' || $order['order_status'] === 'processing') {
            http_response_code(202); //accepted request
            echo json_encode(array('error' => 'Order not ready yet'));
        } else {
            http_response_code(400); // Bad request
            echo json_encode(array('error' => 'Order already picked up'));
        }
    } else {
        http_response_code(404); // Not found
        echo json_encode(array('error' => 'Invalid OTP'));
    }

    // Close connection
    $conn->close();
}
?>