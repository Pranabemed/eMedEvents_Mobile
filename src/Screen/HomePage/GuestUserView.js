/**
 * File Name: GuestUserView.js
 * Module: Guest User
 * Purpose: Thin presentational wrapper for guest home content rendering.
 * Author: Codex
 * Created Date: 2026-06-03
 * Last Modified: 2026-06-03
 * Dependencies: react, ./GuestUserContent
 */
import React from 'react';
import GuestUserContent from './GuestUserContent';

/**
 * Reusable GuestUserView component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

/**
 * Description: Guest user view wrapper.
 * Purpose: Keeps the container/view separation explicit for the guest home screen.
 *
 * Params:
 * @param {Object} props
 * @param {Object} props.guest
 *
 * Returns:
 * @returns {JSX.Element}
 *
 * Flow:
 * 1. Receive the guest view-model from the container.
 * 2. Forward it to `GuestUserContent`.
 * 3. Return the composed UI tree.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Pure wrapper component with no side effects.
 */
const GuestUserView = ({ guest }) => <GuestUserContent guest={guest} />;
export default GuestUserView;
