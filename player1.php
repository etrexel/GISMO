<?PHP

if(isset($_POST['type'])) {
	switch ($_POST['type']) {
		case 'start':
		$setup = array(
			"Tanks" => array( 
				array("x" => 5, "y" => 10),
				array("x" => 5, "y" => 11),
				array("x" => 5, "y" => 12),
				array("x" => 5, "y" => 13),
				array("x" => 5, "y" => 14),
				array("x" => 5, "y" => 15),
				array("x" => 5, "y" => 16),
				),
			"Blockhouse" => array("x" => 20,"y" => 12 )
			);
		
		echo json_encode($setup);
		break;

		case 'move':
		echo "Moving...";
		break;
		
		default:
		echo "Error: Unrecognized type";
		break;
	}
} else {
	echo "Error: No type set";
}

?>