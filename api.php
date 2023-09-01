<?php
session_start();
date_default_timezone_set('Asia/Singapore');
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;

require_once('./qrcode/vendor/autoload.php');
include './classes/database.php';
include './classes/jwt.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);
$action = $uri[2];

$bearer_token = get_bearer_token();
$is_jwt_valid = isset($bearer_token) ? is_jwt_valid($bearer_token) : false;

$database = new Database();

if ($action === 'clientLogin') {
    header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
    $rest_json = file_get_contents('php://input');
    $_POST = json_decode($rest_json, true);

    if (
        $user = $database->loginClient(
            $_POST['email'],
            md5($_POST['password'])
        )
    ) {
        if($user['status'] == 1){
            $headers = ['alg' => 'HS256', 'typ' => 'JWT'];
            $payload = ['member' => $user];
            $jwt = generate_jwt($headers, $payload);
            return_json(['status' => 1, 'token' => $jwt, 'user_id' => $user['id']]);
        } else {
            return_json(['status' => 0, 'msg' => 'Your account is not activate. Please contact to administrator.']);
        }
    } else {
        return_json(['status' => 0, 'msg' => "Email or Password is invalid."]);
    }
} elseif ($action === 'merchantLogin') {
    header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
    $rest_json = file_get_contents('php://input');
    $_POST = json_decode($rest_json, true);

    if (
        $user = $database->loginMerchant(
            $_POST['email'],
            md5($_POST['password'])
        )
    ) {
        if($user['status'] == 1){
            $headers = ['alg' => 'HS256', 'typ' => 'JWT'];
            $payload = ['member' => $user];
            $jwt = generate_jwt($headers, $payload);
            return_json(['status' => 1, 'token' => $jwt, 'user_id' => $user['id']]);
        } else {
            return_json(['status' => 0, 'msg' => 'Your account is not activate. Please contact to administrator.']);
        }
    } else {
        return_json(['status' => 0, 'msg' => "Email or Password is invalid."]);
    }
} else if($action === 'getMerchantQRCode'){
    header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
    if ($is_jwt_valid) {
        $rest_json = file_get_contents('php://input');
        $_POST = json_decode($rest_json, true);
        if(isset($_POST['id']) && !empty($_POST['id'])){
            $merchant_id = $_POST['id'];
			if ($merchant = $database->getMerchant($merchant_id)) {

				$options = new QROptions(
				  [
					'eccLevel' => QRCode::ECC_L,
					'outputType' => QRCode::OUTPUT_MARKUP_SVG,
					'version' => 5,
				  ]
				);

				$qrcode = (new QRCode($options))->render('https://ryankclient.readyforyourreview.com/#/afterqrcode?merchantid='.$merchant_id);

                return_json(['status' => 1, 'qrcode' => $qrcode]);
            } else {
                return_json(['status' => 0, 'msg' => 'Merchant is invalid.']); 
            }
            
        } else {
            return_json(['status' => 0, 'msg' => 'Merchant id is missing.']); 
        }
    } else {
        return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
    }
} elseif ($action === 'editMerchant') {
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
    if ($is_jwt_valid) {
if($_POST['password'] != ""){
    $user = [
        'username' => $_POST['username'],
        'password' => md5($_POST['password']),
        'email' => $_POST['email'],
        'website' => $_POST['website'],
        'logo'=>'',
        'about'=>$_POST['about'],
        'facebook'=>$_POST['facebook'],
        'youtube'=>$_POST['youtube'],
        'tiktok'=>$_POST['tiktok'],
        'instagram'=>$_POST['instagram'],
         'id'=>$_POST['id']

    ];
}else{
    $user = [
        'username' => $_POST['username'],
        'email' => $_POST['email'],
        'website' => $_POST['website'],
        'logo'=>'',
        'about'=>$_POST['about'],
        'facebook'=>$_POST['facebook'],
        'youtube'=>$_POST['youtube'],
        'tiktok'=>$_POST['tiktok'],
        'instagram'=>$_POST['instagram'],
         'id'=>$_POST['id']

    ];
}
    if(isset($_FILES['logo'])){
        $logo_files = $_FILES['logo'];
        $file_name = $logo_files['name'];
        $file_tmp_name = $logo_files['tmp_name'];
        
        $target_dir = "uploads/";
        $target_file = $target_dir . basename($file_name);
        
        if (file_exists($target_file)) {
            $file_name = time().'-'.$file_name;
            $target_file = $target_dir . basename($file_name);
        }	
        
        $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
        
        if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif" ) {
          return_json(['status' => 0, 'msg' => 'Sorry, only JPG, JPEG, PNG & GIF type logo are allowed.']);
        }

        if(!move_uploaded_file($file_tmp_name, $target_file)){
            return_json(['status' => 0, 'msg' => 'Sorry cannot upload the logo right now.']);
        }
        
        $logo_url = sprintf(
            "%s://%s",
            isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',
            $_SERVER['SERVER_NAME']
          ).'/'.$target_file;
          
        $user['logo'] = $logo_url;  
    }

    $user_id = $database->editMerchant($user);
    if ($user_id) {
            return_json(['status' => 1, 'msg' => 'Profile Updated Sucessfully']);
        }else{
        return_json(['status' => 0, 'msg' =>  'Please contact to administrator.']);
    } 
    }else {
            return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
        }
}elseif ($action === 'merchantRegister') {
    header('Access-Control-Allow-Origin: *');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    header('Access-Control-Allow-Methods: GET, POST');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    if ($is_jwt_valid) {
        $date = date('Y-m-d H:i:s');
        $user = [
            'username' => $_POST['username'],
            'password' => md5($_POST['password']),
            'email' => $_POST['email'],
            'website' => $_POST['website'],
            'logo'=>'',
            'facebook'=>$_POST['facebook'],
            'youtube'=>$_POST['youtube'],
            'instagram'=>$_POST['instagram'],
            'tiktok'=>$_POST['tiktok'],
            'about'=>$_POST['about'],
            'status' => 1,
            'created'=> $date
        ];
        if(isset($_FILES['logo'])){
            $logo_files = $_FILES['logo'];
            $file_name = $logo_files['name'];
            $file_tmp_name = $logo_files['tmp_name'];
            
            $target_dir = "uploads/";
            $target_file = $target_dir . basename($file_name);
            
            if (file_exists($target_file)) {
                $file_name = time().'-'.$file_name;
                $target_file = $target_dir . basename($file_name);
            }	
            
            $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
            
            if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif" ) {
              return_json(['status' => 0, 'msg' => 'Sorry, only JPG, JPEG, PNG & GIF type logo are allowed.']);
            }
    
            if(!move_uploaded_file($file_tmp_name, $target_file)){
                return_json(['status' => 0, 'msg' => 'Sorry cannot upload the logo right now.']);
            }
            
            $logo_url = sprintf(
                "%s://%s",
                isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',
                $_SERVER['SERVER_NAME']
              ).'/'.$target_file;
              
            $user['logo'] = $logo_url;  
        }
        if($database->checkExistByMerchantEmail($user['email'])){
            return_json(['status' => 0, 'msg' => 'Already have Merchant with this Email.']);
        }
        if ($user_id = $database->RegisterMerchant($user)) {    
            return_json(['status' => 1, 'user_id' => $user_id, 'msg' => 'Account Created Sucessfully']);
        } else{
            return_json(['status' => 0, 'msg' =>  'Cannot signup. Please Check Details.']);
        }
    } else {
        return_json(['status' => 0, 'msg' => 'Invalid access token.']);
    }
}else if ($action === 'getWallet') {
    header('Access-Control-Allow-Origin: *');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    header('Access-Control-Allow-Methods: GET, POST');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    if ($is_jwt_valid) {
        $rest_json = file_get_contents('php://input');
        $_POST = json_decode($rest_json, true);

        if (isset($_POST['id']) && !empty($_POST['id'])) {
            $client_id = $_POST['id'];
            if ($wallet = $database->getWallet($client_id)) {
                return_json(['status' => 1, 'wallet' => $wallet]);
            } else {
                return_json(['status' => 0, 'msg' => 'wallet id is invalid.']);
            }
        } else {
            return_json(['status' => 0, 'msg' => 'wallet id is missing.']);
        }
    } else {
        return_json(['status' => 0, 'msg' => 'Invalid access token.']);
    }
}else if ($action === 'getWalletHistory') {
    header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

    if ($is_jwt_valid) {
        $rest_json = file_get_contents('php://input');
        $_POST = json_decode($rest_json, true);

        if (isset($_POST['id']) && !empty($_POST['id']) && empty($_POST['sortby']) && empty($_POST['merchant_name'])) {
            $client_id = $_POST['id'];
            if ($wallet = $database->getWalletHistory($client_id)) {
                return_json(['status' => 1, 'wallet' => $wallet]);
            } else {
                return_json(['status' => 0, 'msg' => 'Client id is invalid.']);
            }
        }else if(isset($_POST['sortby']) && !empty($_POST['id']) && !empty($_POST['sortby']) && empty($_POST['merchant_name'])){
            $client_id = $_POST['id'];
            $sortby=$_POST['sortby'];
            if ($wallet = $database->getWalletHistorySortby($client_id,$sortby)) {
                return_json(['status' => 1, 'wallet' => $wallet]);
            } else {
                return_json(['status' => 0, 'msg' => 'Client id is invalid.']);
            }
        }else if(isset($_POST['merchant_name']) && !empty($_POST['id']) && !empty($_POST['merchant_name']) && empty($_POST['sortby'])){
            $client_id = $_POST['id'];
            $merchant_name=$_POST['merchant_name'];
            if ($wallet = $database->getWalletHistoryFilteBy($client_id,$merchant_name)) {
                return_json(['status' => 1, 'wallet' => $wallet]);
            } else {
                return_json(['status' => 0, 'msg' => 'Client id is invalid.']);
            }
        } else {
            return_json(['status' => 0, 'msg' => 'Client id is missing.']);
        }
    } else {
        return_json(['status' => 0, 'msg' => 'Invalid access token.']);
    }
}elseif ($action === 'updateClientWalletAmount') {
    header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
    if ($is_jwt_valid) {
    $rest_json = file_get_contents('php://input');
    $_POST = json_decode($rest_json, true);
    $userwallet = [
        'id' => $_POST['id'],
        'add_amount' => $_POST['add_amount']
    ];
    $user_update = $database->updateClientAmount($userwallet);
    if ($user_update) {
        return_json(['status' => 1, 'msg' => 'Amount Updated Sucessfully']);
    } else {
        return_json(['status' => 0, 'msg' => 'Please contact to administrator.']);
    }
} else {
    return_json(['status' => 0, 'msg' => 'Invalid access token.']);
}
}elseif ($action === 'createBranch') {
       ini_set('display_errors', 1);
        ini_set('display_startup_errors', 1);
        error_reporting(E_ALL);  
        header('Access-Control-Allow-Origin: *');
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        header('Access-Control-Allow-Methods: GET, POST');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        if ($is_jwt_valid) {
        $branch = [
            'branchpin' => $_POST['branchpin'],
            'discription' => $_POST['discription'],
            'merchant_id'=>$_POST['merchant_id']
        ];
        $Branchpin = $database->createBranch($branch);
        if ($Branchpin) {
                return_json(['status' => 1, 'Branch' =>  $Branchpin,'msg' => 'Branch Created Sucessfully']);
            }else{
            return_json(['status' => 0, 'msg' =>  'Error Promotions Creations']);
        }
    } else {
        return_json(['status' => 0, 'msg' => 'Invalid access token.']);
    }
    }elseif ($action === 'createPromotion') {
    header('Access-Control-Allow-Origin: *');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    header('Access-Control-Allow-Methods: GET, POST');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    if ($is_jwt_valid) {
    $promotion = [
        'promotion_name' => $_POST['promotion_name'],
        'promotion_discription' => $_POST['promotion_discription'],
        'promotion_startdate' => $_POST['promotion_startdate'],
        'promotion_enddate' => $_POST['promotion_enddate'],
        'logo' =>'',
        'level1' => $_POST['level1'],
        'level2' => $_POST['level2'],
        'level3' => $_POST['level3'],
        'level4' => $_POST['level4'],
        'level5' => $_POST['level5'],
        'level6' => $_POST['level6'],
        'level7' => $_POST['level7'],
        'level8' => $_POST['level8'],
        'level9' => $_POST['level9'],
        'level10' => $_POST['level10'],
        'merchant_id'=>$_POST['merchant_id'],
        'branchpin'=>$_POST['branchpin']
    ];
    if(isset($_POST['branchpin'])){
        $merchant_id=$_POST['merchant_id'];
        $inputbranchpin=$_POST['branchpin'];
        $merchantpin = $database->checkBranchpin($inputbranchpin,$merchant_id);
        if(empty($merchantpin)){
            return_json(['status' => 0, 'msg' => 'Sorry, This Branch Pin is Invalid']);
        }
    }
    if(isset($_FILES['logo'])){
        $logo_files = $_FILES['logo'];
        $file_name = $logo_files['name'];
        $file_tmp_name = $logo_files['tmp_name'];
        
        $target_dir = "uploads/";
        $target_file = $target_dir . basename($file_name);
        
        if (file_exists($target_file)) {
            $file_name = time().'-'.$file_name;
            $target_file = $target_dir . basename($file_name);
        }	
        
        $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
        
        if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif" ) {
          return_json(['status' => 0, 'msg' => 'Sorry, only JPG, JPEG, PNG & GIF type logo are allowed.']);
        }

        if(!move_uploaded_file($file_tmp_name, $target_file)){
            return_json(['status' => 0, 'msg' => 'Sorry cannot upload the logo right now.']);
        }
        
        $logo_url = sprintf(
            "%s://%s",
            isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',
            $_SERVER['SERVER_NAME']
          ).'/'.$target_file;
          
        $promotion['logo'] = $logo_url;  
    }
    $promotion_id = $database->createPromotion($promotion);
    if ($promotion_id) {
            return_json(['status' => 1, 'promotion_id' =>  $promotion_id,'msg' => 'Promotions Created Sucessfully']);
        }else{
        return_json(['status' => 0, 'msg' =>  'Error Promotions Creations']);
    }
} else {
    return_json(['status' => 0, 'msg' => 'Invalid access token.']);
}
}elseif ($action === 'editPromotion') {
    header('Access-Control-Allow-Origin: *');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    header('Access-Control-Allow-Methods: GET, POST');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
        if ($is_jwt_valid) {
        $promotion = [
            'promotion_name' => $_POST['promotion_name'],
            'promotion_discription' => $_POST['promotion_discription'],
            'promotion_startdate' => $_POST['promotion_startdate'],
            'promotion_enddate' => $_POST['promotion_enddate'],
            'logo' =>'',
            'level1' => $_POST['level1'],
            'level2' => $_POST['level2'],
            'level3' => $_POST['level3'],
            'level4' => $_POST['level4'],
            'level5' => $_POST['level5'],
            'level6' => $_POST['level6'],
            'level7' => $_POST['level7'],
            'level8' => $_POST['level8'],
            'level9' => $_POST['level9'],
            'level10' => $_POST['level10'],
            'promotion_id'=>$_POST['promotion_id']
        ];
        if(isset($_FILES['logo'])){
            $logo_files = $_FILES['logo'];
            $file_name = $logo_files['name'];
            $file_tmp_name = $logo_files['tmp_name'];
            
            $target_dir = "uploads/";
            $target_file = $target_dir . basename($file_name);
            
            if (file_exists($target_file)) {
                $file_name = time().'-'.$file_name;
                $target_file = $target_dir . basename($file_name);
            }	
            
            $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
            
            if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif" ) {
              return_json(['status' => 0, 'msg' => 'Sorry, only JPG, JPEG, PNG & GIF type logo are allowed.']);
            }
    
            if(!move_uploaded_file($file_tmp_name, $target_file)){
                return_json(['status' => 0, 'msg' => 'Sorry cannot upload the logo right now.']);
            }
            
            $logo_url = sprintf(
                "%s://%s",
                isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',
                $_SERVER['SERVER_NAME']
              ).'/'.$target_file;
              
            $promotion['logo'] = $logo_url;  
        }
    
        $promotion = $database->editPromotion($promotion);
        if ($promotion) {
                return_json(['status' => 1, 'msg' => 'Promotion Updated Sucessfully']);
            }else{
            return_json(['status' => 0, 'msg' =>  'Please contact to administrator.']);
        } 
        }else {
                return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
        }
    }else if ($action === 'getSinglePromotion') {
        if ($is_jwt_valid) {
            $rest_json = file_get_contents('php://input');
            $_POST = json_decode($rest_json, true);
            if(isset($_POST['id']) && !empty($_POST['id'])){
                $promotion_id = $_POST['id'];
                if ($promotion = $database->getSinglePromotion($promotion_id)) {
                    return_json(['status' => 1, 'promotion' => $promotion]);
                } else {
                    return_json(['status' => 0, 'msg' => 'promotion id is invalid.']); 
                }
            } else {
                return_json(['status' => 0, 'msg' => 'promotion id is missing.']); 
            }
        } else {
            return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
        }
    }else if ($action === 'getPromotion') {
/*         ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL); */
        header('Access-Control-Allow-Origin: *');
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        header('Access-Control-Allow-Methods: GET, POST');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
    if ($is_jwt_valid) {
        $rest_json = file_get_contents('php://input');
        $_POST = json_decode($rest_json, true);
        if(isset($_POST['id']) && !empty($_POST['id'] && empty($_POST['search']))){
            $client_id=$_POST['id'];
            if ($promotion = $database->getPromotion($client_id)) {
                return_json(['status' => 1, 'promotion' => $promotion]);
            } else {
                return_json(['status' => 0, 'msg' => 'promotion id is invalid.']); 
            }
        }else if(isset($_POST['search']) && !empty($_POST['id'] && !empty($_POST['search']))){
            $client_id=$_POST['id'];
            $search_input=$_POST['search'];
            if ($promotion = $database->getPromotionBySearch($client_id,$search_input)) {
                return_json(['status' => 1, 'promotion' => $promotion]);
            } else {
                return_json(['status' => 0, 'msg' => 'promotion id is invalid.']); 
            }
        } else {
            return_json(['status' => 0, 'msg' => 'promotion id is missing.']); 
        }
    } else {
        return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
    }
}else if ($action === 'getBranchpin') {
    /*     ini_set('display_errors', 1);
        ini_set('display_startup_errors', 1);
        error_reporting(E_ALL); */
        header('Access-Control-Allow-Origin: *');
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        header('Access-Control-Allow-Methods: GET, POST');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        if ($is_jwt_valid) {
            $rest_json = file_get_contents('php://input');
            $_POST = json_decode($rest_json, true);
            if(isset($_POST['id']) && !empty($_POST['id']) && empty($_POST['search']) && empty($_POST['sortby'])){
                $merchant_id = $_POST['id'];
                $offset=$_POST['offset'];
                if ($branch = $database->getBranch($merchant_id,$offset)) {
                    return_json(['status' => 1, 'branch' => $branch]);
                } else {
                    return_json(['status' => 0, 'msg' => 'merchant id is invalid.']); 
                }
            }else if(isset($_POST['search']) && isset($_POST['id']) && !empty($_POST['search'])){
                $merchant_id = $_POST['id'];
                $search=$_POST['search'];
                $offset=$_POST['offset'];
                if ($branch = $database->searchBranch($merchant_id,$search,$offset)) {
                    return_json(['status' => 1, 'branch' => $branch]);
                } else {
                    return_json(['status' => 0, 'msg' => 'merchant id is invalid.']); 
                }
            }else if(isset($_POST['sortby']) && isset($_POST['id'])  && !empty($_POST['sortby'])){
                $merchant_id = $_POST['id'];
                $sort=$_POST['sortby'];
                $offset=$_POST['offset'];
                if ($branch = $database->sortBranch($merchant_id,$sort,$offset)) {
                    return_json(['status' => 1, 'branch' => $branch]);
                } else {
                    return_json(['status' => 0, 'msg' => 'merchant id is invalid.']); 
                }
            } else {
                return_json(['status' => 0, 'msg' => 'merchant id is missing.']); 
            }
        } else {
            return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
        }
    }else if ($action === 'getSingleBranch') {
            header('Access-Control-Allow-Origin: *');
            header('Cache-Control: no-cache, no-store, must-revalidate');
            header('Pragma: no-cache');
            header('Expires: 0');
            header('Access-Control-Allow-Methods: GET, POST');
            header('Access-Control-Allow-Headers: Content-Type, Authorization');
            if ($is_jwt_valid) {
                $rest_json = file_get_contents('php://input');
                $_POST = json_decode($rest_json, true);
                if(isset($_POST['id']) && !empty($_POST['id'])){
                    $branch_id = $_POST['id'];
                    if ($branch = $database->getSingleBranch($branch_id,$offset)) {
                        return_json(['status' => 1, 'branch' => $branch]);
                    } else {
                        return_json(['status' => 0, 'msg' => 'merchant id is invalid.']); 
                    }
                }else {
                    return_json(['status' => 0, 'msg' => 'merchant id is missing.']); 
                }
            } else {
                return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
            }
        }
        else if ($action === 'getPromotionAfterqrcode') {
        header('Access-Control-Allow-Origin: *');
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        header('Access-Control-Allow-Methods: GET, POST');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        if ($is_jwt_valid) {
            $rest_json = file_get_contents('php://input');
            $_POST = json_decode($rest_json, true);
            if(isset($_POST['id']) && !empty($_POST['id'])){
                $merchant_id = $_POST['id'];
                $client_id=$_POST['clientid'];
                if ($promotions = $database->getPromotionAfterqrcode($merchant_id,$client_id)) {
                    return_json(['status' => 1, 'promotion' => $promotions]);
                } else {
                    return_json(['status' => 0, 'msg' => 'promotion id is invalid.']); 
                }
            } else {
                return_json(['status' => 0, 'msg' => 'promotion id is missing.']); 
            }
        } else {
            return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
        }
    }else if ($action === 'getPromotionMerchant') {
    header('Access-Control-Allow-Origin: *');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    header('Access-Control-Allow-Methods: GET, POST');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    if ($is_jwt_valid) {
        $rest_json = file_get_contents('php://input');
        $_POST = json_decode($rest_json, true);
        if(isset($_POST['id']) && !empty($_POST['id']) && empty($_POST['search']) && empty($_POST['sortby'])){
            $merchant_id = $_POST['id'];
            $offset=$_POST['offset'];
            if ($merchant = $database->getPromotionMerchant($merchant_id,$offset)) {
                return_json(['status' => 1, 'promotion' => $merchant]);
            } else {
                return_json(['status' => 0, 'msg' => 'promotion id is invalid.']); 
            }
        }else if(isset($_POST['search']) && isset($_POST['id']) && !empty($_POST['search'])){
            $merchant_id = $_POST['id'];
            $search=$_POST['search'];
            $offset=$_POST['offset'];
            if ($merchant = $database->searchPromotionMerchant($merchant_id,$search,$offset)) {
                return_json(['status' => 1, 'promotion' => $merchant]);
            } else {
                return_json(['status' => 0, 'msg' => 'promotion id is invalid.']); 
            }
        }else if(isset($_POST['sortby']) && isset($_POST['id'])  && !empty($_POST['sortby'])){
            $merchant_id = $_POST['id'];
            $sort=$_POST['sortby'];
            $offset=$_POST['offset'];
            if ($merchant = $database->sortMerchantPromotions($merchant_id,$sort,$offset)) {
                return_json(['status' => 1, 'promotion' => $merchant]);
            } else {
                return_json(['status' => 0, 'msg' => 'promotion id is invalid.']); 
            }
        } else {
            return_json(['status' => 0, 'msg' => 'promotion id is missing.']); 
        }
    } else {
        return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
    }
}else if ($action === 'getClient') {
    header('Access-Control-Allow-Origin: *');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    header('Access-Control-Allow-Methods: GET, POST');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    if ($is_jwt_valid) {
        $rest_json = file_get_contents('php://input');
        $_POST = json_decode($rest_json, true);
        if(isset($_POST['id']) && !empty($_POST['id'])){
            $client_id = $_POST['id'];
            if ($client = $database->getClient($client_id)) {
                return_json(['status' => 1, 'client' => $client[0]]);
            } else {
                return_json(['status' => 0, 'msg' => 'Client id is invalid.']); 
            }
        }else if( isset($_POST['merchant_id']) && !empty($_POST['merchant_id']) && empty($_POST['search']) && empty($_POST['sortby'])){
            $merchant_id = $_POST['merchant_id'];
            $offset=$_POST['offset'];
            if ($client = $database->getMerchantsClient($merchant_id,$offset)) {
                return_json(['status' => 1, 'client' => $client]);
            } else {
                return_json(['status' => 0, 'msg' => 'Merchant is invalid.']); 
            }
        }else if(isset($_POST['search']) && isset($_POST['merchant_id']) && !empty($_POST['search'])){
            $merchant_id = $_POST['merchant_id'];
            $search_input = $_POST['search'];
            $offset=$_POST['offset'];
            if ($client = $database->getSearchClient($search_input,$merchant_id,$offset)) {
                return_json(['status' => 1, 'client' => $client]);
            } else {
                return_json(['status' => 0, 'msg' => 'Merchant is invalid.']); 
            }
        }else if(isset($_POST['sortby']) && isset($_POST['merchant_id'])  && !empty($_POST['sortby'])){
            $merchant_id = $_POST['merchant_id'];
            $sortby = $_POST['sortby'];
            $offset=$_POST['offset'];
            if ($client = $database->sortClient($sortby,$merchant_id,$offset)) {
                return_json(['status' => 1, 'client' => $client]);
            } else {
                return_json(['status' => 0, 'msg' => 'Merchant is invalid.']); 
            }
        }else {
            return_json(['status' => 0, 'msg' => 'Client id is missing.']); 
        }
    } else {
        return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
    }
}else if ($action === 'getRefferalamount') {
    header('Access-Control-Allow-Origin: *');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    header('Access-Control-Allow-Methods: GET, POST');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    
    if ($is_jwt_valid) {
        $rest_json = file_get_contents('php://input');
        $_POST = json_decode($rest_json, true);
        if(isset($_POST['id']) && !empty($_POST['id'])){
            $client_id = $_POST['id'];
            if ($refferalamount = $database->getRefferalamount($client_id)) {
                return_json(['status' => 1, 'amount' => $refferalamount]);
            } else {
                return_json(['status' => 0, 'msg' => 'Merchant id is invalid.']); 
            }
        }
        else {
            return_json(['status' => 0, 'msg' => 'Client id is missing.']); 
        }
    } else {
        return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
    }
}
else if ($action === 'getMerchant') {
    header('Access-Control-Allow-Origin: *');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    header('Access-Control-Allow-Methods: GET, POST');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    
    if ($is_jwt_valid) {
        $rest_json = file_get_contents('php://input');
        $_POST = json_decode($rest_json, true);

        if(isset($_POST['id']) && !empty($_POST['id'])){
            $merchant_id = $_POST['id'];
            if ($merchant = $database->getMerchant($merchant_id)) {
                return_json(['status' => 1, 'merchant' => $merchant]);
            } else {
                return_json(['status' => 0, 'msg' => 'Merchant id is invalid.']); 
            }
        }else if(isset($_POST['client_id']) && !empty($_POST['client_id'])){
            $client_id = $_POST['client_id'];
            if ($merchants = $database->getClientMerchants($client_id)) {
                return_json(['status' => 1, 'merchant' => $merchants]);
            } else {
                return_json(['status' => 0, 'msg' => 'Merchant id is invalid.']); 
            }
        } 
        else {
            return_json(['status' => 0, 'msg' => 'Merchant id is missing.']); 
        }
    } else {
        return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
    }
}else if ($action === 'clientsRegister') {
    ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
    header('Access-Control-Allow-Origin: *');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    header('Access-Control-Allow-Methods: GET, POST');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    $rest_json = file_get_contents('php://input');
    $_POST = json_decode($rest_json, true);
    $date = date('Y-m-d H:i:s');
    $walletamount=0;
    $refferalclient_id=0;
    $user = [
        'username' => $_POST['username'],
        'password' => md5($_POST['password']),
        'email' => $_POST['email'],
        'status' => 1,
        'phone'=>$_POST['phone'],
        'referral_code' => $_POST['referral_code'],
        'created'=> $date
    ];
    if($database->checkExistByClientEmail($user['email'])){
        return_json(['status' => 0, 'msg' => 'Already have Client with this Email.']);
    }
    if(!empty($user['referral_code'])){
        if($checkreferralcode=$database->checkreferralcode($user['referral_code'])){
            $refferamount=$database->getRefferalamount();
            $walletamount=$refferamount['referral_amount'];
            $refferalclient_id=$checkreferralcode['client_id'];
            $wallet = $database->getWallet($refferalclient_id);
            $walletbalance=$wallet[0]['balance'];
            $updated_balance=$walletbalance+$walletamount;
            $updatewallet=$database->updateClientAmountAfterPayment($refferalclient_id,$updated_balance);
            $timestamp = time();
            $created = date('Y-m-d H:i:s', $timestamp);
            $promotion_id='';
            $merchant_id='';
            $discription='referral amount';
            $create_wallet_history=$database->CreateWalletHistory($refferalclient_id,$updated_balance,$walletamount,$merchant_id,$promotion_id,$user['username'],$discription,$created);
        }
    }
    if ($user_id = $database->RegisterClient($user)) {
        $user['id'] = $user_id;
        $getclientname=$database->getClient($user_id);
        $refferalcodegenrated=$getclientname[0]['username'].$user_id;
            $headers = ['alg' => 'HS256', 'typ' => 'JWT'];
            $payload = ['member' => $user];
            $jwt = generate_jwt($headers, $payload);
            $crate_referalcode=$database->CreateRefferalcode($user_id,$refferalclient_id,$refferalcodegenrated);
            $wallet_create=$database->CreateClientWallet($user_id,$walletamount);
            if($walletamount != 0){
                $timestamp = time();
            $created = date('Y-m-d H:i:s', $timestamp);
            $promotion_id='';
            $merchant_id='';
            $discription='referral amount';
            $clientname=$database->getClient($refferalclient_id);
            $refferalclientname=$clientname[0]['username'];
            $upwalletamount=$walletamount;
            $create_wallet_history=$database->CreateWalletHistory($user_id,$upwalletamount,$walletamount,$merchant_id,$promotion_id,$refferalclientname,$discription,$created);
            }
            return_json(['status' => 1, 'token' =>  $jwt, 'msg' =>'Account Created Sucessfully','user_id' => $user['id']]);
        }else{
        return_json(['status' => 0, 'msg' =>  'Cannot signup. Please contact to administrator.']);
    }
}
elseif ($action === 'editClient') {
    header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
    if ($is_jwt_valid) {
    if($_POST['password'] != ""){
        $user = [
            'username' => $_POST['username'],
            'password' => md5($_POST['password']),
            'email' => $_POST['email'],
            'phone' => $_POST['phone'],
            'logo'=>'',
             'id'=>$_POST['id']
    
        ];
    }else{
        $user = [
            'username' => $_POST['username'],
            'email' => $_POST['email'],
            'phone' => $_POST['phone'],
            'logo'=>'',
             'id'=>$_POST['id']
    
        ];
    }
    if(isset($_FILES['logo'])){
        $logo_files = $_FILES['logo'];
        $file_name = $logo_files['name'];
        $file_tmp_name = $logo_files['tmp_name'];
        
        $target_dir = "uploads/";
        $target_file = $target_dir . basename($file_name);
        
        if (file_exists($target_file)) {
            $file_name = time().'-'.$file_name;
            $target_file = $target_dir . basename($file_name);
        }	
        
        $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
        
        if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif" ) {
          return_json(['status' => 0, 'msg' => 'Sorry, only JPG, JPEG, PNG & GIF type logo are allowed.']);
        }

        if(!move_uploaded_file($file_tmp_name, $target_file)){
            return_json(['status' => 0, 'msg' => 'Sorry cannot upload the logo right now.']);
        }
        
        $logo_url = sprintf(
            "%s://%s",
            isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',
            $_SERVER['SERVER_NAME']
          ).'/'.$target_file;
          
        $user['logo'] = $logo_url;  
    }
    $user_id = $database->editClient($user);
    if ($user_id){
        $user['id'] = $user_id;
            return_json(['status' => 1, 'msg' => 'Profile Updated Sucessfully']);
        }else{
        return_json(['status' => 0, 'msg' =>  'Please contact to administrator.']);
    } 
    }else {
            return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
        }
}else if ($action === 'merchantReview') {
    header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($is_jwt_valid) {
    $rest_json = file_get_contents('php://input');
    $_POST = json_decode($rest_json, true);
    $timestamp = time();
    $date = date('Y-m-d H:i:s', $timestamp);
    $review = [
        'client_id' => $_POST['client_id'],
        'client_name'=>$_POST['client_name'],
        'merchant_id' => $_POST['merchant_id'],
        'rating' => $_POST['rating'],
        'review' => $_POST['review'],
        'created'=> $date
    ];
    if(empty($review['rating'])){
        $review['rating']=1;
    }
    if ($review_id = $database->SubmitReview($review)) {
        $review['id'] = $review_id;
            return_json(['status' => 1, 'msg' =>'Review Submit Sucessfully']);
        }else{
        return_json(['status' => 0, 'msg' =>  'Cannot signup. Please contact to administrator.']);
    }
}else {
    return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
}
}
else if ($action === 'paymentCheck') {
    header('Access-Control-Allow-Origin: *');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    header('Access-Control-Allow-Methods: GET, POST');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    if ($is_jwt_valid) {
        $rest_json = file_get_contents('php://input');
        $_POST = json_decode($rest_json, true);
        if(isset($_POST['id']) && !empty($_POST['id'])){
            $merchant_id = $_POST['merchant_id'];
            $promotion_id = $_POST['promotion_id'];
            $inputbranchpin=$_POST['brachpin'];
            $client_id=$_POST['id'];
            $amount=$_POST['amount'];
            $discountvalue=$_POST['discountvalue'];
            $discountlvl=$_POST['discountlevel'];
            $discount=$amount/100*$discountvalue;
            $formattedDiscount = number_format($discount, 2);
            $payment_amount= $amount-$discount;
            $merchantpin = $database->checkBranchpin($inputbranchpin,$merchant_id);
            if($merchantpin){
                    $discription=$merchantpin[0]['discription'];
                    $wallet = $database->getWallet($client_id);
                    $walletbalance=$wallet[0]['balance'];
                    if($walletbalance>=$amount){
                        $updated_balance=$walletbalance-$discount;
                    }else{
                        return_json(['status' => 0, 'msg' => 'Wallet Balance is Low']);
                    }
                    if(!empty($updated_balance)){
                    $updatewallet=$database->updateClientAmountAfterPayment($client_id,$updated_balance);
                    }else{
                        return_json(['status' => 0, 'msg' => 'Wallet Balance is Low']);
                    }
                    $merchantalldata=$database->getMerchant($merchant_id); 
                    $merchant_name=$merchantalldata[0]['username'];
                    $timestamp = time();
                    $created = date('Y-m-d H:i:s', $timestamp);
                    $create_wallet_history=$database->CreateWalletHistory($client_id,$updated_balance,$amount,$merchant_id,$promotion_id,$merchant_name,$discription,$created);
                    $clientalldata=$database->getClient($client_id);
                    $client_name=$clientalldata[0]['username'];
                    $getpromotion=$database->getSinglePromotion($promotion_id);
                    $promotion_name=$getpromotion[0]['promotion_name'];
                    $create_wallet_history=$database->CreateRedemptionHistory($client_id,$discount,$promotion_name,$client_name,$merchant_name,$inputbranchpin,$amount,$merchant_id,$discountlvl,$discription,$created);
                    if($discountlvl==1){
                        $creatediscountlevel=$database->CreatePromotionDiscountLevel($client_id,$promotion_id,$merchant_id);
                        $updatediscountlevel=$database->updatePromotionDiscountLevel($client_id,$promotion_id,$discountlvl,$merchant_id);
                    }else{
                        $updatediscountlevel=$database->updatePromotionDiscountLevel($client_id,$promotion_id,$discountlvl,$merchant_id);
                    }
                return_json(['status' => 1, 'msg' => 'Payment Successfully','paymentamount'=>$payment_amount,'discount'=>$formattedDiscount]);
            } else {
                return_json(['status' => 0, 'msg' => 'Branch Pin is invalid.']); 
            }
        } else {
            return_json(['status' => 0, 'msg' => 'Merchant is missing.']); 
        }
    } else {
        return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
    }
}else if ($action === 'getRedemptionHistory') {
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
    if ($is_jwt_valid) {
        $rest_json = file_get_contents('php://input');
        $_POST = json_decode($rest_json, true);
        if(isset($_POST['id']) && !empty($_POST['id']) && empty($_POST['search']) && empty($_POST['sortby'])){
            $merchant_id = $_POST['id'];
            $offset=$_POST['offset'];
            if ($merchant = $database->getRedemptionHistory($merchant_id,$offset)) {
                return_json(['status' => 1, 'merchant' => $merchant]);
            } else {
                return_json(['status' => 0, 'msg' => 'Merchant id is invalid.']); 
            }
        }else if(isset($_POST['search']) && isset($_POST['id']) && !empty($_POST['search'])){
            $merchant_id = $_POST['id'];
            $search=$_POST['search'];
            $offset=$_POST['offset'];
            if ($merchant = $database->searchHistoryMerchant($merchant_id,$search,$offset)) {
                return_json(['status' => 1, 'merchant' => $merchant]);
            } else {
                return_json(['status' => 0, 'msg' => 'Merchant id is invalid.']); 
            }
        }else if(isset($_POST['sortby']) && isset($_POST['id'])  && !empty($_POST['sortby'])){
            $merchant_id = $_POST['id'];
            $sort=$_POST['sortby'];
            $offset=$_POST['offset'];
            if ($merchant = $database->sortHistoryMerchants($merchant_id,$sort,$offset)) {
                return_json(['status' => 1, 'merchant' => $merchant]);
            } else {
                return_json(['status' => 0, 'msg' => 'Merchant id is invalid.']); 
            }
        }
        } else {
            return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
        }
    }else if ($action === 'getWalletAmountTotal') {

        if ($is_jwt_valid) {
            $rest_json = file_get_contents('php://input');
            $_POST = json_decode($rest_json, true);
    
            if (isset($_POST['id']) && !empty($_POST['id'])) {
                $client_id = $_POST['id'];
                if ($wallet = $database->getWalletAmountTotal($client_id)) {
                    $totalAmount = 0;
                    foreach ($wallet as $row) {
                        $totalAmount += $row['amount'];
                    }
                    $totalmerchant=$database->getClinetMerchantCount($client_id);
                    return_json(['status' => 1, 'wallet' => $totalAmount,'totalmerchant'=>$totalmerchant]);
                } else {
                    return_json(['status' => 0, 'msg' => 'Client id is invalid.']);
                }
            }else {
                return_json(['status' => 0, 'msg' => 'Client id is missing.']);
            }
        } else {
            return_json(['status' => 0, 'msg' => 'Invalid access token.']);
        }
    }else if ($action === 'getRedemptionHistoryTotal') {
        header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
    if ($is_jwt_valid) {
        $rest_json = file_get_contents('php://input');
        $_POST = json_decode($rest_json, true);
        if(isset($_POST['id']) && !empty($_POST['id']) ){
            $merchant_id = $_POST['id'];
            if ($merchant = $database->getRedemptionHistoryTotal($merchant_id)) {
				$totalAmount = 0;
                    foreach ($merchant as $row) {
                        $totalAmount += $row['discount'];
                    }
                    $formattedNumber = number_format($totalAmount, 2);
                return_json(['status' => 1, 'totaldiscount' => $formattedNumber]);
            } else {
                return_json(['status' => 0, 'msg' => 'Merchant id is invalid.']); 
            }
        }  
        } else {
            return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
        }
    }
            else if ($action === 'getDiscountlevelcount') {
                header('Access-Control-Allow-Origin: *');
                header('Cache-Control: no-cache, no-store, must-revalidate');
                header('Pragma: no-cache');
                header('Expires: 0');
                header('Access-Control-Allow-Methods: GET, POST');
                header('Access-Control-Allow-Headers: Content-Type, Authorization');
                    if ($is_jwt_valid) {
                        $rest_json = file_get_contents('php://input');
                        $_POST = json_decode($rest_json, true);
                        if(isset($_POST['id'])){
                            $merchant_id = $_POST['id'];
                            if ($disocuntlvl = $database->GetRedeemHistorybyDiscountLevel($merchant_id)){
                                return_json(['status' => 1, 'disocuntlvl' => $disocuntlvl]);
                            } else {
                                return_json(['status' => 0, 'msg' => 'Merchant id is invalid.']); 
                            }
                        }
                        } else {
                            return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
                        }
                    }
                    else if ($action === 'getRedemptionHistorySingleClient') {
                        header('Access-Control-Allow-Origin: *');
                        header('Cache-Control: no-cache, no-store, must-revalidate');
                        header('Pragma: no-cache');
                        header('Expires: 0');
                        header('Access-Control-Allow-Methods: GET, POST');
                        header('Access-Control-Allow-Headers: Content-Type, Authorization');
                            if ($is_jwt_valid) {
                                $rest_json = file_get_contents('php://input');
                                $_POST = json_decode($rest_json, true);
                                if(isset($_POST['client_id']) && !empty($_POST['client_id']) &&  empty($_POST['sortby']) && empty($_POST['sortbydiscount'])){
                                    $client_id = $_POST['client_id'];
                                    $offset=$_POST['offset'];
                                    if ($merchant = $database->getRedemptionHistorySingleClient($client_id,$offset)) {
                                        return_json(['status' => 1, 'merchant' => $merchant]);
                                    } else {
                                        return_json(['status' => 0, 'msg' => 'Merchant id is invalid.']); 
                                    }
                                }else if(isset($_POST['sortby']) && isset($_POST['client_id'])  && !empty($_POST['sortby'])){
                                    $client_id = $_POST['client_id'];
                                    $sort=$_POST['sortby'];
                                    $offset=$_POST['offset'];
                                    if ($merchant = $database->sortHistoryMerchantsSingleClient($client_id,$sort,$offset)) {
                                        return_json(['status' => 1, 'merchant' => $merchant]);
                                    } else {
                                        return_json(['status' => 0, 'msg' => 'Merchant id is invalid.']); 
                                    }
                                }else if(isset($_POST['sortbydiscount']) && isset($_POST['client_id'])  && !empty($_POST['sortbydiscount'])){
                                    $client_id = $_POST['client_id'];
                                    $sortbydiscount=$_POST['sortbydiscount'];
                                    $offset=$_POST['offset'];
                                    if ($merchant = $database->sortByDiscountHistoryMerchantsSingleClient($client_id,$sortbydiscount,$offset)) {
                                        return_json(['status' => 1, 'merchant' => $merchant]);
                                    } else {
                                        return_json(['status' => 0, 'msg' => 'Merchant id is invalid.']); 
                                    }
                                }
                                } else {
                                    return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
                                }
                            }else if ($action === 'getRedemptionSingleHistory') {
                                header('Access-Control-Allow-Origin: *');
                                header('Cache-Control: no-cache, no-store, must-revalidate');
                                header('Pragma: no-cache');
                                header('Expires: 0');
                                header('Access-Control-Allow-Methods: GET, POST');
                                header('Access-Control-Allow-Headers: Content-Type, Authorization');
                                    if ($is_jwt_valid) {
                                        $rest_json = file_get_contents('php://input');
                                        $_POST = json_decode($rest_json, true);
                                        if(isset($_POST['branch_pin']) && !empty($_POST['branch_pin']) &&  empty($_POST['sortby']) && empty($_POST['sortbydiscount'])){
                                            $branch_pin = $_POST['branch_pin'];
                                            $offset=$_POST['offset'];
                                            if ($merchant = $database->getRedemptionSingleHistory($branch_pin,$offset)) {
                                                return_json(['status' => 1, 'merchant' => $merchant]);
                                            } else {
                                                return_json(['status' => 0, 'msg' => 'Merchant id is invalid.']); 
                                            }
                                        }else if(isset($_POST['sortby']) && isset($_POST['branch_pin'])  && !empty($_POST['sortby'])){
                                            $branch_pin = $_POST['branch_pin'];
                                            $sort=$_POST['sortby'];
                                            $offset=$_POST['offset'];
                                            if ($merchant = $database->sortSingleHistoryMerchants($branch_pin,$sort,$offset)) {
                                                return_json(['status' => 1, 'merchant' => $merchant]);
                                            } else {
                                                return_json(['status' => 0, 'msg' => 'Merchant id is invalid.']); 
                                            }
                                        }else if(isset($_POST['sortbydiscount']) && isset($_POST['branch_pin'])  && !empty($_POST['sortbydiscount'])){
                                            $branch_pin = $_POST['branch_pin'];
                                            $sortbydiscount=$_POST['sortbydiscount'];
                                            $offset=$_POST['offset'];
                                            if ($merchant = $database->sortByDiscountSingleHistoryMerchants($branch_pin,$sortbydiscount,$offset)) {
                                                return_json(['status' => 1, 'merchant' => $merchant]);
                                            } else {
                                                return_json(['status' => 0, 'msg' => 'Merchant id is invalid.']); 
                                            }
                                        }
                                        } else {
                                            return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
                                        }
                                    }
                            else if ($action === 'getTotalVisits') {

                                if ($is_jwt_valid) {
                                    $rest_json = file_get_contents('php://input');
                                    $_POST = json_decode($rest_json, true);
                                    if (isset($_POST['id']) && !empty($_POST['id'])) {
                                        $merchant_id = $_POST['id'];
                                        if ($data = $database->getTotalVisits($merchant_id)) {
                                            return_json(['status' => 1, 'data' => $data]);
                                        } else {
                                            return_json(['status' => 0, 'msg' => 'Client id is invalid.']);
                                        }
                                    }else {
                                        return_json(['status' => 0, 'msg' => 'Client id is missing.']);
                                    }
                                } else {
                                    return_json(['status' => 0, 'msg' => 'Invalid access token.']);
                                }
                            }    else if ($action === 'deletePromotion') {
                                header('Access-Control-Allow-Origin: *');
                            header('Cache-Control: no-cache, no-store, must-revalidate');
                            header('Pragma: no-cache');
                            header('Expires: 0');
                            header('Access-Control-Allow-Methods: GET, POST');
                            header('Access-Control-Allow-Headers: Content-Type, Authorization');
                            if ($is_jwt_valid) {
                                $rest_json = file_get_contents('php://input');
                                $_POST = json_decode($rest_json, true);
                                $promotion_id=$_POST['id'];
                                if ($promotion = $database->DeletePromotion($promotion_id)) {
                                        return_json(['status' => 1, 'msg'=>'Merchant Deleted Sucessfully']);
                                }else{
                                    return_json(['status' => 0, 'msg' =>  'Merchant is invaild']);
                                }
                            }else {
                                    return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
                            }
                            }
                            else if ($action === 'deleteBranch') {
                            header('Access-Control-Allow-Origin: *');
                            header('Cache-Control: no-cache, no-store, must-revalidate');
                            header('Pragma: no-cache');
                            header('Expires: 0');
                            header('Access-Control-Allow-Methods: GET, POST');
                            header('Access-Control-Allow-Headers: Content-Type, Authorization');
                            if ($is_jwt_valid) {
                                $rest_json = file_get_contents('php://input');
                                $_POST = json_decode($rest_json, true);
                                $branch_id=$_POST['id'];
                                if ($branch = $database->DeleteBranch($branch_id)) {
                                        return_json(['status' => 1, 'msg'=>'Branch Deleted Sucessfully']);
                                }else{
                                    return_json(['status' => 0, 'msg' =>  'Branch is invaild']);
                                }
                            }else {
                                    return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
                            }
                            }elseif ($action === 'editBranch') {
                                header('Access-Control-Allow-Origin: *');
                                header('Cache-Control: no-cache, no-store, must-revalidate');
                                header('Pragma: no-cache');
                                header('Expires: 0');
                                header('Access-Control-Allow-Methods: GET, POST');
                                header('Access-Control-Allow-Headers: Content-Type, Authorization');
                                    if ($is_jwt_valid) {
                                        $branch = [
                                            'branchpin' => $_POST['branchpin'],
                                            'discription' => $_POST['discription'],
                                            'merchant_id'=>$_POST['merchant_id'],
                                            'id'=>$_POST['id']
                                        ];
                                                               
                                    $branchpin = $database->editBranch($branch);
                                    if ($branchpin) {
                                            return_json(['status' => 1, 'msg' => 'Branch Updated Sucessfully']);
                                        }else{
                                        return_json(['status' => 0, 'msg' =>  'Please contact to administrator.']);
                                    } 
                                    }else {
                                            return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
                                        }
                                }else if ($action === 'getRedemptionSingleHistoryBylvl') {
                                    header('Access-Control-Allow-Origin: *');
                                    header('Cache-Control: no-cache, no-store, must-revalidate');
                                    header('Pragma: no-cache');
                                    header('Expires: 0');
                                    header('Access-Control-Allow-Methods: GET, POST');
                                    header('Access-Control-Allow-Headers: Content-Type, Authorization');
                                        if ($is_jwt_valid) {
                                            $rest_json = file_get_contents('php://input');
                                            $_POST = json_decode($rest_json, true);
                                            if(isset($_POST['level']) && !empty($_POST['level']) &&  empty($_POST['sortby']) && empty($_POST['sortbydiscount'])){
                                                $level = $_POST['level'];
                                                $offset=$_POST['offset'];
                                                if ($merchant = $database->getRedemptionSingleHistorybylvl($level,$offset)) {
                                                    return_json(['status' => 1, 'merchant' => $merchant]);
                                                } else {
                                                    return_json(['status' => 0, 'msg' => 'Merchant id is invalid.']); 
                                                }
                                            }else if(isset($_POST['sortby']) && isset($_POST['branch_pin'])  && !empty($_POST['sortby'])){
                                                $level = $_POST['level'];
                                                $sort=$_POST['sortby'];
                                                $offset=$_POST['offset'];
                                                if ($merchant = $database->sortSingleHistoryMerchantsByLvl($level,$sort,$offset)) {
                                                    return_json(['status' => 1, 'merchant' => $merchant]);
                                                } else {
                                                    return_json(['status' => 0, 'msg' => 'Merchant id is invalid.']); 
                                                }
                                            }else if(isset($_POST['sortbydiscount']) && isset($_POST['branch_pin'])  && !empty($_POST['sortbydiscount'])){
                                                $level = $_POST['level'];
                                                $sortbydiscount=$_POST['sortbydiscount'];
                                                $offset=$_POST['offset'];
                                                if ($merchant = $database->sortByDiscountSingleHistoryMerchantsBylvl($level,$sortbydiscount,$offset)) {
                                                    return_json(['status' => 1, 'merchant' => $merchant]);
                                                } else {
                                                    return_json(['status' => 0, 'msg' => 'Merchant id is invalid.']); 
                                                }
                                            }
                                            } else {
                                                return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
                                            }
                                        }

    /*Admin Api*/
    else if ($action === 'adminlogin') {
        header('Access-Control-Allow-Origin: *');
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        header('Access-Control-Allow-Methods: GET, POST');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
            $rest_json = file_get_contents('php://input');
            $_POST = json_decode($rest_json, true);
                if ($user = $database->checkAdminLogin(
                    $_POST['username'],
                    md5($_POST['password'])
                )){
                    $headers = ['alg' => 'HS256', 'typ' => 'JWT'];
                    $payload = ['member' => $user];
                    $jwt = generate_jwt($headers, $payload);
                    return_json(['status' => 1, 'token' => $jwt, 'user_id' => $user['id']]);
                }else {
                    return_json(['status' => 0, 'msg' => 'Email or Password is invalid.']); 
                }
    }
    else if ($action === 'getAllMerchant') {
        header('Access-Control-Allow-Origin: *');
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        header('Access-Control-Allow-Methods: GET, POST');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        if ($is_jwt_valid) {
            $rest_json = file_get_contents('php://input');
            $_POST = json_decode($rest_json, true);
            if(isset($_POST['id']) && !empty($_POST['id']) && empty($_POST['search']) && empty($_POST['sortby'])){
                $offset=$_POST['offset'];
                if ($allmerchant = $database->getMerchantAdmin($offset)) {
                    
                    return_json(['status' => 1, 'allmerchant' => $allmerchant]);
                } else {
                    return_json(['status' => 0, 'msg' => 'Data is invalid.']); 
                }
            }else if(isset($_POST['search']) && isset($_POST['id']) && !empty($_POST['search'])){
                $search_input = $_POST['search'];
                $offset=$_POST['offset'];
                if ($allmerchant = $database->getSearchMerchantAdmin($search_input,$offset)) {
                    return_json(['status' => 1, 'allmerchant' => $allmerchant]);
                } else {
                    return_json(['status' => 0, 'msg' => 'Data is invalid.']); 
                }
            }else if(isset($_POST['sortby']) && isset($_POST['id'])  && !empty($_POST['sortby'])){
                $sortby = $_POST['sortby'];
                $offset=$_POST['offset'];
                if ($allmerchant = $database->sortMerchantAdmin($sortby,$offset)) {
                    return_json(['status' => 1, 'allmerchant' => $allmerchant]);
                } else {
                    return_json(['status' => 0, 'msg' => 'data is invalid.']); 
                }
            }else {
                return_json(['status' => 0, 'msg' => 'Admin is not login.']); 
            }
        } else {
            return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
        }
    }
    else if ($action === 'getAllClientAdmin') {
        header('Access-Control-Allow-Origin: *');
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        header('Access-Control-Allow-Methods: GET, POST');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        if ($is_jwt_valid) {
            $rest_json = file_get_contents('php://input');
            $_POST = json_decode($rest_json, true);
            if(isset($_POST['id']) && !empty($_POST['id']) && empty($_POST['search']) && empty($_POST['sortby'])){
                $offset=$_POST['offset'];
                if ($allclient = $database->getClientAdmin($offset)) {
                    return_json(['status' => 1, 'allclient' => $allclient]);
                } else {
                    return_json(['status' => 0, 'msg' => 'Data is invalid.']); 
                }
            }else if(isset($_POST['search']) && isset($_POST['id']) && !empty($_POST['search'])){
                $search_input = $_POST['search'];
                $offset=$_POST['offset'];
                if ($allclient = $database->getSearchClientAdmin($search_input,$offset)) {
                    return_json(['status' => 1, 'allclient' => $allclient]);
                } else {
                    return_json(['status' => 0, 'msg' => 'Data is invalid.']); 
                }
            }else if(isset($_POST['sortby']) && isset($_POST['id'])  && !empty($_POST['sortby'])){
                $sortby = $_POST['sortby'];
                $offset=$_POST['offset'];
                if ($allclient = $database->sortClientAdmin($sortby,$offset)) {
                    return_json(['status' => 1, 'allclient' => $allclient]);
                } else {
                    return_json(['status' => 0, 'msg' => 'data is invalid.']); 
                }
            }else {
                return_json(['status' => 0, 'msg' => 'Admin is not login.']); 
            }
        } else {
            return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
        }
    }
    else if ($action === 'getPromotionAdmin') {
        header('Access-Control-Allow-Origin: *');
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        header('Access-Control-Allow-Methods: GET, POST');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
    
        if ($is_jwt_valid) {
            $rest_json = file_get_contents('php://input');
            $_POST = json_decode($rest_json, true);
    
            if(isset($_POST['id']) && !empty($_POST['id']) && empty($_POST['search']) && empty($_POST['sortby'])){
                $offset=$_POST['offset'];
                if ($merchantpromotion = $database->getPromotionAdmin($offset)) {
                    return_json(['status' => 1, 'promotion' => $merchantpromotion]);
                } else {
                    return_json(['status' => 0, 'msg' => 'promotion id is invalid.']); 
                }
            }else if(isset($_POST['search']) && isset($_POST['id']) && !empty($_POST['search']) && empty($_POST['sortby'])){
                $search=$_POST['search'];
                $offset=$_POST['offset'];
                if ($merchantpromotion = $database->searchPromotionAdmin($search,$offset)) {
                    return_json(['status' => 1, 'promotion' => $merchantpromotion]);
                } else {
                    return_json(['status' => 0, 'msg' => 'promotion id is invalid.']); 
                }
            }else if(isset($_POST['sortby']) && isset($_POST['id'])  && !empty($_POST['sortby'])){
                $sort=$_POST['sortby'];
                $offset=$_POST['offset'];
                if ($merchantpromotion = $database->sortPromotionsAdmin($sort,$offset)) {
                    return_json(['status' => 1, 'promotion' => $merchantpromotion]);
                } else {
                    return_json(['status' => 0, 'msg' => 'promotion id is invalid.']); 
                }
            } else {
                return_json(['status' => 0, 'msg' => 'promotion id is missing.']); 
            }
        } else {
            return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
        }
    }
else if ($action === 'getmerchantReview') {
        header('Access-Control-Allow-Origin: *');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    header('Access-Control-Allow-Methods: GET, POST');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    if ($is_jwt_valid) {
        $rest_json = file_get_contents('php://input');
        $_POST = json_decode($rest_json, true);
        if(isset($_POST['id']) && !empty($_POST['id']) && empty($_POST['client_id']) && empty($_POST['checkstatus']) && empty($_POST['search'])){
        $merchant_id=$_POST['id'];
        if ($review = $database->GetReview($merchant_id)) {
            $totalreview = 0;
            $numberOfRatings = count($review);
            foreach ($review as $row) {
                $totalreview += $row['rating'];
            }
            $averageRating = $totalreview / $numberOfRatings;
            $formattedAverage = number_format($averageRating,1);
                return_json(['status' => 1, 'review'=>$review, 'totalratingavg'=>$formattedAverage]);
        }
        }elseif(isset($_POST['client_id']) && !empty($_POST['client_id']) && !empty($_POST['id']) && empty($_POST['checkstatus']) && empty($_POST['search'])){
            $client_id=$_POST['client_id'];
            $merchant_id=$_POST['id'];
            $review = $database->GetReviewSingleData($client_id,$merchant_id);
            if($review){
                return_json(['status' => 1, 'review'=>$review[0]]);
            }
         }elseif(isset($_POST['checkstatus'])  && !empty($_POST['client_id']) && !empty($_POST['checkstatus']) && empty($_POST['search'])){
            $client_id=$_POST['client_id'];
            $review = $database->GetReviewSingleDataWithStatus($client_id);
            if($review){
                return_json(['status' => 1, 'review'=>$review]);
            }
         }elseif(isset($_POST['search'])  && !empty($_POST['search']) && !empty($_POST['client_id']) && !empty($_POST['checkstatus'])){
            $client_id=$_POST['client_id'];
            $search=$_POST['search'];
            $review = $database->GetReviewSingleDataWithStatusSearch($client_id,$search);
            if($review){
                return_json(['status' => 1, 'review'=>$review]);
            }
         }
         else{
            return_json(['status' => 0, 'msg' =>  'Merchant is invaild']);
        }
    }else {
            return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
    }
}
else if ($action === 'deleteMerchant') {
    header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($is_jwt_valid) {
    $rest_json = file_get_contents('php://input');
    $_POST = json_decode($rest_json, true);
    $merchant_id=$_POST['id'];
    if ($merchant = $database->DeleteMerchant($merchant_id)) {
            return_json(['status' => 1, 'msg'=>'Merchant Deleted Sucessfully']);
    }else{
        return_json(['status' => 0, 'msg' =>  'Merchant is invaild']);
    }
}else {
        return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
}
}
else if ($action === 'deleteClient') {
    header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($is_jwt_valid) {
    $rest_json = file_get_contents('php://input');
    $_POST = json_decode($rest_json, true);
    $client_id=$_POST['id'];
    if ($client = $database->DeleteClient($client_id)) {
            return_json(['status' => 1, 'msg'=>'Merchant Deleted Sucessfully']);
    }else{
        return_json(['status' => 0, 'msg' =>  'Merchant is invaild']);
    }
}else {
        return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
}
}
elseif ($action === 'editPromotionLevelAdmin') {
    header('Access-Control-Allow-Origin: *');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    header('Access-Control-Allow-Methods: GET, POST');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
        if ($is_jwt_valid) {
        $promotion = [
            'level1' => $_POST['level1'],
            'level2' => $_POST['level2'],
            'level3' => $_POST['level3'],
            'level4' => $_POST['level4'],
            'level5' => $_POST['level5'],
            'level6' => $_POST['level6'],
            'level7' => $_POST['level7'],
            'level8' => $_POST['level8'],
            'level9' => $_POST['level9'],
            'level10' => $_POST['level10'],
            'promotion_id'=>$_POST['promotion_id']
        ];
        $promotion = $database->editPromotionByAdmin($promotion);
        if ($promotion) {
                return_json(['status' => 1, 'msg' => 'Promotion Updated Sucessfully']);
            }else{
            return_json(['status' => 0, 'msg' =>  'Please contact to administrator.']);
        } 
        }else {
                return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
        }
    }
    elseif ($action === 'addrefferalamount') {
        header('Access-Control-Allow-Origin: *');
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        header('Access-Control-Allow-Methods: GET, POST');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
            if ($is_jwt_valid) {
            $amount = [
                'amount' => $_POST['amount'],
            ];
            $amount = $database->UpdateRefferalAmount($amount);
            if ($amount) {
                    return_json(['status' => 1, 'msg' => 'Refferal Updated Sucessfully']);
                }else{
                return_json(['status' => 0, 'msg' =>  'Please Try Again.']);
            } 
            }else {
                    return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
            }
        }
        elseif ($action === 'getRefferalAmountAdmin') {
            header('Access-Control-Allow-Origin: *');
            header('Cache-Control: no-cache, no-store, must-revalidate');
            header('Pragma: no-cache');
            header('Expires: 0');
            header('Access-Control-Allow-Methods: GET, POST');
            header('Access-Control-Allow-Headers: Content-Type, Authorization');
                if ($is_jwt_valid) {
                $amount = $database->getRefferalAmountAdmin();
                if ($amount) {
                        return_json(['status' => 1, 'amount' => $amount]);
                    }else{
                    return_json(['status' => 0, 'msg' =>  'Please Try Again.']);
                } 
                }else {
                        return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
                }
            }else if ($action === 'getRedemptionHistoryAdmin') {
                header('Access-Control-Allow-Origin: *');
                header('Cache-Control: no-cache, no-store, must-revalidate');
                header('Pragma: no-cache');
                header('Expires: 0');
                header('Access-Control-Allow-Methods: GET, POST');
                header('Access-Control-Allow-Headers: Content-Type, Authorization');
                    if ($is_jwt_valid) {
                        $rest_json = file_get_contents('php://input');
                        $_POST = json_decode($rest_json, true);
                        if(isset($_POST['id']) && !empty($_POST['id']) && empty($_POST['search']) && empty($_POST['sortby']) && empty($_POST['sortbydiscount'])){
                            $merchant_id = $_POST['id'];
                            $offset=$_POST['offset'];
                            if ($merchant = $database->getRedemptionHistoryAdmin($merchant_id,$offset)) {
                                return_json(['status' => 1, 'merchant' => $merchant]);
                            } else {
                                return_json(['status' => 0, 'msg' => 'Merchant id is invalid.']); 
                            }
                        }else if(isset($_POST['search']) && isset($_POST['id']) && !empty($_POST['search']) && empty($_POST['sortbydiscount'])){
                            $merchant_id = $_POST['id'];
                            $search=$_POST['search'];
                            $offset=$_POST['offset'];
                            if ($merchant = $database->searchHistoryMerchantAdmin($merchant_id,$search,$offset)) {
                                return_json(['status' => 1, 'merchant' => $merchant]);
                            } else {
                                return_json(['status' => 0, 'msg' => 'Merchant id is invalid.']); 
                            }
                        }else if(isset($_POST['sortby']) && isset($_POST['id'])  && !empty($_POST['sortby']) && empty($_POST['sortbydiscount'])){
                            $merchant_id = $_POST['id'];
                            $sort=$_POST['sortby'];
                            $offset=$_POST['offset'];
                            if ($merchant = $database->sortHistoryMerchantsAdmin($merchant_id,$sort,$offset)) {
                                return_json(['status' => 1, 'merchant' => $merchant]);
                            } else {
                                return_json(['status' => 0, 'msg' => 'Merchant id is invalid.']); 
                            }
                        }else if(isset($_POST['sortbydiscount']) && isset($_POST['id'])  && !empty($_POST['sortbydiscount'])){
                            $merchant_id = $_POST['id'];
                            $sortbydiscount=$_POST['sortbydiscount'];
                            $offset=$_POST['offset'];
                            if ($merchant = $database->sortByDiscountHistoryAdmin($merchant_id,$sortbydiscount,$offset)) {
                                return_json(['status' => 1, 'merchant' => $merchant]);
                            } else {
                                return_json(['status' => 0, 'msg' => 'Merchant id is invalid.']); 
                            }
                        }
                        } else {
                            return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
                        }
                    }
                    else if ($action === 'getRedemptionHistoryAdminDashbord') {
                        header('Access-Control-Allow-Origin: *');
                        header('Cache-Control: no-cache, no-store, must-revalidate');
                        header('Pragma: no-cache');
                        header('Expires: 0');
                        header('Access-Control-Allow-Methods: GET, POST');
                        header('Access-Control-Allow-Headers: Content-Type, Authorization');
                            if ($is_jwt_valid) {
                                $rest_json = file_get_contents('php://input');
                                $_POST = json_decode($rest_json, true);
                                if(isset($_POST['id']) && !empty($_POST['id'])){
                                    if ($merchant = $database->getRedemptionHistoryAdminDashborad()) {
                                        return_json(['status' => 1, 'merchant' => $merchant]);
                                    } else {
                                        return_json(['status' => 0, 'msg' => 'User id is invalid.']); 
                                    }
                                }
                                } else {
                                    return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
                                }
                            }
                            else if ($action === 'getRedemptionHistoryTotalAdmin') {
                                header('Access-Control-Allow-Origin: *');
                        header('Cache-Control: no-cache, no-store, must-revalidate');
                        header('Pragma: no-cache');
                        header('Expires: 0');
                        header('Access-Control-Allow-Methods: GET, POST');
                        header('Access-Control-Allow-Headers: Content-Type, Authorization');
                            if ($is_jwt_valid) {
                                $rest_json = file_get_contents('php://input');
                                $_POST = json_decode($rest_json, true);
                                if(isset($_POST['id']) && !empty($_POST['id']) ){
                                    if ($merchant = $database->getRedemptionHistoryTotalAdmin()) {
                                        $totalAmount = 0;
                                            foreach ($merchant as $row) {
                                                $totalAmount += $row['discount'];
                                            }
                                            $formattedNumber = number_format($totalAmount, 2);
                                        return_json(['status' => 1, 'totaldiscount' => $formattedNumber]);
                                    } else {
                                        return_json(['status' => 0, 'msg' => 'User id is invalid.']); 
                                    }
                                }  
                                } else {
                                    return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
                                }
                            }
                            else if ($action === 'getTotalAmountAdmin') {
                                header('Access-Control-Allow-Origin: *');
                        header('Cache-Control: no-cache, no-store, must-revalidate');
                        header('Pragma: no-cache');
                        header('Expires: 0');
                        header('Access-Control-Allow-Methods: GET, POST');
                        header('Access-Control-Allow-Headers: Content-Type, Authorization');
                            if ($is_jwt_valid) {
                                $rest_json = file_get_contents('php://input');
                                $_POST = json_decode($rest_json, true);
                                if(isset($_POST['id']) && !empty($_POST['id']) ){
                                    if ($merchant = $database->getTotalAmountAdmin()) {
                                        $totalAmount = 0;
                                            foreach ($merchant as $row) {
                                                $totalAmount += $row['discount'];
                                            }
                                            $formattedNumber = number_format($totalAmount, 2);
                                        return_json(['status' => 1, 'totaldiscount' => $formattedNumber]);
                                    } else {
                                        return_json(['status' => 0, 'msg' => 'User id is invalid.']); 
                                    }
                                }  
                                } else {
                                    return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
                                }
                            }
                            else if ($action === 'getDiscountAvarge') {
                                header('Access-Control-Allow-Origin: *');
                                header('Cache-Control: no-cache, no-store, must-revalidate');
                                header('Pragma: no-cache');
                                header('Expires: 0');
                                header('Access-Control-Allow-Methods: GET, POST');
                                header('Access-Control-Allow-Headers: Content-Type, Authorization');
                                    if ($is_jwt_valid) {
                                        $rest_json = file_get_contents('php://input');
                                        $_POST = json_decode($rest_json, true);
                                        if(isset($_POST['id'])){
                                            $merchant_id = $_POST['id'];
                                            if ($disocuntlvl = $database->GetRedeemHistorybyDiscounAvg($merchant_id)){
                                                    $totaldisocuntlvl = 0;
                                                    $numberOfRatings = count($disocuntlvl);
                                                    foreach ($disocuntlvl as $row) {
                                                        $totaldisocuntlvl += $row['discount'];
                                                    }
                                                    $averageRating = $totaldisocuntlvl / $numberOfRatings;
                                                    $formattedAverage = number_format($averageRating,0);
                                                return_json(['status' => 1, 'disocunt' => $formattedAverage]);
                                            } else {
                                                return_json(['status' => 0, 'msg' => 'Merchant id is invalid.']); 
                                            }
                                        }
                                        } else {
                                            return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
                                        }
                                    }
/* 
elseif ($action === 'memberConfirm') {
    if ($is_jwt_valid) {
        $rest_json = file_get_contents('php://input');
        $_POST = json_decode($rest_json, true);
    
        $user_id = getPayload($bearer_token)->member->id;

        if ($database->confirmCode($user_id, $_POST['confirmationCode'])) {
            if ($database->activeMember($user_id)) {
                return_json(['status' => 1, 'msg' => "Member successfully activated. Please login to continue."]);
            } else {
                return_json(['status' => 0, 'msg' => "Cannot activate the account. Please contact to administrator."]);
            }
        } else {
            return_json(['status' => 0, 'msg' => "Confirmation code is invalid, please enter the valid code."]);
        }
    } else {
        return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
    }
} elseif ($action === 'updateAdmin') {
    if ($is_jwt_valid) {
        $rest_json = file_get_contents('php://input');
        $_POST = json_decode($rest_json, true);
        $admin = [
            'id'   => $_POST['id'],
            'firstname' => $_POST['firstname'],
            'lastname' => $_POST['lastname'],
            'email' => $_POST['email']
        ];

        if(isset($_POST['password']) && !empty($_POST['password'])){
            $admin['password'] = md5($_POST['password']);
        }

        if ($database->updateAdmin($admin)) {
            return_json(['status' => 1, 'msg' => 'Profile updated successfull.']);
        } else {
            return_json(['status' => 0, 'msg' => 'Cannot update profile.']);
        }
    } else {
        return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
    }
} elseif ($action === 'adminLogin') {
    $rest_json = file_get_contents('php://input');
    $_POST = json_decode($rest_json, true);

    if (
        $user = $database->loginAdmin(
            $_POST['email'],
            md5($_POST['password'])
        )
    ) {
        $headers = ['alg' => 'HS256', 'typ' => 'JWT'];
        $payload = ['admin' => $user];
        $jwt = generate_jwt($headers, $payload);
        return_json(['status' => 1, 'token' => $jwt]);
    } else {
        return_json(['status' => 0, 'msg' => "Email or password is invalid."]);
    }
} elseif ($action === 'reset') {
    $rest_json = file_get_contents('php://input');
    $_POST = json_decode($rest_json, true);

    if ($user = $database->getUserByUsernameOrEmail($_POST['username'])) {
        $generated_password = uniqid(round(11111, 99999));
        $user['password'] = md5($generated_password);
        if ($database->updateUser($user)) {
            //send password ($generated_password value) to user by email
            return_json(['status' => 1]);
        }
    }
} elseif ($action === 'adminUser') {
    if ($is_jwt_valid) {
        $email = getPayload($bearer_token)->admin->email;
        if ($user = $database->getAdminByEmail($email)) {
            return_json(['status' => 1, 'user' => $user]);
        } else {
            return_json(['status' => 0, 'msg' => 'Invalid email address.']); 
        }
    } else {
        return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
    }
}  elseif ($action === 'createMember') {
    if ($is_jwt_valid) {
        $rest_json = file_get_contents('php://input');
        $_POST = json_decode($rest_json, true);
        $member = [
            'firstname' => trim($_POST['firstname']),
            'lastname' => $_POST['lastname'],
            'email' => $_POST['email'],
            'password' => md5($_POST['password']),
            'status' => $_POST['status'],
            'created_at' => date('Y-m-d H:i:s')
        ];
        if($database->checkMemberExistByEmail($member['email'])){
            return_json(['status' => 0, 'msg' => 'A Member already exist with the same email.']);
        }
        if ($member_id = $database->insertMember($member)) {
            $member_response['id'] = $member_id;
            return_json(['status' => 1, 'member' => $member_response]);
        } else {
            return_json(['status' => 0, 'msg' => 'Cannot create member.']);
        }
    } else {
        return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
    }
} elseif ($action === 'updateMember') {
    if ($is_jwt_valid) {
		
		if(!isset($_POST['id'])|| empty($_POST['id'])){
			return_json(['status' => 0, 'msg' => 'Please provide the member id.']);	
		}
		
        $member = [
            'id'   => $_POST['id'],
            'firstname' => trim($_POST['firstname']),
            'lastname' => $_POST['lastname'],
            'email' => $_POST['email'],
            'status' => $_POST['status'],
            'created_at' => date('Y-m-d H:i:s'),
			'short_desc' => '',
			'logo' => ''
        ];
		
		if(isset($_FILES['logo'])){
			

			$logo_files = $_FILES['logo'];
			$file_name = $logo_files['name'];
			$file_tmp_name = $logo_files['tmp_name'];
			
			$target_dir = "uploads/";
			$target_file = $target_dir . basename($file_name);
			
			if (file_exists($target_file)) {
				$file_name = time().'-'.$file_name;
				$target_file = $target_dir . basename($file_name);
			}	
			
			$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
			
			if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif" ) {
			  return_json(['status' => 0, 'msg' => 'Sorry, only JPG, JPEG, PNG & GIF type logo are allowed.']);
			}

			if(!move_uploaded_file($file_tmp_name, $target_file)){
				return_json(['status' => 0, 'msg' => 'Sorry cannot upload the logo right now.']);
			}
			
			$logo_url = sprintf(
				"%s://%s",
				isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',
				$_SERVER['SERVER_NAME']
			  ).'/'.$target_file;
			  
			$member['logo'] = $logo_url;  
		}
		
		
		if(isset($_POST['short_desc']) && !empty($_POST['short_desc'])){
			$short_desc = $_POST['short_desc'];
			$member['short_desc'] = $short_desc;
		}
		
		
        if(isset($_POST['password']) && !empty($_POST['password'])){
            $member['password'] = md5($_POST['password']);
        }
        if($database->checkMemberExistByEmail($_POST['email'], $_POST['id'])){
            return_json(['status' => 0, 'msg' => 'A Member already exist with the same email.']);
        }
        if ($database->updateMember($member)) {
            return_json(['status' => 1, 'msg' => 'Member updated successfull.']);
        } else {
            return_json(['status' => 0, 'msg' => 'Cannot update member.']);
        }
    } else {
        return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
    }
} elseif ($action === 'deleteMember') {
    if ($is_jwt_valid) {
        $rest_json = file_get_contents('php://input');
        $_POST = json_decode($rest_json, true);


        if(isset($_POST['id']) && !empty($_POST['id'])){
            $id = $_POST['id'];
            if(!$database->checkMemberExistById($id)){
                return_json(['status' => 0, 'msg' => 'The member not exist for this id.']);
            }

            if ($database->deleteMember($id)) {
                return_json(['status' => 1, 'msg' => 'Member deleted successfully.']);
            } else {
                return_json(['status' => 0, 'msg' => 'Cannot delete member.']);
            }

        } else {
            return_json(['status' => 0, 'msg' => 'Please provide a valid member id for delete the plan.']); 
        } 
    } else {
        return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
    }
} elseif ($action === 'members') {
    if ($is_jwt_valid) {
        if ($members = $database->getMembers()) {
            return_json(['status' => 1, 'members' => $members]);
        } else {
            return_json(['status' => 0, 'msg' => 'No members available.']); 
        }
    } else {
        return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
    }
} elseif ($action === 'member') {
    if ($is_jwt_valid) {
        //$rest_json = file_get_contents('php://input');
        //$_POST = json_decode($rest_json, true);

        if(isset($_GET['id']) && !empty($_GET['id'])){
            $member_id = $_GET['id'];
            if ($member = $database->getSingleMember($member_id)) {
                return_json(['status' => 1, 'member' => $member[0]]);
            } else {
                return_json(['status' => 0, 'msg' => 'Member id is invalid.']); 
            }
        } else {
            return_json(['status' => 0, 'msg' => 'Member id is missing.']); 
        }
    } else {
        return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
    }
} elseif ($action === 'memberLogin') {
    $rest_json = file_get_contents('php://input');
    $_POST = json_decode($rest_json, true);

    if (
        $user = $database->loginMember(
            $_POST['email'],
            md5($_POST['password'])
        )
    ) {
        if($user['status'] == 1){
            $headers = ['alg' => 'HS256', 'typ' => 'JWT'];
            $payload = ['member' => $user];
            $jwt = generate_jwt($headers, $payload);
            return_json(['status' => 1, 'token' => $jwt, 'user_id' => $user['id']]);
        } else {
            return_json(['status' => 0, 'msg' => 'Your account is not activate. Please contact to administrator.']);
        }
    } else {
        return_json(['status' => 0, 'msg' => "Email or password is invalid."]);
    }
}  elseif ($action === 'businessRegistration') {
    
    $rest_json = file_get_contents('php://input');
    $_POST = json_decode($rest_json, true);
    $merchant = [
        'business_name' => $_POST['business_name'],
        'business_hours' => json_encode($_POST['business_hours']),
        'business_address' => $_POST['business_address'],
        'email' => $_POST['email'],
        'business_phone_number' => $_POST['business_phone_number'],
        'password' => md5($_POST['password']),
        'created_at' => date('Y-m-d H:i:s'),
    ];
    
    if($database->checkBusinessExistByEmail($merchant['email'])){
        return_json(['status' => 0, 'msg' => 'Business already registered with this email.']);
    }

    if ($merchant_id = $database->businessRegister($merchant)) {
        $merchant['id'] = $merchant_id;
        //if ($code = $database->generateConfirmCode($user_id)) {
            
            //$sent_mail = send_confirmation_code($user['firstname'].''.$user['lastname'], $user['email'], $code);
            
            //send generated code by email to user
            $headers = ['alg' => 'HS256', 'typ' => 'JWT'];
            $payload = ['business' => $merchant];
            $jwt = generate_jwt($headers, $payload);
            return_json(['status' => 1, 'token' =>  $jwt, 'business_id' => $merchant_id, 'msg' => 'Registration Successfull.']);

    } else{
        return_json(['status' => 0, 'msg' =>  'Cannot register for business. Please contact to administrator.']);
    }
} elseif ($action === 'addRestrauntDetails') {
    $rest_json = file_get_contents('php://input');
    $_POST = json_decode($rest_json, true);
    
    if ($is_jwt_valid) {
        
		if(!isset($_POST['id'])|| empty($_POST['id'])){
			return_json(['status' => 0, 'msg' => 'Please provide the business id.']);	
		}
		
        $restrauntDetails = [
            'id'   => $_POST['id'],
            'is_restaurant' => $_POST['is_restaurant'],
            'uber_eats_link' => $_POST['uber_eats_link'],
            'door_dash_link' => $_POST['door_dash_link'],
            'grub_hub' => $_POST['grub_hub'],
            'instacart' => $_POST['instacart'],
            'facebook_link' => $_POST['facebook_link'],
            'instagram_link' => $_POST['instagram_link']
        ];
	
        if ($database->addRestrauntDetails($restrauntDetails)) {
            return_json(['status' => 1, 'msg' => 'Restraunt details added successfull.']);
        } else {
            return_json(['status' => 0, 'msg' => 'Cannot add restro details.']);
        }
    } else {
        return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
    }
} elseif ($action === 'addMenuItems') {
    $rest_json = file_get_contents('php://input');
    $_POST = json_decode($rest_json, true);
    
    if ($is_jwt_valid) {
        print_r($_POST);
		if(!isset($_POST['id'])|| empty($_POST['id'])){
			return_json(['status' => 0, 'msg' => 'Please provide the business id.']);	
		}
		
        $menuItem = [
            'merchant_id'   => $_POST['merchant_id'],
            'name'          => $_POST['name'],
            'ingredients'   => $_POST['ingredients'],
            'photo'         => '',
            'price'         => $_POST['price']
        ];

        if(isset($_FILES['photo'])){
			
            print_r($_FILES);
            die();

			$logo_files = $_FILES['photo'];
			$file_name = $logo_files['name'];
			$file_tmp_name = $logo_files['tmp_name'];
			
			$target_dir = "uploads/";
			$target_file = $target_dir . basename($file_name);
			
			if (file_exists($target_file)) {
				$file_name = time().'-'.$file_name;
				$target_file = $target_dir . basename($file_name);
			}	
			
			$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
			
			if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif" ) {
			  return_json(['status' => 0, 'msg' => 'Sorry, only JPG, JPEG, PNG & GIF type logo are allowed.']);
			}

			if(!move_uploaded_file($file_tmp_name, $target_file)){
				return_json(['status' => 0, 'msg' => 'Sorry cannot upload the logo right now.']);
			}
			
			$logo_url = sprintf(
				"%s://%s",
				isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',
				$_SERVER['SERVER_NAME']
			  ).'/'.$target_file;
			  
			$menuItem['logo'] = $logo_url;  

            $database->addMenuItems($menuItem);
		}
        die();
        if () {
            return_json(['status' => 1, 'msg' => 'Menu details added successfull.']);
        } else {
            return_json(['status' => 0, 'msg' => 'Cannot add restro details.']);
        }
    } else {
        return_json(['status' => 0, 'msg' => 'Invalid access token.']); 
    }
}
*/

return_json(['status' => 0]);

function return_json($arr)
{
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: *');
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($arr);
    exit();
}
