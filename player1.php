<?PHP

if(isset($_POST['type'])) {
	switch ($_POST['type']) {
		case 'start':
		$setup = array(
			"Tanks" => array( 
				array("x" => 5,
					"y" => 25,
					"heading" => "N",
					"turret" => ""
					),
				array("x" => 5,
					"y" => 24,
					"heading" => "N",
					"turret" => ""
					),
				array("x" => 5,
					"y" => 23,
					"heading" => "N",
					"turret" => ""
					),
				array("x" => 5,
					"y" => 22,
					"heading" => "N",
					"turret" => ""
					),
				array("x" => 5,
					"y" => 21,
					"heading" => "N",
					"turret" => ""
					),
				array("x" => 5,
					"y" => 20,
					"heading" => "N",
					"turret" => ""
					),
				array("x" => 5,
					"y" => 19,
					"heading" => "N",
					"turret" => ""
					)
				),
			"Blockhouse" => array("x" => 20,"y" => 12 )
			);

		echo json_encode($setup);
		break;

		case 'move':
		$orders = array(
			"surrender" => false,
			"Tanks" => array(
				array("heading" => "N",
					"speed" => 0,
					"TurretFacing" => "N",
					"fireAt" => array(
						"X" => 20,
						"Y" => 20
						) 
					),
				array("heading" => "N",
					"speed" => 1,
					"TurretFacing" => "N",
					"fireAt" => array(
						"X" => 20,
						"Y" => 20
						) 
					),
				array("heading" => "N",
					"speed" => 1,
					"TurretFacing" => "N",
					"fireAt" => array(
						"X" => 20,
						"Y" => 20
						) 
					),
				array("heading" => "N",
					"speed" => 1,
					"TurretFacing" => "N",
					"fireAt" => array(
						"X" => 20,
						"Y" => 20
						) 
					),
				array("heading" => "N",
					"speed" => 1,
					"TurretFacing" => "N",
					"fireAt" => array(
						"X" => 20,
						"Y" => 20
						) 
					),
				array("heading" => "N",
					"speed" => 1,
					"TurretFacing" => "N",
					"fireAt" => array(
						"X" => 20,
						"Y" => 20
						) 
					),
				array("heading" => "N",
					"speed" => 1,
					"TurretFacing" => "N",
					"fireAt" => array(
						"X" => 20,
						"Y" => 20
						) 
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