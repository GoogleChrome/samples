import vm from "vm";

function isSupported() {
	// node --experimental-vm-modules …
	if(process.execArgv.find(entry => entry == "--experimental-vm-modules")) {
		return true;
	}
	// NODE_OPTIONS='--experimental-vm-modules' node …
	if((process.env?.NODE_OPTIONS || "").split(" ").find(entry => entry == "--experimental-vm-modules")) {
		return true;
	}

	// Feature test for a future when --experimental-vm-modules is not needed
	// and vm.Module is stable:
	try {
		new vm.SourceTextModule(`/* hi */`);
		return true;
	} catch(e) {}

	return false;
}

export { isSupported };