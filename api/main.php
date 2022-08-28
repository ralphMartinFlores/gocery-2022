<?php 
	require_once("./config/Config.php");
	require_once("./models/OTP.php");

	$db = new Connection();
	$pdo = $db->connect();
	$gm = new GlobalMethods($pdo);
	$auth = new Auth($pdo);
	$post = new Post($pdo);

	if (isset($_REQUEST['request'])) {
		$req = explode('/', rtrim(($_REQUEST['request']), '/'));
	} else {
		$req = array("errorcatcher");
	}

	switch($_SERVER['REQUEST_METHOD']) {
		case 'POST':
			switch($req[0]) {
				case 'accounts':
					if(count($req)>1){
						echo json_encode($gm->exec_query($req[0], $req[1]),JSON_PRETTY_PRINT);
					} else {
						echo json_encode($gm->exec_query($req[0], null),JSON_PRETTY_PRINT);
					}
				break;

				case 'stores':
					if(count($req)>1){
						echo json_encode($gm->exec_query($req[0], $req[1]),JSON_PRETTY_PRINT);
					} else {
						echo json_encode($gm->exec_query($req[0], null),JSON_PRETTY_PRINT);
					}
				break;

				case 'products':
					if(count($req)>1){
						echo json_encode($gm->exec_query($req[0], $req[1]),JSON_PRETTY_PRINT);
					} else {
						echo json_encode($gm->exec_query($req[0], null),JSON_PRETTY_PRINT);
					}
				break;

				case 'storeProducts':
					if(count($req)>1){
						echo json_encode($post->storeProducts('products', $req[1]),JSON_PRETTY_PRINT);
					} else {
						echo json_encode($post->storeProducts('products', null),JSON_PRETTY_PRINT);
					}
				break;

				case 'productDesc':
					if(count($req)>1){
						echo json_encode($post->productDescrition('products', $req[1]),JSON_PRETTY_PRINT);
					} else {
						echo json_encode($post->productDescrition('products', null),JSON_PRETTY_PRINT);
					}
				break;

				case 'cart':
					if(count($req)>1){
						echo json_encode($gm->exec_query($req[0], $req[1]),JSON_PRETTY_PRINT);
					} else {
						echo json_encode($gm->exec_query($req[0], null),JSON_PRETTY_PRINT);
					}
				break;

				case 'orders':
					if(count($req)>1){
						echo json_encode($gm->exec_query($req[0], $req[1]),JSON_PRETTY_PRINT);
					} else {
						echo json_encode($gm->exec_query($req[0], null),JSON_PRETTY_PRINT);
					}
				break;

				case 'order_details':
					if(count($req)>1){
						echo json_encode($post->order_details($req[1]),JSON_PRETTY_PRINT);
					} else {
						echo json_encode($post->order_details(null),JSON_PRETTY_PRINT);
					}
				break;

				case 'order_items':
					if(count($req)>1){
						echo json_encode($gm->exec_query($req[0], $req[1]),JSON_PRETTY_PRINT);
					} else {
						echo json_encode($gm->exec_query($req[0], null),JSON_PRETTY_PRINT);
					}
				break;

				case 'addToCart':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
					echo json_encode($gm->insert("cart", $d));
				break;

				case 'addQuantity':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
					echo json_encode($gm->update("cart", $d, "cart_id = $req[1]"));
				break;

				case 'subtractQuantity':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
					echo json_encode($gm->update("cart", $d, "cart_id = $req[1]"));
				break;

				case 'archiveCart':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
					echo json_encode($gm->update("cart", $d, "cart_id = $req[1]"));
				break;

				case 'clearCart':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
					echo json_encode($gm->update("cart", $d, "acc_id = $req[1]"));
				break;

				case 'placeOrder':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
					echo json_encode($post->placeOrder($d));
				break;

				case 'cancelOrder':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
					echo json_encode($gm->update("orders", $d, "order_id = $req[1]"));
				break;

				case 'checkEmail':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
					echo json_encode($auth->checkEmail($d));
				break;

				case 'checkUsername':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
					echo json_encode($auth->checkUsername($d));
				break;

				case 'verifyEmail':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
					echo json_encode($auth->verifyEmail($d));
				break;

				case 'login':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
					echo json_encode($auth->login($d));
				break;

				case 'register':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
					echo json_encode($auth->register($d));
				break;

				case 'sendOTP':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
					echo json_encode(sendOTP($d));
				break;

				case 'getOTP':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
					echo json_encode($post->getOTP($d));
				break;

				case 'updateProfile':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
					echo json_encode($gm->update("accounts", $d, "acc_id = $req[1]"));
				break;

				case 'updatePassword':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
					echo json_encode($auth->updatePassword($d, "acc_id = $req[1]"));
				break;

				default:
					http_response_code(400);
					echo "Invalid Routee haha";
				break;
			}
		break;

		case 'GET':
			switch ($req[0]) {
				default:
				http_response_code(400);
				echo "Bad Request";
				break;
			}
			break;

		default:
			http_response_code(403);
			echo "Please contact the Systems Administrator";
		break;
	}
?>