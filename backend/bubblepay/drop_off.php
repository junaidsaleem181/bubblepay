<?php
// Include database connection file
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

// Simulated OTP generation function
function generateOTP() {
    return rand(100000, 999999); // Generate a random 6-digit OTP
}

// Endpoint to handle Drop Off request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Assume JSON input for simplicity
    $input = json_decode(file_get_contents('php://input'), true);

    // Validate input (phone number or email)
    $phone = isset($input['phone']) ? $input['phone'] : null;
    $email = isset($input['email']) ? $input['email'] : null;

    if (!$phone && !$email) {
        http_response_code(400); // Bad request
        echo json_encode(array('error' => 'Phone number or email is required'));
        exit;
    }

    // Generate OTP
    $otp = generateOTP();

    if ($phone) {
        $identifier = $phone;
    } else if ($email) {
        $identifier = $email;
    }

    // Default order status (you can adjust this as needed)
    $order_status = 'received';

    // Store identifier (phone/email), OTP, and order status in database
    $stmt = $conn->prepare("INSERT INTO orders (phone, email, otp, order_status) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $phone, $email, $otp, $order_status);
    $stmt->execute();

    // Check for successful insertion
    if ($stmt->affected_rows > 0) {
        http_response_code(200);
        header("Content-Type: application/json");
        echo json_encode(array('otp' => $otp));
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(array('error' => 'Failed to store OTP in database'));
    }

    // Close statement
    $stmt->close();
}
?>
