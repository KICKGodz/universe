import { removeLoading, changeLoading, startBackground } from "./managers/UIManager"
import { downloadAssets } from "./managers/AssetManager"

startBackground()

downloadAssets(changeLoading)
    .then(() => {
        console.log('All files downloaded.');
        removeLoading()
    })
    .catch(error => {
        console.error(`Error downloading files: ${error}`);
    });


// Loading Order
// [ Assets, Files, ThreeJS ]
// Handle Event When Loading Is Finished