<?php
date_default_timezone_set('Asia/Singapore');
class Database
{
    //private $server_name = 'localhost';
    //private $database_username = 'root';
    //private $database_password = '';
    //private $database_name = 'shmuel';
    //private $connection = null;

    private $server_name = 'localhost';
    private $database_username = 'u688797554_ryank123';
    private $database_password = 'Ib0~TS[w5M/k';
    private $database_name = 'u688797554_ryank123';
    private $connection = null;
    
    public function loginClient($email, $password)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `clients` WHERE email=? AND password=? AND status=1'
        );
        $sql->bind_param('ss', $email, $password);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            $sql->close();
            $this->connection->close();
            return $user;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function loginMerchant($email, $password)
    { 
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `merchants` WHERE email=? AND password=? AND status=1'
        );
        $sql->bind_param('ss', $email, $password);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            $sql->close();
            $this->connection->close();
            return $user;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getClient($client_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `clients` WHERE id = ?'
        );
        $sql->bind_param('i', $client_id);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            foreach($plans as &$plan){
            $getclientwallet = $this->connection->prepare(
                'SELECT balance FROM `client_wallet` WHERE client_id = ?'
            );
            $getclientwallet->bind_param('i',$client_id);
            $getclientwallet->execute();
            $walletdata = $getclientwallet->get_result();
            $balance = $walletdata->fetch_assoc();
            if($balance){
            $plan['walletbalance']=$balance['balance'];
            }
        }
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getWallet($client_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `client_wallet` WHERE client_id = ?'
        );
        $sql->bind_param('i', $client_id);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getWalletHistory($client_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `client_wallet_history` WHERE client_id = ? ORDER BY id DESC'
        );
        $sql->bind_param('i', $client_id);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getWalletAmountTotal($client_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT amount FROM `client_wallet_history` WHERE client_id = ?'
        );
        $sql->bind_param('i', $client_id);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getClinetMerchantCount($client_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT merchant_id FROM `client_wallet_history` WHERE client_id = ? GROUP BY merchant_id'
        );
        $sql->bind_param('i', $client_id);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getWalletHistorySortby($client_id,$sortby)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sortby = ($sortby === 'asc') ? 'ASC' : 'DESC';
        $sql = $this->connection->prepare(
            "SELECT * FROM `client_wallet_history` WHERE client_id = ? ORDER BY merchant_name $sortby"
        );
        $sql->bind_param('i', $client_id);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getWalletHistoryFilteBy($client_id,$merchant_name)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            "SELECT * FROM `client_wallet_history` WHERE client_id = ? AND merchant_name= ?"
        );
        $sql->bind_param('is', $client_id,$merchant_name);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function CreateWalletHistory($client_id,$updated_balance,$amount,$merchant_id,$promotion_id,$merchant_name,$discription,$created)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'INSERT INTO `client_wallet_history` (`client_id`, `wallet_balance`, `amount`, `merchant_name`, `merchant_id`,`promotion_id`,`discription`,`created`) VALUES (?, ?, ?, ?, ?,?,?,?)'
        );
        $sql->bind_param(
            'ssssssss',
            $client_id,
            $updated_balance,
            $amount,
            $merchant_name,
            $merchant_id,
            $promotion_id,
            $discription,
            $created
        );
        if ($sql->execute()) {
            $id = $this->connection->insert_id;
            $sql->close();
            $this->connection->close();
            return $id;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function CreateRedemptionHistory($client_id,$discount,$promotion_name,$client_name,$merchant_name,$inputbranchpin,$amount,$merchant_id,$discountlvl,$discription,$created)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'INSERT INTO `redemption_history` (`client_id`, `merchant_id`, `promotion_name`,`client_name`,`merchant_name`, `branch_pin`,`amount`, `discount`,`discount_level`,`discription`,`created`) VALUES (?,?, ?, ?, ?, ?,?,?,?,?,?)'
        );
        $sql->bind_param(
            'sssssssssss',
            $client_id,
            $merchant_id,
            $promotion_name,
            $client_name,
            $merchant_name,
            $inputbranchpin,
            $amount,
            $discount,
            $discountlvl,
            $discription,
            $created
        );
        if ($sql->execute()) {
            $id = $this->connection->insert_id;
            $sql->close();
            $this->connection->close();
            return $id;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getMerchantsClient($merchant_id,$offset)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $count = $this->connection->prepare(
            'SELECT COUNT(*) AS total_record FROM `redemption_history` WHERE merchant_id = ? GROUP BY client_id'
         );
         $count->bind_param('i', $merchant_id);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql = $this->connection->prepare(
            'SELECT * FROM `redemption_history` WHERE merchant_id = ? GROUP BY client_id ORDER BY id DESC limit 10 OFFSET ?'
        );
        $sql->bind_param('ii',$merchant_id,$offset); 
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $count=0;
            foreach($plans as $clientdata){
                $client_id=$clientdata['client_id'];
                $sqlclient = $this->connection->prepare(
                    'SELECT * FROM `clients` WHERE id = ? AND status=1'
                );
                $sqlclient->bind_param('i',$client_id); 
                $sqlclient->execute();
                $resultclient = $sqlclient->get_result();
                $clientdata = $resultclient->fetch_all(MYSQLI_ASSOC);
                $count++;
            }
            $sql->close();
            $this->connection->close();
            $alldata['data']=$clientdata;
            $alldata['count']=$count;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getClientMerchants($client_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `client_wallet_history` WHERE client_id = ? GROUP BY merchant_id ORDER BY id DESC'
        );
        $sql->bind_param('i', $client_id); 
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            foreach ($plans as &$plan) {
                $merchant_id=$plan['merchant_id'];
                $getmerchantname = $this->connection->prepare(
                    'SELECT username FROM `merchants` WHERE id = ? AND status=1'
                );
                $getmerchantname->bind_param('i',$merchant_id);
                $getmerchantname->execute();
                $merchantdata = $getmerchantname->get_result();
                $merchantnamedata = $merchantdata->fetch_assoc();
                $plan['username']=$merchantnamedata['username'];
            }
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getMerchant($merchant_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `merchants` WHERE id = ?'
        );
        $sql->bind_param('i', $merchant_id);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function RegisterMerchant($user)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'INSERT INTO `merchants` (`username`, `password`, `website`,`logo`,`about`,`facebook`,`youtube`,`tiktok`,`instagram`,`email`,`status`,`created`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)'
        );
        $sql->bind_param(
            'ssssssssssss',
            $user['username'],
            $user['password'],
            $user['website'],
            $user['logo'],
            $user['about'],
            $user['facebook'],
            $user['youtube'],
            $user['tiktok'],
            $user['instagram'],
            $user['email'],
            $user['status'],
            $user['created']
        );
        if ($sql->execute()) {
            $id = $this->connection->insert_id;
            $sql->close();
            $this->connection->close();
            return $id;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function CreateClientWallet($user_id,$walletamount)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'INSERT INTO `client_wallet` (`client_id`,`balance`,`created`) VALUES (?,?,?)'
        );
        $timestamp = time();
        $date = date('Y-m-d H:i:s', $timestamp);
        $sql->bind_param(
            'sss',
            $user_id,
            $walletamount,
            $date
        );
        if ($sql->execute()) {
            $id = $this->connection->insert_id;
            $sql->close();
            $this->connection->close();
            return $id;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
	public function updateClientAmount($userwallet)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'UPDATE `client_wallet` SET `balance` = ? where client_id = ?'
        );
        $sql->bind_param(
            'ss',
            $userwallet['add_amount'],
            $userwallet['id']
        );
        if ($sql->execute()) {
            $sql->close();
            $this->connection->close();
            return true;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function updateClientAmountAfterPayment($client_id,$updated_balance)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'UPDATE `client_wallet` SET `balance` = ? where client_id = ?'
        );
        $sql->bind_param(
            'ss',
            $updated_balance,
            $client_id
        );
        if ($sql->execute()) {
            $sql->close();
            $this->connection->close();
            return true;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function editBranch($branch)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'UPDATE `branchpin` SET `merchant_id` = ?,`branchpin`=?, `discription`=? WHERE `id` = ?'
        );
        $sql->bind_param(
            'iisi',
            $branch['merchant_id'],
            $branch['branchpin'],
            $branch['discription'],
            $branch['id']
        );
        if ($sql->execute()) {
            $id = $this->connection->insert_id;
            $sql->close();
            $this->connection->close();
            return true;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function editMerchant($user)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        if($user['password']){
        $sql = $this->connection->prepare(
            'UPDATE `merchants` SET `username` = ?,`password`=?, `website`=?, `email`=?,`logo`=?,`about`=?,`facebook`=?,`youtube`=?,`tiktok`=?,`instagram`=? WHERE `id` = ?'
        );
        $sql->bind_param(
            'sssssssssss',
            $user['username'],
            $user['password'],
            $user['website'],
            $user['email'],
            $user['logo'],
            $user['about'],
            $user['facebook'],
            $user['youtube'],
            $user['tiktok'],
            $user['instagram'],
            $user['id']
        );
    }else{
        $sql = $this->connection->prepare(
            'UPDATE `merchants` SET `username` = ?, `website`=?, `email`=?,`logo`=?,`about`=?,`facebook`=?,`youtube`=?,`tiktok`=?,`instagram`=? WHERE `id` = ?'
        );
        $sql->bind_param(
            'ssssssssss',
            $user['username'],
            $user['website'],
            $user['email'],
            $user['logo'],
            $user['about'],
            $user['facebook'],
            $user['youtube'],
            $user['tiktok'],
            $user['instagram'],
            $user['id']
        );
    }
        if ($sql->execute()) {
            $id = $this->connection->insert_id;
            $sql->close();
            $this->connection->close();
            return true;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function editClient($user)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        if($user['password']){
        $sql = $this->connection->prepare(
            'UPDATE `clients` SET `username` = ?,`password`=?, `email`=?, `phone`=?,`profilepic`=? WHERE `id` = ?'
        );
        $sql->bind_param(
            'ssssss',
            $user['username'],
            $user['password'],
            $user['email'],
            $user['phone'],
            $user['logo'],
            $user['id']
        );
        }else{
        $sql = $this->connection->prepare(
            'UPDATE `clients` SET `username` = ?, `email`=?, `phone`=?,`profilepic`=? WHERE `id` = ?'
        );
        $sql->bind_param(
            'sssss',
            $user['username'],
            $user['email'],
            $user['phone'],
            $user['logo'],
            $user['id']
        );
        }
        if ($sql->execute()) {
            $sql->close();
            $this->connection->close();
            return true;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getPromotion($client_id)
    {
        $current_date = date('Y-m-d');
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
                'SELECT * FROM `promotions` WHERE end_date >= ?'
            );
        $sql->bind_param('s',$current_date);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            foreach($plans as &$plan){
                $promotion_id=$plan['id'];
                $discountlevel = $this->connection->prepare(
                    'SELECT * FROM `promotion_level` WHERE 	client_id = ? AND promotion_id=?'
                );
            $discountlevel->bind_param('ii',$client_id,$promotion_id);
            $discountlevel->execute();
            $resultlevel = $discountlevel->get_result();
            $discountlevels = $resultlevel->fetch_assoc();
            if($discountlevels){
                $plan['promotionlevel']=$discountlevels['discountlevel'];
            }else{
                $plan['promotionlevel']=1;
            }
            }
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getPromotionAfterqrcode($merchant_id,$client_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $current_date = date('Y-m-d');
            $sql = $this->connection->prepare(
                'SELECT promotions.*, promotion_level.discountlevel 
                FROM `promotions` 
                LEFT JOIN `promotion_level` ON promotions.id = promotion_level.promotion_id AND promotion_level.client_id = ?
                WHERE promotions.merchant_id = ? AND promotions.end_date >= ?'
            );
        $sql->bind_param('iis', $client_id,$merchant_id,$current_date);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getBranch($merchant_id,$offset)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $current_date = date('Y-m-d');
        $count = $this->connection->prepare(
            'SELECT COUNT(*) AS total_record FROM `branchpin` WHERE merchant_id = ?'
         );
        $count->bind_param('i', $merchant_id);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql = $this->connection->prepare(
            'SELECT * FROM `branchpin` WHERE merchant_id = ?  ORDER BY id DESC limit 10 OFFSET ?'
        );
        $sql->bind_param('ii', $merchant_id,$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getSingleBranch($branch_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `branchpin` WHERE id = ?'
        );
        $sql->bind_param('i', $branch_id);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getPromotionMerchant($merchant_id,$offset)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $current_date = date('Y-m-d');
        $count = $this->connection->prepare(
            'SELECT COUNT(*) AS total_record FROM `promotions` WHERE merchant_id = ? AND end_date >= ?'
         );
        $count->bind_param('is', $merchant_id,$current_date);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql = $this->connection->prepare(
            'SELECT * FROM `promotions` WHERE merchant_id = ? AND end_date >= ? ORDER BY id DESC limit 10 OFFSET ?'
        );
        $sql->bind_param('isi', $merchant_id,$current_date,$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            foreach($plans as &$plan){
                $startdate=$plan['start_date'];
                $enddate=$plan['end_date'];
                $timestampstartdate = strtotime($startdate);
                $formattedStartDate = date('j F Y', $timestampstartdate);
                $plan['start_date']=$formattedStartDate;
                $timestampenddate = strtotime($enddate);
                $formattedEndDate = date('j F Y', $timestampenddate);
                $plan['end_date']=$formattedEndDate;
            }
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function createPromotion($promotion)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'INSERT INTO promotions (`merchant_id`, `promotion_name`, `branchpin`,`discription`,`start_date`,`end_date`,`logo`,`level1`,`level2`,`level3`,`level4`,`level5`,`level6`,`level7`,`level8`,`level9`,`level10`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
        );
        $sql->bind_param(
            'sssssssssssssssss',
            $promotion['merchant_id'],
            $promotion['promotion_name'],
            $promotion['branchpin'],
            $promotion['promotion_discription'],
            $promotion['promotion_startdate'],
            $promotion['promotion_enddate'],
            $promotion['logo'],
            $promotion['level1'],
            $promotion['level2'],
            $promotion['level3'],
            $promotion['level4'],
            $promotion['level5'],
            $promotion['level6'],
            $promotion['level7'],
            $promotion['level8'],
            $promotion['level9'],
            $promotion['level10'],
        );
        if ($sql->execute()) {
            $id = $this->connection->insert_id;
            return true;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getDiscountLevelValue($promotion_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `promotions` WHERE promotion_id = ?'
        );
        $sql->bind_param('i', $promotion_id);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function createBranch($branch)
    {
        $date = date('Y-m-d H:i:s');
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'INSERT INTO branchpin (`merchant_id`, `branchpin`, `discription`, `created`) VALUES (?,?,?,?)'
        );
        $sql->bind_param(
            'ssss',
            $branch['merchant_id'],
            $branch['branchpin'],
            $branch['discription'],
            $date,
        );
        if ($sql->execute()) {
            $id = $this->connection->insert_id;
            $sql->close();
            $this->connection->close();
            return $id;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function RegisterClient($user)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'INSERT INTO clients (`username`, `password`, `email`, `phone`,`referral_code`,`status`,`created`) VALUES (?,?,?,?,?,?,?)'
        );
        $sql->bind_param(
            'sssssss',
            $user['username'],
            $user['password'],
            $user['email'],
            $user['phone'],
            $user['referral_code'],
            $user['status'],
            $user['created']
        );
        if ($sql->execute()) {
            $id = $this->connection->insert_id;
            $sql->close();
            $this->connection->close();
            return $id;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getSearchClient($search_input,$merchant_id,$offset)
    {
        $search_input = '%'.$search_input.'%';
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $count = $this->connection->prepare(
            'SELECT COUNT(*) AS total_record FROM `redemption_history` WHERE merchant_id = ? AND client_name LIKE ? GROUP BY client_id'
         );
         $count->bind_param('ii',$merchant_id,$search_input);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql =  $this->connection->prepare('SELECT * FROM `redemption_history` WHERE merchant_id = ? AND client_name LIKE ? GROUP BY client_id ORDER BY id DESC limit 10 OFFSET ?');
        $sql->bind_param('sss',$merchant_id,$search_input,$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $count=0;
            foreach($plans as $clientdata){
                $client_id=$clientdata['client_id'];
                $sqlclient = $this->connection->prepare(
                    'SELECT * FROM `clients` WHERE id = ? AND status=1'
                );
                $sqlclient->bind_param('i',$client_id); 
                $sqlclient->execute();
                $resultclient = $sqlclient->get_result();
                $clientdata = $resultclient->fetch_all(MYSQLI_ASSOC);
                $count++;
            }
            $sql->close();
            $this->connection->close();
            $alldata['data']=$clientdata;
            $alldata['count']=$count;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function sortClient($sortby,$merchant_id,$offset)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sortby = ($sortby === 'asc') ? 'ASC' : 'DESC';
        $count = $this->connection->prepare(
            "SELECT COUNT(*) AS total_record FROM `redemption_history` WHERE merchant_id = ? GROUP BY client_id ORDER BY client_name $sortby"
         );
         $count->bind_param('i',$merchant_id);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql =  $this->connection->prepare("SELECT * FROM `redemption_history` WHERE merchant_id = ? GROUP BY client_id ORDER BY client_name $sortby limit 10 OFFSET ?");
        $sql->bind_param('ss',$merchant_id,$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $count=0;
            foreach($plans as $clientdata){
                $client_id=$clientdata['client_id'];
                $sqlclient = $this->connection->prepare(
                    'SELECT * FROM `clients` WHERE id = ? AND status=1'
                );
                $sqlclient->bind_param('i',$client_id); 
                $sqlclient->execute();
                $resultclient = $sqlclient->get_result();
                $clientdata = $resultclient->fetch_all(MYSQLI_ASSOC);
                $count++;
            }
            $sql->close();
            $this->connection->close();
            $alldata['data']=$clientdata;
            $alldata['count']=$count;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function searchBranch($merchant_id,$search,$offset)
    {
        $search = '%'.$search.'%';
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $current_date = date('Y-m-d');
        $count = $this->connection->prepare(
            'SELECT COUNT(*) AS total_record FROM `branchpin` WHERE merchant_id = ? AND discription LIKE ?'
         );
         $count->bind_param('is', $merchant_id,$search);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql =  $this->connection->prepare('SELECT * FROM `branchpin` WHERE merchant_id = ?  AND discription LIKE ? ORDER BY id DESC limit 10 OFFSET ?');
        $sql->bind_param('iss', $merchant_id,$search,$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function searchPromotionMerchant($merchant_id,$search,$offset)
    {
        $search = '%'.$search.'%';
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $current_date = date('Y-m-d');
        $count = $this->connection->prepare(
            'SELECT COUNT(*) AS total_record FROM `promotions` WHERE merchant_id = ? AND end_date >= ? AND promotion_name LIKE ?'
         );
         $count->bind_param('iss', $merchant_id,$current_date,$search);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql =  $this->connection->prepare('SELECT * FROM `promotions` WHERE merchant_id = ? AND end_date >= ?  AND promotion_name LIKE ? ORDER BY id DESC limit 10 OFFSET ?');
        $sql->bind_param('isss', $merchant_id,$current_date,$search,$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function sortBranch($merchant_id,$sort,$offset)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sort = ($sort === 'asc') ? 'ASC' : 'DESC';
        $current_date = date('Y-m-d');
        $count = $this->connection->prepare(
            "SELECT COUNT(*) AS total_record FROM `branchpin` WHERE merchant_id = ? ORDER BY created $sort"
         );
        $count->bind_param('i',$merchant_id);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql =  $this->connection->prepare("SELECT * FROM `branchpin` WHERE merchant_id = ?  ORDER BY created $sort limit 10 OFFSET ?");
        $sql->bind_param('is', $merchant_id,$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function sortMerchantPromotions($merchant_id,$sort,$offset)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sort = ($sort === 'asc') ? 'ASC' : 'DESC';
        $current_date = date('Y-m-d');
        $count = $this->connection->prepare(
            "SELECT COUNT(*) AS total_record FROM `promotions` WHERE merchant_id = ? AND end_date >= ? GROUP BY branch_pin ORDER BY promotion_name $sort"
         );
        $count->bind_param('is',$merchant_id,$current_date);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql =  $this->connection->prepare("SELECT * FROM `promotions` WHERE merchant_id = ? AND end_date >= ? GROUP BY branch_pin ORDER BY promotion_name $sort limit 10 OFFSET ?");
        $sql->bind_param('iss', $merchant_id,$current_date,$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function searchHistoryMerchantAdmin($merchant_id,$search,$offset)
    {
        $search = '%'.$search.'%';
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $count = $this->connection->prepare(
            'SELECT COUNT(*) AS total_record FROM `redemption_history` WHERE merchant_id = ?  AND client_name LIKE ?'
         );
         $count->bind_param('is', $merchant_id,$search);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql =  $this->connection->prepare('SELECT * FROM `redemption_history` WHERE merchant_id = ? AND client_name LIKE ? ORDER BY id DESC limit 10 OFFSET ?');
        $sql->bind_param('sss', $merchant_id,$search,$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function searchHistoryMerchant($merchant_id,$search,$offset)
    {
        $search = '%'.$search.'%';
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $count = $this->connection->prepare(
            'SELECT COUNT(*) AS total_record FROM `redemption_history` WHERE merchant_id = ? GROUP BY branch_pin AND discription LIKE ?'
         );
         $count->bind_param('is', $merchant_id,$search);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql =  $this->connection->prepare('SELECT * FROM `redemption_history` WHERE merchant_id = ? GROUP BY branch_pin AND discription LIKE ? ORDER BY id DESC limit 10 OFFSET ?');
        $sql->bind_param('sss', $merchant_id,$search,$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            foreach ($plans as &$plan) { 
                $branchpin = $plan['branch_pin'];
                $countbranchpin = $this->connection->prepare(
                    'SELECT COUNT(*) AS total_record FROM `redemption_history` WHERE branch_pin = ?'
                );
                $countbranchpin->bind_param('i', $branchpin);
                $countbranchpin->execute();
                $branchpincount = $countbranchpin->get_result();
                $branchpinrow = $branchpincount->fetch_assoc();
                $plan['branchpincount'] = $branchpinrow['total_record'];
                $branchdiscription = $this->connection->prepare(
                    'SELECT discription FROM `branchpin` WHERE branchpin = ?'
                );
                $branchdiscription->bind_param('i', $branchpin);
                $branchdiscription->execute();
                $branchdiscriptiondata = $branchdiscription->get_result();
                $branchdiscriptionrow = $branchdiscriptiondata->fetch_assoc();
                $plan['branchpindiscription'] = $branchdiscriptionrow['discription'];
            } 
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function sortHistoryMerchantsAdmin($merchant_id,$sort,$offset)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sort = ($sort === 'asc') ? 'ASC' : 'DESC';
        $count = $this->connection->prepare(
            "SELECT COUNT(*) AS all_record FROM `redemption_history` WHERE merchant_id = ?  ORDER BY created $sort"
         );
         $count->bind_param('i', $merchant_id);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['all_record'];
        $sql =  $this->connection->prepare("SELECT * FROM `redemption_history` WHERE merchant_id = ?  ORDER BY created $sort limit 10 OFFSET ?");
        $sql->bind_param('ss', $merchant_id,$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function sortHistoryMerchants($merchant_id,$sort,$offset)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sort = ($sort === 'asc') ? 'ASC' : 'DESC';
        $count = $this->connection->prepare(
            "SELECT COUNT(*) AS all_record FROM `redemption_history` WHERE merchant_id = ? GROUP BY branch_pin ORDER BY created $sort"
         );
         $count->bind_param('i', $merchant_id);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['all_record'];
        $sql =  $this->connection->prepare("SELECT * FROM `redemption_history` WHERE merchant_id = ? GROUP BY branch_pin ORDER BY created $sort limit 10 OFFSET ?");
        $sql->bind_param('ss', $merchant_id,$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            foreach ($plans as &$plan) { 
                $branchpin = $plan['branch_pin'];
                $countbranchpin = $this->connection->prepare(
                    'SELECT COUNT(*) AS total_record FROM `redemption_history` WHERE branch_pin = ?'
                );
                $countbranchpin->bind_param('i', $branchpin);
                $countbranchpin->execute();
                $branchpincount = $countbranchpin->get_result();
                $branchpinrow = $branchpincount->fetch_assoc();
                $plan['branchpincount'] = $branchpinrow['total_record'];
                $branchdiscription = $this->connection->prepare(
                    'SELECT discription FROM `branchpin` WHERE branchpin = ?'
                );
                $branchdiscription->bind_param('i', $branchpin);
                $branchdiscription->execute();
                $branchdiscriptiondata = $branchdiscription->get_result();
                $branchdiscriptionrow = $branchdiscriptiondata->fetch_assoc();
                $plan['branchpindiscription'] = $branchdiscriptionrow['discription'];
            } 
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function SubmitReview($review)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'INSERT INTO merchant_review (`merchant_id`, `client_id`, `client_name`,`review`, `rating`,`created`) VALUES (?,?,?,?,?,?)'
        );
        $sql->bind_param(
            'ssssss',
            $review['merchant_id'],
            $review['client_id'],
            $review['client_name'],
            $review['review'],
            $review['rating'],
            $review['created'],
        );
        if ($sql->execute()) {
            $sql->close();
            $this->connection->close();
            return true;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function checkBranchpin($inputbranchpin,$merchant_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `branchpin` WHERE branchpin = ? AND merchant_id=?'
        );
        $sql->bind_param('ii',$inputbranchpin,$merchant_id);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getRedemptionHistoryAdmin($merchant_id, $offset)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
    
        $count = $this->connection->prepare(
            'SELECT COUNT(*) AS total_record FROM `redemption_history` WHERE merchant_id = ?'
        );
        $count->bind_param('i', $merchant_id);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
    
        $sql = $this->connection->prepare(
            'SELECT * FROM `redemption_history` WHERE merchant_id = ?  ORDER BY id DESC LIMIT 10 OFFSET ?'
        );
        $sql->bind_param('ii', $merchant_id, $offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata = array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            $alldata['data'] = $plans;
            $alldata['count'] = $total_record;
            return $alldata;
        }
    
        $sql->close();
        $count->close();
        $this->connection->close();
        return false;
    } 
    public function getRedemptionHistory($merchant_id, $offset)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
    
        $count = $this->connection->prepare(
            'SELECT COUNT(*) AS total_record FROM `redemption_history` WHERE merchant_id = ? GROUP BY branch_pin'
        );
        $count->bind_param('i', $merchant_id);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
    
        $sql = $this->connection->prepare(
            'SELECT * FROM `redemption_history` WHERE merchant_id = ? GROUP BY branch_pin ORDER BY id DESC LIMIT 10 OFFSET ?'
        );
        $sql->bind_param('ii', $merchant_id, $offset);
        $sql->execute();
        $result = $sql->get_result();
    
        $alldata = array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            foreach ($plans as &$plan) { 
                $branchpin = $plan['branch_pin'];
                $countbranchpin = $this->connection->prepare(
                    'SELECT COUNT(*) AS total_record FROM `redemption_history` WHERE branch_pin = ?'
                );
                $countbranchpin->bind_param('i', $branchpin);
                $countbranchpin->execute();
                $branchpincount = $countbranchpin->get_result();
                $branchpinrow = $branchpincount->fetch_assoc();
                $plan['branchpincount'] = $branchpinrow['total_record'];
                $branchdiscription = $this->connection->prepare(
                    'SELECT discription FROM `branchpin` WHERE branchpin = ?'
                );
                $branchdiscription->bind_param('i', $branchpin);
                $branchdiscription->execute();
                $branchdiscriptiondata = $branchdiscription->get_result();
                $branchdiscriptionrow = $branchdiscriptiondata->fetch_assoc();
                $plan['branchpindiscription'] = $branchdiscriptionrow['discription'];
            } 
            $sql->close();
            $this->connection->close();
            $alldata['data'] = $plans;
            $alldata['count'] = $total_record;
            return $alldata;
        }
    
        $sql->close();
        $count->close();
        $this->connection->close();
        return false;
    }     
	public function getRedemptionHistoryTotal($merchant_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `redemption_history` WHERE merchant_id = ?'
         );
         $sql->bind_param('i', $merchant_id);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $count->close();
        $this->connection->close();
        return false;
    }   
    public function getTotalAmountAdmin()
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `redemption_history`'
         );
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $count->close();
        $this->connection->close();
        return false;
    }  
    public function getRedemptionHistoryAdminDashborad()
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `redemption_history` GROUP BY branch_pin ORDER BY id DESC'
        );
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            foreach ($plans as &$plan) { 
                $branchpin = $plan['branch_pin'];
                $countbranchpin = $this->connection->prepare(
                    'SELECT COUNT(*) AS total_record FROM `redemption_history` WHERE branch_pin = ?'
                );
                $countbranchpin->bind_param('i', $branchpin);
                $countbranchpin->execute();
                $branchpincount = $countbranchpin->get_result();
                $branchpinrow = $branchpincount->fetch_assoc();
                $plan['branchpincount'] = $branchpinrow['total_record'];
                $branchdiscription = $this->connection->prepare(
                    'SELECT discription FROM `branchpin` WHERE branchpin = ? '
                );
                $branchdiscription->bind_param('i', $branchpin);
                $branchdiscription->execute();
                $branchdiscriptiondata = $branchdiscription->get_result();
                $branchdiscriptionrow = $branchdiscriptiondata->fetch_assoc();
                $plan['branchpindiscription'] = $branchdiscriptionrow['discription'];
            } 
            $sql->close();
            $this->connection->close();
            return $plans;
        }
    
        $sql->close();
        $count->close();
        $this->connection->close();
        return false;
    }     
	public function getRedemptionHistoryTotalAdmin()
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `redemption_history`'
         );
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $count->close();
        $this->connection->close();
        return false;
    }  
    public function checkAdminLogin($username,$password)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
        'SELECT * FROM `admin_detail` WHERE username=? AND password=?'
        );
        $sql->bind_param('ss', $username, $password);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            $sql->close();
            $this->connection->close();
            return $user;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getMerchantAdmin($offset)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $count = $this->connection->prepare(
            'SELECT COUNT(*) AS total_record FROM `merchants` WHERE status=1'
         );
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql = $this->connection->prepare(
            'SELECT * FROM `merchants` WHERE status=1 ORDER BY id DESC limit 10 OFFSET ?'
        );
        $sql->bind_param('i',$offset); 
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $data = array(); 
            while ($row = $result->fetch_assoc()) {
                $data[] = $row; 
            }
            $sql->close();
            $this->connection->close();
            $alldata['data']=$data;
            $alldata['count']=$total_record;
            return $alldata;
        } else {
            $sql->close();
            $this->connection->close();
            return array(); 
        }
    }
    public function getSearchMerchantAdmin($search_input,$offset)
    {
        $search_input = '%'.$search_input.'%';
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $count = $this->connection->prepare(
            'SELECT COUNT(*) AS total_record FROM `merchants` WHERE  username LIKE ? AND status=1'
         );
         $count->bind_param('i',$search_input);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql =  $this->connection->prepare('SELECT * FROM `merchants` WHERE  username LIKE ? AND status=1 ORDER BY id DESC limit 10 OFFSET ?');
        $sql->bind_param('ss',$search_input,$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function updatePromotionDiscountLevel($client_id,$promotion_id,$discountlvl)
    {
        $upgradelvl=1;
        $update_discount_level=$discountlvl+$upgradelvl;
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'UPDATE `promotion_level` SET `discountlevel` = ? where client_id = ? AND promotion_id=?'
        );
        $sql->bind_param(
            'iii',
            $update_discount_level,
            $client_id,
            $promotion_id
        );
        if ($sql->execute()) {
            $sql->close();
            $this->connection->close();
            return true;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function CreatePromotionDiscountLevel($client_id,$promotion_id,$merchant_id)
    {
        $discountlvl=1;
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'INSERT INTO `promotion_level` (`promotion_id`,`merchant_id`,`client_id`,`discountlevel`) VALUES (?,?,?,?)'
        );
        $sql->bind_param(
            'iiii',
            $promotion_id,
            $merchant_id,
            $client_id,
            $discountlvl
        );
        if ($sql->execute()) {
            $sql->close();
            $this->connection->close();
            return true;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getPromotionBySearch($client_id,$search_input)
    {
        $search_input = '%'.$search_input.'%';
        $current_date = date('Y-m-d');
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `promotions` WHERE end_date >= ? AND promotion_name LIKE ?');
        $sql->bind_param('ss',$current_date,$search_input);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            foreach($plans as &$plan){
                $promotion_id=$plan['id'];
                $discountlevel = $this->connection->prepare(
                    'SELECT * FROM `promotion_level` WHERE 	client_id = ? AND promotion_id=?'
                );
            $discountlevel->bind_param('ii',$client_id,$promotion_id);
            $discountlevel->execute();
            $resultlevel = $discountlevel->get_result();
            $discountlevels = $resultlevel->fetch_assoc();
            if($discountlevels){
                $plan['promotionlevel']=$discountlevels['discountlevel'];
            }else{
                $plan['promotionlevel']=1;
            }
            }
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function sortMerchantAdmin($sortby,$offset)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sortby = ($sortby === 'asc') ? 'ASC' : 'DESC';
        $count = $this->connection->prepare(
            "SELECT COUNT(*) AS total_record FROM `merchants` WHERE status=1 ORDER BY username $sortby"
         );
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql =  $this->connection->prepare("SELECT * FROM `merchants` WHERE status=1 ORDER BY username $sortby limit 10 OFFSET ?");
        $sql->bind_param('s',$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getRefferalamount()
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
            $sql = $this->connection->prepare(
                'SELECT referral_amount FROM `admin_detail`'
                );
                $sql->execute();
                $result = $sql->get_result();
                if ($result->num_rows > 0) {
                    $plan = $result->fetch_assoc();
                    $sql->close();
                    $this->connection->close();
                    return $plan;
                }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function checkreferralcode($refferalcode)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
            $sql = $this->connection->prepare(
                'SELECT * FROM `referral` WHERE refferal_code=?'
                );
                $sql->bind_param('s',$refferalcode);
                $sql->execute();
                $result = $sql->get_result();
                if ($result->num_rows > 0) {
                    $plan = $result->fetch_assoc();
                    $sql->close();
                    $this->connection->close();
                    return $plan;
                }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function CreateRefferalcode($user_id,$refferalclient_id,$refferalcode)
    {
        $date = date('Y-m-d H:i:s');
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
            $sql = $this->connection->prepare(
                'INSERT INTO `referral` (`client_id`,`refferal_clientid`,`refferal_code`,`created`) VALUES (?,?,?,?)'
                );
                $sql->bind_param('ssss',$user_id,$refferalclient_id,$refferalcode,$date);
                if ($sql->execute()) {
                    $id = $this->connection->insert_id;
                    $sql->close();
                    $this->connection->close();
                    return $id;
                }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function checkExistByMerchantEmail($email)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
            $sql = $this->connection->prepare(
                'SELECT * FROM `merchants` WHERE email=?'
                );
                $sql->bind_param('s',$email);
                $sql->execute();
                $result = $sql->get_result();
                if ($result->num_rows > 0) {
                    $plan = $result->fetch_assoc();
                    $sql->close();
                    $this->connection->close();
                    return $plan;
                }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function checkExistByClientEmail($email)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
        'SELECT * FROM `clients` WHERE email=?'
        );
        $sql->bind_param('s', $email);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plan = $result->fetch_assoc();
            $sql->close();
            $this->connection->close();
            return $plan;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getClientAdmin($offset)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $count = $this->connection->prepare(
            'SELECT COUNT(*) AS total_record FROM `clients` WHERE status=1'
         );
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql = $this->connection->prepare(
            'SELECT * FROM `clients` WHERE status=1 ORDER BY id DESC limit 10 OFFSET ?'
        );
        $sql->bind_param('i',$offset); 
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $data = array(); 
            while ($row = $result->fetch_assoc()) {
                $data[] = $row; 
            }
            $sql->close();
            $this->connection->close();
            $alldata['data']=$data;
            $alldata['count']=$total_record;
            return $alldata;
        } else {
            $sql->close();
            $this->connection->close();
            return array(); 
        }
    }
    public function getSearchClientAdmin($search_input,$offset)
    {
        $search_input = '%'.$search_input.'%';
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $count = $this->connection->prepare(
            'SELECT COUNT(*) AS total_record FROM `clients` WHERE  username LIKE ? AND status=1'
         );
         $count->bind_param('i',$search_input);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql =  $this->connection->prepare('SELECT * FROM `clients` WHERE  username LIKE ? AND status=1 ORDER BY id DESC limit 10 OFFSET ?');
        $sql->bind_param('ss',$search_input,$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function sortClientAdmin($sortby,$offset)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sortby = ($sortby === 'asc') ? 'ASC' : 'DESC';
        $count = $this->connection->prepare(
            "SELECT COUNT(*) AS total_record FROM `clients` WHERE status=1 ORDER BY username $sortby"
         );
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql =  $this->connection->prepare("SELECT * FROM `clients` WHERE status=1 ORDER BY username $sortby limit 10 OFFSET ?");
        $sql->bind_param('s',$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getPromotionAdmin($offset)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $count = $this->connection->prepare(
            'SELECT COUNT(*) AS total_record FROM `promotions`'
         );
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql = $this->connection->prepare(
            'SELECT * FROM `promotions` ORDER BY id DESC LIMIT 10 OFFSET ?'
        );
        $sql->bind_param('s',$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            foreach($plans as &$plan){
                $merchant_id=$plan['merchant_id'];
                $getmerchantname = $this->connection->prepare(
                    'SELECT username FROM `merchants` WHERE id = ?'
                );
                $getmerchantname->bind_param('i',$merchant_id);
                $getmerchantname->execute();
                $merchantdata = $getmerchantname->get_result();
                $merchantnamedata = $merchantdata->fetch_assoc();
                $plan['username']=$merchantnamedata['username'];
            }
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function searchPromotionAdmin($search,$offset)
    {
        $search = '%'.$search.'%';
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $count = $this->connection->prepare(
            'SELECT COUNT(*) AS total_record FROM `promotions` WHERE  promotion_name LIKE ?'
         );
         $count->bind_param('s',$search);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql =  $this->connection->prepare('SELECT * FROM `promotions` WHERE  promotion_name LIKE ? ORDER BY id DESC limit 10 OFFSET ?');
        $sql->bind_param('ss',$search,$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function sortPromotionsAdmin($sort,$offset)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sort = ($sort === 'asc') ? 'ASC' : 'DESC';
        $count = $this->connection->prepare(
            "SELECT COUNT(*) AS total_record FROM `promotions` ORDER BY promotion_name $sort"
         );
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql =  $this->connection->prepare("SELECT * FROM `promotions` ORDER BY promotion_name $sort limit 10 OFFSET ?");
        $sql->bind_param('s',$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function GetReview($merchant_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `merchant_review` WHERE merchant_id = ?'
         );
        $sql->bind_param('i', $merchant_id);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            foreach($plans as &$plan){
                $client_id = $plan['client_id'];
                $getpaymenttime = $this->connection->prepare(
                    'SELECT * FROM `redemption_history` WHERE merchant_id = ? AND client_id=? ORDER BY id DESC'
                );
                $getpaymenttime->bind_param('ii',$merchant_id,$client_id);
                $getpaymenttime->execute();
                $paymenttime = $getpaymenttime->get_result();
                $paytime = $paymenttime->fetch_assoc();
                $plan['created']=$paytime['created'];
            }
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }     
    public function GetReviewSingleData($client_id,$merchant_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `merchant_review` WHERE client_id=? AND merchant_id = ?'
         );
        $sql->bind_param('ii',$client_id,$merchant_id);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            foreach($plans as &$plan){
                $getpaymenttime = $this->connection->prepare(
                    'SELECT * FROM `redemption_history` WHERE merchant_id = ? AND client_id=? ORDER BY id DESC'
                );
                $getpaymenttime->bind_param('ii',$merchant_id,$client_id);
                $getpaymenttime->execute();
                $paymenttime = $getpaymenttime->get_result();
                $paytime = $paymenttime->fetch_assoc();
                $plan['created']=$paytime['created'];
            }
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function GetReviewSingleDataWithStatus($client_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `redemption_history` WHERE client_id=?  GROUP BY merchant_id ORDER BY id DESC'
         );
        $sql->bind_param('i',$client_id);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            foreach ($plans as &$plan) { 
                $merchant_id = $plan['merchant_id'];
                $checkstatus = $this->connection->prepare(
                    'SELECT * FROM `merchant_review` WHERE merchant_id = ? AND 	client_id=?'
                );
                $checkstatus->bind_param('ii',$merchant_id,$client_id);
                $checkstatus->execute();
                $branchpincount = $checkstatus->get_result();
                $branchpinrow = $branchpincount->fetch_assoc();
                if($branchpinrow){
                    $plan['reviewstatus']=1;
                }else{
                    $plan['reviewstatus']='';
                }
                $getmerchantname = $this->connection->prepare(
                    'SELECT username FROM `merchants` WHERE id = ?'
                );
                $getmerchantname->bind_param('i',$merchant_id);
                $getmerchantname->execute();
                $merchantdata = $getmerchantname->get_result();
                $merchantnamedata = $merchantdata->fetch_assoc();
                $plan['username']=$merchantnamedata['username'];
            } 
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }     
    public function GetReviewSingleDataWithStatusSearch($client_id,$search_input)
    {
        $search_input = '%'.$search_input.'%';
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `redemption_history` WHERE client_id=? AND merchant_name LIKE ? GROUP BY merchant_id ORDER BY id DESC'
         );
        $sql->bind_param('is',$client_id,$search_input);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            foreach ($plans as &$plan) { 
                $merchant_id = $plan['merchant_id'];
                $checkstatus = $this->connection->prepare(
                    'SELECT * FROM `merchant_review` WHERE merchant_id = ? AND 	client_id=?'
                );
                $checkstatus->bind_param('ii',$merchant_id,$client_id);
                $checkstatus->execute();
                $branchpincount = $checkstatus->get_result();
                $branchpinrow = $branchpincount->fetch_assoc();
                if($branchpinrow){
                    $plan['reviewstatus']=1;
                }else{
                    $plan['reviewstatus']='';
                }
                $getmerchantname = $this->connection->prepare(
                    'SELECT username FROM `merchants` WHERE id = ?'
                );
                $getmerchantname->bind_param('i',$merchant_id);
                $getmerchantname->execute();
                $merchantdata = $getmerchantname->get_result();
                $merchantnamedata = $merchantdata->fetch_assoc();
                $plan['username']=$merchantnamedata['username'];
            } 
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }    
    public function DeletePromotion($promotion_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'DELETE FROM `promotions` WHERE id = ?'
         );
        $sql->bind_param('i', $promotion_id);
        $sql->execute();
        $sql->close();
        $this->connection->close();
        return true;
    }  
    public function DeleteBranch($branch_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'DELETE FROM `branchpin` WHERE id = ?'
         );
        $sql->bind_param('i', $branch_id);
        $sql->execute();
        $sql->close();
        $this->connection->close();
        return true;
    }  
    public function DeleteMerchant($merchant_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $status=0;
        $sql = $this->connection->prepare(
            'UPDATE `merchants` SET status = ? WHERE id = ?'
        );
        $sql->bind_param('ii',$status,$merchant_id);
        $sql->execute();
        $sql->close();
        $this->connection->close();
        return true;
    }     
    public function DeleteClient($client_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $status=0;
        $sql = $this->connection->prepare(
            'UPDATE `clients` SET status = ? WHERE id = ?'
         );
        $sql->bind_param('ii',$status,$client_id);
        $sql->execute();
        $sql->close();
        $this->connection->close();
        return true;
    }
    public function GetRedeemHistorybyDiscountLevel($merchant_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $discountlvl1=1;
        $discountlvl2=2;
        $discountlvl3=3;
        $discountlvl4=4;
        $discountlvl5=5;
        $discountlvl6=6;
        $discountlvl7=7;
        $discountlvl8=8;
        $discountlvl9=9;
        $discountlvl10=10;
        $lvl1 = $this->connection->prepare(
            'SELECT COUNT(*) AS lvl1_record FROM `redemption_history` WHERE merchant_id = ? AND discount_level=?'
         );
        $lvl1->bind_param('ii', $merchant_id,$discountlvl1);
        $lvl1->execute();
        $lvl1_result = $lvl1->get_result();
        $rowlvl1 = $lvl1_result->fetch_assoc();
        $lvl1_record = $rowlvl1['lvl1_record'];
        $lvl2 = $this->connection->prepare(
            'SELECT COUNT(*) AS lvl2_record FROM `redemption_history` WHERE merchant_id = ? AND discount_level=?'
         );
        $lvl2->bind_param('ii', $merchant_id,$discountlvl2);
        $lvl2->execute();
        $lvl2_result = $lvl2->get_result();
        $rowlvl2 = $lvl2_result->fetch_assoc();
        $lvl2_record = $rowlvl2['lvl2_record'];
        $lvl3 = $this->connection->prepare(
            'SELECT COUNT(*) AS lvl3_record FROM `redemption_history` WHERE merchant_id = ? AND discount_level=?'
         );
        $lvl3->bind_param('ii', $merchant_id,$discountlvl3);
        $lvl3->execute();
        $lvl3_result = $lvl3->get_result();
        $rowlvl3 = $lvl3_result->fetch_assoc();
        $lvl3_record = $rowlvl3['lvl3_record'];
        $lvl4 = $this->connection->prepare(
            'SELECT COUNT(*) AS lvl4_record FROM `redemption_history` WHERE merchant_id = ? AND discount_level=?'
         );
        $lvl4->bind_param('ii', $merchant_id,$discountlvl4);
        $lvl4->execute();
        $lvl4_result = $lvl4->get_result();
        $rowlvl4 = $lvl4_result->fetch_assoc();
        $lvl4_record = $rowlvl4['lvl4_record'];
        $lvl5 = $this->connection->prepare(
            'SELECT COUNT(*) AS lvl5_record FROM `redemption_history` WHERE merchant_id = ? AND discount_level=?'
         );
        $lvl5->bind_param('ii', $merchant_id,$discountlvl5);
        $lvl5->execute();
        $lvl5_result = $lvl5->get_result();
        $rowlvl5 = $lvl5_result->fetch_assoc();
        $lvl5_record = $rowlvl5['lvl5_record'];
        $lvl6 = $this->connection->prepare(
            'SELECT COUNT(*) AS lvl6_record FROM `redemption_history` WHERE merchant_id = ? AND discount_level=?'
         );
        $lvl6->bind_param('ii', $merchant_id,$discountlvl6);
        $lvl6->execute();
        $lvl6_result = $lvl6->get_result();
        $rowlvl6 = $lvl6_result->fetch_assoc();
        $lvl6_record = $rowlvl6['lvl6_record'];
        $lvl7 = $this->connection->prepare(
            'SELECT COUNT(*) AS lvl7_record FROM `redemption_history` WHERE merchant_id = ? AND discount_level=?'
         );
        $lvl7->bind_param('ii', $merchant_id,$discountlvl7);
        $lvl7->execute();
        $lvl7_result = $lvl7->get_result();
        $rowlvl7 = $lvl7_result->fetch_assoc();
        $lvl7_record = $rowlvl7['lvl7_record'];
        $lvl8 = $this->connection->prepare(
            'SELECT COUNT(*) AS lvl8_record FROM `redemption_history` WHERE merchant_id = ? AND discount_level=?'
         );
        $lvl8->bind_param('ii', $merchant_id,$discountlvl8);
        $lvl8->execute();
        $lvl8_result = $lvl8->get_result();
        $rowlvl8 = $lvl8_result->fetch_assoc();
        $lvl8_record = $rowlvl8['lvl8_record'];
        $lvl9 = $this->connection->prepare(
            'SELECT COUNT(*) AS lvl9_record FROM `redemption_history` WHERE merchant_id = ? AND discount_level=?'
         );
        $lvl9->bind_param('ii', $merchant_id,$discountlvl9);
        $lvl9->execute();
        $lvl9_result = $lvl9->get_result();
        $rowlvl9 = $lvl9_result->fetch_assoc();
        $lvl9_record = $rowlvl9['lvl9_record'];
        $lvl10 = $this->connection->prepare(
            'SELECT COUNT(*) AS lvl10_record FROM `redemption_history` WHERE merchant_id = ? AND discount_level=?'
         );
        $lvl10->bind_param('ii', $merchant_id,$discountlvl10);
        $lvl10->execute();
        $lvl10_result = $lvl10->get_result();
        $rowlvl10 = $lvl10_result->fetch_assoc();
        $lvl10_record = $rowlvl10['lvl10_record'];
        $alldata=array();
        $alldata['discountlvl1']=$lvl1_record;
        $alldata['discountlvl2']=$lvl2_record;
        $alldata['discountlvl3']=$lvl3_record;
        $alldata['discountlvl4']=$lvl4_record;
        $alldata['discountlvl5']=$lvl5_record;
        $alldata['discountlvl6']=$lvl6_record;
        $alldata['discountlvl7']=$lvl7_record;
        $alldata['discountlvl8']=$lvl8_record;
        $alldata['discountlvl9']=$lvl9_record;
        $alldata['discountlvl10']=$lvl10_record;
        if (!empty($alldata)) {
            return $alldata;
        }
        $sql->close();
        $count->close();
        $this->connection->close();
        return false;
    } 
    public function getRedemptionSingleHistory($branch_pin,$offset)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $count = $this->connection->prepare(
            'SELECT COUNT(*) AS total_record FROM `redemption_history` WHERE branch_pin = ?'
         );
         $count->bind_param('i', $branch_pin);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql = $this->connection->prepare(
            'SELECT * FROM `redemption_history` WHERE branch_pin = ? limit 10 OFFSET ?'
         );
         $sql->bind_param('ii', $branch_pin,$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $count->close();
        $this->connection->close();
        return false;
    }  
    public function getRedemptionSingleHistorybylvl($level,$offset)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $count = $this->connection->prepare(
            'SELECT COUNT(*) AS total_record FROM `redemption_history` WHERE discount_level = ?'
         );
         $count->bind_param('i', $level);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql = $this->connection->prepare(
            'SELECT * FROM `redemption_history` WHERE discount_level = ? limit 10 OFFSET ?'
         );
         $sql->bind_param('ii', $level,$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $count->close();
        $this->connection->close();
        return false;
    } 
    public function sortSingleHistoryMerchants($branch_pin,$sort,$offset)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sort = ($sort === 'asc') ? 'ASC' : 'DESC';
        $count = $this->connection->prepare(
            "SELECT COUNT(*) AS total_record FROM `redemption_history` WHERE branch_pin = ? ORDER BY created $sort"
         );
         $count->bind_param('i', $branch_pin);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql =  $this->connection->prepare("SELECT * FROM `redemption_history` WHERE branch_pin = ? ORDER BY created $sort limit 10 OFFSET ?");
        $sql->bind_param('ss', $branch_pin,$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }  
    public function sortSingleHistoryMerchantsByLvl($level,$sort,$offset)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sort = ($sort === 'asc') ? 'ASC' : 'DESC';
        $count = $this->connection->prepare(
            "SELECT COUNT(*) AS total_record FROM `redemption_history` WHERE discount_level = ? ORDER BY created $sort"
         );
         $count->bind_param('i', $level);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql =  $this->connection->prepare("SELECT * FROM `redemption_history` WHERE discount_level = ? ORDER BY created $sort limit 10 OFFSET ?");
        $sql->bind_param('ss', $level,$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }  
    public function sortByDiscountHistoryAdmin($merchant_id,$sortbydiscount,$offset)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sortbydiscount = ($sortbydiscount === 'asc') ? 'ASC' : 'DESC';
        $count = $this->connection->prepare(
            "SELECT COUNT(*) AS total_record FROM `redemption_history` WHERE merchant_id = ? ORDER BY discount $sortbydiscount"
         );
         $count->bind_param('i', $merchant_id);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql =  $this->connection->prepare("SELECT * FROM `redemption_history` WHERE merchant_id = ? ORDER BY discount $sortbydiscount limit 10 OFFSET ?");
        $sql->bind_param('ss', $merchant_id,$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }  
    public function sortByDiscountSingleHistoryMerchants($branch_pin,$sortbydiscount,$offset)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sortbydiscount = ($sortbydiscount === 'asc') ? 'ASC' : 'DESC';
        $count = $this->connection->prepare(
            "SELECT COUNT(*) AS total_record FROM `redemption_history` WHERE branch_pin = ? ORDER BY discount $sortbydiscount"
         );
         $count->bind_param('i', $branch_pin);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql =  $this->connection->prepare("SELECT * FROM `redemption_history` WHERE branch_pin = ? ORDER BY discount $sortbydiscount limit 10 OFFSET ?");
        $sql->bind_param('ss', $branch_pin,$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }  
    public function sortByDiscountSingleHistoryMerchantsBylvl($level,$sortbydiscount,$offset)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sortbydiscount = ($sortbydiscount === 'asc') ? 'ASC' : 'DESC';
        $count = $this->connection->prepare(
            "SELECT COUNT(*) AS total_record FROM `redemption_history` WHERE discount_level = ? ORDER BY discount $sortbydiscount"
         );
         $count->bind_param('i', $level);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql =  $this->connection->prepare("SELECT * FROM `redemption_history` WHERE discount_level = ? ORDER BY discount $sortbydiscount limit 10 OFFSET ?");
        $sql->bind_param('ss', $level,$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getRedemptionHistorySingleClient($client_id,$offset)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $count = $this->connection->prepare(
            'SELECT COUNT(*) AS total_record FROM `redemption_history` WHERE client_id = ?'
         );
         $count->bind_param('i', $client_id);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql = $this->connection->prepare(
            'SELECT * FROM `redemption_history` WHERE client_id = ? limit 10 OFFSET ?'
         );
         $sql->bind_param('ii', $client_id,$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $count->close();
        $this->connection->close();
        return false;
    }
    public function sortHistoryMerchantsSingleClient($client_id,$sort,$offset)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sort = ($sort === 'asc') ? 'ASC' : 'DESC';
        $count = $this->connection->prepare(
            "SELECT COUNT(*) AS total_record FROM `redemption_history` WHERE client_id = ? ORDER BY created $sort"
         );
         $count->bind_param('i', $client_id);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql =  $this->connection->prepare("SELECT * FROM `redemption_history` WHERE client_id = ? ORDER BY created $sort limit 10 OFFSET ?");
        $sql->bind_param('ss', $client_id,$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function sortByDiscountHistoryMerchantsSingleClient($client_id,$sortbydiscount,$offset)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sortbydiscount = ($sortbydiscount === 'asc') ? 'ASC' : 'DESC';
        $count = $this->connection->prepare(
            "SELECT COUNT(*) AS total_record FROM `redemption_history` WHERE client_id = ? ORDER BY discount $sortbydiscount"
         );
         $count->bind_param('i', $client_id);
        $count->execute();
        $count_result = $count->get_result();
        $row = $count_result->fetch_assoc();
        $total_record = $row['total_record'];
        $sql =  $this->connection->prepare("SELECT * FROM `redemption_history` WHERE client_id = ? ORDER BY discount $sortbydiscount limit 10 OFFSET ?");
        $sql->bind_param('ss', $client_id,$offset);
        $sql->execute();
        $result = $sql->get_result();
        $alldata=array();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            $alldata['data']=$plans;
            $alldata['count']=$total_record;
            return $alldata;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getTotalVisits($merchant_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql =  $this->connection->prepare("SELECT branch_pin FROM `redemption_history` WHERE merchant_id = ?");
        $sql->bind_param('s', $merchant_id);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function editPromotion($promotion)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'UPDATE `promotions` SET `promotion_name` = ?,`discription`=?, `start_date`=?, `end_date`=?,`logo`=?,`level1`=?,`level2`=?,`level3`=?,`level4`=?,`level5`=?,`level6`=?,`level7`=?,`level8`=?,`level9`=?,`level10`=? WHERE `id` = ?'
        );
        $sql->bind_param(
            'ssssssssssssssss',
            $promotion['promotion_name'],
            $promotion['promotion_discription'],
            $promotion['promotion_startdate'],
            $promotion['promotion_enddate'],
            $promotion['logo'],
            $promotion['level1'],
            $promotion['level2'],
            $promotion['level3'],
            $promotion['level4'],
            $promotion['level5'],
            $promotion['level6'],
            $promotion['level7'],
            $promotion['level8'],
            $promotion['level9'],
            $promotion['level10'],
            $promotion['promotion_id']
        );
        if ($sql->execute()) {
            return true;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function editPromotionByAdmin($promotion)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'UPDATE `promotions` SET `level1`=?,`level2`=?,`level3`=?,`level4`=?,`level5`=?,`level6`=?,`level7`=?,`level8`=?,`level9`=?,`level10`=? WHERE `id` = ?'
        );
        $sql->bind_param(
            'sssssssssss',
            $promotion['level1'],
            $promotion['level2'],
            $promotion['level3'],
            $promotion['level4'],
            $promotion['level5'],
            $promotion['level6'],
            $promotion['level7'],
            $promotion['level8'],
            $promotion['level9'],
            $promotion['level10'],
            $promotion['promotion_id']
        );
        if ($sql->execute()) {
            return true;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getSinglePromotion($promotion_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `promotions` WHERE `id` = ?'
        );
        $sql->bind_param(
            'i',
            $promotion_id
        );
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function UpdateRefferalAmount($amount)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'UPDATE `admin_detail` SET `referral_amount`=?'
        );
        $sql->bind_param(
            's',
            $amount['amount'],
        );
        if ($sql->execute()) {
            return true;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function getRefferalAmountAdmin()
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT referral_amount FROM `admin_detail`'
            );
            $sql->execute();
            $result = $sql->get_result();
            if ($result->num_rows > 0) {
                $plan = $result->fetch_assoc();
                $sql->close();
                $this->connection->close();
                return $plan;
            }
        $sql->close();
        $this->connection->close();
        return false;
    }
    public function GetRedeemHistorybyDiscounAvg($merchant_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `redemption_history` WHERE merchant_id = ?'
         );
        $sql->bind_param('i', $merchant_id);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $this->connection->close();
        return false;
    } 
/*
    public function generateConfirmCode($user_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'UPDATE `members` SET authCode = ? WHERE id = ?'
        );
        $code = rand(111111, 999999);
        $sql->bind_param('ii', $code, $user_id);
        if ($sql->execute()) {
            $sql->close();
            $this->connection->close();
            return $code;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }

    public function confirmCode($user_id, $code)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `members` WHERE id = ? AND authCode = ?'
        );
        $sql->bind_param('ii', $user_id, $code);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $sql->close();
            $this->connection->close();
            return true;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }

    public function activeMember($user_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'UPDATE `members` SET `status` = 1 WHERE id=?'
        );
        $sql->bind_param('i', $user_id);
        if ($sql->execute()) {
            $sql->close();
            $this->connection->close();
            return true;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }

    public function updateAdmin($admin){
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');

        $pass_up = '';
        if(isset($admin['password']) && !empty($admin['password'])){
            $pass_up .= 'password = ?,';
        }

        $sql = $this->connection->prepare(
            'UPDATE `admin` SET '.$pass_up.' `firstname` = ?, `lastname` = ?, `email` = ?  WHERE id = ?'
        );

        if(!empty($pass_up)){
            $sql->bind_param(
                'ssssi',
                $admin['password'],
                $admin['firstname'],
                $admin['lastname'],
                $admin['email'],
                $admin['id']
            );
        } else {
            $sql->bind_param(
                'sssi',
                $admin['firstname'],
                $admin['lastname'],
                $admin['email'],
                $admin['id']
            );
        }
        
        if ($sql->execute()) {
            $sql->close();
            $this->connection->close();
            return true;
        }
        $sql->close();
        $this->connection->close();
        return false; 
    }

    public function loginAdmin($email, $password)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `admin` WHERE email=? AND password=?'
        );
        $sql->bind_param('ss', $email, $password);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            $sql->close();
            $this->connection->close();
            return $user;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }

    public function getUserByUsernameOrEmail($username)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT DISTINCT * FROM `user` WHERE username=? OR email=?'
        );
        $sql->bind_param('ss', $username, $username);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            $sql->close();
            $this->connection->close();
            return $user;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }

    public function getAdminByEmail($email)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT DISTINCT * FROM `admin` WHERE email=?'
        );
        $sql->bind_param('s', $email);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            $sql->close();
            $this->connection->close();
            return $user;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }

    public function updateUser($user)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'UPDATE `user` SET `name` = ?,`lastname`=?,`username`=?,`password`=?,`email`=? WHERE id=?'
        );
        $sql->bind_param(
            'sssssi',
            $user['name'],
            $user['lastname'],
            $user['username'],
            $user['password'],
            $user['email'],
            $user['id']
        );
        if ($sql->execute()) {
            $sql->close();
            $this->connection->close();
            return true;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }

    public function checkPlanExist($name, $id = false)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        if($id){
            $sql = $this->connection->prepare(
                'SELECT * FROM `plans` WHERE name=? AND id != ?'
            );
            $sql->bind_param('si', $name, $id);
        } else{
            $sql = $this->connection->prepare(
                'SELECT * FROM `plans` WHERE name=?'
            );
            $sql->bind_param('s', $name);
        }
        
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plan = $result->fetch_assoc();
            $sql->close();
            $this->connection->close();
            return $plan;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }

    public function checkPlanExistById($id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT id FROM `plans` WHERE id = ?'
        );
        $sql->bind_param('i', $id);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {  
            $sql->close();
            $this->connection->close();
            return true;
        }
        
        $sql->close();
        $this->connection->close();
        return false;
    }

    public function insertPlan($plan){
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'INSERT INTO plans (`name`, `description`, `duration`, `duration_unit`, `price`, `sign_up_fee`, `trial_duration`, `trial_duration_unit`, `renewal`, `status`, `created_at`) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
        );

        $sql->bind_param(
            'ssisddisiis',
            $plan['name'],
            $plan['description'],
            $plan['duration'],
            $plan['duration_unit'],
            $plan['price'],
            $plan['sign_up_fee'],
            $plan['trial_duration'],
            $plan['trial_duration_unit'],
            $plan['renewal'],
            $plan['status'],
            $plan['created_at']
        );
        if ($sql->execute()) {
            $id = $this->connection->insert_id;
            $sql->close();
            $this->connection->close();
            return $id;
        }
        $sql->close();
        $this->connection->close();
        return false; 
    }

    public function updatePlan($plan){
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'UPDATE plans SET `name` = ?, `description` = ?, `duration` = ?, `duration_unit` = ?, `price` = ?, `sign_up_fee` = ?, `trial_duration` = ?, `trial_duration_unit` = ?, `renewal` = ?, `status` = ?, `created_at` = ? WHERE id = ?'
        );

        $sql->bind_param(
            'ssisddisiisi',
            $plan['name'],
            $plan['description'],
            $plan['duration'],
            $plan['duration_unit'],
            $plan['price'],
            $plan['sign_up_fee'],
            $plan['trial_duration'],
            $plan['trial_duration_unit'],
            $plan['renewal'],
            $plan['status'],
            $plan['created_at'],
            $plan['id']
        );
        if ($sql->execute()) {
            $sql->close();
            $this->connection->close();
            return true;
        }
        $sql->close();
        $this->connection->close();
        return false; 
    }

    public function deletePlan($id){
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'DELETE FROM plans WHERE id = ?'
        );

        $sql->bind_param(
            'i',
            $id
        );
        if ($sql->execute()) {
            $sql->close();
            $this->connection->close();
            return true;
        }
        $sql->close();
        $this->connection->close();
        return false; 
    }

    public function getPlans()
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT *, DATE_FORMAT(created_at, "%Y/%m/%d at %h:%i %p") AS created_at FROM `plans`'
        );
        //$sql->bind_param('i', 1);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }

    public function getSinglePlan($plan_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `plans` WHERE id = ?'
        );
        $sql->bind_param('i', $plan_id);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }

    public function checkMemberExistByEmail($email, $id = false)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        if($id){
            $sql = $this->connection->prepare(
                'SELECT * FROM `members` WHERE email=? AND id != ?'
            );
            $sql->bind_param('si', $email, $id);
        } else{
            $sql = $this->connection->prepare(
                'SELECT * FROM `members` WHERE email=?'
            );
            $sql->bind_param('s', $email);
        }
        
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plan = $result->fetch_assoc();
            $sql->close();
            $this->connection->close();
            return $plan;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }

    public function checkMemberExistById($id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT id FROM `members` WHERE id = ?'
        );
        $sql->bind_param('i', $id);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {  
            $sql->close();
            $this->connection->close();
            return true;
        }
        
        $sql->close();
        $this->connection->close();
        return false;
    }

    public function insertMember($member){
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'INSERT INTO members (`firstname`, `lastname`, `email`, `password`, `status`, `created_at`) VALUES (?,?,?,?,?,?)'
        );

        $sql->bind_param(
            'ssssis',
            $member['firstname'],
            $member['lastname'],
            $member['email'],
            $member['password'],
            $member['status'],
            $member['created_at']
        );
        if ($sql->execute()) {
            $id = $this->connection->insert_id;
            $sql->close();
            $this->connection->close();
            return $id;
        }
        $sql->close();
        $this->connection->close();
        return false; 
    }

    public function updateMember($member){
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');

        $pass_up = '';
        if(isset($member['password']) && !empty($member['password'])){
            $pass_up .= 'password = ?,';
        }
		

        $sql = $this->connection->prepare(
            'UPDATE members SET '.$pass_up.' `firstname` = ?, `lastname` = ?, `email` = ?, `status` = ?, `created_at` = ?, short_desc = ?, logo = ? WHERE id = ?'
        );

        if(!empty($pass_up)){
            $sql->bind_param(
                'ssssssssi',
                $member['password'],
                $member['firstname'],
                $member['lastname'],
                $member['email'],
                $member['status'],
                $member['created_at'],
				$member['short_desc'],
				$member['logo'],
                $member['id']
            );
        } else {
            $sql->bind_param(
                'sssssssi',
                $member['firstname'],
                $member['lastname'],
                $member['email'],
                $member['status'],
                $member['created_at'],
				$member['short_desc'],
				$member['logo'],
                $member['id']
            );
        }
        
        if ($sql->execute()) {
            $sql->close();
            $this->connection->close();
            return true;
        }
        $sql->close();
        $this->connection->close();
        return false; 
    }

    public function deleteMember($id){
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'DELETE FROM members WHERE id = ?'
        );

        $sql->bind_param(
            'i',
            $id
        );
        if ($sql->execute()) {
            $sql->close();
            $this->connection->close();
            return true;
        }
        $sql->close();
        $this->connection->close();
        return false; 
    }

    public function getMembers()
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT *, DATE_FORMAT(created_at, "%Y/%m/%d at %h:%i %p") AS created_at FROM `members`'
        );
        //$sql->bind_param('i', 1);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }

    public function getSingleMember($member_id)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `members` WHERE id = ?'
        );
        $sql->bind_param('i', $member_id);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plans = $result->fetch_all(MYSQLI_ASSOC);
            $sql->close();
            $this->connection->close();
            return $plans;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
    
    //memeber endpoints frontend
    public function loginMember($email, $password)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `members` WHERE email=? AND password=?'
        );
        $sql->bind_param('ss', $email, $password);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            $sql->close();
            $this->connection->close();
            return $user;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }

    public function checkBusinessExistByEmail($email, $id = false)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        if($id){
            $sql = $this->connection->prepare(
                'SELECT * FROM `merchants` WHERE email=? AND id != ?'
            );
            $sql->bind_param('si', $email, $id);
        } else{
            $sql = $this->connection->prepare(
                'SELECT * FROM `merchants` WHERE email=?'
            );
            $sql->bind_param('s', $email);
        }
        
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $plan = $result->fetch_assoc();
            $sql->close();
            $this->connection->close();
            return $plan;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }

    public function businessRegister($merchant){
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'INSERT INTO merchants (`business_name`, `business_hours`, `business_address`, `email`, `business_phone_number`, `password`, `created_at`) VALUES (?,?,?,?,?,?,?)'
        );

        $sql->bind_param(
            'ssssiss',
            $merchant['business_name'],
            $merchant['business_hours'],
            $merchant['business_address'],
            $merchant['email'],
            $merchant['business_phone_number'],
            $merchant['password'],
            $merchant['created_at']
        );

        if ($sql->execute()) {
            $id = $this->connection->insert_id;
            $sql->close();
            $this->connection->close();
            return $id;
        }
        $sql->close();
        $this->connection->close();
        return false; 
    }

    public function addRestrauntDetails($restrauntDetails){
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');


        $sql = $this->connection->prepare(
            'UPDATE merchants SET `is_restaurant` = ?, `uber_eats_link` = ?, `door_dash_link` = ?, `grub_hub` = ?, `instacart` = ?, facebook_link = ?, instagram_link = ? WHERE id = ?'
        );

        $sql->bind_param(
            'isssssss',
            $restrauntDetails['is_restaurant'],
            $restrauntDetails['uber_eats_link'],
            $restrauntDetails['door_dash_link'],
            $restrauntDetails['grub_hub'],
            $restrauntDetails['instacart'],
            $restrauntDetails['facebook_link'],
            $restrauntDetails['instagram_link'],
            $restrauntDetails['id']
        );
        
        if ($sql->execute()) {
            $sql->close();
            $this->connection->close();
            return true;
        }
        $sql->close();
        $this->connection->close();
        return false; 
    }

    public function addMenuItems($menuItems){
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');


        $sql = $this->connection->prepare(
            'INSERT INTO menu_items SET `merchant_id` = ?, `name` = ?, `ingredients` = ?, `photo` = ?, `price` = ?'
        );

        $sql->bind_param(
            'issss',
            $menuItems['merchant_id'],
            $menuItems['name'],
            $menuItems['ingredients'],
            $menuItems['photo'],
            $menuItems['price']
        );
        
        if ($sql->execute()) {
            $sql->close();
            $this->connection->close();
            return true;
        }
        $sql->close();
        $this->connection->close();
        return false; 
    }*/
}
