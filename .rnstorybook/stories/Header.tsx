/**
 * Header Storybook module. Defines stories and controls for component previews. Exported members: Header, styles.
 */

import { StyleSheet, Text, View } from 'react-native';

import { Button } from './Button';

export type HeaderProps = {
  user?: { name: string };
  onLogin: () => void;
  onLogout: () => void;
  onCreateAccount: () => void;
};

export /**
 * Header component.
 * @param {Object} props - Input object.
 * @param {*} props.user - Nested property value.
 * @param {*} props.onLogin - Nested property value.
 * @param {*} props.onLogout - Nested property value.
 * @param {*} props.onCreateAccount - Nested property value.
 * @returns {JSX.Element}
 */
const Header = ({ user, onLogin, onLogout, onCreateAccount }: HeaderProps) => (
  <View>
    <View style={styles.wrapper}>
      <View style={styles.logoContainer}>
        <Text style={styles.h1}>Acme</Text>
      </View>
      <View style={styles.buttonContainer}>
        {user ? (
          <>
            <Text>Welcome, </Text>
            <Text style={styles.userName}>{user.name}!</Text>

            <Button style={styles.button} size="small" onPress={onLogout} label="Log out" />
          </>
        ) : (
          <>
            <Button style={styles.button} size="small" onPress={onLogin} label="Log in" />

            <Button
              style={styles.button}
              primary
              size="small"
              onPress={onCreateAccount}
              label="Sign up"
            />
          </>
        )}
      </View>
    </View>
  </View>
);

/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  h1: {
    fontWeight: '900',
    fontSize: 20,
    marginTop: 6,
    marginBottom: 6,
    marginLeft: 10,
    color: 'black',
    alignSelf: 'flex-start',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontWeight: '700',
  },
});
