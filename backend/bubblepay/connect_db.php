<?php

//connect db
$dbHost = 'localhost';     
$dbUsername = 'root'; 
$dbPassword = '11223344';  //replace this with your root password
$dbName = 'bubblepay';   

$conn = new mysqli($dbHost, $dbUsername, $dbPassword, $dbName);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset('utf8');
?>