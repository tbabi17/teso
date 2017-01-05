<?
    header("X-Frame-Options: SAMEORIGIN"); 

	$gmail = $_GET['account'];
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
 <head>
  <title> Google Calendar </title>
  <meta name="Generator" content="EditPlus">
  <meta name="Author" content="">
  <meta name="Keywords" content="">
  <meta name="Description" content="">
 </head>
 <body>
	<?
 	if (!isset($gmail) || strlen($gmail) == 0) {?>
		Та өөрийн Gmail Account  - аа тохируулна уу ! Тохиргоо хэсэгт орж өөрчлөх боломжтой.
	<?} else {?>
	  <iframe src="cal.php?account=<?=$gmail?>" style="border: 0" width="100%" height="100%" frameborder="0" scrolling="no" target="_top"></iframe>
	 <?}?>
 </body>
</html>
