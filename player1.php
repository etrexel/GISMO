<?PHP

if(isset($_POST['type'])) {
	switch ($_POST['type']) {
		case 'start':
		$setup = array(
			"Tanks" => array( 
				array("x" => 5, "y" => 25),
				array("x" => 5, "y" => 26),
				array("x" => 5, "y" => 27),
				array("x" => 5, "y" => 29),
				array("x" => 5, "y" => 30),
				array("x" => 5, "y" => 31),
				array("x" => 5, "y" => 32),
				),
			"Blockhouse" => array("x" => 20,"y" => 12 )
			);

		echo json_encode($setup);
		break;

		case 'move':
		$orders = array(
			"surrender" => false,
			"tanks" => array(
				array("heading" => "S",
					"speed" => 1,
					"TurretFacing" => "nw"
					),
				array("heading" => "n",
					"speed" => 1,
					"TurretFacing" => "nw"
					),
				array("heading" => "n",
					"speed" => 1,
					"TurretFacing" => "nw"
					),
				array("heading" => "n",
					"speed" => 1,
					"TurretFacing" => "nw"
					),
				array("heading" => "n",
					"speed" => 1,
					"TurretFacing" => "nw"
					),
				array("heading" => "n",
					"speed" => 1,
					"TurretFacing" => "nw"
					),
				array("heading" => "n",
					"speed" => 1,
					"TurretFacing" => "nw"
					)
				)
			);
		echo json_encode($orders);
		break;

		default:
		echo "Error: Unrecognized type";
		break;
	}
} else {
	echo "Error: No type set";
}

?>