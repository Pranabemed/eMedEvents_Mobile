/**
 * Fs value.
 * @returns {*}
 */
const fs = require('fs');
/**
 * Path value.
 * @returns {*}
 */
const path = require('path');

/**
 * Screens dir value.
 * @returns {*}
 */
const screensDir = path.join(__dirname, 'src', 'Screen');
/**
 * Storybook dir value.
 * @returns {*}
 */
const storybookDir = path.join(__dirname, '.rnstorybook', 'stories');

// Ensure storybook directory exists
if (!fs.existsSync(storybookDir)) {
    fs.mkdirSync(storybookDir, { recursive: true });
}

/**
 * Returns files recursively.
 * @param {*} directory - Input value.
 * @returns {*}
 */
function getFilesRecursively(directory) {
    let results = [];
    const list = fs.readdirSync(directory);
    list.forEach(file => {
        file = path.join(directory, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFilesRecursively(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

/**
 * Process file utility.
 * @param {*} filePath - Input value.
 * @returns {void}
 */
const processFile = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);

    // Skip non-JS/TSX files
    if (!fileName.endsWith('.js') && !fileName.endsWith('.tsx')) return;

    // Basic extraction of Component name
    const functionMatch = content.match(/export\s+default\s+function\s+([A-Za-z0-9_]+)/);
    const constMatch = content.match(/const\s+([A-Za-z0-9_]+)\s*=\s*\(/);
    const classMatch = content.match(/class\s+([A-Za-z0-9_]+)\s+extends/);

    let componentName = null;
    if (functionMatch) componentName = functionMatch[1];
    else if (constMatch) componentName = constMatch[1];
    else if (classMatch) componentName = classMatch[1];

    if (!componentName) return; 

    // Generate JSDoc if missing
    if (!content.includes('/**') || !content.includes('@component')) {
        const jsDoc = `/**
 * Reusable ${componentName} component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */\n`;

        const lastImportIndex = content.lastIndexOf('import ');
        if (lastImportIndex !== -1) {
            const nextNewLine = content.indexOf('\n', lastImportIndex);
            content = content.slice(0, nextNewLine + 1) + '\n' + jsDoc + content.slice(nextNewLine + 1);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`[JSDoc] Added to ${fileName}`);
        }
    }
};

/**
 * Run utility.
 * @returns {void}
 */
const run = () => {
    console.log('Starting Screen documentation generation...');
    const files = getFilesRecursively(screensDir);
    files.forEach(filePath => {
        processFile(filePath);
    });
    console.log('Screen documentation generation complete.');
};

run();
