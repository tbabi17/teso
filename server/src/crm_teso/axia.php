<?
	session_start();
	if (isset($_SESSION["logged"])) {
		$mac_list = $_POST["mac_list"];
		if ($mac_list != "read") {
			if (strlen($mac_list) > 3)
				file_put_contents("c:\\mac.txt", $mac_list);
		}
		else {
			$file = file_get_contents('c:\\mac.txt', true);
			echo $file;
		}
	} else
		echo "bad request";
?>