const usb = require("usb");

console.log("Connected USB devices:");
const devices = usb.getDeviceList();
devices.forEach((device) => {
  console.log(
    `Vendor ID: 0x${device.deviceDescriptor.idVendor
      .toString(16)
      .padStart(4, "0")}, Product ID: 0x${device.deviceDescriptor.idProduct
      .toString(16)
      .padStart(4, "0")}`
  );
});
