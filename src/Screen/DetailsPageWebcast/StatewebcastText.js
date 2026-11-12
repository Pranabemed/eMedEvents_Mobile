/**
 * Statewebcast text screen module. Renders a React Native screen or a screen-scoped support component. Exported members: StatewebcastText.
 */

import React, { memo } from 'react';
import { HorizontalChipSection } from './StatewebcastSpeciality';

/**
 * Reusable StatewebcastText component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const StatewebcastText = memo(({ webcastdeatils }) => {
    return (
        <HorizontalChipSection
            title="Target Audience"
            items={webcastdeatils?.targetAudience}
        />
    );
});

/**
 * Statewebcast text default export.
 *
 * @returns {*}
 */
export default StatewebcastText;
