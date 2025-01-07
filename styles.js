// styles.js
import { StyleSheet } from 'react-native';

// Stylesheet to store all the styles in one place
const styles = StyleSheet.create({
  avoidingViewContainer: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 25,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    alignItems: 'center',
  },
  loginTitle: {
    color: "#333",
    fontSize: 24,
    textAlign: "center",
    fontWeight: "700",
    marginVertical: 10,
  },
  subtitle: {
    color: "#999",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  textInput: {
    width: '100%',
    borderRadius: 8,
    borderColor: "#ddd", 
    borderWidth: 1,
    padding: 15,
    marginVertical: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  signinButton: {
    width: '100%',
    padding: 15,
    backgroundColor: "#1c6bd9", // Primary button color
    borderRadius: 8,
    marginVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  forgotPasswordWrapper: {
    marginTop: 10,
    marginBottom: 20,
  },
  linkText: {
    color: "#1c6bd9",
    textDecorationLine: "underline",
    fontSize: 14,
  },
  bottomTextWrapper: {
    marginTop: 20,
  },
  bottomText: {
    fontSize: 14,
    color: "#333",
    textAlign: 'center',
  },
});

export default styles;
