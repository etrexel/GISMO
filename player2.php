<?PHP

if(isset($_POST['type'])) {
	switch ($_POST['type']) {
		case 'start':
		$setup = array(
			"Tanks" => array( 
				array("x" => 8, "y" => 10),
				array("x" => 8, "y" => 11),
				array("x" => 8, "y" => 12),
				array("x" => 8, "y" => 13),
				array("x" => 8, "y" => 14),
				array("x" => 8, "y" => 15),
				array("x" => 8, "y" => 16),
				),
			"Blockhouse" => array("x" => 20,"y" => 12 )
			);

		echo json_encode($setup);
		break;

		case 'move':
		$orders = array(
			"surrender" => false,
			"Tanks" => array(
				array("heading" => "S",
					"speed" => 2,
					"TurretFacing" => "nw",
					"X" => 2,
					"Y" => 5
					),
				array("heading" => "n",
					"speed" => 2,
					"TurretFacing" => "nw",
					"X" => 2,
					"Y" => 5
					),
				array("heading" => "n",
					"speed" => 2,
					"TurretFacing" => "nw",
					"X" => 2,
					"Y" => 5
					),
				array("heading" => "n",
					"speed" => 2,
					"TurretFacing" => "nw",
					"X" => 2,
					"Y" => 5
					),
				array("heading" => "n",
					"speed" => 2,
					"TurretFacing" => "nw",
					"X" => 2,
					"Y" => 5
					),
				array("heading" => "n",
					"speed" => 2,
					"TurretFacing" => "nw",
					"X" => 2,
					"Y" => 5
					),
				array("heading" => "n",
					"speed" => 2,
					"TurretFacing" => "nw",
					"X" => 2,
					"Y" => 5
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