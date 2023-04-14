export async function downloadAssets(progressCallback: (percent: number) => void): Promise<void> {
    const response = await fetch('/assets/download.txt');
    const contents = await response.text();
    const lines = contents.split('\n').filter(line => !line.startsWith('#'));;
    
    let downloadedCount = 0;
  
    await Promise.all(lines.map(url => {
        return fetch(`/assets/files/${url}`).then(response => {
            downloadedCount++;
            progressCallback((downloadedCount / lines.length) * 100);
            return response.blob();
        });
    }));
  
    console.log(`Downloaded ${downloadedCount} files.`);
    return Promise.resolve();
}