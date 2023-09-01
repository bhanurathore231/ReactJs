<?php
//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader
require './PHPMailer/vendor/autoload.php';

//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);


function send_confirmation_code($to_name, $to_address, $code){
    global $mail;
    
    try {
        //Server settings
        //$mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
        //$mail->isSMTP();                                            //Send using SMTP
        //$mail->Host       = 'smtp.example.com';                     //Set the SMTP server to send through
        //$mail->SMTPAuth   = true;                                   //Enable SMTP authentication
        //$mail->Username   = 'user@example.com';                     //SMTP username
        //$mail->Password   = 'secret';                               //SMTP password
        //$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
        //$mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
    
        //Recipients
        $mail->setFrom('admin@readyforyourreview.com ', 'Mailer');
        $mail->addAddress($to_address, $to_name);     //Add a recipient
        //$mail->addAddress('ellen@example.com');               //Name is optional
        //$mail->addReplyTo('info@example.com', 'Information');
        //$mail->addCC('cc@example.com');
        //$mail->addBCC('bcc@example.com');
    
        //Attachments
        //$mail->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
        //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name
    
        //Content
        $mail->isHTML(true);                                  //Set email format to HTML
        $mail->Subject = 'Email Verification';
        $mail->Body    = '
        <!DOCTYPE html>
        <html>
        
        <head>
          <meta charset="UTF-8">
          <title>Email Verification</title>
        </head>
        
        <body>
          <h2>Verification Code</h2>
          <p>Dear '.$to_name.',</p>
          <p>Thank you for signing up! To complete your registration, please enter the following verification code:</p>
          
          <h3 style="background-color: #f2f2f2; padding: 10px; border-radius: 5px; font-weight: bold; display: inline-block;">'.$code.'</h3>
        
          <p>This verification code is only valid for a limited time period. If you did not request this verification, please ignore this email.</p>
        
          <p>Thank you,</p>
          <p>Your Company Name</p>
        </body>
        </html>';
        
        //$mail->AltBody = 'This is the body in plain text for non-HTML mail clients';
    
        $mail->send();
        return 'Verification code has been sent on your email address.';
        
    } catch (Exception $e) {
        return "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}