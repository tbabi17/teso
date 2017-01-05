<?
function current_millis() {
    list($usec, $sec) = explode(" ", microtime());
    return round(((float)$usec + (float)$sec) * 1000);
}
$key = $_GET['key'].".".current_millis();
echo base64_encode($key);
?>