<?php
    class Post{
        protected $pdo;

        public function __construct(\PDO $pdo) {
			$this->pdo = $pdo;
		}

		public function productDescrition($table, $filter_data) {

			$this->sql = "SELECT * FROM $table";

			if($filter_data != null) {
				$this->sql .= " WHERE product_id=$filter_data";
			}

			$data = array(); $code = 0; $msg= ""; $remarks = "";
			try {
				if ($res = $this->pdo->query($this->sql)->fetchAll()) {
					foreach ($res as $rec) { array_push($data, $rec);}
					$res = null; $code = 200; $msg = "Successfully retrieved the requested records"; $remarks = "success";
				}
			} catch (\PDOException $e) {
				$msg = $e->getMessage(); $code = 401; $remarks = "failed";
			}
			return $this->sendPayload($data, $remarks, $msg, $code);
		}

		public function order_details($filter_data) {

			$this->sql = "SELECT * FROM orders";

			if($filter_data != null) {
				$this->sql .= " LEFT JOIN accounts ON accounts.acc_id = orders.acc_id WHERE order_id=$filter_data";
			}

			$data = array(); $code = 0; $msg= ""; $remarks = "";
			try {
				if ($res = $this->pdo->query($this->sql)->fetchAll()) {
					foreach ($res as $rec) { array_push($data, $rec);}
					$res = null; $code = 200; $msg = "Successfully retrieved the requested records"; $remarks = "success";
				}
			} catch (\PDOException $e) {
				$msg = $e->getMessage(); $code = 401; $remarks = "failed";
			}
			return $this->sendPayload($data, $remarks, $msg, $code);
		}

		public function storeProducts($table, $filter_data) {

			$this->sql = "SELECT * FROM $table WHERE store_id='$filter_data'";

			$data = array(); $code = 0; $msg= ""; $remarks = "";
			try {
				if ($res = $this->pdo->query($this->sql)->fetchAll()) {
					foreach ($res as $rec) { array_push($data, $rec);}
					$res = null; $code = 200; $msg = "Successfully retrieved the requested records"; $remarks = "success";
				}
			} catch (\PDOException $e) {
				$msg = $e->getMessage(); $code = 401; $remarks = "failed";
			}
			return $this->sendPayload($data, $remarks, $msg, $code);
		}

		public function placeOrder($data) {
			$this->sql = "INSERT INTO orders (acc_id, order_total, order_shipping, order_grandtotal)
				VALUES ($data->acc_id, $data->order_total, $data->order_shipping, $data->order_grandtotal)";

			try {
				if($this->pdo->query($this->sql)) {
					$id = $this->pdo->lastInsertId();

					$product_id = [];
					$order_id = [];
					$item_quantity = [];
					$values = [];

					for($i = 0; $i < sizeof($data->product_id); $i++) {
						$product_id[] = $data->product_id[$i];
						$order_id[] = $id;
						$item_quantity[] = $data->item_quantity[$i];
						$values[] = "($product_id[$i], $order_id[$i], $item_quantity[$i])";
					}

					$this->sql = "INSERT INTO order_items (product_id, order_id, item_quantity) VALUES " . implode(', ', $values);
					
					if($this->pdo->query($this->sql)) {
						return array("code"=>200, "remarks"=>"success");
					}

				}
			} catch (\PDOException $e) {
				$errmsg = $e->getMessage();
				$code = 403;
			}
			return array("code"=>$code, "errmsg"=>$errmsg);
		}

		public function getOTP($dt) {

			$this->sql = "SELECT acc_otp FROM accounts WHERE acc_email='$dt->acc_email'";

			$data = array(); $code = 0; $msg= ""; $remarks = "";
			try {
				if ($res = $this->pdo->query($this->sql)->fetchAll()) {
					foreach ($res as $rec) { array_push($data, $rec);}
					$res = null; $code = 200; $msg = "Successfully retrieved the requested records"; $remarks = "success";
				}
			} catch (\PDOException $e) {
				$msg = $e->getMessage(); $code = 401; $remarks = "failed";
			}
			return $this->sendPayload($data, $remarks, $msg, $code);
		}

        public function sendPayload($payload, $remarks, $message, $code) {
			$status = array("remarks"=>$remarks, "message"=>$message);
			http_response_code($code);
			return array(
				"status"=>$status,
				"payload"=>$payload,
				'prepared_by'=>'Bernie L. Inociete Jr., Developer',
				"timestamp"=>date_create());
		} 
    }
?>