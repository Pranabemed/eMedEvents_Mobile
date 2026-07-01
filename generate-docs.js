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
 * Components dir value.
 * @returns {*}
 */
const componentsDir = path.join(__dirname, 'src', 'Components');
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
 * Process file utility.
 * @param {*} filePath - Input value.
 * @param {*} fileName - Input value.
 * @returns {void}
 */
const processFile = (filePath, fileName) => {
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if it already has JSDoc at the top or if it's not a JS file
    if (!fileName.endsWith('.js') && !fileName.endsWith('.tsx')) return;

    // Basic extraction of Component name
    const functionMatch = content.match(/export\s+default\s+function\s+([A-Za-z0-9_]+)/);
    const constMatch = content.match(/const\s+([A-Za-z0-9_]+)\s*=\s*\(/);
    const classMatch = content.match(/class\s+([A-Za-z0-9_]+)\s+extends/);

    let componentName = null;
    if (functionMatch) componentName = functionMatch[1];
    else if (constMatch) componentName = constMatch[1];
    else if (classMatch) componentName = classMatch[1];

    if (!componentName) return; // Could not parse component name, skip

    // Generate JSDoc if missing
    if (!content.includes('/**') || !content.includes('@component')) {
        const jsDoc = `/**
 * Reusable ${componentName} component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */\n`;

        // Inject after imports
        const lastImportIndex = content.lastIndexOf('import ');
        if (lastImportIndex !== -1) {
            const nextNewLine = content.indexOf('\n', lastImportIndex);
            content = content.slice(0, nextNewLine + 1) + '\n' + jsDoc + content.slice(nextNewLine + 1);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`[JSDoc] Added to ${fileName}`);
        }
    }

    // Generate Storybook Story if missing
    const storyName = fileName.replace('.js', '').replace('.tsx', '');
    // Avoid overwriting CustomButton or Page
    if (storyName === 'Button' || storyName === 'Page' || storyName === 'Header') return;

    const storyFilePath = path.join(storybookDir, `${storyName}.stories.tsx`);
    if (!fs.existsSync(storyFilePath)) {
        const storyContent = `import type { Meta, StoryObj } from '@storybook/react';
import ${componentName} from '../../../src/Components/${fileName.replace('.js', '').replace('.tsx', '')}';

const meta = {
  title: 'Components/${storyName}',
  component: ${componentName},
} satisfies Meta<typeof ${componentName}>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
`;
        fs.writeFileSync(storyFilePath, storyContent, 'utf8');
        console.log(`[Storybook] Created story for ${fileName}`);
    }
};

/**
 * Run utility.
 * @returns {void}
 */
const run = () => {
    console.log('Starting documentation generation...');
    const files = fs.readdirSync(componentsDir);
    files.forEach(file => {
        const filePath = path.join(componentsDir, file);
        if (fs.statSync(filePath).isFile()) {
            processFile(filePath, file);
        }
    });
    console.log('Documentation generation complete.');
};

run();
