// require('dotenv').config();
// const { notarize } = require('electron-notarize');

// exports.default = async function notarizing(context) {
//   const { electronPlatformName, appOutDir } = context;  
//   if (electronPlatformName !== 'darwin') {
//     return;
//   }

//   const appName = context.packager.appInfo.productFilename;

//   return await notarize({
//     appBundleId: 'bob.nobody.bender',
//     appPath: `${appOutDir}/${appName}.app`,
//     appleId: process.env.CLASHY_SIGN_APPLE_ID,
//     appleIdPassword: process.env.CLASHY_SIGN_APPLE_ID_PASSWORD,
//   });
// };
exports.default = () => null