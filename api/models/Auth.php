<?php
	class Auth {
		
		protected $gm, $pdo;

		public function __construct(\PDO $pdo) {
			$this->pdo = $pdo;
			$this->gm = new GlobalMethods($pdo);
		}

		function encryptPassword($pword): ?string {
			$hashFormat="$2y$10$";
			$saltLength=22;
			$salt=$this->generateSalt($saltLength);
			return crypt($pword, $hashFormat.$salt);
		}

		function generateSalt($len){
			$urs=md5(uniqid(mt_rand(), true));
			$b64String=base64_encode($urs);
			$mb64String=str_replace('+','.', $b64String);
			return substr($mb64String, 0, $len);
		}

		# JWT
		protected function generateHeader() {
			$h = [
				"typ"=>"JWT",
				"alg"=>"HS256",
				"app"=>"My App",
				"dev"=>"The Developer"
			];
			return str_replace("=", "", base64_encode(json_encode($h)));
		}

		protected function generatePayload($uc, $ue, $ito) {
			$p = [
				"uc"=>$uc,
				"ue"=>$ue,
				"ito"=>$ito,
				"iby"=>"The Developer",
				"ie"=>"thedeveloper@test.com",
				"exp"=>date("Y-m-d H:i:s") //date_create()
			];
			return str_replace("=", "", base64_encode(json_encode($p)));
		}

		protected function generateToken($usercode, $useremail, $fullname) {
			$header = $this->generateHeader();
			$payload = $this->generatePayload($usercode, $useremail, $fullname);
			$signature = hash_hmac("sha256", "$header.$payload", base64_encode(SECRET));
			return "$header.$payload." .str_replace("=", "", base64_encode($signature));
		}

		#./JWT

		public function showToken($data){
			$user_data = []; 
			foreach ($data as $key => $value) {
				array_push($user_data, $value);
			}
			return $this->generateToken($user_data[1], $user_data[2], $user_data[3]);
		}

		function login($dt){
			
			$this->sql="SELECT * FROM accounts WHERE acc_username='$dt->acc_username' LIMIT 1";

			try {
				if ($res = $this->pdo->query($this->sql)->fetchColumn()>0) {
					$result=$this->pdo->query($this->sql)->fetchAll();

					$data = array(); $code = 0; $msg = ""; $remarks = "";
					foreach ($result as $rec) { 
						if($this->pwordCheck($dt->acc_password, $rec['acc_password'])){
							$res = null; $code = 200; $msg = "Successfully retrieved the requested records"; $remarks = "success";
							$data = array(
								"id"=>$rec['acc_id'],
								"fname"=>$rec['acc_fname'],
								"lname"=>$rec['acc_lname'],
								"email"=>$rec['acc_email'],
								"is_activated"=>$rec['is_activated']
							);
						} else{
							$res = null; $code = 401; $msg = "Incorrect Password"; $remarks = "failed";
						}
					}
				} else{
					http_response_code(401);
					$res = null; $code = 401; $msg = "User does not exist"; $remarks = "failed";
				}
			} catch (\PDOException $e) {
				$msg = $e->getMessage(); $code = 401; $remarks = "failed";
			}
			return $this->sendPayload(base64_encode(json_encode($data)), $remarks, $msg, $code);
		}

		function register($dt) {
			$encryptedPassword = $this->encryptPassword($dt->acc_password);

			$i = 0; $fields=[]; $values=[];
			foreach ($dt as $key => $value) {
				array_push($fields, $key);
				array_push($values, $value);
			}

			$otp = rand(111111, 999999);

			$data = array(); $code = 0; $msg = ""; $remarks = ""; $token = "";

			try {
				$sqlstr = "INSERT INTO accounts (acc_lname, acc_fname, acc_mname, acc_gender, acc_no, acc_street,
					acc_barangay, acc_city, acc_province, acc_email, acc_mobile, acc_username, acc_password, acc_otp, acc_role) 
					VALUES ('$dt->acc_lname', '$dt->acc_fname', '$dt->acc_mname', '$dt->acc_gender', '$dt->acc_no', 
					'$dt->acc_street', '$dt->acc_barangay', '$dt->acc_city', '$dt->acc_province', 
					'$dt->acc_email', '$dt->acc_mobile', '$dt->acc_username', '$encryptedPassword', '$otp', 'user')";
					
				if($this->pdo->query($sqlstr)) {
					$data = $dt->acc_email; $code = 200; $msg = "Successfully retrieved the requested records"; $remarks = "success";
				} else { 
					$data = null; $code = 400; $msg = "Bad Request"; $remarks = "failed";
				}
				
			} catch (\PDOException $e) {
				$errmsg = $e->getMessage();
				$code = 403;
			}
			return $this->sendPayload($data, $remarks, $msg, $code);
		}

		public function checkEmail($dt) {

			$this->sql="SELECT * FROM accounts WHERE acc_email='$dt->acc_email' LIMIT 1";

			try {
				if ($res = $this->pdo->query($this->sql)->fetchColumn()>0) {
					$result=$this->pdo->query($this->sql)->fetchAll();
					http_response_code(401);
					$res = null; $code = 401; $msg = "Email exist"; $remarks = "failed";
				} else{
					http_response_code(200);
					$res = null; $code = 200; $msg = "Email does not exist"; $remarks = "success";
				}
			} catch (\PDOException $e) {
				$msg = $e->getMessage(); $code = 401; $remarks = "failed";
			}
			return $this->sendPayload(base64_encode(json_encode($res)), $remarks, $msg, $code);
		}

		public function checkUsername($dt) {

			$this->sql="SELECT * FROM accounts WHERE acc_username='$dt->acc_username' LIMIT 1";

			try {
				if ($res = $this->pdo->query($this->sql)->fetchColumn()>0) {
					$result=$this->pdo->query($this->sql)->fetchAll();
					http_response_code(401);
					$res = null; $code = 401; $msg = "Username exist"; $remarks = "failed";
				} else{
					http_response_code(200);
					$res = null; $code = 200; $msg = "Username does not exist"; $remarks = "success";
				}
			} catch (\PDOException $e) {
				$msg = $e->getMessage(); $code = 401; $remarks = "failed";
			}
			return $this->sendPayload(base64_encode(json_encode($res)), $remarks, $msg, $code);
		}

		public function verifyEmail($dt) {

			$this->sql="SELECT * FROM accounts WHERE acc_email='$dt->acc_email' LIMIT 1";

			try {
				if ($res = $this->pdo->query($this->sql)->fetchColumn()>0) {
					$result=$this->pdo->query($this->sql)->fetchAll();

					$data = array(); $code = 0; $msg = ""; $remarks = ""; $token = "";
					foreach ($result as $rec) { 
						if($dt->acc_otp == $rec['acc_otp']){
							$this->sql = "UPDATE tbl_accounts SET is_activated=1 WHERE acc_email='$dt->acc_email'";
							$sqlstr = $this->pdo->prepare($this->sql);
							$sqlstr->execute();
							$res = null; $code = 200; $msg = "Successfully retrieved the requested records"; $remarks = "success";
						} else{
							http_response_code(401);
							$res = null; $code = 401; $msg = "Incorrect otp"; $remarks = "failed";
						}
					}
				} else{
					http_response_code(401);
					$res = null; $code = 401; $msg = "User does not exist"; $remarks = "failed";
				}
			} catch (\PDOException $e) {
				$msg = $e->getMessage(); $code = 401; $remarks = "failed";
			}
			return $this->sendPayload(base64_encode(json_encode($res)), $remarks, $msg, $code);
		}

		public function updatePassword($dt, $filter_data) {
			$encryptedPassword = $this->encryptPassword($dt->acc_password);

			try {
				$sqlstr = "UPDATE accounts SET acc_password = '$encryptedPassword' WHERE $filter_data";
					
				if($this->pdo->query($sqlstr)) {
					$data = null; $code = 200; $msg = "Successfully Changed Password"; $remarks = "success";
				} else { 
					$data = null; $code = 400; $msg = "Bad Request"; $remarks = "failed";
				}
				
			} catch (\PDOException $e) {
				$errmsg = $e->getMessage();
				$code = 403;
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
				"timestamp"=>date_create()
			);
		} 

		function pwordCheck($pw, $existingpw){
			$hash=crypt($pw, $existingpw);
			if($hash === $existingpw){return true;} else {return false;}
		}
	}
?>